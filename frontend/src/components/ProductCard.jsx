import { Link } from "react-router-dom";

import React from "react";
const BASE_URL = "http://127.0.0.1:8000/"
function ProductCard({ product }) {
    return (
        <Link to={`/product/${product.id}`}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer">
                <img src={`${BASE_URL}${product.image}`} alt={product.name} className="w-full h-56 object-cover rounded-sm mb-4 bg-amber-200"/>
                <h1 className="text-lg font-semibold text-gray-800 truncate text-center">{product.name}</h1>
                <p className="text-gray-600 mt-2 text-center">₹{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard;