import React from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption } from '@americanexpress/dls-react';

const convertHtmlSymbolString = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const DropdownAnswer = ({
  selectedAnswer,
  answerOptions,
  questionId,
}) => {
  const options = answerOptions.length > 0
    ? answerOptions.map((e) => (
      { value: e.id, label: convertHtmlSymbolString(e.verbiage) })
    )
    : [];
  return (
    <Select
      value={selectedAnswer?.trim() || ''}
      id={`dropdownComponent-${questionId}`}
      className="margin-2-l"
      disabled={true}
    >
      {options.map((o) => (
        <SelectOption value={o.value} key={o.index}>{o.label}</SelectOption>
      ))}
    </Select>
  );
};

DropdownAnswer.propTypes = {
  answerOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedAnswer: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
};

export default DropdownAnswer;
