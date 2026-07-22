// Q&A Flow
export const ANSWER_TYPE_RADIO = 'RADIO';
export const ANSWER_TYPE_SELECT = 'SELECT';
export const ANSWER_TYPE_DATE = 'DATE';
export const ANSWER_TYPE_CURRENCY = 'CURRENCY';
export const ANSWER_TYPE_TEXT = 'TEXT';
export const ANSWER_TYPE_TEXTAREA = 'TEXTAREA';
export const ANSWER_TYPE_MONEYAMOUNT = 'MONEYAMOUNT';
export const ANSWER_TYPE_TRANSACTION = 'TRANSACTION';
export const ANSWER_TYPE_P2P_TABLE = 'PEER_TO_PEER_TABLE'; // ASK ABOUT ANSWER TYPE
export const ANSWER_TYPE_TEXT_REQUIRED = 'TEXT_REQUIRED';
export const ANSWER_TYPE_TEXT_SIMPLE = 'TEXT_SIMPLE';
export const ANSWER_TYPE_BULK_GRID = 'BULK_GRID';

export const DB_DATE_FORMAT = 'yyyyMMdd';

export const TRANSACTIONS_PER_PAGE_QNA = 10;

// P2P QNA IDs
// Q&A Question IDs (for custom configurations)
export const QNA_ID_ENROLL = 'P2P_Enroll_SendSplit';
export const QNA_ID_LOAD_AUTHORIZED = 'P2P_Load_Authorized';
export const QNA_ID_SEND_AUTHORIZED = 'P2P_Send_MoneyToRecipient';
export const QNA_ID_CONTACT = 'P2P_Send_ContactWithRecipient';
export const QNA_ID_ESCALATION = 'P2P_Send_Escalation';
export const QNA_ID_PURPOSE = 'P2P_Send_Purpose';

export const P2P_QNA_ORDER = {
  [QNA_ID_ENROLL]: 0,
  [QNA_ID_LOAD_AUTHORIZED]: 1,
  [QNA_ID_SEND_AUTHORIZED]: 2,
  [QNA_ID_CONTACT]: 3,
  [QNA_ID_PURPOSE]: 4,
  [QNA_ID_ESCALATION]: 5,
};
