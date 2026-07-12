import React from 'react';
import PropTypes from 'prop-types';

function SimpleQAContainer({ qaInfo }) {
  if (qaInfo.length === 0) {
    return <div>No data found</div>;
  }
  return (
    <div>
      {
        qaInfo.map((qa, index) => (
          <div className="pad-1-tb pad-1-lr" key={qa.pyPropertyName}>
            <div className="margin-1-b">
              <p style={{ whiteSpace: 'pre-line' }}>
                <b>
                  {index + 1}.
                </b>
                {' '}
                {qa.pyPropertyName}
              </p>
            </div>
            <span className="margin-2-l">{qa.pyPropertyValue}</span>
          </div>
        ))
        }
    </div>
  );
}

export default SimpleQAContainer;

SimpleQAContainer.defaultProps = {
  qaInfo: [],
};

SimpleQAContainer.propTypes = {
  qaInfo: PropTypes.arrayOf(PropTypes.shape({})),
};
