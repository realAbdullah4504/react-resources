import React from 'react';
import PropTypes from 'prop-types';

const TextAreaAnswer = ({
  answer,
  questionId,
  isDisabled,
}) => (
  <textarea
    id={`textAreaAnswerComponent-${questionId}`}
    className="margin-2-l"
    value={answer || ''}
    disabled={isDisabled}
    readOnly
    rows={4}
    style={{ width: '100%', maxWidth: '600px' }}
  />
);

TextAreaAnswer.propTypes = {
  answer: PropTypes.string,
  questionId: PropTypes.string,
  isDisabled: PropTypes.bool,
};

TextAreaAnswer.defaultProps = {
  answer: '',
  questionId: '',
  isDisabled: false,
};

export default TextAreaAnswer;
