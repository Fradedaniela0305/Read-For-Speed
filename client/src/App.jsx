import { useEffect, useMemo, useState } from "react";
import { createAttempt, getAttempts } from "./api";
import { Routes, Route, Navigate } from "react-router-dom";
import Train from "./pages/Train";
import RSVP from "./pages/RSVP";
import ChunkedRSVP from "./pages/ChunkedRSVP";
import SpeedDrills from "./pages/SpeedDrills";
import TestTab from "./pages/TestTab";
import Test from "./pages/Test";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import SetTheme from "./pages/SetTheme"
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp"
import TestPage from "./pages/TestPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import { ProfileContextProvider } from "./context/ProfileContext";


export default function App() {
    const [theme, setTheme] = useState("fantasy");
    return (
        <>
            <div className={`app theme-${theme}`}>
                <Routes>
                    <Route path="/" element={<Navigate to="/signin" replace />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<ProfileContextProvider />}>
                            <Route element={<MainLayout />}>
                                <Route path="/train" element={<Train />} />
                                <Route path="/test" element={<Test />} />
                                <Route path="/stats" element={<Stats />} />
                                <Route path="/profile" element={<Profile theme={theme} setTheme={setTheme} />} />
                                <Route path="/settheme" element={<SetTheme theme={theme} setTheme={setTheme} />} />
                            </Route>

                            <Route path="/rsvp" element={<RSVP />} />
                            <Route path="/chunked" element={<ChunkedRSVP />} />
                            <Route path="/drills" element={<SpeedDrills />} />
                            <Route path="/testpage" element={<TestPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<div>Page Not Found</div>} />
                </Routes>
            </div>
        </>
    );

}

