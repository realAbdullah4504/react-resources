import React from 'react';
import PropTypes from 'prop-types';
import {
  CommonDataTable,
} from '@americanexpress/case-management-common';
import {
  buildBulkGridTableColumns,
} from '../../utils/tableConfig';

const BulkTableAnswer = ({
  questionId,
  transactionData,
}) => {
  const tableColumns = buildBulkGridTableColumns(transactionData);
  return (
    <div
      id={`${questionId}_tableAnswer`}
      key={`${questionId}_tableAnswer`}
    >
      <div className="pad-2-tb pad-2-l">
        <CommonDataTable
          data={transactionData}
          columns={tableColumns}
          noDataMessage=""
        />
      </div>
    </div>
  );
};

BulkTableAnswer.propTypes = {
  questionId: PropTypes.string.isRequired,
  transactionData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default BulkTableAnswer;
