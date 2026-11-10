import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";


function Signup(){
    const BASE_URL = "http://127.0.0.1:8000/"

    const [form, setForm] = useState({username:"",  email:"", password: "", password2:""});
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handlchange = (e) =>{
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async(e) => {
        e.preventDefault(); // send data to backend
        setMsg("");
        try{ 
            const res = await fetch(`${BASE_URL}api/register/`, {
                method: "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok){
                saveToken(data);
                setMsg("Login Successfully! Redirecting...");
                setTimeout(() => {
                    navigate("/login");
                }, 1200);
            } else {
                setMsg(data.username || data.password || JSON.stringify(data));
            }
        } catch (error) {
            console.error(error)
            setMsg("An error occured. Please", error)
        };

    }


    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Signup</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="username" onChange={handlchange} value={form.username} placeholder="Username" required className="w-full p-2 border-rounded"/>
                    <input name="email" type="email" onChange={handlchange} value={form.email} placeholder="password" required className="w-full p-2 border-rounded"/>
                    <input name="password" type="password" onChange={handlchange} value={form.password} placeholder="Username" required className="w-full p-2 border-rounded"/>
                    <input name="password2" type="password" onChange={handlchange} value={form.password} placeholder="password" required className="w-full p-2 border-rounded"/>
                    <button className="w-full bg-blue-600 text-white py-2 rounded">Create</button>
                </form>
                {msg && <p className="mt-3 text-sm">{msg}</p>}
            </div>
        </div>
    )
}

export default Signup;