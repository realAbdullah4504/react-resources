import React from 'react';
import PropTypes from 'prop-types';

import langPack from '../../locale/langPack.json';

const TransactionTable = ({ selectedTransactions, locale, answerType }) => {
  const t = (key) => langPack[key] || key;

  if (!selectedTransactions || selectedTransactions.length === 0) {
    return <span className="margin-2-l">{t('noSelectedTransactions')}</span>;
  }

  const isAddTxn = answerType === 'AddTxn';

  const formatDate = (dateStr = '') => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    const date = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
    if (Number.isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  };

  const headers = isAddTxn
    ? [t('effectiveDate'), t('postedDate')]
    : [t('transDate'), t('postedDate')];

  headers.push(
    t('seNumber'),
    t('description'),
    t('billedAmount'),
    t('transAmount'),
    t('transCode'),
    t('type'),
    t('stmtDate')
  );
  if (isAddTxn) headers.push(t('tid'));
  headers.push(t('cardNo'));

  return (
    <table
      id="tablev2-base-instance"
      style={{ borderCollapse: 'collapse', width: '100%' }}
    >
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
        {selectedTransactions.map((transaction, index) => (
          <tr key={transaction?.ReferenceID || index}>
            {isAddTxn ? (
              <>
                <td style={cellStyle}>{formatDate(transaction?.TransactionEffDate)}</td>
                <td style={cellStyle}>{formatDate(transaction?.TransactionPostDate)}</td>
              </>
            ) : (
              <>
                <td style={cellStyle}>{formatDate(transaction?.TransactionDate)}</td>
                <td style={cellStyle}>{formatDate(transaction?.TransactionPostDate)}</td>
              </>
            )}
            <td style={cellStyle}>{transaction?.SENbr || '--'}</td>
            <td style={cellStyle}>{transaction?.TransactionDescription || '--'}</td>
            <td style={cellStyle}>{`${transaction?.BillingAmount || ''} ${transaction?.BillingCurrencyDesc || ''}`}</td>
            <td style={cellStyle}>{`${transaction?.TransactionAmount || ''} ${transaction?.TransactionCurrencyDesc || ''}`}</td>
            <td style={cellStyle}>{transaction?.TransCd || '--'}</td>
            <td style={cellStyle}>{transaction?.MonetaryTypeCd || '--'}</td>
            <td style={cellStyle}>{formatDate(transaction?.TransactionStmtDate)}</td>
            {isAddTxn && <td style={cellStyle}>{transaction?.TID || '--'}</td>}
            <td style={cellStyle} align="right">{transaction?.AccountNumber?.slice(11) || '--'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};

TransactionTable.propTypes = {
  selectedTransactions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  locale: PropTypes.string.isRequired,
  answerType: PropTypes.string.isRequired,
};

export default TransactionTable;
