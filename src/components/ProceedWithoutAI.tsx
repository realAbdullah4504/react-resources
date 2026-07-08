import { useTestContext } from './Context';

const ProceedWithoutAI = () => {
  const {
    showAssistantInsights,
    setShowAssistantInsights,
    addLog,
  } = useTestContext();

  if (!showAssistantInsights) return null;

  return (
    <button
      onClick={() => {
        addLog('👤 User clicked "Proceed Without AI"');
        setShowAssistantInsights(false);
        addLog('🔄 AssistInsightsContainer will unmount...');
      }}
      style={{
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        marginRight: '10px'
      }}
    >
      Proceed Without AI
    </button>
  );
};

export default ProceedWithoutAI;
