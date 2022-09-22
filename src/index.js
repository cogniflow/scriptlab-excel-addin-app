import { h, render } from 'preact';
import htm from 'htm';
import { Initializer } from './utils/initializer';
import { Login, Experiments, RunModel } from './pages';

import './style.css';

const html = htm.bind(h);

function App() {
  return html`
    <main>
      <div class="app-wrapper">
        <${Login} />
        <${Experiments} />
        <${RunModel} />
      </div>
    </main>
  `;
}

render(html`<${App} />`, document.getElementById('app'));
Initializer();

// ${PagesMap[currentPage]}
