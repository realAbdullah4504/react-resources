import React, { useEffect, useState } from "react";

const ACCOUNT_RESEARCH = "ACCOUNT_RESEARCH";
const AGENT_FEEDBACK = "AGENT_FEEDBACK";
const ALTERNATIVE_RESOLUTION_INTENT = "alternativeResolution";
const SUSPECT_INTENT = "suspect";
const DISPUTE_ASSIST = "disputeAssist";
const OUTCOME = "outcome";
const OUTCOME_ASSIST = "outcomeAssist";
const FINAL_CLASSIFICATION = "FINAL_CLASSIFICATION";
const STATUS_SUCCESS = "SUCCESS";

const PROBING_OUTCOMES = {
  MANUAL_OVERRIDE: "MANUAL_OVERRIDE",
  CASE_SETUP: "CASE_SETUP",
  FRAUD_STEP_OUT: "FRAUD_STEP_OUT",
  CASE_AVOID: "CASE_AVOID",
};

const JOURNEY_MODES = {
  FRAUD_ASSIST: "FRAUD_ASSIST",
  STANDARD: "STANDARD",
};

const GDM_QNA_INTENTS = [
  "noKnowledge",
  "cancelled",
  "goodsServicesNotRcvd",
];

const JOURNEY_FLOW_CONFIG: Record<string, any> = {};

const continueEventTypes: Record<string, string> = {
  reviewTransactions: "CONTINUE_REVIEW_TRANSACTIONS",
  disputeAssist: "CONTINUE_DISPUTE_ASSIST",
  outcome: "CONTINUE_OUTCOME",
  outcomeAssist: "CONTINUE_OUTCOME_ASSIST",
};

const SCREEN_FLOW = [
  "reviewTransactions",
  "disputeAssist",
  "outcome",
  "outcomeAssist",
];

const getScreenFlowForMode = () => SCREEN_FLOW;

const getIntentRoutingPolicy = (
  _journeyMode: string,
  _customerIntent: string
) => "CONTINUE";

type Transaction = {
  id: number;
  checked: boolean;
  isEligible: boolean;
  recurringBilling: boolean;
};

type AlertItem = {
  key: string;
  messageId: string;
  type?: "info" | "alert";
  status?: string;
};

const messages: Record<string, string> = {
  customerIntentError: "Please select a customer intent.",
  noAiPossibleClaimTypeError:
    "AI cannot determine a possible claim type. Review the selected intent.",
  fraudIntentAlertMessage:
    "This intent requires the fraud handling flow.",
  alternativeResolutionAlertMessage:
    "This case requires an alternative resolution.",
  recurringBillingAlert:
    "All selected transactions are recurring billing transactions.",
  otherNotification:
    "The Other intent will launch the transactions experience.",
  allTransRemoved:
    "Select at least one transaction to continue.",
  over20TransactionsErrorMessage:
    "You cannot continue with more than 20 selected transactions.",
  disclosuresAlert:
    "Please complete all disclosures before continuing.",
  proceedWithoutAiInstruction:
    "You selected a suspected fraud intent. Confirm whether to proceed without AI.",
  confirmTalkOff: "Confirm consultation accepted",
  consultationAcceptedAreYouSure:
    "Are you sure you want to avoid this case?",
  caseAvoidAreYouSure: "Are you sure you want to avoid this case?",
  confirmTalkOffMessage:
    "Do you want to confirm this consultation?",
  ifYouClickYes: "If you click Yes, this case will be closed.",
  aiPossibleClaimTypeWithIntent: "Continue with the selected intent?",
  continueProbingRecommendationMessage:
    "The probing workflow is not complete. We recommend continuing probing.",
};

