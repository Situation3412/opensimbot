import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { SimcStatus } from './components/SimcStatus';
import { Home } from './pages/Home';
import { BestInBag } from './pages/BestInBag';
import { SingleSim } from './pages/SingleSim';
import { UpgradeFinder } from './pages/UpgradeFinder';
import { Settings } from './pages/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SimcProvider } from './contexts/SimcContext';
import { ConfigProvider } from './contexts/ConfigContext';

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <SimcProvider>
          <BrowserRouter>
            <div className="App bg-dark text-light min-vh-100">
              <Header />
              <SimcStatus />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/best-in-bag" element={<BestInBag />} />
                <Route path="/single-sim" element={<SingleSim />} />
                <Route path="/upgrade-finder" element={<UpgradeFinder />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </BrowserRouter>
        </SimcProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
