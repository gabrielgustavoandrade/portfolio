import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ScrollProgress } from './components/ScrollProgress';
import { HomePage } from './routes/HomePage';
import { WorkDetailPage } from './routes/WorkDetailPage';
import './App.css';
import './styles/homeSystem.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollProgress />
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/blog" element={<Navigate to="/#build-log" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
