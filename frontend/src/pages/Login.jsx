import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";
const BASE_URL = "http://127.0.0.1:8000/"

function Login(){

    const BASE_URL = "http://127.0.0.1:8000/"

    const [form, setForm] = useState({username:"", password: ""});
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handlchange = (e) =>{
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async(e) => {
        e.preventDefault(); // send data to backend
        setMsg("");
        try{ 
            const res = await fetch(`${BASE_URL}api/token/`, {
                method: "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok){
                console.log("Login successful");
                saveToken(data);
                 console.log("Stored token:", localStorage.getItem("access_token"));
                setMsg("Login Successfully! Redirecting...");
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setMsg(data.detail || "Login Failed. Please try again later");
            }
        } catch (error) {
            setMsg("An error occured. Please", error)
        };

    }


    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="username" onChange={handlchange} value={form.username} placeholder="Username" required className="w-full p-2 border-rounded"/>
                    <input name="password" onChange={handlchange} value={form.password} placeholder="password" required className="w-full p-2 border-rounded"/>
                    <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
                </form>
                {msg && <p className="mt-3 text-sm">{msg}</p>}
                <div className="mt-4 text-sm">
                    Don't have an account?{" "}
                    <a href="/singup" className="text-blue-600 hover:underline">SignUp</a>
                </div>
            </div>
        </div>
    )
}

export default Login;


// import bcrypt from bcryptjs
// function register(){
//     const{ email, password } = req.body;
//     const hashedpassword = bcrypt.hash(password, 10);

// }