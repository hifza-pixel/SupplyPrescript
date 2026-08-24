const API_BASE_URL=process.env.NEXT_PUBLIC_API_URL ||  "http://127.0.0.1:8000";
async function apiRequest<T>(endpoint:string,options? : RequestInit):Promise<T> {
    console.log("API REQUEST:", `${API_BASE_URL}${endpoint}`);
    console.log("API BASE URL:", API_BASE_URL);   
    const response= await fetch(`${API_BASE_URL}${endpoint}`,{
        ...options, headers:{
            "Content-Type": "application/json", ...(options?.headers || {}),
        },
    });
    if(!response.ok) {
        const errorText=await response.text();
        throw new Error(
            errorText ||  `API request failed: ${response.status}`
        );
    }
    return response.json();
}
export {API_BASE_URL, apiRequest};