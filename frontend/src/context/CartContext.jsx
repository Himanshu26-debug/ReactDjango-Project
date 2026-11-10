import { createContext, useContext, useState, useEffect } from "react";
// import { createContext, useState, useEffect } from "react";
import { authFetch } from "../utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children })=>{
    const BASE_URL = "http://127.0.0.1:8000/"
    const [cartItems, setCartItems]= useState([]);
    const [total, setTotal] = useState(0);

    // This cart is authorization cart with jwttoken
    const fetchCart = async ()=>{
        try{
            const res = await authFetch(`${BASE_URL}api/cart/`)
            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total);
        } catch (error){
            console.log("Error fetching cart", error)
        }
    }

    useEffect(()=>{
        fetchCart();
    }, [])


    const addToCart = async (productId)=>{
        try{
            await authFetch(`${BASE_URL}api/cart/add/`, {
                method: "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({product_id : productId})
            }); 
            await fetchCart();
        } catch (error){
            console.log("Error Occured", error)
        }
    }

    
    const removeFromCart = async (itemId) =>{
        try{
            await authFetch(`${BASE_URL}api/cart/remove/`, {
                method: "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({item_id : itemId})
            }); fetchCart()
        } catch (error){
            console.log("Error Occured", error)
        }
    }

    
    const updateQuantity = async (itemId, quantity)=>{
        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }
        try{
            await authFetch(`${BASE_URL}api/cart/remove/`, {
                method: "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({item_id : itemId, quantity })
            }); fetchCart()
        } catch (error){
            console.log("Error Occured", error)
        }
    }

    const clearCart = () =>{
        setCartItems([]);
        setTotal(0);
    }

    console.log("Cart Items in Context:", cartItems)

    return (
        <CartContext.Provider value={{cartItems, total, addToCart, removeFromCart, updateQuantity, clearCart}}>
            {children}
        </CartContext.Provider>
    );
}; 

export const useCart = () => useContext(CartContext);