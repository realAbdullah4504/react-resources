import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, IntlProvider } from 'react-intl';

import oneAppModuleWrapper from '@americanexpress/one-app-module-wrapper';
import { loadLanguagePack } from '@americanexpress/one-app-ducks';
import { IconInfo, ProgressCircle } from '@americanexpress/dls-react';
import { useOneDataFetchye } from '@americanexpress/fetchye-amex';
import { ErrorMessage, ErrorBoundary } from '@americanexpress/case-management-common';

import QuestionContainer from './QuestionContainer';
import { formatQnaDetails } from '../utils/helpers';

const AxpServicingCaseClaimQaDetails = ({
  languageData,
  locale,
  disputeId,
  journey,
}) => {
  const [apiError, setApiError] = useState(false);
  const [qnaResp, setQnaResp] = useState({});
  const [transactions, setTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [correlationId, setCorrelationId] = useState(null);

  const { run } = useOneDataFetchye(
    'ReadGlobalCaseProcessingQuestions.v1',
    {
      defer: true,
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        caseId: disputeId,
        section: 'qna-details',
        journeyName: journey?.name || '',
      },
    }
  );

  const callQna = async () => {
    setApiError(false);
    setIsLoading(true);

    const { data: { status, body = {}, correlationId: fetchCorrelationId } = {} } = await run();
    setCorrelationId(fetchCorrelationId);
    if (status !== 200) {
      setApiError(true);
    } else if (body) {
      const { qnaObject, qnaTransactions } = formatQnaDetails(body);

      setQnaResp(qnaObject);
      setTransactions(qnaTransactions);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    callQna();
  }, []);

  if (
    isLoading
    || Object.entries(languageData)?.length === 0
  ) {
    return (
      <div className="pad-responsive flex flex-justify-center">
        <ProgressCircle data-testid="progressCircle" />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="pad-2-tb">
        <IntlProvider locale={locale} messages={languageData}>
          <ErrorMessage handleRetry={callQna} correlationId={correlationId} />
        </IntlProvider>
      </div>
    );
  }

  if (qnaResp?.Errors?.[0]?.description || !qnaResp?.CaseInfo) {
    return (
      <IntlProvider locale={locale} messages={languageData}>
        <div className="pad-responsive flex flex-justify-center">
          <IconInfo />
          <h3 className="pad-1-l" data-testid="no-details-message">
            {qnaResp.Errors?.[0]?.description || <FormattedMessage id="noDetailsAvailable" />}
          </h3>
        </div>
      </IntlProvider>
    );
  }

  return (
    <IntlProvider locale={locale} messages={languageData}>
      <ErrorBoundary
        sourceApp="ISP"
        requestBody={{
          type: 'GSP_VIEW_MANAGE_LOGGING_EVENT',
          description: 'VIEW_QNA_DETAILS_CRASH Failure',
          payload: { disputeId },
        }}
      >
        <QuestionContainer
          caseId={disputeId}
          claimQAInfo={qnaResp?.CaseInfo.Advisor}
          transactions={transactions}
          locale={locale}
          caseData={{}}
        />
      </ErrorBoundary>
    </IntlProvider>
  );
};

export const TestableAxpServicingCaseClaimQaDetails = AxpServicingCaseClaimQaDetails;

AxpServicingCaseClaimQaDetails.propTypes = {
  languageData: PropTypes.shape({}).isRequired, // no need to restate all the keys in the lang pack
  locale: PropTypes.string.isRequired,
  disputeId: PropTypes.string.isRequired,
  journey: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export const loadModuleData = ({ store: { dispatch } }) => dispatch(
  loadLanguagePack('axp-servicing-case-claim-question-answer-details', { fallbackLocale: 'en-US' })
);

AxpServicingCaseClaimQaDetails.holocron = {
  name: 'axp-servicing-case-claim-question-answer-details',
  loadModuleData,
};

export default oneAppModuleWrapper('axp-servicing-case-claim-question-answer-details')(
  AxpServicingCaseClaimQaDetails
);
