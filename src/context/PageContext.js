import { h, createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { LOGIN } from 'constants';
import htm from 'htm';

const html = htm.bind(h);

export const PageContext = createContext({
  currentPage: LOGIN,
  goToPage: () => {},
});

export const PageContextProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(LOGIN);

  const goToPage = (pageName) => {
    setCurrentPage(pageName);
  };

  return html`
    <${PageContext.Provider} value=${{ currentPage, goToPage }}>
      ${children}
    </${PageContext.Provider}>
  `;
};
