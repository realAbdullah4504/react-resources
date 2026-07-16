import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from '../utils/intl';
import QuestionContainer from './QuestionContainer';
import { formatQnaDetails } from '../utils/helpers';
import mockQnaData from '../mock/corporateFraudBulkGrid.json';

const AxpServicingCaseClaimQaDetails = ({
  languageData,
  locale,
  disputeId,
  journey,
}) => {
  const [qnaResp, setQnaResp] = useState({});
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    const { qnaObject, qnaTransactions } = formatQnaDetails(mockQnaData);
    setQnaResp(qnaObject);
    setTransactions(qnaTransactions);
  }, []);

  if (qnaResp?.Errors?.[0]?.description || !qnaResp?.CaseInfo) {
    return (
      <IntlProvider locale={locale} messages={languageData}>
        <div className="pad-responsive flex flex-justify-center">
          <h3 className="pad-1-l" data-testid="no-details-message">
            {qnaResp.Errors?.[0]?.description || 'No details available'}
          </h3>
        </div>
      </IntlProvider>
    );
  }

  return (
    <IntlProvider locale={locale} messages={languageData}>
      <QuestionContainer
        caseId={disputeId}
        claimQAInfo={qnaResp?.CaseInfo.Advisor}
        transactions={transactions}
        locale={locale}
        caseData={{}}
        journeyName={journey?.name || ''}
      />
    </IntlProvider>
  );
};

export const TestableAxpServicingCaseClaimQaDetails = AxpServicingCaseClaimQaDetails;

AxpServicingCaseClaimQaDetails.propTypes = {
  languageData: PropTypes.shape({}).isRequired,
  locale: PropTypes.string.isRequired,
  disputeId: PropTypes.string.isRequired,
  journey: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AxpServicingCaseClaimQaDetails;
