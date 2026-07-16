import React from 'react';
import PropTypes from 'prop-types';

const TextAnswer = ({
  selectedAnswer,
  questionId,
}) => (
  <input
    className="margin-2-l pad-0-l pad-t col-md-6 col-xs-8"
    type="text"
    name={questionId}
    value={selectedAnswer || ''}
    id={`disputesTextField-${questionId}`}
    disabled="true"
    readOnly
  />
);

TextAnswer.propTypes = {
  selectedAnswer: PropTypes.string,
  questionId: PropTypes.string,
};

TextAnswer.defaultProps = {
  selectedAnswer: '',
  questionId: '',
};

export default TextAnswer;
