import React from 'react';
import PropTypes from 'prop-types';

import langPack from '../../locale/langPack.json';

const MoneyAmountAnswer = ({
  answer,
  questionId,
}) => {
  const { locale, currencyCode } = langPack.globalValues;
  const numericValue = Number(answer) || 0;

  return (
    <div
      id={`moneyAmountComponent-${questionId}`}
      className="margin-2-l"
      style={{ width: 'fit-content' }}
    >
      {new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).format(numericValue)}
    </div>
  );
};

MoneyAmountAnswer.propTypes = {
  answer: PropTypes.string,
  questionId: PropTypes.string,
};

MoneyAmountAnswer.defaultProps = {
  answer: '',
  questionId: '',
};

export default MoneyAmountAnswer;
