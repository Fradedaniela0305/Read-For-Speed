import { useProfile } from "../context/ProfileContext";
import { REQUIRED_SESSIONS_FOR_TEST, canUserTakeTest } from "../shared/testElegibility";
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "src/api/client";
import ReadingTest from "./ReadingTest"
import ProgressTestIntro from "../components/ProgressTestIntro";
import ProgressTestOutro from "../components/ProgressTestOutro";



export default function ProgressTest() {

    const { profile } = useProfile();

    const navigate = useNavigate();

    const numberOfTrainsTaken = profile?.completed_session_count ?? 0;

    if (!canUserTakeTest(numberOfTrainsTaken)) {
        navigate("/test");
    }

    return (
        <ReadingTest
            IntroComponent={ProgressTestIntro}
            fetchEndpoint={"/progress/fetch"}
            navigateTo={"/progresstest/questions"}
        />
    )
}