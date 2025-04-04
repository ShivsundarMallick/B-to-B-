import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export interface TransactionProduct {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  company: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  customer: string;
  products: TransactionProduct[];
  totalAmount: number;
  requestedAmount: number;
  suggestedAmount?: number;
  status: "pending" | "approved" | "declined" | "modified";
  createdAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (
    userId: string,
    customer: string,
    products: TransactionProduct[],
    totalAmount: number,
    requestedAmount: number
  ) => string;
  getTransaction: (id: string) => Transaction | undefined;
  getPendingTransactions: () => Transaction[];
  updateTransactionStatus: (
    id: string,
    status: "approved" | "declined"
  ) => void;
  suggestTransactionAmount: (id: string, suggestedAmount: number) => void;
  clearTransactions: () => void;
  addDummyTransaction: () => Transaction;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

// Helper function to get transactions from localStorage
const getTransactionsFromStorage = (): Transaction[] => {
  try {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading transactions from localStorage:", error);
  }
  return [];
};

// Helper function to sync transactions with localStorage
const syncTransactionsWithStorage = (transactions: Transaction[]): boolean => {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error("Error saving transactions to localStorage:", error);
    return false;
  }
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const storedTransactions = getTransactionsFromStorage();
    if (storedTransactions.length > 0) {
      console.log("Loaded transactions from localStorage:", storedTransactions);
      setTransactions(storedTransactions);
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      syncTransactionsWithStorage(transactions);
      console.log("Saved transactions to localStorage:", transactions);
    }
  }, [transactions]);

  const addTransaction = (
    userId: string,
    customer: string,
    products: TransactionProduct[],
    totalAmount: number,
    requestedAmount: number
  ): string => {
    // Generate a unique ID for the transaction
    const id = uuidv4();

    // Generate an order ID (e.g., ORD-123456)
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTransaction: Transaction = {
      id,
      orderId,
      userId,
      customer,
      products,
      totalAmount,
      requestedAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // First update our local state
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);

    // Immediately sync with localStorage to ensure consistency
    const syncSuccess = syncTransactionsWithStorage(updatedTransactions);

    if (!syncSuccess) {
      console.error("Failed to sync transaction to localStorage");
    }

    console.log("Added new transaction:", newTransaction);
    return id;
  };

  const getTransaction = (id: string): Transaction | undefined => {
    // First check our local state
    let transaction = transactions.find((tx) => tx.id === id);

    // If not found in local state, check localStorage directly
    if (!transaction) {
      console.log(
        `Transaction ${id} not found in state, checking localStorage...`
      );
      const storedTransactions = getTransactionsFromStorage();
      transaction = storedTransactions.find((tx) => tx.id === id);

      // If found in localStorage but not in our state, update our state
      if (transaction && !transactions.some((tx) => tx.id === id)) {
        console.log(
          `Found transaction ${id} in localStorage, updating state...`
        );
        setTransactions((prev) => [...prev, transaction!]);
      }
    }

    return transaction;
  };

  const getPendingTransactions = (): Transaction[] => {
    // Ensure we're looking at the latest data by checking localStorage too
    const storedTransactions = getTransactionsFromStorage();
    const allTransactions = [...transactions];

    // Add any transactions from localStorage that aren't in our state
    storedTransactions.forEach((storedTx) => {
      if (!allTransactions.some((tx) => tx.id === storedTx.id)) {
        allTransactions.push(storedTx);
      }
    });

    return allTransactions.filter((tx) => tx.status === "pending");
  };

  const updateTransactionStatus = (
    id: string,
    status: "approved" | "declined"
  ) => {
    // Find the transaction first to ensure it exists
    let transaction = getTransaction(id);

    if (!transaction) {
      console.error(`Cannot update status: Transaction ${id} not found`);

      // Try to find it directly in localStorage
      try {
        const storedTransactions = getTransactionsFromStorage();
        transaction = storedTransactions.find((tx) => tx.id === id);

        if (!transaction) {
          console.error("Transaction not found even in localStorage");
          return;
        }
      } catch (error) {
        console.error("Error checking localStorage for transaction:", error);
        return;
      }
    }

    console.log(
      `Updating transaction ${id} (${transaction.orderId}) status to ${status}`
    );

    // Update in memory state
    const updatedTransactions = transactions.map((tx) =>
      tx.id === id
        ? {
            ...tx,
            status: status as Transaction["status"],
          }
        : tx
    );

    setTransactions(updatedTransactions);

    // Ensure it's updated in localStorage
    try {
      // Get all transactions including ones not in memory state
      const storedTransactions = getTransactionsFromStorage();

      // Update the transaction by ID
      const fullyUpdatedTransactions = storedTransactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              status: status as Transaction["status"],
            }
          : tx
      );

      // Sync back to localStorage
      const syncSuccess = syncTransactionsWithStorage(fullyUpdatedTransactions);

      if (syncSuccess) {
        console.log(
          `Successfully synchronized transaction ${id} status to localStorage`
        );
      } else {
        console.error(
          `Failed to synchronize transaction ${id} status to localStorage`
        );
      }
    } catch (error) {
      console.error("Error updating transaction in localStorage:", error);
    }

    console.log(`Updated transaction ${id} status to ${status}`);
  };

  const suggestTransactionAmount = (id: string, suggestedAmount: number) => {
    // Find the transaction first to ensure it exists
    let transaction = getTransaction(id);

    if (!transaction) {
      console.error(`Cannot update amount: Transaction ${id} not found`);
      return;
    }

    if (suggestedAmount <= 0 || suggestedAmount >= transaction.totalAmount) {
      console.error(`Invalid suggested amount: ${suggestedAmount}`);
      return;
    }

    console.log(
      `Suggesting amount ${suggestedAmount} for transaction ${id} (${transaction.orderId})`
    );

    // Update in memory state
    const updatedTransactions = transactions.map((tx) =>
      tx.id === id
        ? {
            ...tx,
            suggestedAmount,
            status: "modified" as Transaction["status"],
          }
        : tx
    );

    setTransactions(updatedTransactions);

    // Ensure it's updated in localStorage
    try {
      // Get all transactions including ones not in memory state
      const storedTransactions = getTransactionsFromStorage();

      // Update the transaction by ID
      const fullyUpdatedTransactions = storedTransactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              suggestedAmount,
              status: "modified" as Transaction["status"],
            }
          : tx
      );

      // Sync back to localStorage
      const syncSuccess = syncTransactionsWithStorage(fullyUpdatedTransactions);

      if (syncSuccess) {
        console.log(
          `Successfully synchronized suggested amount for transaction ${id}`
        );
      } else {
        console.error(
          `Failed to synchronize suggested amount for transaction ${id}`
        );
      }
    } catch (error) {
      console.error("Error updating transaction in localStorage:", error);
    }
  };

  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem("transactions");
    console.log("Cleared all transactions");
  };

  const addDummyTransaction = (): Transaction => {
    const id = uuidv4();
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const dummyTransaction: Transaction = {
      id,
      orderId,
      userId: "user123",
      customer: "Demo Customer",
      products: [
        {
          id: "prod1",
          productId: "product1",
          name: "Demo Product - Company A",
          price: 99.99,
          quantity: 1,
          company: "Company A",
        },
      ],
      totalAmount: 99.99,
      requestedAmount: 49.99,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Update state and localStorage
    const updatedTransactions = [...transactions, dummyTransaction];
    setTransactions(updatedTransactions);
    syncTransactionsWithStorage(updatedTransactions);

    console.log("Added dummy transaction:", dummyTransaction);
    return dummyTransaction;
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransaction,
        getPendingTransactions,
        updateTransactionStatus,
        suggestTransactionAmount,
        clearTransactions,
        addDummyTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
