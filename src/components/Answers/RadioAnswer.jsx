import React from 'react';
import PropTypes from 'prop-types';

const RadioAnswer = ({
  selectedAnswer,
  answer,
  answerOptions,
  radioGroupName,
  isDisabled,
}) => {
  const finalGroupName = radioGroupName || 'radioAnswer';
  const value = selectedAnswer || answer || '';

  return (
    <div className="margin-2-l">
      {answerOptions.length > 0 ? answerOptions.map((option, i) => (
        <label key={`${option.id}-${i}`} style={{ display: 'block', marginBottom: '4px' }}>
          <input
            type="radio"
            name={finalGroupName}
            value={option.id}
            checked={value === option.id}
            disabled={isDisabled}
            readOnly
          />
          <span style={{ marginLeft: '6px' }}>{option.verbiage}</span>
        </label>
      )) : null}
    </div>
  );
};

RadioAnswer.propTypes = {
  selectedAnswer: PropTypes.string,
  answer: PropTypes.string,
  answerOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  radioGroupName: PropTypes.string,
  isDisabled: PropTypes.bool,
};

RadioAnswer.defaultProps = {
  selectedAnswer: '',
  answer: '',
  radioGroupName: '',
  isDisabled: false,
};

export default RadioAnswer;
