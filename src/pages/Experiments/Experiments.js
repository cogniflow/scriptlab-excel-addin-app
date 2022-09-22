import { h } from 'preact';
import htm from 'htm';

const html = htm.bind(h);

export const Experiments = () => {
  return html` <div id="page-experiments" class="app-page">
    <div class="cogni__navbar mb-xs main-navbar">
      <div class="navbar__logo-text">
        <div class="navbar__logo">
          <img
            height="30"
            src="https://media-exp1.licdn.com/dms/image/C4E0BAQFJHyVpoH4QuA/company-logo_200_200/0/1630606332593?e=2159024400&v=beta&t=qcXVSsYYBTcdeX0e-Cx8q5cxStydyPjhEWyEZcYaj0Y"
            alt="Cogniflow logo"
          />
        </div>
      </div>
      <div>
        <select
          id="experiments-visibility-dropdown"
          class="cogni__default-select experiments-select"
          disabled
        >
          <option value="list">Private experiments</option>
          <option value="publicExperiments">Public experiments</option>
        </select>
      </div>
      <div>
        <select
          id="experiments-type-dropdown"
          class="cogni__default-select experiments-select"
        >
          <option value="">All types</option>
          <option value="0">Text</option>
          <option value="1">Image</option>
          <option value="2">Audio</option>
        </select>
      </div>
      <div class="cogni__nav-link" id="logout">
        <p>Logout</p>
      </div>
    </div>
    <section id="experiments-list" class="p-md">
      <div class="experiments-options">
        <!-- <div class="experiments-searchbar-wrapper mb-sm">
                <input
                  type="text"
                  placeholder="Search"
                  class="cogni__form-input experiments-search-input"
                />
                <button>O</button>
              </div> -->
      </div>
      <div class="experiment-cards" id="experiment-cards-container">
        <!-- DYNAMIC HERE -->
      </div>
    </section>
  </div>`;
};
