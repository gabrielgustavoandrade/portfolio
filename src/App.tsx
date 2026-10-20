import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nProvider';
import { HomePage } from './routes/HomePage';
import './App.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <I18nProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Old case-study and blog URLs land on the matching section. */}
            <Route path="/work/*" element={<Navigate to="/#work" replace />} />
            <Route path="/blog/*" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </I18nProvider>
    </BrowserRouter>
  );
}

export default App;
