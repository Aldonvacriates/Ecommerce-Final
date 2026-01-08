import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import type { Product } from "../types/types";

// Define action types
//action is an instruction to the reducer on how to update the state
type ProductAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_SELECTED_CATEGORY"; payload: string };
  
interface ProductState {
  products: Product[];
  selectedCategory: string; 
}

// Initial state
// const [name, setName] = useState("")
const initialState: ProductState = {
  products: [],
  selectedCategory: "",
};

// Reducer function to manage state updates based on dispatched actions 
const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    default:
      throw new Error("Unhandled action type");
  }
};

// create context
interface ProductContextType extends ProductState {
  //The dispatch function is used to send actions to the reducer to update the state
  // const [name, setName] = useState("")
  dispatch: Dispatch<ProductAction>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component to wrap the app and provide state
interface ProductProviderProps {
  children: ReactNode;
} 

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the ProductContext
export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
