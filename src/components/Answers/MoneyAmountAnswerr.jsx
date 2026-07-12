import React from 'react';
import PropTypes from 'prop-types';
import { CurrencyInput } from '@americanexpress/dls-react';
import langPack from '../../../locale/langPack.json';

const MoneyAmountAnswer = ({
  answer,
  questionId,
}) => (
  <CurrencyInput
    value={answer}
    locale={langPack.globalValues.locale}
    currency={langPack.globalValues.currencyCode}
    id={`moneyAmountComponent-${questionId}`}
    defaultValue=""
    className="margin-2-l"
    disabled="true"
    style={{ width: 'fit-content' }}
  />
);
MoneyAmountAnswer.propTypes = {
  answer: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
};

export default MoneyAmountAnswer;
