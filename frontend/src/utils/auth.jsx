export const saveToken = (token) =>{
    console.log("Saving token:", token);
    localStorage.setItem("access", token.access);
    localStorage.setItem("refresh", token.refresh);
    // localStorage.setItem("access", token.data.access);
    // localStorage.setItem("refresh", token.data.refresh);
};

export const clearToken = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};

export const getAccessToken = () => {
    return localStorage.getItem("access");
};

export const authFetch = (url, options = {})=>{
    const token = getAccessToken();
    const headers = options.headers ? {...options.headers } : {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    headers['Content-Type'] = "application/json";

    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
       headers["Content-Type"] = "application/json";
    }
    console.log("TOKEN:", token);
   console.log("HEADERS:", headers);
    return fetch(url, {
        ...options, 
        headers,
    })
}

// export default saveToken;
// export const {saveToken, clearToken}