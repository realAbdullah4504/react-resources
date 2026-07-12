import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  DataTableV2,
  DataTableBodyV2,
  DataTableCellV2,
  DataTableRowV2,
  DataTableHeadV2,
  DataTableHeadCellV2,
  Pagination,
  Heading,
  IconMinus,
  dlsGray03,
  DataTableExpandableContentV2,
} from '@americanexpress/dls-react';
import {
  DropdownAnswer, RadioAnswer, TextAnswer, TextAreaAnswer,
} from '@americanexpress/case-management-common';

import {
  ANSWER_TYPE_RADIO,
  ANSWER_TYPE_SELECT,
  ANSWER_TYPE_TEXT_REQUIRED,
  TRANSACTIONS_PER_PAGE_QNA,
} from '../../utils/constants';
import { formatP2PTransactions, getLabelIdForTextInput, toTitleCase } from '../../utils/helpers';

const PeerToPeerTableAnswer = ({
  questionId,
  transactionData,
  inputColumnHeader,
  inputType,
  answerOptions,
  locale,
}) => {
  const getStartIndex = (page) => (page - 1) * TRANSACTIONS_PER_PAGE_QNA;
  const getEndIndex = (page) => page * TRANSACTIONS_PER_PAGE_QNA;

  const [sortedTxnIds, setSortedTxnIds] = useState([]);
  const [mappedTransactions, setMappedTransactions] = useState([]);

  const typeIconStyle = {
    width: '10px', height: '10px', borderRadius: '50%', marginRight: '10px',
  };

  const numPages = Math.ceil(transactionData.length / TRANSACTIONS_PER_PAGE_QNA);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const [sortInfo, setSortInfo] = useState({
    sortBy: 'recipient',
    sortDirection: 'descending',
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const intl = useIntl();

  const sortColumn = (id, newSortDirection, transactions = mappedTransactions) => {
    let sortedTableData = [];

    if (newSortDirection === 'ascending') {
      sortedTableData = [...transactions]
        .sort((a, b) => {
          if (id === 'date') {
            return new Date(a.createTime) - new Date(b.createTime);
          }
          if (id === 'recipient') {
            return a.recipient?.localeCompare(b.recipient);
          }
          return a.amount.value - b.amount.value;
        });
    } else {
      sortedTableData = [...transactions]
        .sort((a, b) => {
          if (id === 'date') {
            return new Date(b.createTime) - new Date(a.createTime);
          }
          if (id === 'recipient') {
            return b.recipient?.localeCompare(a.recipient);
          }
          return b.amount.value - a.amount.value;
        });
    }

    setSortedTxnIds([...sortedTableData.map((txn) => txn.transactionIdentifier)]);
  };

  const handleSortClick = (_, id) => {
    const newSortDirection = sortInfo.sortBy === id && sortInfo.sortDirection === 'descending' ? 'ascending' : 'descending';
    sortColumn(id, newSortDirection);
    setSortInfo({
      sortBy: id,
      sortDirection: newSortDirection,
    });
    return null;
  };

  const getHeader = (transactions = []) => {
    const types = transactions.map((transaction) => transaction.P2PTxnType);
    const uniqueTypes = [...new Set(types)];

    if (uniqueTypes.length > 1) return 'disputedTransactions';
    if (uniqueTypes[0] === 'LOAD') return 'disputedLoadTransactions';
    if (uniqueTypes[0] === 'SEND') return 'disputedSendTransactions';
    return 'disputedTransactions';
  };

  const fieldWidth = '18vw';

  const getInputComponent = (
    transactionId,
    fieldName,
    type,
    value,
    options = []
    /* eslint-disable max-params -- need all params for this function */
  ) => {
    /* eslint-enable max-params -- need all params for this function */
    const componentId = `${questionId}_${transactionId}_${fieldName}`;

    switch (type) {
      case ANSWER_TYPE_RADIO: return (
        <RadioAnswer
          id={componentId}
          questionId={componentId}
          data-testid={componentId}
          answer={value}
          answerOptions={options}
          classNames="flex"
          isDisabled={true}
        />
      );
      case ANSWER_TYPE_SELECT: return (
        <DropdownAnswer
          id={componentId}
          questionId={componentId}
          data-testid={componentId}
          answer={value}
          answerOptions={options}
          isDisabled={true}
        />
      );
      case ANSWER_TYPE_TEXT_REQUIRED:
        return (
          <TextAreaAnswer
            id={componentId}
            questionId={componentId}
            data-testid={componentId}
            answer={value}
            label={intl.formatMessage({ id: getLabelIdForTextInput(questionId) })}
            showCharactersRemaining={false}
            isDisabled={true}
          />
        );
      // DEFAULT TO TEXT INPUT
      default: return (
        <TextAnswer
          id={componentId}
          questionId={componentId}
          data-testid={componentId}
          answer={value}
          type="text"
          showCharactersRemaining={false}
          isDisabled={true}
          theme={{ overflow: 'scroll' }}
        />
      );
    }
  };

  const tableTheme = {
    '& .css-twor8d:first-of-type': {
      display: 'none',
    },
  };

  useEffect(() => {
    if (transactionData) {
      const formattedTxns = formatP2PTransactions(transactionData, intl, questionId);
      setMappedTransactions(formattedTxns);
      sortColumn(sortInfo.sortBy, sortInfo.sortDirection, formattedTxns);
    }
  }, [transactionData]);

  return (
    <div
      id={`${questionId}_tableAnswer`}
      key={`${questionId}_tableAnswer`}
    >
      <div>
        <div className="pad-1-tb">
          <Heading headingStyle="heading2">
            <FormattedMessage id={getHeader(transactionData)} />
          </Heading>
        </div>
        <DataTableV2
          id={`${questionId}_tableAnswer_dataTable`}
          sortable={true}
          sortBy={sortInfo.sortBy}
          sortDirection={sortInfo.sortDirection}
          onSortClick={handleSortClick}
          expandable={true}
          theme={tableTheme}
        >
          <DataTableHeadV2 id="checkableTableAnswer-Header">
            <DataTableRowV2 id="checkableTableAnswer-HeaderRow">
              <DataTableHeadCellV2 key="date" id="date" sortable={true}>
                <FormattedMessage id="date" />
              </DataTableHeadCellV2>
              <DataTableHeadCellV2 key="type" id="type">
                <FormattedMessage id="type" />
              </DataTableHeadCellV2>
              <DataTableHeadCellV2 key="memo" id="memo">
                <FormattedMessage id="memo" />
              </DataTableHeadCellV2>
              <DataTableHeadCellV2 key="from" id="from">
                <FormattedMessage id="from" />
              </DataTableHeadCellV2>
              <DataTableHeadCellV2 key="recipient" id="recipient" sortable={true}>
                <FormattedMessage id="recipient" />
              </DataTableHeadCellV2>
              <DataTableHeadCellV2 key="partner" id="partner">
                <FormattedMessage id="partner" />
              </DataTableHeadCellV2>
              <DataTableHeadCellV2 key="origin" id="origin">
                <FormattedMessage id="origin" />
              </DataTableHeadCellV2>
              <DataTableHeadCellV2 key="amount" id="amount" align="right" sortable={true}>
                <FormattedMessage id="amount" />
              </DataTableHeadCellV2>
              <DataTableHeadCellV2
                key={`${questionId}_inputColumnHeader`}
                id={`$${questionId}_inputColumnHeader`}
                minWidth={inputType === ANSWER_TYPE_RADIO}
                theme={inputType === ANSWER_TYPE_RADIO ? undefined : { width: fieldWidth }}
              >
                {inputColumnHeader}
              </DataTableHeadCellV2>
            </DataTableRowV2>
          </DataTableHeadV2>
          <DataTableBodyV2>
            {sortedTxnIds.slice(
              getStartIndex(currentPage), getEndIndex(currentPage)
            ).map((identifier) => {
              const transaction = mappedTransactions.find(
                (txn) => txn.transactionIdentifier === identifier
              );
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

              const expanded = transaction[questionId]?.verbiage;
              return (
                <DataTableRowV2
                  id={transactionIdentifier}
                  key={transactionIdentifier}
                  expanded={expanded}
                >
                  <DataTableCellV2>
                    {createTime
                      ? new Intl.DateTimeFormat(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      }).format(new Date(createTime))
                      : <IconMinus size="sm" filled={true} theme={dlsGray03} />}
                  </DataTableCellV2>
                  <DataTableCellV2>
                    {sendOrLoad ? (
                      <>
                        <span
                          className="display-inline-block"
                          style={{ ...typeIconStyle, background: sendOrLoad.toLowerCase() === 'send' ? '#006FCF' : '#008767' }}
                        />
                        {toTitleCase(sendOrLoad)}
                      </>
                    )
                      : <IconMinus size="sm" filled={true} theme={dlsGray03} />}
                  </DataTableCellV2>
                  <DataTableCellV2>{memo || <IconMinus size="sm" filled={true} theme={dlsGray03} />}</DataTableCellV2>
                  <DataTableCellV2>{from || <IconMinus size="sm" filled={true} theme={dlsGray03} />}</DataTableCellV2>
                  <DataTableCellV2>{recipient || <IconMinus size="sm" filled={true} theme={dlsGray03} />}</DataTableCellV2>
                  <DataTableCellV2>{partnerIdentifier || <IconMinus size="sm" filled={true} theme={dlsGray03} />}</DataTableCellV2>
                  <DataTableCellV2>{createSource || <IconMinus size="sm" filled={true} theme={dlsGray03} />}</DataTableCellV2>
                  <DataTableCellV2 align="right">
                    {amount?.value ? new Intl.NumberFormat(locale || 'en-US', {
                      style: 'currency',
                      currency: amount?.currency || 'XXX',
                    }).format(amount?.value)
                      : <IconMinus size="sm" filled={true} theme={dlsGray03} />}
                  </DataTableCellV2>
                  <DataTableCellV2
                    key={`${questionId}_${transactionIdentifier}_${inputColumnHeader}`}
                    id={`${questionId}_${transactionIdentifier}_${inputColumnHeader}`}
                  >
                    {getInputComponent(
                      transactionIdentifier,
                      questionId,
                      inputType,
                      transaction[questionId]?.identifier || '',
                      answerOptions
                    )}
                  </DataTableCellV2>
                  {expanded && (
                    <DataTableExpandableContentV2 id={`expand-${transactionIdentifier}`} key={`expand-${transactionIdentifier}`}>
                      <div className="dls-gray-bg pad-2">
                        {getInputComponent(
                          transactionIdentifier,
                          questionId,
                          ANSWER_TYPE_TEXT_REQUIRED,
                          transaction[questionId]?.verbiage,
                          answerOptions
                        )}
                      </div>
                    </DataTableExpandableContentV2>
                  )}

                </DataTableRowV2>

              );
            }
            )}
          </DataTableBodyV2>
        </DataTableV2>
        {numPages > 1 && (
          <Pagination selected={currentPage} onChange={handlePageChange} total={numPages} aria-label="Pagination" />) }
      </div>
    </div>
  );
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
