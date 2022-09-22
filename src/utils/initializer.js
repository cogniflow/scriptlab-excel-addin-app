import {
  STATUS_FINISHED,
  TASKS_ALLOWED,
  EXPERIMENT_TYPES_URL,
  URL_TASK_MAP,
} from './../constants';

import { testToken } from './../constants';

import EXCEL_EVENTS from './../states/excelEvents';

import { pages } from './pages';

import {
  experimentTemplate,
  setExperimentsInDom,
  setModelOptionsInDom,
  findAndSetModelByName,
  setColumnAtTheRight,
  columnToPlaceResultMap,
  isEntireColumn,
  getColumnNameFromRange,
  getColmunStartIndex,
  getEntireColumnRangeString,
  removeExcelEvent,
} from './functions';

import HttpService from './../services/http';

export const Initializer = () => {
  const EXPERIMENT = {
    current: {},
    models: [
      { name: 'FFN Vectorization algorithm' },
      { name: 'Linear Regression' },
    ],
    currentModel: {},
    query: 'sort=recent',
    list: [],
    showConfidence: false,
    insertPlace: 'insertRight',
    colRange: 'A2:A5',
    hasHeaders: true,
    publicExperiments: [],
    visibilityQuery: '',
  };
  const QANDA_TASK = 3;

  const API_URL = 'https://api.cogniflow.ai';
  const PREDICT_API_URL = 'https://predict.cogniflow.ai';

  // Task based
  const REQUEST_BODY_KEYS = {
    0: 'text',
    1: 'text',
    3: 'question',
  };

  let user = {};

  const runState = {
    progress: 0,
    processed: 0,
    total: 0,

    stop: false,

    updateProgress() {
      this.progress = parseInt((this.processed / this.total) * 100);
    },
    clearRunState(dom) {
      this.progress = 0;
      this.processed = 0;
      this.total = 0;

      this.stop = false;

      dom.changeText(pages.run.runStop, 'Stop');

      dom.changeText(pages.run.runTotalCells, this.total);
      dom.changeText(pages.run.runProcessed, this.processed);
      dom.changeText(pages.run.runPercentage, this.progress);
    },
  };

  // const Excel = {
  //   run: () => { },
  // };

  // https://app.dev.cogniflow.ai/static/media/img-placeholder.bf7d98c5.svg

  const setRecommendedModel = () => {
    if (!EXPERIMENT.current.id_recommended_model) {
      EXPERIMENT.currentModel = {
        recommended: true,
        ...EXPERIMENT.models[0],
      };
      return;
    }

    const recommendedIdx = EXPERIMENT.models.findIndex(
      (model) => EXPERIMENT.current.id_recommended_model === model.id
    );

    EXPERIMENT.currentModel = {
      recommended: true,
      ...EXPERIMENT.models[recommendedIdx],
    };
    EXPERIMENT.models[recommendedIdx] = EXPERIMENT.models[0];
    EXPERIMENT.models[0] = EXPERIMENT.currentModel;
  };

  const findAndSetModelByName = (modelName) => {
    EXPERIMENT.currentModel = EXPERIMENT.models.find(
      ({ name }) => name === modelName
    );
  };

  const setColumnAtTheRight = async (
    range,
    sheet,
    context,
    isConfidence = false
  ) => {
    const nextEntireCol = range
      .getEntireColumn()
      .getColumnsAfter(1)
      .insert('Right');

    nextEntireCol.load('address');
    nextEntireCol.load('values');

    await context.sync();

    const newColChar = nextEntireCol.address.split('!')[1][0];
    const [startCell, endCell] = range.address.split('!')[1].split(':');
    const [_, startIdx] = startCell;
    const endIdx = endCell ? endCell[1] : '';

    const insertedColumnRangeStr = endIdx
      ? `${newColChar}${startIdx}:${newColChar}${endIdx}`
      : `${newColChar}${startIdx}`;
    const newInsertedColumnRange = sheet.getRange(insertedColumnRangeStr);

    if (EXPERIMENT.hasHeaders) {
      if (isConfidence) {
        const titleCellRange = sheet.getRange(`${newColChar}1`);
        titleCellRange.values = [['Confidence']];
      } else {
        const titleCellRange = sheet.getRange(`${newColChar}1`);
        titleCellRange.values = [[EXPERIMENT.current.title]];
      }
    }

    newInsertedColumnRange.load('values');
    newInsertedColumnRange.load('address');

    console.log(insertedColumnRangeStr);

    await context.sync();

    return newInsertedColumnRange;
  };

  const getEntireColumnRangeString = async (
    sheet,
    context,
    forInsertResult = false
  ) => {
    const range = sheet.getUsedRange();
    const columnLetter = getColumnNameFromRange(EXPERIMENT.colRange);
    const letterIndex = columnLetter.charCodeAt() - 65;
    const start = EXPERIMENT.hasHeaders ? 1 : 0;
    let endIdx = start;

    range.load('values');
    await context.sync();
    for (endIdx; endIdx < range.values.length; endIdx++) {
      if (!range.values[endIdx][letterIndex]) break;
    }
    return `${columnLetter}${start + 1}:${columnLetter}${endIdx}`;
  };

  function logout(router) {}

  function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  class DomHandler {
    getById(id) {
      return document.getElementById(id);
    }

    getElementsByClass(className) {
      return document.getElementsByClassName(className);
    }

    hidePage(pageId) {
      this.getById(pageId).style.display = 'none';
    }
    showPage(pageId) {
      this.getById(pageId).style.display = 'block';
    }

    addEvent(elementId, eventName, callback) {
      this.getById(elementId).addEventListener(eventName, callback);
    }

    addEventToElements(elementsClass, eventName, callback) {
      const elements = this.getElementsByClass(elementsClass);

      for (const element of elements) {
        element.addEventListener(eventName, callback);
      }
    }

    changeText(elementId, text) {
      this.getById(elementId).innerText = text;
    }

    removeListenersFromNode(nodeId) {
      const el = document.getElementById(nodeId);
      const elClone = el.cloneNode(true);

      el.parentNode.replaceChild(elClone, el);
    }
  }

  class PageStateHandler {
    constructor(initialPageId, domHandler) {
      this.current = initialPageId;
      this.history = [this.current];
      this.dom = domHandler;

      this.dom.showPage(initialPageId);
    }

    updateForwardPageState(newPageId) {
      this.history.push(newPageId);
      this.current = this.history[this.history.length - 1];
    }

    switchPagesVisibility(visible, toShow) {
      this.dom.hidePage(visible);
      this.dom.showPage(toShow);
    }

    navigateTo(newPageId) {
      this.switchPagesVisibility(this.current, newPageId);
      this.updateForwardPageState(newPageId);
    }

    navigateToSubPage(currentSubPage, newSubPage) {
      this.switchPagesVisibility(currentSubPage, newSubPage);
    }
  }

  async function runExcelAPI(dom) {
    if (EXPERIMENT.colRange.length === 1) {
      const colLetter = getColumnNameFromRange(EXPERIMENT.colRange);

      EXPERIMENT.colRange = `${colLetter}:${colLetter}`;
    }

    const { showConfidence, currentModel, insertPlace } = EXPERIMENT;
    let { colRange } = EXPERIMENT;

    const httpPredict = new HttpService(PREDICT_API_URL);

    Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();

      if (isEntireColumn(colRange)) {
        colRange = await getEntireColumnRangeString(sheet, context);
      } else {
        const selectedRange = sheet.getRange(colRange);

        selectedRange.load('values');
        await context.sync();

        const start = getColmunStartIndex(colRange);
        const columnName = getColumnNameFromRange(colRange);
        let end = start;

        for (const [val] of selectedRange.values) {
          if (!val) break;
          end++;
        }
        if (end !== start) {
          colRange = `${columnName}${start}:${columnName}${end - 1}`;
        }
      }
      const range = sheet.getRange(colRange);

      range.load('values');
      range.load('text');
      range.load('address');

      await context.sync();

      const requestInterval = {
        text: {
          time: 1000,
          limit: 5,
        },
        image: {
          time: 1000,
          limit: 2,
        },
        audio: {
          time: 1000,
          limit: 1,
        },

        index: 0,
      };
      const column = range.text;

      let requests = [];
      let idx = 0;
      let prev = 0;

      //  -------------------------------------------------------------------------------------

      runState.total = column.length;

      const typeUrl = EXPERIMENT_TYPES_URL[EXPERIMENT.current.type];
      const task = URL_TASK_MAP[EXPERIMENT.current.task];
      const currentModelId = currentModel.id;

      async function fillCellsRequest(text, idx, data) {
        if (runState.stop) return;

        const responses = await Promise.allSettled(data);

        let resultText = [];
        if (EXPERIMENT.current.task === QANDA_TASK) {
          resultText = responses.map(({ value }) => [value.result[0].answer]);
        } else {
          resultText = responses.map(({ value }) => [value.result]);
        }
        const currrentColumnLetter = getColumnNameFromRange(colRange);
        const height = getColmunStartIndex(colRange);
        const responseRangeString = `${currrentColumnLetter}${
          prev + height
        }:${currrentColumnLetter}${idx + height}`;
        let responseRange = sheet.getRange(responseRangeString);

        responseRange.load('values');
        responseRange.load('address');
        await context.sync();

        responseRange = columnToPlaceResultMap[insertPlace](responseRange);

        responseRange.load('values');

        prev = idx + 1;
        responseRange.values = resultText;
        if (showConfidence) {
          let confidenceResponse = 0;
          if (EXPERIMENT.current.task === QANDA_TASK) {
            confidenceResponse = responses.map(({ value }) => [
              value.result[0].confidence,
            ]);
          } else {
            confidenceResponse = responses.map(({ value }) => [
              value.confidence_score,
            ]);
          }
          const confidenceColumn =
            columnToPlaceResultMap[insertPlace](responseRange);

          confidenceColumn.values = confidenceResponse;
        }
        requestInterval.index = -1;

        if (!runState.stop) {
          runState.processed = runState.processed + responses.length;
          runState.updateProgress();

          dom.changeText(pages.run.runTotalCells, runState.total);
          dom.changeText(pages.run.runProcessed, runState.processed);
          dom.changeText(pages.run.runPercentage, runState.progress);
        }

        await context.sync();
      }
      const currentType = EXPERIMENT.current.type;
      const fileFormatMap = {
        image: 'jpg',
        audio: 'mp3',
      };
      const format = fileFormatMap[EXPERIMENT_TYPES_URL[currentType]];
      const intervals = requestInterval[EXPERIMENT_TYPES_URL[currentType]];

      if (EXPERIMENT.insertPlace === 'insertRight') {
        if (EXPERIMENT.showConfidence) {
          const newResultCol = await setColumnAtTheRight(
            range,
            sheet,
            context,
            false
          );
          await setColumnAtTheRight(newResultCol, sheet, context, true);
        } else {
          await setColumnAtTheRight(range, sheet, context, false);
        }
      }

      for (const cell of column) {
        if (runState.stop) break;
        const [text] = cell;
        const replaced = text.replace(/\n/g, '\\n');
        const bodyKey = REQUEST_BODY_KEYS[EXPERIMENT.current.task] || 'url';

        requests.push(
          httpPredict.post(
            `${typeUrl}/${task}/${currentModelId}`,
            JSON.stringify({
              [bodyKey]: replaced,
              ...(format ? { format } : {}),
            }),
            {
              accept: 'application/json',
              'Content-Type': 'application/json',
              'x-api-key': user.api_keys ? user.api_keys[0].key : {},
            },
            'retry'
          )
        );

        if (
          requestInterval.index === intervals.limit ||
          idx === column.length - 1
        ) {
          await fillCellsRequest(text, idx, requests);
          requests = [];
        }
        requestInterval.index += 1;
        idx += 1;
      }
      await context.sync();
      dom.getById(pages.run.runEditWarning).style.display = 'none';
      dom.changeText(pages.run.runExperiment, 'Run model');
    });
  }

  function setUpListeners(dom, router, pages, http) {
    const {
      login: {
        pageId: loginPageId,
        emailInput,
        passwordInput,
        loginButton,
        goToSecretTokenAuth,
        gotToNormalAuth,
        subPages: { defaultSubpage, secretToken },
        invalidCredentials,
      },
      experiments: {
        pageId: expPageId,
        experimentCardsClassName,
        cardsContainer,
        visibilityDropdown,
        typeDropdown,
        logoutBtn,
      },
      run: {
        pageId: runPageId,
        goBack: runPageGoBack,
        confidenceDd,
        includeHeadersContainer,
        hasHeadersCb,
        insertDd,
        modelDd,
        expValue,
        confidenceValue,
        hasHeadersValue,
        modelValue,
        resultPlaceValue,
        cellsRange,

        runProgressContainer,
        runProcessed,
        runTotalCells,
        runPercentage,
        runStop,

        runExperiment,
        runEditWarning,
      },
    } = pages;

    const setLoginEvents = (cb) => {
      dom.addEvent(loginButton, 'click', () => {
        const cred = {
          username: dom.getById(emailInput).value,
          password: dom.getById(passwordInput).value,
        };
        http
          .post('login', new URLSearchParams({ ...cred }), {
            'Content-Type': 'application/x-www-form-urlencoded',
          })
          .then((res) => {
            http.setTokenInHeaders(res.access_token);
            router.navigateTo(expPageId);
            dom.getById(invalidCredentials).style.display = 'none';
            cb();
          })
          .catch((err) => {
            const messages = {
              422: 'Sorry, something went wrong, please try later',
              400: 'Invalid credencials, please try again',
            };
            dom.getById(invalidCredentials).style.display = 'block';
            dom.getById(invalidCredentials).innerText = messages[err.status];
            dom.getById(loginButton).blur();
          });
      });
      dom.addEvent(goToSecretTokenAuth, 'click', () => {
        router.switchPagesVisibility(defaultSubpage, secretToken);
      });
      dom.addEvent(gotToNormalAuth, 'click', () => {
        router.switchPagesVisibility(secretToken, defaultSubpage);
      });
    };

    const setExperimentEvents = (cb) => {
      http
        .get('user/')
        .then((res) => {
          user = res;
        })
        .catch((err) => {
          console.log(err);
        });
      const appendExperimentListInDom = (experimentList) => {
        dom.getById(cardsContainer).innerHTML = '';

        setExperimentsInDom(
          experimentList,
          experimentTemplate,
          cardsContainer,
          dom
        );

        dom.addEventToElements(experimentCardsClassName, 'click', (event) => {
          const selectedExperimentId = event.currentTarget.id;

          http
            .get(`experiment/${selectedExperimentId}`)
            .then(({ models, ...rest }) => {
              EXPERIMENT.current = rest;
              EXPERIMENT.models = models;
              router.navigateTo(runPageId);
              cb();
            });
        });
      };

      http.get(`experiment/?${EXPERIMENT.query}`).then((response) => {
        EXPERIMENT.list = response.filter(
          (experiment) =>
            experiment.status === STATUS_FINISHED &&
            TASKS_ALLOWED.includes(experiment.task)
        );
        appendExperimentListInDom(EXPERIMENT.list);
      });

      http.get(`experiment/public?${EXPERIMENT.query}`).then((response) => {
        EXPERIMENT.publicExperiments = response;
        dom.getById(visibilityDropdown).disabled = false;

        dom.addEvent(visibilityDropdown, 'change', (event) => {
          const { value: visibility } = event.target;
          const experimentList = EXPERIMENT[visibility];
          EXPERIMENT.visibilityQuery =
            visibility === 'publicExperiments' ? 'public' : '';

          appendExperimentListInDom(experimentList);
        });
      });

      dom.addEvent(typeDropdown, 'change', (event) => {
        const visibility = EXPERIMENT.visibilityQuery;
        const type = event.target.value;
        const typeQuery = type ? `type=${type}&&` : '';

        http
          .get(`experiment/${visibility}?${typeQuery}${EXPERIMENT.query}`)
          .then((response) => {
            appendExperimentListInDom(response);
          });
      });

      dom.addEvent(logoutBtn, 'click', () => {
        router.navigateTo(loginPageId);
        dom.removeListenersFromNode(expPageId);
      });
    };

    const setRunModelPageEvents = () => {
      setRecommendedModel();
      setModelOptionsInDom(EXPERIMENT.models, modelDd, dom);

      Excel.run((context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        EXCEL_EVENTS.select = sheet.onSelectionChanged.add((event) => {
          dom.getById(cellsRange).value = event.address;
          EXPERIMENT.colRange = event.address;
          // dom.getById(includeHeadersContainer).style.display = isEntireColumn(event.address) ? "flex" : "none";
        });

        return context.sync();
      });

      dom.changeText(expValue, EXPERIMENT.current.title);
      // dom.changeText(confidenceValue, false);
      // dom.changeText(resultPlaceValue, 'insertRight');
      // dom.changeText(modelValue, EXPERIMENT.currentModel.name);

      dom.addEvent(runPageGoBack, 'click', () => {
        dom.changeText(pages.run.runStop, 'Run model');
        runState.clearRunState(dom);
        EXPERIMENT.insertPlace = 'insertRight';
        dom.removeListenersFromNode(runPageId);
        router.navigateTo(expPageId);
        removeExcelEvent();
      });
      dom.addEvent(cellsRange, 'keyup', (e) => {
        EXPERIMENT.colRange = e.target.value;
        // dom.getById(includeHeadersContainer).style.display = isEntireColumn(e.target.value) ? "flex" : "none";
      });
      dom.addEvent(confidenceDd, 'change', ({ target: { checked } }) => {
        EXPERIMENT.showConfidence = checked;
        // dom.changeText(confidenceValue, checked);
      });
      dom.addEvent(hasHeadersCb, 'change', ({ target: { checked } }) => {
        EXPERIMENT.hasHeaders = checked;
        // dom.changeText(hasHeadersValue, checked);
      });
      dom.addEvent(insertDd, 'change', ({ target: { value } }) => {
        EXPERIMENT.insertPlace = value;
        // dom.changeText(resultPlaceValue, value);
      });
      dom.addEvent(modelDd, 'change', ({ target: { value } }) => {
        findAndSetModelByName(value);
        // dom.changeText(modelValue, value);
      });
      dom.addEvent(runExperiment, 'click', () => {
        if (dom.getById(runExperiment).innerText === 'Stop') {
          dom.changeText(runTotalCells, 0);
          dom.changeText(runProcessed, 0);
          dom.changeText(runPercentage, 0);
          runState.stop = true;
          dom.changeText(runExperiment, 'Run model');
          dom.getById(runEditWarning).style.display = 'none';
          return;
        }
        try {
          runState.clearRunState(dom);
          runExcelAPI(dom);
          dom.getById(runEditWarning).style.display = 'block';
          dom.changeText(runExperiment, 'Stop');
        } catch (e) {
          console.error(e);
          alert(
            'Sorry, something went wrong, please verify you typed a correct range value.\n For example: "A2:A10" of "B:B"'
          );
        }
      });
    };

    setLoginEvents(() => setExperimentEvents(setRunModelPageEvents));

    testToken && setExperimentEvents(setRunModelPageEvents);
    // setRunModelPageEvents();
  }

  const http = new HttpService(API_URL);
  const domHandler = new DomHandler();

  // let router = "";
  let router = new PageStateHandler(pages.login.pageId, domHandler);
  if (testToken) {
    // Uncomment line below to start from experiments page
    router = new PageStateHandler(pages.experiments.pageId, domHandler);

    // Uncomment line below to start from model page
    // router = new PageStateHandler(pages.run.pageId, domHandler);
  }

  setUpListeners(domHandler, router, pages, http);
};
