import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import OverviewPage from './pages/OverviewPage';
import RiskModelsPage from './pages/RiskModelsPage';
import SegmentationPage from './pages/SegmentationPage';
import RoiAnalyticsPage from './pages/RoiAnalyticsPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="risk-models" element={<RiskModelsPage />} />
        <Route path="segmentation" element={<SegmentationPage />} />
        <Route path="roi-analytics" element={<RoiAnalyticsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
