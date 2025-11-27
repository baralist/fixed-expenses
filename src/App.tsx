import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import MyPage from '@/pages/MyPage';
import { MobileLayout } from '@/components/layout/MobileLayout';
import './App.css';

function App() {
  return (
    <Router>
      <MobileLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </MobileLayout>
    </Router>
  );
}

export default App;
