import React from 'react';
import PropTypes from 'prop-types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsiblePanel,
} from '@americanexpress/dls-react';

import format from 'date-fns/format';
import { isValid } from 'date-fns';

import { useIntl } from 'react-intl';
import Question from './Question';

const QuestionContainer = ({
  claimQAInfo, transactions, locale, caseId,
}) => {
  const intl = useIntl();

  const getDate = (dateString = '') => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6) - 1;
    const day = dateString.slice(6, 8);

    const dateObj = new Date(year, month, day);

    if (isValid(dateObj)) {
      return format(dateObj, 'MMM d, yyyy');
    }

    return '--';
  };

  const buildQuestion = (question, FCIARefNum) => {
    let answerOptions = [];
    let applicableTransactions = [];

    if (question?.transactions) {
      Object.keys(question?.transactions).forEach((transactionId) => {
        const transaction = {
          ...transactions[transactionId],
          [question.QuestionDtls.QUES_ID]: question?.transactions[transactionId],
        };
        applicableTransactions = [
          ...applicableTransactions,
          transaction,
        ];
      });
    }

    if (question?.QuestionDtls?.OptionList && question?.QuestionDtls?.OptionList.length > 0) {
      answerOptions = question?.QuestionDtls?.OptionList?.map((option) => ({
        id: option?.QUES_OPTN_ID,
        verbiage:
          option?.OptionVerbiage?.VRBG_LONG_DS
          || option?.OptionVerbiage?.VRBG_SHORT_DS,
      }));
    } else if (question?.QuestionDtls?.QUES_TYPE_CD === 'YesNo') {
      answerOptions = [
        {
          id: 'True',
          verbiage: 'Yes',
        },
        {
          id: 'False',
          verbiage: 'No',
        },
      ];
    } else if (
      question?.QuestionDtls.QUES_TYPE_CD === 'AddTxn'
      || question?.QuestionDtls.QUES_TYPE_CD === 'CAdvTxn'
    ) {
      answerOptions = question?.TransactionSearch?.SelectedTransactions;
    }

    // filter out empty values
    if (
      question?.QuestionDtls.QUES_TYPE_CD !== 'AddTxn'
      && question?.QuestionDtls.QUES_TYPE_CD !== 'CAdvTxn'
    ) {
      answerOptions = answerOptions.filter((item) => Boolean(item?.id));
    }

    return {
      questionId: question?.QuestionDtls?.QUES_ID || FCIARefNum,
      answerType: question?.QuestionDtls?.QUES_TYPE_CD,
      answerOptions,
      verbiage: question?.QuestionDtls?.QuestionVerbiage?.SPCL_PROP_IN
        ? question?.QuestionDtls?.QuestionVerbiage?.SPCL_PROP_IN
        : question?.QuestionDtls?.QuestionVerbiage?.VRBG_LONG_DS,
      transactions: question?.transactions
        ? applicableTransactions : undefined, // For transaction-level questions
      // For transaction-level questions
      headerVerbiage: question?.QuestionDtls?.HeaderVerbiage?.VRBG_LONG_DS,
      bundleTransactions: question?.BundleTransactions,
    };
  };

  const getQuestions = (questionsArray, FCIARefNum) => {
    // filter out all questions with pyDeletedObject = true, ccp changed the answer
    const filteredQuestions = questionsArray?.filter(
      (question) => question?.pyDeletedObject !== 'true'
    );

    return filteredQuestions?.map((question, index) => (
      <div
        key={question?.QuestionDtls?.QUES_ID || `${FCIARefNum}-S-${index + 1}`}
      >
        <Question
          question={buildQuestion(question, `${FCIARefNum}-Q-${index + 1}`)}
          questionNumber={index + 1}
          selectedAnswer={
            question?.InputText
            || question?.InputTextArea
            || question?.PropertyValuePrev
            || question?.PropertyValue
            || question?.UserInputYesNo
            || question?.UserInputDate
          }
          locale={locale}
        />
      </div>
    ));
  };

  /* eslint-disable max-len -- due to prettier formatting */
  const isHeaderSectionAvailable = claimQAInfo?.filter((qaInfo) => qaInfo?.FCIARefNum?.length > 0)?.length > 0;
  /* eslint-enable max-len -- re-enabling for rest of file */

  return (
    <div className="flex flex-wrap flex-column margin-1-t">
      {isHeaderSectionAvailable ? (
        <Collapsible>
          {claimQAInfo?.map((qaInfo) => {
            const {
              FCIARefNum,
              CaseReceivedDate,
              pyOrigUserID,
              pxUserName,
              PreviouslyEnteredProperties,
            } = qaInfo;
            return (
              <div className="border" key={`border-${FCIARefNum}`}>
                <CollapsiblePanel
                  id={`collapsible-${FCIARefNum}`}
                  key={`collapsible-${FCIARefNum}`}
                >
                  <div
                    className="flex flex-wrap flex-row flex-justify-between"
                  >
                    <span className="flex">{FCIARefNum}</span>
                    <div className="flex" style={{ gap: '2rem' }}>
                      <span className="flex" style={{ whiteSpace: 'nowrap' }}>
                        <p className="label-2">
                          {intl.formatMessage({ id: 'repId' })}&nbsp;
                        </p>
                        {pyOrigUserID}
                      </span>
                      <span className="flex" style={{ whiteSpace: 'nowrap' }}>
                        <p className="label-2">
                          {intl.formatMessage({ id: 'repName' })}&nbsp;
                        </p>
                        {pxUserName}
                      </span>
                      <span className="flex" style={{ whiteSpace: 'nowrap' }}>
                        <p className="label-2">
                          Created on:&nbsp;
                        </p>
                        {getDate(CaseReceivedDate)}
                      </span>
                    </div>
                  </div>
                </CollapsiblePanel>
                <CollapsibleContent labelledBy={`collapsible-${FCIARefNum}`}>
                  {getQuestions(PreviouslyEnteredProperties, FCIARefNum)}
                </CollapsibleContent>
              </div>
            );
          })}
        </Collapsible>
      )
        : getQuestions(
          claimQAInfo[0]?.PreviouslyEnteredProperties,
          claimQAInfo[0]?.FCIARefNum || caseId
        )}
    </div>
  );
};

QuestionContainer.propTypes = {
  claimQAInfo: PropTypes.shape([]),
  locale: PropTypes.string.isRequired,
  transactions: PropTypes.shape([]),
  caseId: PropTypes.string,
};

export default QuestionContainer;
