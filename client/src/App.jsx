import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Train from "./pages/Train";
import RSVP from "./pages/RSVP";
import ChunkedRSVP from "./pages/ChunkedRSVP";
import SpeedDrills from "./pages/SpeedDrills";
import BaselineTest from "./pages/BaselineTest"
import BaselineTestQuestions from "./pages/BaselineTestQuestions";
import Test from "./pages/Test";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import SetTheme from "./pages/SetTheme"
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp"
import RequireAuth from "./guards/RequireAuth";
import RequireBaselineTest from "./guards/RequireBaselineTest";
import PreventBaseline from "./guards/PreventBaseline";
import BaselineResults from "./pages/BaselineResults";
import { ProfileContextProvider } from "./context/ProfileContext";
import RSVPsetup from "./pages/RSVPsetup"
import RSVPResult from "./pages/RSVPResult";


export default function App() {
    const [theme, setTheme] = useState("fantasy");

    return (
        <>
            <div className={`app theme-${theme}`}>
                <Routes>
                    <Route path="/" element={<Navigate to="/signin" replace />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route element={<RequireAuth />}>
                        <Route element={<ProfileContextProvider />}>
                            <Route element={<PreventBaseline />} >
                                <Route path="/baselinetest" element={<BaselineTest />} />
                                <Route path="/baselinetestquestions" element={<BaselineTestQuestions />} />
                            </Route>

                            <Route element={<RequireBaselineTest />} >
                                <Route element={<MainLayout />}>
                                    <Route path="/train" element={<Train />} />
                                    <Route path="/test" element={<Test />} />
                                    <Route path="/stats" element={<Stats />} />
                                    <Route path="/profile" element={<Profile theme={theme} setTheme={setTheme} />} />
                                    <Route path="/settheme" element={<SetTheme theme={theme} setTheme={setTheme} />} />
                                </Route>

                                <Route path="/rsvpsetup" element={<RSVPsetup />} />
                                <Route path="/rsvp/read" element={<RSVP />} />
                                <Route path="rsvp/result" element={<RSVPResult />} />


                                <Route path="/chunked" element={<ChunkedRSVP />} />
                                <Route path="/drills" element={<SpeedDrills />} />
                            </Route>
                        </Route>
                        <Route path="/baselineresults" element={<BaselineResults />} />
                    </Route>

                    <Route path="*" element={<div>Page Not Found</div>} />
                </Routes>
            </div>
        </>
    );

}

