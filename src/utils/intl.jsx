import { createContext, useContext } from 'react';

import langPack from '../locale/langPack.json';

const IntlContext = createContext({ locale: 'en-US', messages: langPack });

export const IntlProvider = ({ locale = 'en-US', messages = langPack, children }) => (
  <IntlContext.Provider value={{ locale, messages }}>{children}</IntlContext.Provider>
);

export const FormattedMessage = ({ id, defaultMessage }) => {
  const { messages } = useContext(IntlContext);
  const text = (messages && messages[id]) || defaultMessage || id;
  return <>{text}</>;
};

export const useIntl = () => {
  const { locale, messages } = useContext(IntlContext);
  return {
    locale,
    formatMessage: ({ id, defaultMessage }) => (messages && messages[id]) || defaultMessage || id,
  };
};
