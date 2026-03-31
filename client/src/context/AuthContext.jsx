
import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";


const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined)

    const signUpNewUser = async (email, password, nickname) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { nickname }
            }
        })

        if (error) {
            console.error("There was a problem signing up: ", error)
            return { success: false, error }
        }
        return { success: true, data }
    }

    const signInUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword( {
                email: email,
                password: password
            })

            if (error) {
                console.error('sign in error occurred: ', error)
                return {success: false, error: error }
            }
            return { success: true, data}

        } catch(error) {
            console.error("an error occured: ", error)
            return { success: false, error }
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
    }, [])

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("there was an error ", error)
        }
    }



    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}