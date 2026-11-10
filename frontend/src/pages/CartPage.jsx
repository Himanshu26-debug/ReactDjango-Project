import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";


function CartPage(){
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const BASE_URL = "http://127.0.0.1:8000/"
    // const total = cartItems.reduce((acc, item)=> acc+item.price * item.quantity, 0);
    console.log("CartItems: ", cartItems)

    return (
        <div className="pt-20 min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
            {cartItems.length ===0 ? (
                <p className="text-center text-gray-600">Your Cart is Empty</p>
            ): (
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    {cartItems.map((item)=> (
                        <div key={item.id} className="flex items-center justify-evenly mb-4 ">
                            <div className="flex items-center gap-4">
                                {item.product_image && (
                                    <img src={`${BASE_URL}${item.product_image}`}
                                    alt={item.name}  className="w-20 h-20 object-cover rounded"/>
                                )}
                            </div> 
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {item.product_name}
                                </h2>   
                                <p className="text-gray-600">
                                    ₹ {item.product_price}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="bg-gray-300 px-3 py-1 rounded" onClick={()=> updateQuantity(item.id, item.quantity-1)}>
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button className="bg-gray-300 px-3 py-1 rounded" onClick={()=>updateQuantity(item.id, item.quantity+1)}>
                                    +
                                </button>
                                <button className="text-red-500" onClick={()=> removeFromCart(item.id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="border-t pt-4 mt-4 flex justify-center items-center">
                        <h2 className="text-xl font-bold">Total: </h2>
                        <p className="text-xl font-semibold">₹ {total.toFixed(2)}</p>
                        <Link to="/checkout"  className="bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage;