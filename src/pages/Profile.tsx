import { useEffect } from "react";
import type { Product } from "../types/types";
import { useProductContext } from "../context/ProductContext";

const Profile: React.FC = () => {
  const { products, dispatch } = useProductContext();

  useEffect(() => {
    if (products.length) {
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        dispatch({ type: "SET_PRODUCTS", payload: data });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [dispatch, products.length]);

  return (
    <div className="d-flex flex-column gap-3">
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((product) => <h2 key={product.id}>{product.title}</h2>)
      )}
    </div>
  );
};

export default Profile;
