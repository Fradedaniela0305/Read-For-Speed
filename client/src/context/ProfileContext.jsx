import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { apiRequest } from "../api/client"
import { Outlet } from "react-router-dom"


const ProfileContext = createContext();

export function ProfileContextProvider() {
    const { session } = useAuth()

    const [profile, setProfile] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {

            if (!session) {
                setProfile(null)
                setLoadingProfile(false)
                return;
            }

            try {
                setLoadingProfile(true)
                const data = await apiRequest("/profile/me")
                setProfile(data)
            } catch (err) {
                console.error(err)
                setProfile(null)
            } finally {
                setLoadingProfile(false)
            }
        }

        fetchProfile()
    }, [session])

    const refreshProfile = async () => {
        if (!session) {
            return
        }

        let data = null

        try {
            data = await apiRequest("/profile/me")
            setProfile(data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <ProfileContext.Provider value={{ profile, setProfile, refreshProfile, loadingProfile }} >
            <Outlet />
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext);

    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }

    return context;
}