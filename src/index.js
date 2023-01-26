import { h, render } from 'preact';
import htm from 'htm';
import { Initializer } from './utils/initializer';
import { Login, Experiments, RunModel } from './pages';
import { AuthContextProvider } from './context/AuthContext';

import './style.css';

const html = htm.bind(h);

function App() {
  return html`
    <${AuthContextProvider}>
      <main>
        <div class="app-wrapper">
          <${Login} />
          <${Experiments} />
          <${RunModel} />
        </div>
      </main>
    </${AuthContextProvider}>
  `;
}

render(html`<${App} />`, document.getElementById('app'));
Initializer();

// ${PagesMap[currentPage]}
