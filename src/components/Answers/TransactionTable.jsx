import React from 'react';
import PropTypes from 'prop-types';
import {
  DataTableV2, DataTableBodyV2, DataTableCellV2,
  DataTableHeadV2, DataTableRowV2, DataTableHeadCellV2,
} from '@americanexpress/dls-react';
import { FormattedMessage } from 'react-intl';

const TransactionTable = ({ selectedTransactions, locale, answerType }) => {
  if (selectedTransactions?.length === 0 || selectedTransactions === undefined) {
    return (
      <FormattedMessage id="noSelectedTransactions" />
    );
  }

  return (
    <DataTableV2 id="tablev2-base-instance" striped="true" small="true" bordered="true">
      <DataTableHeadV2>
        <DataTableRowV2>
          {answerType === 'AddTxn' ? (
            <>
              <DataTableHeadCellV2><FormattedMessage id="effectiveDate" /></DataTableHeadCellV2>
              <DataTableHeadCellV2><FormattedMessage id="postedDate" /></DataTableHeadCellV2>
            </>
          )
            : (
              <>
                <DataTableHeadCellV2><FormattedMessage id="transDate" /></DataTableHeadCellV2>
                <DataTableHeadCellV2><FormattedMessage id="postedDate" /></DataTableHeadCellV2>
              </>
            )}
          <DataTableHeadCellV2><FormattedMessage id="seNumber" /></DataTableHeadCellV2>
          <DataTableHeadCellV2><FormattedMessage id="description" /></DataTableHeadCellV2>
          <DataTableHeadCellV2 align="right"><FormattedMessage id="billedAmount" /></DataTableHeadCellV2>
          <DataTableHeadCellV2 align="right"><FormattedMessage id="transAmount" /></DataTableHeadCellV2>
          <DataTableHeadCellV2><FormattedMessage id="transCode" /></DataTableHeadCellV2>
          <DataTableHeadCellV2><FormattedMessage id="type" /></DataTableHeadCellV2>
          <DataTableHeadCellV2><FormattedMessage id="stmtDate" /></DataTableHeadCellV2>
          {answerType === 'AddTxn' && (
            <DataTableHeadCellV2><FormattedMessage id="tid" /></DataTableHeadCellV2>
          )}
          <DataTableHeadCellV2 align="right"><FormattedMessage id="cardNo" /></DataTableHeadCellV2>
        </DataTableRowV2>
      </DataTableHeadV2>
      <DataTableBodyV2>
        {selectedTransactions?.map((transaction) => (
          <DataTableRowV2 key={transaction?.ReferenceID}>
            {answerType === 'AddTxn' ? (
              <>
                <DataTableCellV2>
                  {new Intl.DateTimeFormat(locale, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  }).format(new Date(transaction?.TransactionEffDate.split('-')))}
                </DataTableCellV2>
                <DataTableCellV2>
                  {new Intl.DateTimeFormat(locale, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  }).format(new Date(transaction?.TransactionPostDate.split('-')))}
                </DataTableCellV2>
              </>
            )
              : (
                <>
                  <DataTableCellV2>
                    {new Intl.DateTimeFormat(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }).format(new Date(transaction?.TransactionDate.split('-')))}
                  </DataTableCellV2>
                  <DataTableCellV2>
                    {new Intl.DateTimeFormat(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }).format(new Date(transaction?.TransactionPostDate.split('-')))}
                  </DataTableCellV2>
                </>
              )}
            <DataTableCellV2>{transaction?.SENbr}</DataTableCellV2>
            <DataTableCellV2>{transaction?.TransactionDescription}</DataTableCellV2>
            <DataTableCellV2 align="right">{transaction?.BillingAmount} {transaction?.BillingCurrencyDesc}</DataTableCellV2>
            <DataTableCellV2 align="right">{transaction?.TransactionAmount} {transaction?.TransactionCurrencyDesc}</DataTableCellV2>
            <DataTableCellV2>{transaction?.TransCd}</DataTableCellV2>
            <DataTableCellV2>{transaction?.MonetaryTypeCd}</DataTableCellV2>
            <DataTableCellV2>
              {new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              }).format(new Date(transaction?.TransactionStmtDate.split('-')))}
            </DataTableCellV2>
            {answerType === 'AddTxn' && (
              <DataTableCellV2>{transaction?.TID}</DataTableCellV2>
            )}
            <DataTableCellV2 align="right">{transaction?.AccountNumber.slice(11)}</DataTableCellV2>
          </DataTableRowV2>
        ))}
      </DataTableBodyV2>
    </DataTableV2>
  );
};
TransactionTable.propTypes = {
  selectedTransactions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  locale: PropTypes.string.isRequired,
  answerType: PropTypes.string.isRequired,
};

export default TransactionTable;
