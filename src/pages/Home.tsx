import { useEffect } from "react";
import type { Category, Product } from "../types/types";
import ProductCard from "../commponents/ProductCard";
import { useProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "../api/api";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, selectedCategory, dispatch } = useProductContext();

  const {
    data: productsData,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (productsData)
      dispatch({ type: "SET_PRODUCTS", payload: productsData.data });
  }, [dispatch, productsData]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const getFilteredProducts = () => {
    if (selectedCategory) {
      return products.filter(
        (product: Product) => product.category === selectedCategory
      );
    }
    return products;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div>
      <select
        className="m-3 p-2 border rounded"
        onChange={(e) =>
          dispatch({ type: "SET_SELECTED_CATEGORY", payload: e.target.value })
        }
        value={selectedCategory}
      >
        <option value="">All Categories</option>
        {categories?.data.map((category: Category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={() => dispatch({ type: "SET_SELECTED_CATEGORY", payload: "" })}>Clear Filter</button>
      <button onClick={() => navigate("/profile")}>Go to Profile Page</button>
      {isLoading && <h1>Loading products...</h1>}
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {filteredProducts.map((product: Product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
