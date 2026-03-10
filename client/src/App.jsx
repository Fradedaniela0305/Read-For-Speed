import { useEffect, useMemo, useState } from "react";
import { createAttempt, getAttempts } from "./api";
import RSVPPlayer from "./pages/RSVP";
import QuickQuiz from "./pages/QuickQuiz";
import { Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <Routes>
            <Route path="/train" element={<Train />}>
                <Route path="rsvp" element={<RSVP />} />
                <Route path="chunked" element={<ChunkedRSVP />} />
                <Route path="drills" element={<SpeedDrills />} />
            </Route>

            <Route path="/testtab" element={<TestTab />}>
                <Route path="test" element={<Test />} />
            </Route>

            <Route path="/stats" element={<Stats />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}