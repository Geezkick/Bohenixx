import { db } from "@/lib/db";

export const ReconciliationEngine = {
  /**
   * Reconcile a specific transaction against an invoice
   */
  async reconcileTransaction(transactionId: string, invoiceId: string, agentId?: string) {
    const transaction = await db.mpesaTransaction.findUnique({ where: { id: transactionId } });
    const invoice = await db.invoice.findUnique({ where: { id: invoiceId }, include: { reconciliations: true } });

    if (!transaction || !invoice) {
      throw new Error("Transaction or Invoice not found");
    }

    if (transaction.status !== "SUCCESS") {
      throw new Error("Only successful transactions can be reconciled");
    }

    // Check if transaction is already fully reconciled
    const existingReconciliations = await db.paymentReconciliation.findMany({
      where: { transactionId }
    });
    const reconciledAmount = existingReconciliations.reduce((sum, r) => sum + r.amountMatched, 0);
    const availableAmount = transaction.amount - reconciledAmount;

    if (availableAmount <= 0) {
      throw new Error("Transaction is already fully reconciled");
    }

    // Check invoice remaining balance
    const invoicePaidAmount = invoice.reconciliations.reduce((sum, r) => sum + r.amountMatched, 0);
    const invoiceRemaining = invoice.amountKes - invoicePaidAmount;

    if (invoiceRemaining <= 0) {
      throw new Error("Invoice is already fully paid");
    }

    // Calculate match amount
    const amountToMatch = Math.min(availableAmount, invoiceRemaining);

    // Create reconciliation record
    await db.paymentReconciliation.create({
      data: {
        invoiceId,
        transactionId,
        amountMatched: amountToMatch,
        matchedBy: agentId ? `agent:${agentId}` : "system"
      }
    });

    // Update invoice status
    const newPaidAmount = invoicePaidAmount + amountToMatch;
    let newStatus = invoice.status;
    if (newPaidAmount >= invoice.amountKes) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL";
    }

    if (newStatus !== invoice.status) {
      await db.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus }
      });
    }

    return {
      success: true,
      amountMatched: amountToMatch,
      invoiceStatus: newStatus
    };
  },

  /**
   * Auto-reconcile all pending transactions and unpaid invoices
   */
  async autoReconcileAll(userId?: string) {
    let reconciledCount = 0;

    // Get all successful transactions that aren't fully matched
    // We fetch all for simplicity, in a real system we'd filter by checking sum of reconciliations.
    const transactions = await db.mpesaTransaction.findMany({
      where: {
        status: "SUCCESS",
        ...(userId ? { userId } : {})
      },
      include: {
        reconciliations: true
      }
    });

    const pendingTransactions = transactions.filter(t => {
      const matched = t.reconciliations.reduce((sum, r) => sum + r.amountMatched, 0);
      return t.amount > matched;
    });

    for (const tx of pendingTransactions) {
      const availableAmount = tx.amount - tx.reconciliations.reduce((sum, r) => sum + r.amountMatched, 0);

      // 1. Exact match attempt by checkoutReqId/merchantReqId if we mapped them to invoices somewhere
      // In this system, STK Push might have a reference mapped. Let's try to find an invoice by exact amount and phone number first.
      
      const potentialInvoices = await db.invoice.findMany({
        where: {
          status: { in: ["DRAFT", "SENT", "PARTIAL"] },
          ...(userId ? { userId } : {})
        },
        include: {
          reconciliations: true
        }
      });

      for (const invoice of potentialInvoices) {
        const invoicePaid = invoice.reconciliations.reduce((sum, r) => sum + r.amountMatched, 0);
        const invoiceRemaining = invoice.amountKes - invoicePaid;

        // Auto-match logic: If the phone number matches OR the amount exactly matches the remaining balance
        const phoneMatch = invoice.customerPhone && (tx.phoneNumber.includes(invoice.customerPhone.substring(3)) || invoice.customerPhone.includes(tx.phoneNumber.substring(3)));
        const amountMatch = availableAmount === invoiceRemaining;

        if (phoneMatch || amountMatch) {
          try {
            await this.reconcileTransaction(tx.id, invoice.id);
            reconciledCount++;
            break; // Stop looking for this transaction once matched
          } catch (e) {
            console.error("Auto-reconcile failed for pair", tx.id, invoice.id, e);
          }
        }
      }
    }

    return { success: true, reconciledCount };
  }
};
