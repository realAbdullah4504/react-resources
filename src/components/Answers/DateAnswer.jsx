import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import langPack from '../../locale/langPack.json';

const dateIsValidDB = (date) => /^\d{8}$/.test(date);

const DateAnswer = ({
  selectedAnswer,
  questionId,
  locale,
}) => {
  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    if (selectedAnswer && dateIsValidDB(selectedAnswer)) {
      const year = selectedAnswer.slice(0, 4);
      const month = selectedAnswer.slice(4, 6) - 1;
      const day = selectedAnswer.slice(6);

      setDisplayDate(
        new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).format(new Date(year, month, day))
      );
    }
  }, [selectedAnswer, locale]);

  return (
    <div className="margin-2-l pad-0-l pad-2-b">
      <input
        type="text"
        id={`datePickerComponent-${questionId}`}
        value={displayDate}
        disabled="true"
        readOnly
        className="margin-2-l"
      />
    </div>
  );
};

DateAnswer.propTypes = {
  selectedAnswer: PropTypes.string,
  questionId: PropTypes.string,
  locale: PropTypes.string,
};

DateAnswer.defaultProps = {
  selectedAnswer: '',
  questionId: '',
  locale: langPack.globalValues.locale,
};

export default DateAnswer;