function Amex2() {
  const [journeyId] = useState("sandbox-journey");
  const [currentScreen, setCurrentScreen] = useState("reviewTransactions");
  const [customerIntent, setCustomerIntent] = useState("");
  const [allIneligible] = useState(false);

  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([
    {
      id: 1,
      checked: true,
      isEligible: true,
      recurringBilling: false,
    },
    {
      id: 2,
      checked: true,
      isEligible: true,
      recurringBilling: false,
    },
  ]);

  const [loading] = useState(false);
  const [allDisclosuresChecked, setAllDisclosuresChecked] = useState(false);
  const [showAssistantInsights, setShowAssistantInsights] = useState(true);
  const [wasManualOverride, setWasManualOverride] = useState(false);
  const [assistantFeedback] = useState<any>(null);

  const [agentProbingData, setAgentProbingData] = useState<any>({
    probingComplete: false,
    questionHistory: [],
    workflow_variant: "default",
  });

  const [userJourneyAccess] = useState<Record<string, boolean>>({
    [ACCOUNT_RESEARCH]: false,
    [AGENT_FEEDBACK]: false,
  });

  const [journeyMode, setJourneyMode] = useState(JOURNEY_MODES.STANDARD);

  const [showCaseAvoidDialog, setShowCaseAvoidDialog] = useState(false);
  const [showProceedWithAiDialog, setShowProceedWithAiDialog] =
    useState(false);

  const [activeAlert, setActiveAlert] = useState<AlertItem | null>(null);

  const hasAccountResearchAccess = userJourneyAccess?.[ACCOUNT_RESEARCH];
  const hasFeedbackAccess = !!userJourneyAccess?.[AGENT_FEEDBACK];
  const isVeritasMode = journeyMode === JOURNEY_MODES.FRAUD_ASSIST;

  const shouldRunFinalClassification =
    currentScreen === DISPUTE_ASSIST &&
    !!agentProbingData &&
    !agentProbingData?.probingComplete;

  const screenMapping = getScreenFlowForMode(journeyMode);

  const intentRoutingPolicy = getIntentRoutingPolicy(
    journeyMode,
    customerIntent
  );

  const fraudAlertMessageId =
    JOURNEY_FLOW_CONFIG[journeyMode]?.fraudAlertMessageId ||
    "fraudIntentAlertMessage";

  const intentAlertMessageId =
    currentScreen === DISPUTE_ASSIST && showAssistantInsights
      ? "noAiPossibleClaimTypeError"
      : "customerIntentError";

  const buildLogEvent = (event: Record<string, any>) => event;

  const ispLogger = (event: Record<string, any>) => {
    console.log("[ISP logger]", event);
  };

  const fetchServicingCaseEvent = (eventType: string) => {
    console.log("[Servicing case event]", eventType);
  };

  const runProbingWorkflow = () => {
    console.log("[Probing workflow]", {
      triggerType: FINAL_CLASSIFICATION,
      questionHistory: agentProbingData?.questionHistory || [],
      workflowVariant: agentProbingData?.workflow_variant,
    });

    setAgentProbingData((previous: any) => ({
      ...previous,
      probingComplete: true,
    }));
  };

  const launchExperience = (experience: string) => {
    console.log("[Launch experience]", experience);
    setCurrentScreen(experience);
  };

  const closeModule = () => {
    console.log("[Close module]");
    setCurrentScreen("closed");
  };

  const setLumiDetails = (updater: any) => {
    console.log("[Lumi details updated]", updater);
  };

  const showAlert = (
    key: string,
    messageId: string,
    type: "info" | "alert" = "alert",
    status = "error"
  ) => {
    setActiveAlert({
      key,
      messageId,
      type,
      status,
    });
  };

  const clearAlert = (key: string) => {
    setActiveAlert((currentAlert) =>
      currentAlert?.key === key ? null : currentAlert
    );
  };

  const displayedAlert: AlertItem | null = activeAlert
    ? {
        ...activeAlert,
        messageId:
          activeAlert.key === "intent"
            ? intentAlertMessageId
            : activeAlert.key === "fraud"
              ? fraudAlertMessageId
              : activeAlert.messageId,
      }
    : customerIntent === "other"
      ? {
          key: "other",
          messageId: "otherNotification",
          type: "info",
        }
      : null;

  const proceedToNextScreen = () => {
    if (currentScreen === DISPUTE_ASSIST) {
      if (shouldRunFinalClassification) {
        runProbingWorkflow();
      }

      fetchServicingCaseEvent(
        wasManualOverride
          ? PROBING_OUTCOMES.MANUAL_OVERRIDE
          : PROBING_OUTCOMES.CASE_SETUP
      );
    }

    if (currentScreen === OUTCOME_ASSIST) {
      setLumiDetails((previous: any) => ({
        ...previous,
        aiFeedback: {
          overallFeedback: assistantFeedback?.overallFeedback || null,
          feedbackDetails: assistantFeedback?.feedbackDetails || [],
        },
      }));
    }

    ispLogger(
      buildLogEvent({
        logMessage: `Continue clicked from ${currentScreen}`,
        eventType:
          continueEventTypes[currentScreen] || "CONTINUE_CLICKED",
        status: STATUS_SUCCESS,
        moduleLoadEndTime: Date.now(),
        experienceStep: currentScreen,
      })
    );

    setCurrentScreen(
      screenMapping[screenMapping.indexOf(currentScreen) + 1] || "complete"
    );

    setSelectedTransactions((previous) =>
      previous.filter((transaction) => transaction.checked)
    );
  };

  const handleContinue = () => {
    if (customerIntent === "") {
      showAlert("intent", intentAlertMessageId);
    } else if (isVeritasMode && customerIntent === SUSPECT_INTENT) {
      showAlert("proceedWithoutAi", "proceedWithoutAiInstruction");
    } else if (
      intentRoutingPolicy === PROBING_OUTCOMES.FRAUD_STEP_OUT
    ) {
      fetchServicingCaseEvent(intentRoutingPolicy);
      showAlert("fraud", fraudAlertMessageId);
    } else if (customerIntent === ALTERNATIVE_RESOLUTION_INTENT) {
      showAlert(
        "alternativeResolution",
        "alternativeResolutionAlertMessage"
      );
    } else if (activeAlert?.key === "recurringBilling") {
      launchExperience("servicing-transactions");
    } else if (activeAlert?.key === "allTransRemoved") {
    } else if (
      GDM_QNA_INTENTS.includes(customerIntent) &&
      selectedTransactions.filter((transaction) => transaction.checked)
        .length > 20
    ) {
      showAlert("over20Transactions", "over20TransactionsErrorMessage");
    } else if (
      (currentScreen === OUTCOME || currentScreen === OUTCOME_ASSIST) &&
      !allDisclosuresChecked
    ) {
      showAlert("disclosures", "disclosuresAlert");
    } else if (customerIntent === "other") {
      launchExperience("servicing-transactions");
      return null;
    } else {
      const shouldShowProbingDialog =
        showAssistantInsights &&
        !agentProbingData?.probingComplete &&
        currentScreen === DISPUTE_ASSIST;

      if (shouldShowProbingDialog) {
        setShowProceedWithAiDialog(true);
        return null;
      }

      proceedToNextScreen();
    }

    return null;
  };

  useEffect(() => {
    if (
      customerIntent !== "" ||
      (currentScreen === DISPUTE_ASSIST && !showAssistantInsights)
    ) {
      clearAlert("intent");
    }

    if (intentRoutingPolicy !== PROBING_OUTCOMES.FRAUD_STEP_OUT) {
      clearAlert("fraud");
    }

    if (customerIntent !== ALTERNATIVE_RESOLUTION_INTENT) {
      clearAlert("alternativeResolution");
    }

    if (
      !showAssistantInsights ||
      !(isVeritasMode && customerIntent === SUSPECT_INTENT)
    ) {
      clearAlert("proceedWithoutAi");
    }

    if (allDisclosuresChecked) {
      clearAlert("disclosures");
    }

    if (
      selectedTransactions.filter((transaction) => transaction.checked)
        .length <= 20
    ) {
      clearAlert("over20Transactions");
    }

    if (
      !hasAccountResearchAccess &&
      customerIntent === "cancelled" &&
      selectedTransactions?.filter((transaction) => transaction.recurringBilling)
        ?.length === selectedTransactions?.length
    ) {
      showAlert("recurringBilling", "recurringBillingAlert", "info");
      clearAlert("allTransRemoved");
    } else {
      clearAlert("recurringBilling");

      if (
        selectedTransactions.filter((transaction) => transaction.checked)
          .length === 0
      ) {
        if (selectedTransactions.some((transaction) => transaction.isEligible)) {
          showAlert("allTransRemoved", "allTransRemoved");
        } else {
          clearAlert("allTransRemoved");
        }
      } else {
        clearAlert("allTransRemoved");
      }
    }
  }, [
    customerIntent,
    selectedTransactions,
    allDisclosuresChecked,
    showAssistantInsights,
    intentRoutingPolicy,
    isVeritasMode,
    currentScreen,
    hasAccountResearchAccess,
  ]);

  const getContinueButtonLabel = () => {
    if (hasAccountResearchAccess) {
      if (currentScreen === OUTCOME_ASSIST) return "Submit";
      return "Proceed to case setup";
    }

    return "Continue";
  };

  const caseAvoidDialogHeading = isVeritasMode
    ? "confirmTalkOff"
    : hasAccountResearchAccess
      ? "consultationAcceptedAreYouSure"
      : "caseAvoidAreYouSure";

  const caseAvoidDialogMessage = isVeritasMode
    ? "confirmTalkOffMessage"
    : "ifYouClickYes";

  const selectedIntentLabel = customerIntent
    ? messages[customerIntent] || customerIntent
    : "";

  const customerIntentSelect = () => (
    <div className="intent-select">
      <label htmlFor="customerIntent">Customer intent</label>

      <select
        id="customerIntent"
        value={customerIntent}
        onChange={(event) => setCustomerIntent(event.target.value)}
        required
      >
        <option value="" />
        <option value="noKnowledge">I don't recognize this transaction</option>
        <option value="cancelled">Cancelled</option>
        <option value="goodsServicesNotRcvd">
          Goods/services not received
        </option>
        <option value="other">Other</option>
        <option value="alternativeResolution">Alternative resolution</option>
        <option value="suspect">Suspected fraud</option>
      </select>
    </div>
  );

  const showTransactionControls =
    !allIneligible &&
    selectedTransactions.some(
      (transaction) => typeof transaction?.isEligible !== "undefined"
    );

  return (
    <main className="sandbox">
      <header className="sandbox-header">
        <div>
          <h1>FooterBar Sandbox</h1>
          <p>Current screen: {currentScreen}</p>
        </div>

        <label>
          Journey mode

          <select
            value={journeyMode}
            onChange={(event) => setJourneyMode(event.target.value)}
          >
            <option value={JOURNEY_MODES.STANDARD}>Standard</option>
            <option value={JOURNEY_MODES.FRAUD_ASSIST}>
              Fraud Assist / Veritas
            </option>
          </select>
        </label>
      </header>

      <section className="demo-panel">
        <h2>Test data</h2>

        {selectedTransactions.map((transaction) => (
          <div className="transaction" key={transaction.id}>
            <label>
              <input
                type="checkbox"
                checked={transaction.checked}
                onChange={(event) => {
                  setSelectedTransactions((previous) =>
                    previous.map((item) =>
                      item.id === transaction.id
                        ? { ...item, checked: event.target.checked }
                        : item
                    )
                  );
                }}
              />

              Transaction {transaction.id}
            </label>

            <label>
              <input
                type="checkbox"
                checked={transaction.recurringBilling}
                onChange={(event) =>
                  setSelectedTransactions((previous) =>
                    previous.map((item) =>
                      item.id === transaction.id
                        ? {
                            ...item,
                            recurringBilling: event.target.checked,
                          }
                        : item
                    )
                  )
                }
              />

              Recurring billing
            </label>
          </div>
        ))}

        <label className="transaction">
          <input
            type="checkbox"
            checked={allDisclosuresChecked}
            onChange={(event) =>
              setAllDisclosuresChecked(event.target.checked)
            }
          />

          All disclosures checked
        </label>

        <label className="transaction">
          <input
            type="checkbox"
            checked={showAssistantInsights}
            onChange={(event) =>
              setShowAssistantInsights(event.target.checked)
            }
          />

          Show assistant insights
        </label>

        <label className="transaction">
          <input
            type="checkbox"
            checked={agentProbingData.probingComplete}
            onChange={(event) =>
              setAgentProbingData((previous: any) => ({
                ...previous,
                probingComplete: event.target.checked,
              }))
            }
          />

          Probing complete
        </label>

        <label className="transaction">
          <input
            type="checkbox"
            checked={wasManualOverride}
            onChange={(event) => setWasManualOverride(event.target.checked)}
          />

          Manual override
        </label>

        <label className="transaction">
          Screen

          <select
            value={currentScreen}
            onChange={(event) => setCurrentScreen(event.target.value)}
          >
            <option value="reviewTransactions">Review transactions</option>
            <option value="disputeAssist">Dispute Assist</option>
            <option value="outcome">Outcome</option>
            <option value="outcomeAssist">Outcome Assist</option>
            <option value="talkOff">Talk Off</option>
          </select>
        </label>
      </section>

      <footer className="footer-bar">
        <div className="footer-left">
          {currentScreen !== OUTCOME && (
            <button
              className="secondary"
              onClick={() => setShowCaseAvoidDialog(true)}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="footer-right">
          {showTransactionControls && (
            <>
              {currentScreen === "reviewTransactions" &&
                customerIntentSelect()}

              {currentScreen === DISPUTE_ASSIST && showAssistantInsights && (
                <button
                  className="secondary"
                  onClick={() => {
                    ispLogger(
                      buildLogEvent({
                        logMessage: "Proceed without AI clicked",
                        eventType: "PROCEED_WITHOUT_AI_CLICKED",
                        status: STATUS_SUCCESS,
                        moduleLoadEndTime: Date.now(),
                        experienceStep: currentScreen,
                      })
                    );

                    setWasManualOverride(true);
                    setShowAssistantInsights(false);
                  }}
                >
                  Proceed without AI
                </button>
              )}

              {(currentScreen === "talkOff" ||
                currentScreen === DISPUTE_ASSIST) && (
                <button
                  className="secondary"
                  onClick={() => {
                    ispLogger(
                      buildLogEvent({
                        logMessage:
                          "Consultation Accepted Dialog Box render start",
                        eventType:
                          "CONSULTATION_ACCEPTED_DIALOG_BOX_LOAD_STARTED",
                        status: STATUS_SUCCESS,
                        moduleLoadStartTime: Date.now(),
                        experienceStep: currentScreen,
                      })
                    );

                    setShowCaseAvoidDialog(true);
                  }}
                >
                  Case Avoid
                </button>
              )}

              <button
                className="primary"
                onClick={handleContinue}
                disabled={loading}
              >
                {loading ? "Loading..." : getContinueButtonLabel()}
              </button>
            </>
          )}
        </div>
      </footer>

      <section aria-live="polite" className="alerts">
        {displayedAlert && (
          <div
            key={displayedAlert.key}
            role={displayedAlert.type === "info" ? "status" : "alert"}
            className={`alert ${
              displayedAlert.type === "info" ? "info" : "error"
            }`}
          >
            {messages[displayedAlert.messageId] ||
              displayedAlert.messageId}
          </div>
        )}
      </section>

      {showCaseAvoidDialog && (
        <div className="overlay">
          <section className="dialog" role="dialog" aria-modal="true">
            <h2>{messages[caseAvoidDialogHeading]}</h2>
            <p>{messages[caseAvoidDialogMessage]}</p>

            <button
              className="primary full-width"
              onClick={() => {
                ispLogger(
                  buildLogEvent({
                    logMessage: "Consultation accepted dialog confirmed",
                    eventType: "CONSULTATION_ACCEPTED_YES_CLICKED",
                    status: STATUS_SUCCESS,
                    moduleLoadEndTime: Date.now(),
                    experienceStep: currentScreen,
                  })
                );

                if (shouldRunFinalClassification) {
                  runProbingWorkflow();
                }

                fetchServicingCaseEvent(PROBING_OUTCOMES.CASE_AVOID);
                closeModule();
                setShowCaseAvoidDialog(false);
              }}
            >
              Yes
            </button>

            <button
              className="secondary full-width"
              onClick={() => setShowCaseAvoidDialog(false)}
            >
              No
            </button>
          </section>
        </div>
      )}

      {showProceedWithAiDialog && (
        <div className="overlay">
          <section className="dialog" role="dialog" aria-modal="true">
            <h2>AI possible claim type: {selectedIntentLabel}</h2>

            <p>{messages.continueProbingRecommendationMessage}</p>

            <button
              className="primary full-width"
              onClick={() => setShowProceedWithAiDialog(false)}
            >
              Continue probing
            </button>

            <button
              className="secondary full-width"
              onClick={() => {
                ispLogger(
                  buildLogEvent({
                    logMessage:
                      "Proceed with AI possible claim type clicked",
                    eventType:
                      "PROCEED_WITH_AI_POSSIBLE_CLAIM_TYPE_CLICKED",
                    status: STATUS_SUCCESS,
                    moduleLoadEndTime: Date.now(),
                    experienceStep: currentScreen,
                  })
                );

                setShowProceedWithAiDialog(false);
                proceedToNextScreen();
              }}
            >
              Proceed with AI possible claim type
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Amex2;