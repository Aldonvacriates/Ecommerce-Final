import { useEffect } from "react";
import type { Product } from "../types/types";
import ProductCard from "../commponents/ProductCard";
import { useProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/api";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, dispatch } = useProductContext();

  const { data: productsData, isLoading, error } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (!productsData) {
      return;
    }
    dispatch({ type: "SET_PRODUCTS", payload: productsData });
  }, [dispatch, productsData]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const response = await fetch("https://fakestoreapi.com/products");
  //     const data: Product[] = await response.json();
  //     dispatch({ type: "SET_PRODUCTS", payload: data });
  //   };
  //   fetchProducts();
  // }, [dispatch]);

  return (
    <div>
      <button onClick={() => navigate("/profile")}>Go to Profile Page</button>
      {isLoading && <p>Loading products...</p>}
      {error && <p>Failed to load products: {error.message}</p>}
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
