import React, { createContext, useState } from 'react';

export interface AgentProbingData {
  probingComplete: boolean;
  confidence: string; // "High", "Medium", "Low"
  suggestedIntent: string;
}

export interface TestContextType {
  currentScreen: string;
  setCurrentScreen: React.Dispatch<React.SetStateAction<string>>;
  agentProbingData: AgentProbingData;
  setAgentProbingData: React.Dispatch<React.SetStateAction<AgentProbingData>>;
  showAssistantInsights: boolean;
  setShowAssistantInsights: React.Dispatch<React.SetStateAction<boolean>>;
  triggerProbingRequest: () => Promise<void>;
  setTriggerProbingRequest: React.Dispatch<React.SetStateAction<() => Promise<void>>>;
  callLog: string[];
  addLog: (message: string) => void;
}

export const TestContext = createContext<TestContextType | null>(null);

export const useTestContext = () => {
  const context = React.useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<string>('DISPUTE_ASSIST');
  const [agentProbingData, setAgentProbingData] = useState<AgentProbingData>({
    probingComplete: false,
    confidence: 'Medium',
    suggestedIntent: 'noKnowledge'
  });
  const [showAssistantInsights, setShowAssistantInsights] = useState<boolean>(true);
  const [triggerProbingRequest, setTriggerProbingRequest] = useState<() => Promise<void>>(() => {
    console.log('⚠️ Trigger not initialized yet');
    return Promise.resolve();
  });
  const [callLog, setCallLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setCallLog(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  const value: TestContextType = {
    currentScreen,
    setCurrentScreen,
    agentProbingData,
    setAgentProbingData,
    showAssistantInsights,
    setShowAssistantInsights,
    triggerProbingRequest,
    setTriggerProbingRequest,
    callLog,
    addLog,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
