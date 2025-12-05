// Vanilla JavaScript localStorage management
import { Product } from "@/types/product";

const STORAGE_KEY = 'vending_machine_products';

export const storage = {
  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products:', error);
    }
  },

  loadProducts(): Product[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load products:', error);
      return null;
    }
  },

  clearProducts(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear products:', error);
    }
  }
};
