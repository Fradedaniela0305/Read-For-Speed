import ReadingTest from "./ReadingTest"
import BaselineTestIntro from "../components/BaselineTestIntro"
import BaselineTestOutro from "../components/BaselineTestOutro"

export default function BaselineTest() {

    return (
        <ReadingTest
            IntroComponent={BaselineTestIntro}
            fetchEndpoint={"/baseline/test"}
            navigateTo={"/baselinetest/questions" }
        />
    )
}