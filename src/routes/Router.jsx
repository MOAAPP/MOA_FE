import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudyStartPage from "../pages/study/StudyStartPage";
import StudyStepSelectPage from "../pages/study/StudyStepSelectPage";
import VowelStudyPage from "../pages/study/VowelStudyPage";
import StudyCompletePage from "../pages/study/StudyCompletePage";
import AIReportPage from "../pages/study/AIReportPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudyStartPage />} />
        <Route path="/study/complete" element={<StudyCompletePage />} />
        <Route path="/study/vowel/:vowel" element={<VowelStudyPage />} />
        <Route path="/study/:category" element={<StudyStepSelectPage />} />
        <Route path="/analysis" element={<AIReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;