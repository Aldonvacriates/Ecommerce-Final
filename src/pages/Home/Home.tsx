import { useEffect } from "react";
import type { Category, Product } from "../../types/types";
import ProductCard from "../../commponents/ProductCard/ProductCard";
import { useProductContext } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "../../api/api";
import "./Home.css";

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
    <div className="home-shell">
      <section className="home-hero">
        <div className="home-hero__text">
          <p className="home-kicker">Fresh finds</p>
          <h1 className="home-title">Discover gear built for your day</h1>
          <p className="home-subtitle">
            Filter by category or browse the full collection. New arrivals drop daily.
          </p>
          <div className="home-controls">
            <label className="home-select-wrap">
              <span className="visually-hidden">Filter by category</span>
              <select
                className="home-select"
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
            </label>
            <button
              className="home-btn ghost"
              onClick={() => dispatch({ type: "SET_SELECTED_CATEGORY", payload: "" })}
            >
              Clear filter
            </button>
            <button className="home-btn solid" onClick={() => navigate("/profile")}>
              Profile
            </button>
          </div>
        </div>
      </section>

      {isLoading && <div className="home-loading">Loading products...</div>}

      <div className="home-grid">
        {filteredProducts.map((product: Product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
