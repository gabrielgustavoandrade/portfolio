import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ScrollProgress } from './components/ScrollProgress';
import { HomePage } from './routes/HomePage';
import { WorkDetailPage } from './routes/WorkDetailPage';
import './App.css';

const V2Page = lazy(() =>
  import('./routes/V2Page').then((module) => ({ default: module.V2Page })),
);

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
          <Route
            path="/v2"
            element={
              <Suspense
                fallback={
                  <div
                    className="v2-fallback"
                    style={{ minHeight: '100vh', background: '#102733' }}
                    aria-hidden="true"
                  />
                }
              >
                <V2Page />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
