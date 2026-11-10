import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails(){
    const { id } = useParams();
    const BASE_URL = "http://127.0.0.1:8000/"
    const [product, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const {addToCart} = useCart();

    useEffect(()=>{
        fetch(`${BASE_URL}/api/products/${id}`)
        .then((response)=>{
            if(!response.ok){
                throw new Error("Failed to fetch")
            };
            return response.json();
        }).then((data)=>{
            setProducts(data);
            setLoading(false);
        }).catch((error)=>{
            setError(error.message);
            setLoading(false);
        });
    }, [id, BASE_URL]);

    if (loading){
        return <div>Loading....</div>
    };

    if (error){
        return <div className="text-red">Error Occured! of{error} Try after sometime</div>
    };

    const handleAddToCart = () =>{
        if (!localStorage.getItem("access_token")){
            window.location.href = "/login";
            return;
        }
        addToCart(product.id);
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
            <div className="bg-slate-300 shadow-lg rounded-md p-8 max-w-3xl w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    <img src={`${product.image}`} 
                    alt={product.name} 
                    className="w-full md:w-1/2 h-auto object-cover rounded-md"/>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <p className="text-2xl font-semibold text-green-600 mb-6">₹ {product.price}</p>
                        <button onClick={handleAddToCart} className="bg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            Add To Cart
                        </button>
                        <div className="mt-4">
                            <a href="/" className="text-blue-600 hover:underline">&larr; Back to Home</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}    

export default ProductDetails;

