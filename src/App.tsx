import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { SimcStatus } from './components/SimcStatus';
import { Home } from './pages/Home';
import { BestInBag } from './pages/BestInBag';
import { SingleSim } from './pages/SingleSim';
import { UpgradeFinder } from './pages/UpgradeFinder';
import { Settings } from './pages/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SimcProvider } from './contexts/SimcContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { ToastProvider } from './contexts/ToastContext';
import { FormProvider } from './contexts/FormContext';
import { useConfig } from './contexts/ConfigContext';
import { getComponentStyles } from './utils/theme';

function AppContent() {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className={getComponentStyles('app', undefined, isDark)}>
          <Navigation />
          <SimcStatus />
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/best-in-bag" element={<BestInBag />} />
              <Route path="/single-sim" element={<SingleSim />} />
              <Route path="/upgrade-finder" element={<UpgradeFinder />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ConfigProvider>
      <SimcProvider>
        <ToastProvider>
          <FormProvider>
            <AppContent />
          </FormProvider>
        </ToastProvider>
      </SimcProvider>
    </ConfigProvider>
  );
}

export default App;
