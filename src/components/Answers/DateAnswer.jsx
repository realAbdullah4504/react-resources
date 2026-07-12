import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@americanexpress/dls-react';

import langPack from '../../../locale/langPack.json';

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
  }, []);

  return (
    <div className="margin-2-l pad-0-l pad-2-b">
      <DatePicker
        date={selectedAnswer === '' ? '' : displayDate}
        format={langPack.globalValues.dateInputFormat}
        id={`datePickerComponent-${questionId}`}
        autoFocus={displayDate}
        locale={langPack.globalValues.locale}
        defaultValue={displayDate}
        disabled="true"
      />
    </div>
  );
};

DateAnswer.propTypes = {
  selectedAnswer: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default DateAnswer;
