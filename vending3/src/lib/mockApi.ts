import { Product } from "@/types/product";

// Mock API to simulate fetching initial product data
export const fetchInitialProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: "1",
      name: "Cola",
      price: 1.50,
      quantity: 12,
      emoji: "🥤",
      maxQuantity: 15
    },
    {
      id: "2",
      name: "Chips",
      price: 1.25,
      quantity: 10,
      emoji: "🍿",
      maxQuantity: 15
    },
    {
      id: "3",
      name: "Candy Bar",
      price: 1.00,
      quantity: 15,
      emoji: "🍫",
      maxQuantity: 15
    },
    {
      id: "4",
      name: "Water",
      price: 1.00,
      quantity: 8,
      emoji: "💧",
      maxQuantity: 15
    },
    {
      id: "5",
      name: "Energy Drink",
      price: 2.50,
      quantity: 7,
      emoji: "⚡",
      maxQuantity: 15
    },
    {
      id: "6",
      name: "Crackers",
      price: 1.75,
      quantity: 9,
      emoji: "🧈",
      maxQuantity: 15
    },
    {
      id: "7",
      name: "Cookies",
      price: 1.50,
      quantity: 11,
      emoji: "🍪",
      maxQuantity: 15
    },
    {
      id: "8",
      name: "Juice",
      price: 2.00,
      quantity: 6,
      emoji: "🧃",
      maxQuantity: 15
    },
    {
      id: "9",
      name: "Nuts",
      price: 2.25,
      quantity: 5,
      emoji: "🥜",
      maxQuantity: 15
    }
  ];
};
