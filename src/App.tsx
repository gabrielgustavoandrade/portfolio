import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './routes/HomePage';
import { WorkDetailPage } from './routes/WorkDetailPage';
import './App.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
