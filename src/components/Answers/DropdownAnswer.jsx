import React from 'react';
import PropTypes from 'prop-types';

const convertHtmlSymbolString = (html = '') => {
  if (typeof document === 'undefined') {
    return html;
  }
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const DropdownAnswer = ({
  selectedAnswer,
  answerOptions,
  questionId,
  isDisabled,
}) => {
  const options = answerOptions.length > 0
    ? answerOptions.map((e) => ({
      value: e.id,
      label: convertHtmlSymbolString(e.verbiage),
    }))
    : [];

  return (
    <select
      value={selectedAnswer?.trim() || ''}
      id={`dropdownComponent-${questionId}`}
      className="margin-2-l"
      disabled={isDisabled}
    >
      {options.map((o, i) => (
        <option value={o.value} key={`${o.value}-${i}`}>{o.label}</option>
      ))}
    </select>
  );
};

DropdownAnswer.propTypes = {
  answerOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedAnswer: PropTypes.string,
  questionId: PropTypes.string,
  isDisabled: PropTypes.bool,
};

DropdownAnswer.defaultProps = {
  selectedAnswer: '',
  questionId: '',
  isDisabled: false,
};

export default DropdownAnswer;
