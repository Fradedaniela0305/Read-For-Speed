import { useEffect, useMemo, useState } from "react";
import { createAttempt, getAttempts } from "./api";
import { Routes, Route } from "react-router-dom";
import Train from "./pages/Train";
import RSVP from "./pages/RSVP";
import ChunkedRSVP from "./pages/ChunkedRSVP";
import SpeedDrills from "./pages/SpeedDrills";
import TestTab from "./pages/TestTab";
import Test from "./pages/Test";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";



export default function App() {


    return (
        <>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/train" element={<Train />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="/rsvp" element={<RSVP />} />
                <Route path="/chunked" element={<ChunkedRSVP />} />
                <Route path="/drills" element={<SpeedDrills />} />

                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </>
    );

}