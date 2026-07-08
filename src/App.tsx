import { useTestContext, TestProvider } from './components/Context';
import JourneyCloseButton from './components/JourneyCloseButton.tsx';
import AssistInsightsContainer from './components/AssistInsightsContainer.tsx';
import ProceedWithoutAI from './components/ProceedWithoutAI.tsx';
import CancelButton from './components/CancelButton.tsx';
import ConsultationButton from './components/ConsultationButton.tsx';

const AppContent = () => {
  const {
    showAssistantInsights,
    setShowAssistantInsights,
    agentProbingData,
    setAgentProbingData,
    callLog,
    addLog,
  } = useTestContext();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <JourneyCloseButton />

      <h1 style={{ marginBottom: '10px' }}>🧪 Ref Pattern Test - FINAL_CLASSIFICATION Trigger</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Test the unmounting issue when "Proceed Without AI" is clicked
      </p>

      {/* Instructions */}
      <div style={{
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderLeft: '4px solid #ffc107',
        marginBottom: '20px',
        borderRadius: '5px'
      }}>
        <h3 style={{ marginTop: 0 }}>📝 Test Instructions:</h3>
        <ol>
          <li><strong>Test 1 (Should Work):</strong> Click Cancel/Consultation Accepted directly → Check if FINAL_CLASSIFICATION is called ✅</li>
          <li><strong>Test 2 (Bug):</strong> Click "Proceed Without AI" → Then click Cancel/Consultation Accepted → Check if FINAL_CLASSIFICATION is called ❌</li>
          <li><strong>Test 3 (Fix):</strong> In AssistInsightsContainer.tsx, remove the cleanup function → Repeat Test 2 → Should work ✅</li>
        </ol>
      </div>

      {/* Current State */}
      <div style={{
        padding: '15px',
        backgroundColor: '#e7f3ff',
        border: '1px solid #007bff',
        marginBottom: '20px',
        borderRadius: '5px'
      }}>
        <h3 style={{ marginTop: 0 }}>📊 Current State:</h3>
        <p><strong>Screen:</strong> DISPUTE_ASSIST</p>
        <p><strong>Probing Complete:</strong> {String(agentProbingData?.probingComplete)}</p>
        <p><strong>Show Assistant Insights:</strong> {String(showAssistantInsights)}</p>
        <p><strong>Should Trigger Final Classification:</strong> {String(!agentProbingData?.probingComplete)}</p>
      </div>

      {/* Assistant Insights Container */}
      {showAssistantInsights && <AssistInsightsContainer />}

      {/* When AI is hidden */}
      {!showAssistantInsights && (
        <div style={{
          padding: '20px',
          border: '2px dashed #ccc',
          borderRadius: '10px',
          backgroundColor: '#f8f9fa',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          <h3>🚫 AI Component Unmounted</h3>
          <p>The AssistInsightsContainer has been unmounted.</p>
          <p>Now try clicking Cancel or Consultation Accepted to see if FINAL_CLASSIFICATION is triggered.</p>
          <button
            onClick={() => {
              addLog('🔄 Remounting AssistInsightsContainer');
              setShowAssistantInsights(true);
            }}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Show AI Again
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>⚡ Actions:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
          <ProceedWithoutAI />
          <CancelButton />
          <ConsultationButton />

          <button
            onClick={() => {
              addLog('🔄 Toggling probingComplete state');
              setAgentProbingData((prev: typeof agentProbingData) => ({
                ...prev,
                probingComplete: !prev.probingComplete
              }));
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Toggle Probing Complete
          </button>

          <button
            onClick={() => {
              addLog('🗑️ Cleared log');
              window.location.reload();
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Call Log */}
      <div style={{
        padding: '15px',
        backgroundColor: '#000',
        color: '#00ff00',
        borderRadius: '10px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <h3 style={{ color: '#00ff00', marginTop: 0 }}>📜 Execution Log:</h3>
        {callLog.length === 0 ? (
          <p style={{ color: '#666' }}>No logs yet...</p>
        ) : (
          callLog.map((log: string, index: number) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <TestProvider>
      <AppContent />
    </TestProvider>
  );
}

export default App;
