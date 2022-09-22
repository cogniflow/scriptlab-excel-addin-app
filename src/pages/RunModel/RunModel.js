import { h } from 'preact';
import htm from 'htm';

const html = htm.bind(h);

export const RunModel = () => {
  return html`
    <div id="pages-run-model" class="app-page">
      <div class="cogni__navbar mb-sm">
        <button
          id="pages-run-model-go-back"
          class="cogni__goback-button experiment-go-back"
        >
          <span class="cogni__arrow-icon"> </span>
        </button>
        <p id="experiment-value" class="experiment-name">Experiment name</p>
        <div class="experiment-nav-item-void"></div>
      </div>
      <div class="p-md">
        <div class="run-options-bar">
          <div class="run-dropdowns-wrapper">
            <div class="run-select-field">
              <p>Model to use</p>
              <select
                name=""
                id="run-model-dropdown"
                class="cogni__default-select"
              >
                <!-- Dynamic data -->
              </select>
            </div>
            <div class="run-select-field">
              <p>Place result</p>
              <select
                name=""
                id="run-insert-dropdown"
                class="cogni__default-select"
              >
                <option value="insertRight">Insert results at the right</option>
                <option value="replaceRight">
                  Replace values at the right
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="p-md run-cells-range">
          <div class="run-cells-range-items run-range-input-wrapper">
            <p>Cells range or column</p>
            <input
              type="text"
              placeholder="Example: A2:A10"
              id="run-cells-range"
              class="cogni__form-input"
              value="A2:A5"
            />
          </div>
          <div class="run-cells-range-items">
            <p class="run-checkbox-label">Show confidence</p>
            <input type="checkbox" id="run-show-confidence-checkbox" />
          </div>
          <!-- <div class="run-cells-range-items" id="run-include-headers-container" style="display: none">
      <p class="run-checkbox-label">My sheet includes headers</p>
      <input type="checkbox" id="run-show-has-headers" checked />
    </div> -->
          <div class="run-cells-range-items" id="run-include-headers-container">
            <p class="run-checkbox-label">My sheet includes headers</p>
            <input type="checkbox" id="run-show-has-headers" checked />
          </div>
          <!-- <input type="checkbox" id="run-show-has-headers" /> -->
        </div>
        <div class="mt-md mb-md"></div>
        <div class="run-progress-wrapper mb-sm" id="run-progress-container">
          <p>
            Progress:<span style="margin-right: 8px"></span>
            <span id="run-processed">0</span> /
            <span id="run-total-cells">0</span
            ><span style="margin-right: 8px"></span>(<span id="run-percentage"
              >0</span
            >%)
          </p>
          <button id="run-stop">Stop</button>
        </div>
        <div class="run-experiment-wrapper">
          <button class="run-experiment-button" id="run-experiment">
            Run model
          </button>
        </div>

        <div>
          <p class="edit-warning" id="run-edit-warning" style="display: none;">
            IMPORTANT: do not edit anything in the spreadsheet until the process
            completes 100%
          </p>
        </div>
      </div>
    </div>
  `;
};
