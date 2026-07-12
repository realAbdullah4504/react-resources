import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, RadioButton } from '@americanexpress/dls-react';

const RadioAnswer = ({
  selectedAnswer,
  answerOptions,
  radioGroupName,
}) => {
  const finalGroupName = radioGroupName || 'radioAnswer';
  const radioMap = answerOptions.length > 0
    ? answerOptions.map((e, i) => {
      const key = e.id + i;
      return (
        <div id={`radio${e.id}`} key={key}>
          <div className="flex margin-2-l col-xs-12 pad-0-l pad-2-r">
            <RadioButton
              label={(
                <span>{e.verbiage}</span>
                    )}
              value={e.id}
              name={finalGroupName}
              align="center"
              id={e.id}
              disabled={true}
            />
            <div
              style={{ height: '23.125px', width: '23.125px' }}
              className="flex flex-justify-center flex-align-items-center"
            />
          </div>
        </div>
      );
    })
    : [];

  return (
    <RadioGroup checked={selectedAnswer} name={finalGroupName} className="margin-0-b">
      {radioMap}
    </RadioGroup>
  );
};

RadioAnswer.propTypes = {
  selectedAnswer: PropTypes.string.isRequired,
  answerOptions: PropTypes.arrayOf(PropTypes.shape).isRequired,
  radioGroupName: PropTypes.string,
};

RadioAnswer.defaultProps = {
  radioGroupName: '',
};

const disconnected = RadioAnswer;
export { disconnected };

export default RadioAnswer;
