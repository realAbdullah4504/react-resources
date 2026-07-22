import { P2P_QNA_ORDER, QNA_ID_ESCALATION, QNA_ID_PURPOSE } from './constants';

export const toTitleCase = (str) => str.replace(
  /\w\S*/g,
  (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
);

/**

 * Formats the transaction-level QNA details from the TransactionList object.
 * CURRENTLY P2P-ONLY UTILITY
 * @param {object} transactionList - The list of transactions from the QNA API response
 * @param {array} qnaGroups - The list of Q&A groups to process, from claim-level details

 * @returns {object} Object with formatted Q&A details and transaction data
  * @property {object} qnaObject - The formatted Q&A object
  * @property {object} qnaTransactions - The formatted transaction data
*/
/* eslint-disable max-params -- need all params for this function */
export const formatTransactionQna = (
  transactionList,
  qnaGroups,
  qnaOrder = P2P_QNA_ORDER,
  transactionIdAttribute = 'P2PTID') => {
  /* eslint-enable max-params -- need all params for this function */

  let transactions = {};
  const transactionQna = {};

  // Loop through each transaction in TransactionList, add transaction data to dictionary
  transactionList.forEach((transaction) => {
    // Loop through each group of questions within Transactions
    // (assuming Transactions-level will have no more groups than Claim-level)
    qnaGroups.forEach((group) => {
      if (transaction[group]) {
        const transactionId = transaction[transactionIdAttribute];

        transaction[group].PreviouslyEnteredProperties?.forEach((question) => {
          // Do not add if this question object was deleted (answer changed during setup)
          if (question.pyDeletedObject !== 'true') {
            // Check if question is already in transactionQna
            const index = transactionQna[group]?.findIndex(
              (storedQuestion) => storedQuestion?.QuestionDtls?.QUES_ID
              === question?.QuestionDtls?.QUES_ID
            );

            if (index === null || index === undefined) {
              // group is not in transactionQna, add group, question and transaction
              transactionQna[group] = [];
              transactionQna[group][qnaOrder[question?.QuestionDtls?.QUES_ID] || 0] = {
                ...question,
                transactions: {
                  [transactionId]: {
                    identifier: question.PropertyValue, verbiage: question.Verbiage,
                  },
                },
              };
            } else if (index > -1) { // question is already in transactionQna, add transaction
              transactionQna[group][index].transactions = {
                ...transactionQna[group][index].transactions,
                [transactionId]: {
                  identifier: question.PropertyValue, verbiage: question.Verbiage,
                },
              };
            } else { // question is not in transactionQna, add question and transaction to list
              const lastIndex = transactionQna[group].length;
              transactionQna[group][qnaOrder[question?.QuestionDtls?.QUES_ID] || lastIndex] = {
                ...question,
                transactions: {
                  [transactionId]: {
                    identifier: question.PropertyValue, verbiage: question.Verbiage,
                  },
                },
              };
            }
          }
        });

        // Add transactions details to transactions object
        transactions = {
          ...transactions,
          [transactionId]: {
            ...transaction,
            [group]: undefined, // remove questions from transaction, already saved in qnaDetails
          },
        };
      }
    });
  });

  return { qna: transactionQna, transactions };
};

/**

 * Formats the response from Q&A API to extract and structure Q&A details.
 * If transaction list is available, adds transaction-level Q&A to each qna group
 * @param {object} qnaResp - The response object from the Q&A API

 * @returns {object} Object with formatted Q&A details and transaction data
  * @property {object} qnaObject - The formatted Q&A object
  * @property {object} qnaTransactions - The formatted transaction data
*/
export const formatQnaDetails = (qnaResp) => {
  let qnaDetails = {};
  let transactionData = {};
  let transactionLevelQna = {};
  const qnaObject = qnaResp;

  console.log('formatQnaDetails input:', qnaResp);

  if (qnaResp.Errors?.[0]?.description) {
    return { qnaObject, qnaTransactions: {} };
  }

  if (!qnaResp.CaseInfo) {
    return { qnaObject, qnaTransactions: {} };
  }

  // Create object from all properties in CaseInfo (filter out TransactionList)
  const qnaGroups = Object.keys(qnaResp.CaseInfo).filter((group) => group !== 'TransactionList');
  console.log('qnaGroups:', qnaGroups);

  qnaGroups.forEach((group) => {
    // Handle both structures: group could be object with pxResults or directly an array
    const groupData = qnaResp.CaseInfo?.[group];
    qnaDetails = { ...qnaDetails, [group]: groupData?.pxResults || groupData };
  });
  console.log('qnaDetails after mapping:', qnaDetails);

  if (qnaResp.CaseInfo?.TransactionList) {
  // Format transaction-level qna if available (CURRENTLY P2P-ONLY)
    const { qna, transactions } = formatTransactionQna(
      qnaResp.CaseInfo?.TransactionList, qnaGroups
    );
    transactionData = transactions;
    transactionLevelQna = qna;
  }

  qnaGroups.forEach((group) => {
    console.log(`Processing group ${group}:`, qnaDetails[group]);
    if (transactionLevelQna[group]) {
      const updatedPrevEnteredProperties = [
        ...qnaDetails[group][0].PreviouslyEnteredProperties,
        ...transactionLevelQna[group].filter((element) => element),
      ];

      // update first item of Previously Entered Properties
      // Add questions to their respective groups in qnaDetails
      qnaDetails[group][0].PreviouslyEnteredProperties = updatedPrevEnteredProperties;
    }

    // Filter out groups with no previously answered questions, or qna data
    // Check if the group exists and has at least one element with valid data
    if (!qnaDetails[group] || qnaDetails[group].length === 0) {
      console.log(`Deleting group ${group} - group is empty or undefined`);
      delete qnaDetails[group];
    } else if (!qnaDetails[group]?.[0]?.PreviouslyEnteredProperties
      && !qnaDetails[group]?.[0]?.pyPropertyName
      && !qnaDetails[group]?.[0]?.OutcomeCode) {
      console.log(`Deleting group ${group} - no valid data properties`);
      delete qnaDetails[group];
    }
  });

  console.log('qnaDetails after filtering:', qnaDetails);

  // Last check to send CaseInfo as undefined before keys (tab names) are derived in main component
  // If no qna groups are returned by this step
  if (Object.keys(qnaDetails).length === 0) {
    qnaObject.CaseInfo = undefined;
  } else {
    qnaObject.CaseInfo = qnaDetails;
  }

  console.log('Final qnaObject:', qnaObject);

  return { qnaObject, qnaTransactions: transactionData };
};

/**

 * Formats the "From" field of the transactions table based on the transaction type and card number.
 * @param {string} txnType - Transaction type, ex. 'Send' or 'Load'
 * @param {string} cardNumber - The card number associated with the transaction
 * @param {object} intl - Internationalization object for formatting messages

 * @returns {string} The formatted string to display in the "From" field
*/

export const formatTableFromField = (txnType, cardNumber, intl) => {
  if (txnType === 'SEND') { // Send transactions default to static verbiage "Send Account"
    return intl.formatMessage({ id: 'amexSendAccount' });
  }
  if (cardNumber) { // Load transactions show the last 5 digits of card number
    return `${intl.formatMessage({ id: 'cardEndingIn' }, { cardLastDigits: cardNumber.slice(-5) })}`;
  }
  return ''; // If type or card number is not available, display nothing
};

export const formatP2PTransactions = (transactions, intl, questionId) => {
  let formattedTransactions = [];

  if (transactions) {
    formattedTransactions = transactions.map((transaction) => {
      const {
        P2PTID,
        CreateTime,
        Memo,
        FirstName,
        LastName,
        Phone,
        P2PTxnType,
        CardNumber,
        TotalTransactionAmount,
        TotalTransactionAmountCurrency,
        TransactionAmount,
        TransactionCurrencyDesc,
        PartnerID,
        CreateSource,
      } = transaction;

      return {
        transactionIdentifier: P2PTID,
        createTime: CreateTime,
        sendOrLoad: P2PTxnType,
        memo: Memo,
        from: formatTableFromField(P2PTxnType, CardNumber, intl),
        recipient: P2PTxnType === 'LOAD' ? intl.formatMessage({ id: 'amexSendAccount' })
          : `${FirstName || ''}${FirstName ? ' ' : ''}${LastName || ''}`,
        phone: Phone,
        amount: {
          value: P2PTxnType === 'SEND' ? TotalTransactionAmount : TransactionAmount,
          currency: P2PTxnType === 'SEND' ? TotalTransactionAmountCurrency : TransactionCurrencyDesc,
        },
        partnerIdentifier: PartnerID,
        createSource: CreateSource,
        [questionId]: transaction[questionId],
      };
    });
  }

  return formattedTransactions;
};

export const getLabelIdForTextInput = (questionId) => {
  switch (questionId) {
    case QNA_ID_PURPOSE: return 'describePurpose';
    case QNA_ID_ESCALATION: return 'describeEscalationReason';
    default: return 'describeSelection';
  }
};

export const isP2PJourney = (caseQAInfo) => {
  // Most reliable: check outcome code
  const outcomeCode = caseQAInfo?.[0]?.OutcomeCode || '';
  return outcomeCode.includes('P2P_');
  // Fallback: check stage
  // const stage = response.CaseInfo?.Advisor?.pxResults?.[0]?.Stage || '';
  // return stage.includes('P2P');
};
