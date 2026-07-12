import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@americanexpress/dls-react';

const TextAnswer = ({
  selectedAnswer,
  questionId,
}) => (
  <Input
    className="margin-2-l pad-0-l pad-t col-md-6 col-xs-8"
    type="text"
    name={questionId}
    value={selectedAnswer || ''}
    hideLabel={true}
    id={`disputesTextField-${questionId}`}
    disabled="true"
  />
);

TextAnswer.propTypes = {
  selectedAnswer: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
};

export default TextAnswer;
