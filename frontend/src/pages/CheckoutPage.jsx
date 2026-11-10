import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { authFetch } from "../utils/auth";

function CheckoutPage(){
    const BASE_URL = "http://127.0.0.1:8000/";
    const navigate = useNavigate();
    const { clearCart }  = useCart();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) =>{
        setForm({
            ...form, 
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await authFetch(`${BASE_URL}api/orders/create/`, {
                method: "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok){
                setMessage("Order Place Successfully!");
                fetch(`${BASE_URL}/api/cart/`)
                clearCart();
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                setMessage(data.error || "Failed to fetch error. Please try agin later")
            }
        } catch (error) {
            setMessage("An error occured. Please", error)
        };
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="name" value={form.name} onChange={handleChange} required className="w-full border rounded-lg p-2"/>
                    <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} required className="w-full border rounded-lg p-2"/>
                    <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full border rounded-lg p-2"/>
                    <select name="payment_method" value={form.payment_method} onChange={handleChange} className="w-full border rounded-lg p-2">
                        <option value="COD">Cash on Delivery</option>
                        <option value="Credit Card">Credit Card</option>
                    </select>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                        {loading ? "Processing..." :  "Place Order"}
                    </button>
                    {message && (
                        <p className="text-center text-green-700 font-semibold mt-4">{message}</p>
                    )}
                </form>
            </div>
        </div>
    )
};

export default CheckoutPage;