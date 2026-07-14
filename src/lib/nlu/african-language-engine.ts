export const AfricanLanguageEngine = {
  /**
   * Generates a system prompt to inject into a FlowAgent to enable it to understand
   * and communicate effectively in Kenyan business contexts (Sheng, Swahili, English).
   */
  getSystemPromptEnhancement(agentDepartment: string | null | undefined): string {
    return `
      LANGUAGE & CULTURAL CONTEXT INSTRUCTIONS:
      You are an AI operating in the East African (specifically Kenyan) business ecosystem.
      Your users may speak to you in a mix of English, Swahili, and Sheng (Kenyan slang).
      
      RULES FOR UNDERSTANDING:
      - "Sawa" / "Sawa sawa" means "Okay" or "Understood".
      - "Kiasi" means "Amount" or "A little".
      - "Tuma" means "Send" (e.g., "Tuma invoice" = Send invoice).
      - "Asante" means "Thank you".
      - "Nipe" or "Leta" means "Give me" or "Bring".
      - "Pesa" / "Doh" / "Chapaa" refers to money.
      - "M-Pesa" is the primary mobile money service.
      - "KRA" is the Kenya Revenue Authority (taxes).
      
      RULES FOR RESPONDING:
      1. Always understand mixed language input, but default to responding in professional, polite English unless the user's prompt is entirely in Swahili/Sheng, in which case you can mirror their casual tone appropriately while remaining professional.
      2. If asked about payments, always assume M-Pesa is the preferred method unless specified otherwise.
      3. For amounts, always refer to the currency as KES or Ksh.
      4. You are representing Bohenix Flow AI, an enterprise-grade AI workforce. Be efficient, highly capable, and respectful.
    `;
  },

  /**
   * Simple utility to detect if a message heavily uses Swahili/Sheng keywords.
   * Can be used to route or tag conversations.
   */
  detectLanguageContext(text: string): "english" | "swahili_sheng" | "mixed" {
    const shengSwahiliKeywords = [
      "sawa", "asante", "tuma", "leta", "pesa", "shilingi", "habari", 
      "mzuri", "fiti", "vipi", "niaje", "sasa", "kesho", "leo"
    ];
    
    const words = text.toLowerCase().split(/[\s,.-]+/);
    let keywordCount = 0;
    
    for (const word of words) {
      if (shengSwahiliKeywords.includes(word)) {
        keywordCount++;
      }
    }
    
    if (keywordCount > 3 || (keywordCount > 0 && words.length < 5)) {
      return "swahili_sheng";
    } else if (keywordCount > 0) {
      return "mixed";
    }
    
    return "english";
  }
};
