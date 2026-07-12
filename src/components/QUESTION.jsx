import React from 'react';
import PropTypes from 'prop-types';

import {
  ANSWER_TYPE_RADIO,
  ANSWER_TYPE_TEXT,
  ANSWER_TYPE_TEXTAREA,
  ANSWER_TYPE_DATE,
  ANSWER_TYPE_CURRENCY,
  ANSWER_TYPE_SELECT,
  ANSWER_TYPE_TRANSACTION,
  ANSWER_TYPE_TEXT_SIMPLE,
  ANSWER_TYPE_BULK_GRID,
} from '../utils/constants';

import RadioAnswer from './Answers/RadioAnswer';
import DropdownAnswer from './Answers/DropdownAnswer';
import MoneyAmountAnswer from './Answers/MoneyAmountAnswer';
import TextAnswer from './Answers/TextAnswer';
import TextAreaAnswer from './Answers/TextAreaAnswer';
import DateAnswer from './Answers/DateAnswer';
import langPack from '../../locale/langPack.json';
import TransactionTable from './Answers/TransactionTable';
import BulkTableAnswer from './Answers/BulkTableAnswer';
import PeerToPeerTableAnswer from './Answers/PeerToPeerTableAnswer';

const Question = ({
  question,
  questionNumber,
  selectedAnswer,
  locale,
}) => {
  const {
    questionId, answerType, answerOptions, verbiage, bundleTransactions,
  } = question;

  const convertedAnswerType = new Map([
    ['Text', ANSWER_TYPE_TEXT_SIMPLE],
    ['MC', ANSWER_TYPE_TEXT_SIMPLE],
    ['YesNo', ANSWER_TYPE_TEXT_SIMPLE],
    ['Label', ANSWER_TYPE_TEXT_SIMPLE],
    ['AddTxn', ANSWER_TYPE_TEXT_SIMPLE],
    ['CAdvTxn', ANSWER_TYPE_TEXT_SIMPLE],
    ['DDL', ANSWER_TYPE_TEXT_SIMPLE],
    ['Date', ANSWER_TYPE_TEXT_SIMPLE],
    ['Amount', ANSWER_TYPE_TEXT_SIMPLE],
    ['TextArea', ANSWER_TYPE_TEXT_SIMPLE],
    ['OptText', ANSWER_TYPE_TEXT_SIMPLE],
    ['BulkGrid', ANSWER_TYPE_BULK_GRID],
  ]);

  const answerComponentMap = {
    [ANSWER_TYPE_TRANSACTION]: (
      <TransactionTable
        selectedTransactions={answerOptions}
        locale={locale}
        answerType={answerType}
      />
    ),
    [ANSWER_TYPE_RADIO]: (
      <RadioAnswer
        id={`radioAnswerComponent-${questionId}`}
        radioGroupName={`radioAnswer${questionId}`}
        selectedAnswer={selectedAnswer}
        answerOptions={answerOptions}
        langPack={langPack}
      />
    ),
    [ANSWER_TYPE_TEXT]: (
      <TextAnswer
        id={`textAnswerComponent-${questionId}`}
        selectedAnswer={selectedAnswer}
        questionId={questionId}
      />
    ),
    [ANSWER_TYPE_SELECT]: (
      <DropdownAnswer
        id={`dropAnswerComponent-${questionId}`}
        selectedAnswer={selectedAnswer}
        answerOptions={answerOptions}
        questionId={questionId}
        langPack={langPack}
      />
    ),
    [ANSWER_TYPE_DATE]: (
      <DateAnswer
        id={`dateAnswerComponent-${questionId}`}
        selectedAnswer={selectedAnswer?.replaceAll('-', '')}
        questionId={questionId}
        langPack={langPack}
        locale={locale}
      />
    ),
    [ANSWER_TYPE_CURRENCY]: (
      <MoneyAmountAnswer
        id={`moneyAmountAnswerComponent-${questionId}`}
        answer={selectedAnswer}
        questionId={questionId}
        langPack={langPack}
      />
    ),
    [ANSWER_TYPE_TEXTAREA]: (
      <TextAreaAnswer
        id={`textAreaAnswerComponent-${questionId}`}
        answer={selectedAnswer}
        langPack={langPack}
        questionId={questionId}
      />
    ),
    [ANSWER_TYPE_TEXT_SIMPLE]: (
      <p className="margin-2-l body-1">{selectedAnswer}</p>
    ),
    [ANSWER_TYPE_BULK_GRID]: (
      <BulkTableAnswer
        id={`bulkTableAnswer-${questionId}`}
        questionId={questionId}
        transactionData={bundleTransactions || []}
      />
    ),
  };

  return (
    <div id="questionComponent" data-testid="questionComponent">
      <div className="pad-2-t pad-2-lr">
        <div className="margin-1-b">
          <p style={{ whiteSpace: 'pre-line' }} className="label-3">
            <b>{questionNumber}.</b> {verbiage}
          </p>
        </div>
        {question.transactions ? (
          <PeerToPeerTableAnswer
            id={`peerToPeerTableAnswer-${questionId}`}
            questionId={questionId}
            transactionData={question.transactions}
            inputColumnHeader={question.headerVerbiage}
            inputType={convertedAnswerType.get(answerType)}
            answerOptions={answerOptions}
            locale={locale}
          />
        ) : answerComponentMap[convertedAnswerType.get(answerType)]}
      </div>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.shape({
    questionId: PropTypes.string.isRequired,
    answerType: PropTypes.string.isRequired,
    answerOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    verbiage: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape({})),
    headerVerbiage: PropTypes.string,
    bundleTransactions: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  questionNumber: PropTypes.number.isRequired,
  selectedAnswer: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default Question;
