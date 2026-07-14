import { SchemaType } from "@google/generative-ai";
import { ToolDefinition } from "../tool-registry";
import { MpesaEngine } from "@/lib/payments/mpesa-engine";
import { ReconciliationEngine } from "@/lib/payments/reconciliation-engine";
import { db } from "@/lib/db";

export const sendPaymentTool: ToolDefinition = {
  name: "send_payment",
  description: "Initiate an M-Pesa STK push to request payment from a customer. Requires customer phone number and amount.",
  permissionsRequired: ["can_request_payment"],
  declaration: {
    name: "send_payment",
    description: "Initiates an M-Pesa STK Push payment request.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        phoneNumber: { type: SchemaType.STRING, description: "Phone number formatted as 2547XXXXXXXX" },
        amount: { type: SchemaType.NUMBER, description: "Amount in KES" },
        reference: { type: SchemaType.STRING, description: "Account reference or Invoice ID (max 12 chars)" },
        description: { type: SchemaType.STRING, description: "Transaction description (max 13 chars)" }
      },
      required: ["phoneNumber", "amount", "reference", "description"],
    },
  },
  execute: async (args, context) => {
    try {
      // In a real workflow, if amount > maxBudget, we might return requiresApproval: true
      const result = await MpesaEngine.initiateStkPush({
        phoneNumber: args.phoneNumber,
        amount: args.amount,
        reference: args.reference,
        description: args.description,
        userId: context.userId
      });
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

export const checkPaymentStatusTool: ToolDefinition = {
  name: "check_payment_status",
  description: "Query the status of an M-Pesa payment using the checkout request ID.",
  declaration: {
    name: "check_payment_status",
    description: "Query the status of an STK Push payment.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        checkoutRequestId: { type: SchemaType.STRING, description: "The CheckoutRequestID from the initiate STK push response" }
      },
      required: ["checkoutRequestId"],
    },
  },
  execute: async (args, context) => {
    try {
      const transaction = await db.mpesaTransaction.findFirst({
        where: { checkoutReqId: args.checkoutRequestId, userId: context.userId }
      });

      if (!transaction) {
        return { success: false, error: "Transaction not found" };
      }

      if (transaction.status !== "PENDING") {
         return { success: true, data: { status: transaction.status, mpesaReceipt: transaction.mpesaReceipt, resultDesc: transaction.resultDesc } };
      }

      // Query Daraja for real-time status
      const result = await MpesaEngine.queryStkPushStatus(args.checkoutRequestId);
      let newStatus = "PENDING";
      let resultDesc = result.ResultDesc;

      if (result.ResponseCode === "0") {
        if (result.ResultCode === "0") {
          newStatus = "SUCCESS";
        } else if (result.ResultCode) {
          newStatus = "FAILED";
        }
      }

      if (newStatus !== "PENDING") {
        await db.mpesaTransaction.update({
          where: { id: transaction.id },
          data: { status: newStatus, resultDesc }
        });
      }

      return { success: true, data: { status: newStatus, resultDesc, raw: result } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

export const createInvoiceTool: ToolDefinition = {
  name: "create_invoice",
  description: "Create a new invoice for a customer in the database.",
  permissionsRequired: ["can_create_invoice"],
  declaration: {
    name: "create_invoice",
    description: "Creates a new invoice.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        customerName: { type: SchemaType.STRING, description: "Name of the customer" },
        customerEmail: { type: SchemaType.STRING, description: "Email of the customer" },
        customerPhone: { type: SchemaType.STRING, description: "Phone number of the customer" },
        amountKes: { type: SchemaType.NUMBER, description: "Total amount in KES" },
        items: { 
            type: SchemaType.ARRAY, 
            description: "List of items being invoiced",
            items: { type: SchemaType.STRING }
        },
      },
      required: ["customerName", "amountKes", "items"],
    },
  },
  execute: async (args, context) => {
    try {
      const invoiceNumber = "INV-" + Math.floor(Math.random() * 1000000);
      const invoice = await db.invoice.create({
        data: {
          userId: context.userId,
          invoiceNumber,
          customerName: args.customerName,
          customerEmail: args.customerEmail,
          customerPhone: args.customerPhone,
          amountKes: args.amountKes,
          items: JSON.stringify(args.items),
          status: "DRAFT"
        }
      });
      return { success: true, data: { invoiceId: invoice.id, invoiceNumber, status: invoice.status } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

export const reconcilePaymentsTool: ToolDefinition = {
  name: "reconcile_payments",
  description: "Automatically reconcile all pending successful M-Pesa payments with unpaid invoices.",
  permissionsRequired: ["can_reconcile_payments"],
  declaration: {
    name: "reconcile_payments",
    description: "Auto-reconciles pending payments with invoices.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
      required: [],
    },
  },
  execute: async (args, context) => {
    try {
      const result = await ReconciliationEngine.autoReconcileAll(context.userId);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
