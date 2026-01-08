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

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (productsData)
      dispatch({ type: "SET_PRODUCTS", payload: productsData.data });
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
      {isLoading && <h1>Loading products...</h1>}
      <button onClick={() => navigate("/profile")}>Go to Profile Page</button>
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {products.map((product: Product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
