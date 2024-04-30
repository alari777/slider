import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';

// Определение типов состояния и действий
interface ProductState {
    name: string;
    quantity: number;
    price: number;
}

type ProductAction =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_QUANTITY'; payload: number }
    | { type: 'SET_PRICE'; payload: number };

// Определение начального состояния
const initialState: ProductState = {
    name: "",
    quantity: 0,
    price: 0
};

// Создание контекста
interface ProductContextType {
    state: ProductState;
    dispatch: Dispatch<ProductAction>;
}

const ProductContext = createContext<ProductContextType | null>(null);

// Редьюсер
function productReducer(state: ProductState, action: ProductAction): ProductState {
    switch (action.type) {
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'SET_QUANTITY':
            return { ...state, quantity: action.payload };
        case 'SET_PRICE':
            return { ...state, price: action.payload };
        default:
            throw new Error('Unhandled action type');
    }
}

// Provider компонент
export const ProductProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(productReducer, initialState);

    return (
        <ProductContext.Provider value={{ state, dispatch }}>
            {children}
        </ProductContext.Provider>
    );
};
