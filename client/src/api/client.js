import { supabase } from "../lib/supabase"

const API_URL = import.meta.env.VITE_API_URL + "/api";

export async function apiRequest(endpoint, options={}) {

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Session error", error.message)
    }
    const token = session?.access_token
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers : {
            "Content-Type": "application/json",
             ...options.headers,
            ...(token && {"Authorization" : `Bearer ${token}`})
        }
    })
    let data = null
    try {
        data = await res.json()
    } catch {
        data = null
    }
    if (!res.ok) {
        throw new Error(data?.error || `HTTP: ${res.status}`)
    }
    return data
}




// OPTIONS
// {
//   method: "GET" | "POST" | "PUT" | "DELETE",
//   headers: { ... },
//   body: JSON.stringify(...),
// } 

// fetch(URL, {
//   method,
//   headers,
//   body,
// });











