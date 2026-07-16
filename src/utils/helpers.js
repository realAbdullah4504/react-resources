export const formatQnaDetails = (body = {}) => {
  const advisor = body?.CaseInfo?.Advisor || {};
  const pxResults = advisor?.pxResults || [];

  const qnaObject = {
    ...body,
    CaseInfo: {
      ...body?.CaseInfo,
      Advisor: pxResults.map((result, index) => ({
        FCIARefNum: body?.caseId || `REF-${index + 1}`,
        CaseReceivedDate: result?.CaseReceivedDate || '',
        pyOrigUserID: result?.pyOrigUserID || 'N/A',
        pxUserName: result?.pxUserName || 'N/A',
        PreviouslyEnteredProperties: result?.PreviouslyEnteredProperties || [],
      })),
    },
  };

  const qnaTransactions = {};

  return { qnaObject, qnaTransactions };
};

export const toTitleCase = (str = '') => str
  .toLowerCase()
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

export const getLabelIdForTextInput = (questionId = '') => `${questionId}_label`;

export const formatP2PTransactions = (transactionData = [], locale = 'en-US', questionId = '') => transactionData
  .map((transaction) => ({
    transactionIdentifier: transaction?.transactionIdentifier || transaction?.id || '',
    createTime: transaction?.createTime || transaction?.date || '',
    sendOrLoad: transaction?.sendOrLoad || transaction?.type || '',
    memo: transaction?.memo || '',
    from: transaction?.from || '',
    recipient: transaction?.recipient || '',
    partnerIdentifier: transaction?.partnerIdentifier || '',
    createSource: transaction?.createSource || transaction?.origin || '',
    amount: {
      value: transaction?.amount?.value ?? transaction?.amount ?? 0,
      currency: transaction?.amount?.currency || 'USD',
    },
    [questionId]: transaction?.[questionId] || {},
  }));
