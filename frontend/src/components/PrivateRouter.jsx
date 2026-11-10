import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => !! localStorage.getItem("access");

export default function PrivateRouter({redirecTo = "/login"}){
    return isAuthenticated() ? <Outlet/> : <Navigate to={redirecTo} replace/>;
};