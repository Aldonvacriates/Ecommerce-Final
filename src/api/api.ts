import axios, { type AxiosResponse } from "axios";
import type { Product, Category } from "../types/types";

const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
});

// Keeping the API layer thin; these helpers stay typed so components stay lean.
export const fetchProducts = (): Promise<AxiosResponse<Product[]>> =>
  apiClient.get<Product[]>("/products");

export const fetchCategories = (): Promise<AxiosResponse<Category[]>> =>
  apiClient.get<Category[]>("/products/categories");
