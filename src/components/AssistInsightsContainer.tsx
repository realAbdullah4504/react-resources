import { useEffect, useRef, useCallback, useState } from "react";
import { TestContext, useTestContext } from "./Context";

interface Question {
  id: number;
  text: string;
  shouldDisplay: boolean;
}

const AssistInsightsContainer = () => {
  const { setTriggerProbingRequest, addLog } = useTestContext();

  const [questionHistory] = useState<Question[]>([
    { id: 1, text: "Did you authorize this transaction?", shouldDisplay: true },
    { id: 2, text: "Have you contacted the merchant?", shouldDisplay: true },
  ]);
  const [workflowVariant, _setWorkflowVariant] = useState<string>("variant_A");
  const [iterationCount, _setIterationCount] = useState<number>(1);

  const fetchProbingWorkflow = useCallback(
    async ({
      nextTriggerType = "PROBING",
    }: { nextTriggerType?: string } = {}) => {
      addLog(`🔵 API Call: ${nextTriggerType}`);
      addLog(`   Iteration: ${iterationCount}`);
      addLog(`   Variant: ${workflowVariant}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addLog(`✅ ${nextTriggerType} completed`);
      return { iterationCount, workflowVariant };
    },
    [iterationCount, workflowVariant],
  );

  const fetchProbingWorkflowRef = useRef<
    (options?: { nextTriggerType?: string }) => Promise<unknown>
  >(() => Promise.resolve(null));

  useEffect(() => {
    fetchProbingWorkflowRef.current = fetchProbingWorkflow;
    console.log("fetch is added to ref",fetchProbingWorkflow);
  }, [fetchProbingWorkflow]);

  useEffect(() => {
    addLog(`🟢 Setting trigger "useRef pattern"`);
    setTriggerProbingRequest(() => async () => {
      return fetchProbingWorkflowRef.current({
        nextTriggerType: "FINAL_CLASSIFICATION",
      }).then(() => undefined);
    });

    return () => {
      addLog("🔴 Unmounting - Clearing trigger");
      setTriggerProbingRequest(() => () => {
        addLog("❌ Empty trigger called (component was unmounted)");
        return Promise.resolve();
      });
    };
  }, [setTriggerProbingRequest]);

  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #430099",
        borderRadius: "10px",
        backgroundColor: "#F9F7FC",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ color: "#430099" }}>🤖 Assistant Insights Container</h3>

      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => _setIterationCount((c) => c + 1)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Increment Iteration ({iterationCount})
        </button>
        <button
          onClick={() =>
            _setWorkflowVariant((v) =>
              v === "variant_A" ? "variant_B" : "variant_A",
            )
          }
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Toggle Variant ({workflowVariant})
        </button>
      </div>

      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "5px",
        }}
      >
        <h4>Questions:</h4>
        {questionHistory.map((q) => (
          <div key={q.id} style={{ marginLeft: "10px", marginTop: "5px" }}>
            • {q.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
        <p>
          <strong>How to test:</strong>
        </p>
        <ol>
          <li>
            Make sure "Use useRef Pattern" is <strong>unchecked</strong> (stale
            closure mode)
          </li>
          <li>Click "Increment Iteration" a few times to change state</li>
          <li>Click "Proceed Without AI" to unmount</li>
          <li>Click "Show AI Again" to remount</li>
          <li>Click "Cancel" or "Consultation Accepted" to trigger</li>
          <li>
            Check the log - you'll see the OLD iteration count (stale closure!)
          </li>
          <li>
            Now check "Use useRef Pattern" and repeat - you'll see the CURRENT
            iteration count
          </li>
        </ol>
      </div>
    </div>
  );
};

export default AssistInsightsContainer;
