import {
  EXPERIMENT_TASKS,
  EXPERIMENT_TYPES,
  EXPERIMENT_TYPES_URL,
} from '../constants';
import EXCEL_EVENTS from './../states/excelEvents';

const logoBaseUrl = 'https://s3.us-east-2.amazonaws.com/static-cogniflow-prod/';
const logoPlaceholder =
  'https://app.cogniflow.ai/static/media/img-placeholder.3c18e621361480e8272e676738157c04.svg';

const iconSvgExperimentTypeMap = {
  text: `<svg width="32" height="32" viewBox="0 0 32 32" style="display:flex;align-items:center;background-color:#eceffa;border-radius:8px;"><g fill="none" fill-rule="evenodd"><path fill="#a4a9c8" d="M24 21h-6c-.265 0-.52.107-.707.294l-.293.293V11.415L18.414 10H24v11zm-10 0H8V10h5.586L15 11.416v10.172l-.293-.293C14.52 21.106 14.265 21 14 21zM25 8h-7c-.265 0-.52.107-.707.293L16 9.586l-1.293-1.293c-.187-.186-.442-.292-.707-.292H7c-.552 0-1 .447-1 1v13c0 .551.448 1 1 1h6.586l1.707 1.706c.195.195.451.293.707.293.256 0 .512-.098.707-.293L18.414 23H25c.552 0 1-.448 1-1V9c0-.552-.448-1-1-1z"></path></g></svg>`,
  image: `<svg width="32" height="33" viewBox="0 0 32 33" style="display:flex;align-items:center;background-color:#eceffa;border-radius:8px;"><g fill="#A4A9C8" fill-rule="evenodd"><path d="M2 18v-1.52l3.93-3.14 2.36 2.37c.366.367.953.394 1.35.06l5.3-4.42L18 14.41V18H2zM18 2v9.59l-2.29-2.3c-.366-.367-.952-.393-1.35-.06l-5.3 4.42-2.35-2.36c-.361-.358-.933-.388-1.33-.07L2 13.92V2h16zm1-2H1C.448 0 0 .448 0 1v18c0 .553.448 1 1 1h18c.553 0 1-.447 1-1V1c0-.552-.447-1-1-1z" transform="translate(6 7)"></path><path d="M9 6c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1m0 4c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3" transform="translate(6 7)"></path></g></svg>`,
  audio: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="display:flex;align-items:center;border-radius:8px;background-color:#eceffa;fill: #A4A9C8;transform: ;msFilter:;"><path d="M8 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0-6c1.178 0 2 .822 2 2s-.822 2-2 2-2-.822-2-2 .822-2 2-2zm1 7H7c-2.757 0-5 2.243-5 5v1h2v-1c0-1.654 1.346-3 3-3h2c1.654 0 3 1.346 3 3v1h2v-1c0-2.757-2.243-5-5-5zm9.364-10.364L16.95 4.05C18.271 5.373 19 7.131 19 9s-.729 3.627-2.05 4.95l1.414 1.414C20.064 13.663 21 11.403 21 9s-.936-4.663-2.636-6.364z"></path><path d="M15.535 5.464 14.121 6.88C14.688 7.445 15 8.198 15 9s-.312 1.555-.879 2.12l1.414 1.416C16.479 11.592 17 10.337 17 9s-.521-2.592-1.465-3.536z"></path></svg>`,
};

const formattedDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month < 10) {
    return `${day}/0${month}/${year}`;
  } else {
    return `${day}/${month}/${year}`;
  }
};

export const experimentTemplate = ({
  id,
  title,
  type,
  task,
  created_at,
  logo,
  ...rest
}) => {
  const typeString = EXPERIMENT_TYPES[type];
  const taskString = EXPERIMENT_TASKS[task];
  const logoUrl = logo ? `${logoBaseUrl}${logo}` : logoPlaceholder;

  return `
  <div class="experiment-card" id="${id}">

    <div class="exp-card-header">
      <div class="exp-card-bg-img"></div>
      <div class="exp-card-header-logos">
        <div class="exp-card-logo-wrapper">
          <img src="${logoUrl}" class="exp-card-logo" alt="card logo">
        </div>
        <div class="exp-card-logo-type-wrapper">
          ${iconSvgExperimentTypeMap[EXPERIMENT_TYPES_URL[type]]}
        </div>

      </div>
    </div>
    
    <div class="exp-card-content">

      <div class="exp-card-title">
        <p title="${title}">${title}</p>
      </div>
      <div class="exp-card-body">
        <p>${typeString}/${taskString}</p>
      </div>
      <div class="exp-card-time">
        <p>
          Created: <span class="exp-card-time-label">${formattedDate(
            created_at
          )}</span>
        </p>
      </div>

    </div>
  </div>
  `;
};

export const optionTemplate = ({ id, name, recommended }) => {
  const icon = recommended ? '✓' : '';

  return `
    <option value="${name}" id={${id}}>${name} ${icon}</option>
  `;
};

export const setExperimentsInDom = (
  experiments,
  templateFunc,
  experimentsParentId,
  domHandler
) => {
  const container = domHandler.getById(experimentsParentId);
  let allExperimentsTemplate = '';

  for (const exp of experiments) {
    allExperimentsTemplate += templateFunc(exp);
  }
  container.innerHTML = allExperimentsTemplate;
};

export const setModelOptionsInDom = (models, idSelect, domHandler) => {
  const domSelectElement = domHandler.getById(idSelect);
  let allModels = '';

  for (const model of models) {
    allModels += optionTemplate(model);
  }
  domSelectElement.innerHTML = allModels;
};

export const columnToPlaceResultMap = {
  insertRight: (range) => range.getColumnsAfter(1),
  replaceRight: (range) => range.getColumnsAfter(1),
};

export const isEntireColumn = (address) => {
  const [addressStart, addressEnd] = address.split(':');

  return addressStart === addressEnd || addressStart.length === 1;
};

export const delayRequest = (time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

export const getNextFromChar = (char, n = 0) =>
  String.fromCharCode(char.charCodeAt() + n);

export const getColumnNameFromRange = (rangeStr) => rangeStr.split('')[0];

export const getColmunStartIndex = (rangeStr) => {
  const [startCell] = rangeStr.split(':');
  const [_, ...nums] = startCell.split('');
  const index = nums.join('');

  return parseInt(index);
};

export function fetchRetry(url, delay, tries, fetchOptions = {}) {
  function onError(err) {
    triesLeft = tries - 1;
    if (!triesLeft) {
      throw err;
    }
    return wait(delay).then(() =>
      fetchRetry(url, delay, triesLeft, fetchOptions)
    );
  }
  return fetch(url, fetchOptions).catch(onError);
}

export function removeExcelEvent() {
  EXCEL_EVENTS.select.remove();
  return Excel.run(EXCEL_EVENTS.select.context, function (context) {
    return context.sync().then(function () {
      EXCEL_EVENTS.select = null;
      // console.log("Event handler successfully removed.");
    });
  });
}
