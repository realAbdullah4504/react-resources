import { useTestContext } from './Context';

const JourneyCloseButton = () => {
  const {
    currentScreen,
    agentProbingData,
    triggerProbingRequest,
    addLog,
  } = useTestContext();

  const shouldTriggerFinalClassification: boolean = currentScreen === 'DISPUTE_ASSIST'
    && agentProbingData?.probingComplete === false;

  const handleClose = async () => {
    addLog('👤 User clicked Journey Close (X) button');
    addLog(`📋 Should trigger final classification: ${shouldTriggerFinalClassification}`);

    if (shouldTriggerFinalClassification) {
      addLog('🚀 Triggering FINAL_CLASSIFICATION from Journey X button...');
      triggerProbingRequest().catch(console.error);
      console.log("close module")
    } else {
      addLog('⏭️ Skipping FINAL_CLASSIFICATION (conditions not met)');
    }
  };

  return (
    <button
      onClick={handleClose}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '30px',
        height: '30px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title="Close Journey"
    >
      ×
    </button>
  );
};

export default JourneyCloseButton;
