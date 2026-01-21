import type { Product } from "../../types/types";
import { Rating } from "@smastrom/react-rating";
import "./ProductCard.css";

// Presentation-only product tile with truncated copy and rating stars.
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const truncatedTitle =
    product.title.length > 70 ? `${product.title.slice(0, 67)}...` : product.title;
  const truncatedDescription =
    product.description.length > 150
      ? `${product.description.slice(0, 147)}...`
      : product.description;

  return (
    <div className="product-card">
      <h3 className="product-card__title">{truncatedTitle}</h3>
      <img
        src={product.image}
        alt={product.title}
        className="product-card__image"
      />
      <p className="product-card__price">${product.price}</p>
      <h5 className="product-card__category">{product.category.toUpperCase()}</h5>
      <Rating
        style={{ maxWidth: 150 }}
        value={product.rating.rate}
        readOnly
      />
      <p className="product-card__description">{truncatedDescription}</p>
    </div>
  );
};

export default ProductCard;
