import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function ProducList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        fetch("http://127.0.0.1:8000/api/products/")
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
    }, []);

    if (loading){
        return <div>Loading....</div>
    };

    if (error){
        return <div className="text-red">Error Occured! of{error} Try after sometime</div>
    };

    return(
        <div className="min-h-screen bg-gray-100 pt-15 ">
            <h1 className="text-3xl font-bold text-center py-6 bg-blue-950 text-white shadow-2xl shadow-blue-100">Product List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-blue">
                {products.length > 0 ? (    
                    products.map((product)=>(
                        <ProductCard key={product.id} product={product}/>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No Products Avalaible..</p>
                )
            }
            </div>
        </div>
    )
};

export default ProducList;