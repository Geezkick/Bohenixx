import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { MemoryStore } from "./memory-store";
import { getTool, getGeminiToolDeclarations, AgentToolContext } from "./tool-registry";
import { AgentBus } from "./agent-bus";
import { writeTaskKnowledge } from "@/lib/knowledge-writer";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const AgentExecutor = {
  /**
   * Execute a single turn or multi-turn agent execution loop (ReAct).
   */
  async executeTask(params: {
    agentId: string;
    userId: string;
    messages: { role: string; content: string }[];
    taskId?: string; // Optional if we already have a task
  }) {
    if (!genAI) throw new Error("Gemini API key not configured");

    const agent = await db.flowAgent.findUnique({ 
      where: { id: params.agentId },
      include: { tools: true }
    });
    if (!agent) throw new Error("Agent not found");

    // 1. Gather Context
    const memoryContext = await MemoryStore.getContextString(agent.id);
    
    // Make other agents available as a tool dynamically
    const otherAgents = await AgentBus.getAvailableAgents(params.userId, agent.id);
    const orgContext = otherAgents.length > 0 
      ? `\n\n--- ORGANIZATION CONTEXT ---\nYou are part of a team. You can collaborate with these agents if needed:\n${otherAgents.map(a => `- ${a.name} (${a.type}): ${a.description || 'No description'}`).join('\n')}\n(Note: To contact them, tell the user you will delegate the task to them).` 
      : "";

    const basePrompt = agent.systemPrompt || `You are an expert ${agent.type} AI agent named ${agent.name} working for Bohenix Flow AI. You help users with ${agent.type}-related tasks. Be professional, thorough, and action-oriented.`;
    const fullSystemInstruction = `${basePrompt}\n\n${memoryContext}${orgContext}`;

    // 2. Prepare Tools
    // Get enabled tools for this agent from DB, or fallback to default built-ins for Phase 1
    const enabledToolNames = agent.tools.filter(t => t.isEnabled).map(t => t.toolName);
    // For demo purposes, if no tools configured, give them all basic ones
    const activeToolNames = enabledToolNames.length > 0 ? enabledToolNames : ["send_email", "search_web", "create_invoice"];
    
    const toolDeclarations = getGeminiToolDeclarations(activeToolNames);
    const hasTools = toolDeclarations.length > 0;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: fullSystemInstruction,
      ...(hasTools ? { tools: [{ functionDeclarations: toolDeclarations }] } : {})
    });

    // 3. Initialize Chat History
    // Map existing messages to Gemini format
    const history = params.messages.slice(0, -1).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessage = params.messages[params.messages.length - 1].content;
    const chat = model.startChat({ history });

    let finalResponse = "";
    const toolCallsMade: any[] = [];
    let isFinished = false;
    let iterationCount = 0;
    const MAX_ITERATIONS = 5; // Prevent infinite loops
    
    let currentInput: any = lastMessage;
    let lastResponseText = "";

    // 4. ReAct Loop
    while (!isFinished && iterationCount < MAX_ITERATIONS) {
      iterationCount++;
      
      const result = await chat.sendMessage(currentInput);
      const response = result.response;
      lastResponseText = response.text() || "";
      
      const functionCalls = response.functionCalls();
      
      if (functionCalls && functionCalls.length > 0) {
        // Model decided to call tools
        const functionResponses = [];
        
        for (const call of functionCalls) {
          console.log(`[AgentExecutor] Agent ${agent.name} called tool: ${call.name}`);
          const tool = getTool(call.name);
          
          if (!tool) {
            functionResponses.push({
              functionResponse: {
                name: call.name,
                response: { error: "Tool not found or not registered." }
              }
            });
            continue;
          }

          // Execute the tool locally
          const toolContext: AgentToolContext = {
            userId: params.userId,
            agentId: agent.id,
            department: agent.department,
            permissions: agent.permissions ? JSON.parse(agent.permissions) : [],
          };
          
          try {
            const toolResult = await tool.execute(call.args, toolContext);
            toolCallsMade.push({
              tool: call.name,
              args: call.args,
              result: toolResult
            });
            
            functionResponses.push({
              functionResponse: {
                name: call.name,
                response: toolResult
              }
            });
          } catch (e: any) {
            functionResponses.push({
              functionResponse: {
                name: call.name,
                response: { error: e.message }
              }
            });
          }
        }
        
        // Pass tool results back to the model in the next iteration
        currentInput = functionResponses;
      } else {
        // Model provided a text response, loop is finished
        finalResponse = response.text();
        isFinished = true;
      }
    }

    if (!isFinished) {
      finalResponse = "Error: I reached the maximum number of iterations while trying to complete this task. Here is what I was doing last: " + lastResponseText;
    }

    // 5. Record the Task and Messages
    const task = params.taskId 
      ? await db.flowTask.update({
          where: { id: params.taskId },
          data: { 
            result: finalResponse, 
            status: "COMPLETED", 
            completedAt: new Date(),
            toolCalls: JSON.stringify(toolCallsMade)
          }
        })
      : await db.flowTask.create({
          data: {
            userId: params.userId,
            agentId: agent.id,
            prompt: lastMessage,
            result: finalResponse,
            status: "COMPLETED",
            toolCalls: JSON.stringify(toolCallsMade),
            completedAt: new Date()
          }
        });

    // 6. Write knowledge nodes and edges to Knowledge Graph automatically
    await writeTaskKnowledge({
      userId: params.userId,
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      taskId: task.id,
      prompt: lastMessage,
      result: finalResponse,
    });

    return {
      text: finalResponse,
      taskId: task.id,
      toolCalls: toolCallsMade
    };
  }
};
