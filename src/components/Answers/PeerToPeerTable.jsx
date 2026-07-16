import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import langPack from '../../locale/langPack.json';
import {
  ANSWER_TYPE_RADIO,
  ANSWER_TYPE_SELECT,
  ANSWER_TYPE_TEXT_REQUIRED,
} from '../../utils/constants';
import { formatP2PTransactions, toTitleCase } from '../../utils/helpers';
import RadioAnswer from './RadioAnswer';
import DropdownAnswer from './DropdownAnswer';
import TextAnswer from './TextAnswer';
import TextAreaAnswer from './TextAreaAnswer';

const PeerToPeerTableAnswer = ({
  questionId,
  transactionData,
  inputColumnHeader,
  inputType,
  answerOptions,
  locale,
}) => {
  const [mappedTransactions, setMappedTransactions] = useState([]);

  const t = (key) => langPack[key] || key;

  const getHeader = (transactions = []) => {
    const types = transactions.map((transaction) => transaction.P2PTxnType);
    const uniqueTypes = [...new Set(types)];
    if (uniqueTypes.length > 1) return 'disputedTransactions';
    if (uniqueTypes[0] === 'LOAD') return 'disputedLoadTransactions';
    if (uniqueTypes[0] === 'SEND') return 'disputedSendTransactions';
    return 'disputedTransactions';
  };

  const getInputComponent = (transactionId, type, value) => {
    const componentId = `${questionId}_${transactionId}`;
    switch (type) {
      case ANSWER_TYPE_RADIO:
        return (
          <RadioAnswer
            id={componentId}
            questionId={componentId}
            answer={value}
            answerOptions={answerOptions}
            isDisabled={true}
          />
        );
      case ANSWER_TYPE_SELECT:
        return (
          <DropdownAnswer
            id={componentId}
            questionId={componentId}
            answer={value}
            answerOptions={answerOptions}
            isDisabled={true}
          />
        );
      case ANSWER_TYPE_TEXT_REQUIRED:
        return (
          <TextAreaAnswer
            id={componentId}
            questionId={componentId}
            answer={value}
            isDisabled={true}
          />
        );
      default:
        return (
          <TextAnswer
            id={componentId}
            questionId={componentId}
            selectedAnswer={value}
            isDisabled={true}
          />
        );
    }
  };

  useEffect(() => {
    if (transactionData) {
      setMappedTransactions(formatP2PTransactions(transactionData, locale, questionId));
    }
  }, [transactionData, locale, questionId]);

  const headers = [
    t('date'),
    t('type'),
    t('memo'),
    t('from'),
    t('recipient'),
    t('partner'),
    t('origin'),
    t('amount'),
    inputColumnHeader,
  ];

  return (
    <div id={`${questionId}_tableAnswer`} key={`${questionId}_tableAnswer`}>
      <div className="pad-1-tb">
        <h3>{t(getHeader(transactionData))}</h3>
      </div>
      {mappedTransactions.length === 0 ? (
        <p className="margin-2-l">--</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    textAlign: 'left',
                    background: '#f5f5f5',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mappedTransactions.map((transaction) => {
              const {
                transactionIdentifier,
                createTime,
                sendOrLoad,
                memo,
                from,
                recipient,
                partnerIdentifier,
                createSource,
                amount,
              } = transaction;
              return (
                <tr key={transactionIdentifier}>
                  <td style={cellStyle}>
                    {createTime
                      ? new Intl.DateTimeFormat(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      }).format(new Date(createTime))
                      : '--'}
                  </td>
                  <td style={cellStyle}>{sendOrLoad ? toTitleCase(sendOrLoad) : '--'}</td>
                  <td style={cellStyle}>{memo || '--'}</td>
                  <td style={cellStyle}>{from || '--'}</td>
                  <td style={cellStyle}>{recipient || '--'}</td>
                  <td style={cellStyle}>{partnerIdentifier || '--'}</td>
                  <td style={cellStyle}>{createSource || '--'}</td>
                  <td style={cellStyle} align="right">
                    {amount?.value
                      ? new Intl.NumberFormat(locale || 'en-US', {
                        style: 'currency',
                        currency: amount?.currency || 'XXX',
                      }).format(amount?.value)
                      : '--'}
                  </td>
                  <td style={cellStyle}>
                    {getInputComponent(
                      transactionIdentifier,
                      inputType,
                      transaction[questionId]?.identifier || ''
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};

PeerToPeerTableAnswer.propTypes = {
  questionId: PropTypes.string.isRequired,
  transactionData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  locale: PropTypes.string.isRequired,
  inputColumnHeader: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  answerOptions: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default PeerToPeerTableAnswer;
