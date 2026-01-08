import axios from "axios";
import type { Product, Category } from "../types/types";

const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>("/products");
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>("/products/categories");
  return response.data;
};
