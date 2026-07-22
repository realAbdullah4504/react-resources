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
  const [cases, setCases] = useState([]);

  useEffect(() => {
    // Handle both single case (old format) and multiple cases (new format)
    if (mockQnaData.Cases && Array.isArray(mockQnaData.Cases)) {
      // New format: array of cases
      const processedCases = mockQnaData.Cases.map((caseData) => {
        const { qnaObject, qnaTransactions } = formatQnaDetails(caseData);
        return {
          caseId: caseData.caseId,
          qnaResp: qnaObject,
          transactions: qnaTransactions,
        };
      });
      setCases(processedCases);
    } else {
      // Old format: single case
      const { qnaObject, qnaTransactions } = formatQnaDetails(mockQnaData);
      setCases([{
        caseId: mockQnaData.caseId || disputeId,
        qnaResp: qnaObject,
        transactions: qnaTransactions,
      }]);
    }
  }, []);

  return (
    <IntlProvider locale={locale} messages={languageData}>
      {cases.map((caseData, index) => {
        if (caseData?.qnaResp?.Errors?.[0]?.description || !caseData?.qnaResp?.CaseInfo) {
          return (
            <div key={caseData.caseId} className="pad-responsive flex flex-justify-center">
              <h3 className="pad-1-l" data-testid="no-details-message">
                {caseData?.qnaResp?.Errors?.[0]?.description || 'No details available'}
              </h3>
            </div>
          );
        }
        return (
        <QuestionContainer
          key={caseData.caseId}
          caseId={caseData.caseId}
          claimQAInfo={caseData.qnaResp?.CaseInfo?.Advisor}
          transactions={caseData.transactions}
          locale={locale}
          caseData={{}}
          journeyName={journey?.name || ''}
          isFirst={index === 0}
        />
        );
      })}
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
