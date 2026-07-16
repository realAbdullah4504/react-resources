import React from 'react';
import PropTypes from 'prop-types';

import { buildBulkGridTableColumns } from '../../utils/tableConfig';
import langPack from '../../locale/langPack.json';

const formatCell = (field, value) => {
  if (value === undefined || value === null || value === '') {
    return '--';
  }
  if (field === 'DisputeAmount') {
    return new Intl.NumberFormat(langPack.globalValues.locale, {
      style: 'currency',
      currency: langPack.globalValues.currencyCode,
    }).format(Number(value) || 0);
  }
  if (field === 'ExpectDeliveryDate' && /^\d{8}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6) - 1;
    const day = value.slice(6);
    return new Intl.DateTimeFormat(langPack.globalValues.locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(year, month, day));
  }
  return value;
};

const BulkTableAnswer = ({
  questionId,
  transactionData,
}) => {
  const tableColumns = buildBulkGridTableColumns(transactionData);

  if (!tableColumns.length) {
    return <p className="margin-2-l">--</p>;
  }

  return (
    <div
      id={`${questionId}_tableAnswer`}
      key={`${questionId}_tableAnswer`}
    >
      <div className="pad-2-tb pad-2-l">
        <table
          id={`${questionId}_table`}
          style={{ borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr>
              {tableColumns.map((col) => (
                <th
                  key={col.field}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    textAlign: 'left',
                    background: '#f5f5f5',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactionData.map((row, rowIndex) => (
              <tr key={`${questionId}-row-${rowIndex}`}>
                {tableColumns.map((col) => (
                  <td
                    key={col.field}
                    style={{ border: '1px solid #ccc', padding: '8px' }}
                  >
                    {formatCell(col.field, row[col.field])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

BulkTableAnswer.propTypes = {
  questionId: PropTypes.string.isRequired,
  transactionData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default BulkTableAnswer;
