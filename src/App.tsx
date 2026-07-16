import { TestProvider } from './components/Context';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CasePage } from './components/CasePage.tsx';
import AxpServicingCaseClaimQaDetails from './components/AxpServicingCaseClaimQaDetails';
import langPack from './locale/langPack.json';

const SandboxQaDetails = () => (
  <AxpServicingCaseClaimQaDetails
    languageData={langPack}
    locale={langPack.globalValues.locale}
    disputeId="C-161219698"
    journey={{ name: 'sandbox' }}
  />
);

function App() {
  return (
    <BrowserRouter>
      <TestProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/case" replace />} />
          <Route path="/case" element={<CasePage />} />
          <Route path="/sandbox" element={<SandboxQaDetails />} />
        </Routes>
      </TestProvider>
    </BrowserRouter>
  );
}

export default App;
