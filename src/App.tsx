import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nProvider';
import { HomePage } from './routes/HomePage';
import './App.css';

/** Everything below the router; shared with the prerender (entry-server). */
export function AppShell() {
  return (
    <I18nProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pt-BR" element={<HomePage />} />
          {/* Old case-study and blog URLs land on the matching section.
              Vercel redirects these with a 301 before the app loads. */}
          <Route path="/work/*" element={<Navigate to="/#work" replace />} />
          <Route path="/blog/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </I18nProvider>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
