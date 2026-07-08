import { useState } from 'react';
import { useTestContext } from './Context';

const CancelButton = () => {
  const {
    currentScreen,
    agentProbingData,
    triggerProbingRequest,
    addLog,
  } = useTestContext();

  const [showDialog, setShowDialog] = useState<boolean>(false);

  const shouldTriggerFinalClassification: boolean = currentScreen === 'DISPUTE_ASSIST'
    && agentProbingData?.probingComplete === false;

  const handleYesClick = async () => {
    addLog('👤 User confirmed CANCEL');
    addLog(`📋 Should trigger final classification: ${shouldTriggerFinalClassification}`);

    if (shouldTriggerFinalClassification) {
      addLog('🚀 Triggering FINAL_CLASSIFICATION from Cancel button...');
      await triggerProbingRequest();
    } else {
      addLog('⏭️ Skipping FINAL_CLASSIFICATION (conditions not met)');
    }

    setShowDialog(false);
  };

  return (
    <>
      <button
        onClick={() => {
          addLog('👤 User clicked "Cancel" button');
          setShowDialog(true);
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          marginRight: '10px'
        }}
      >
        Cancel
      </button>

      {showDialog && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 1000,
          minWidth: '400px'
        }}>
          <h3>Are you sure?</h3>
          <p>If you click Yes, the case setup will be cancelled.</p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleYesClick}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                addLog('👤 User clicked "No" in cancel dialog');
                setShowDialog(false);
              }}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              No
            </button>
          </div>
        </div>
      )}

      {showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999
        }} onClick={() => setShowDialog(false)} />
      )}
    </>
  );
};

export default CancelButton;
