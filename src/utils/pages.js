export const pages = {
  login: {
    pageId: 'page-login',
    goToSecretTokenAuth: 'login-go-to-secret',
    gotToNormalAuth: 'login-go-to-normal-auth',
    subPages: {
      defaultSubpage: 'login-default-form',
      secretToken: 'login-use-secret-token',
    },
    emailInput: 'login-email-field',
    passwordInput: 'login-password-field',
    loginButton: 'default-login-button',
    invalidCredentials: 'login-invalid-creds',
  },
  experiments: {
    pageId: 'page-experiments',
    experimentCardsClassName: 'experiment-card',
    cardsContainer: 'experiment-cards-container',
    visibilityDropdown: 'experiments-visibility-dropdown',
    typeDropdown: 'experiments-type-dropdown',
    logoutBtn: 'logout',
  },
  run: {
    pageId: 'pages-run-model',
    goBack: 'pages-run-model-go-back',

    confidenceDd: 'run-show-confidence-checkbox',
    includeHeadersContainer: 'run-include-headers-container',
    hasHeadersCb: 'run-show-has-headers',
    insertDd: 'run-insert-dropdown',
    modelDd: 'run-model-dropdown',

    cellsRange: 'run-cells-range',

    expValue: 'experiment-value',
    confidenceValue: 'confidence-value',
    hasHeadersValue: 'has-headers-value',
    modelValue: 'model-value',
    resultPlaceValue: 'result-place-value',

    runProgressContainer: 'run-progress-container',
    runProcessed: 'run-processed',
    runTotalCells: 'run-total-cells',
    runPercentage: 'run-percentage',
    runStop: 'run-stop',

    runExperiment: 'run-experiment',
    runEditWarning: 'run-edit-warning',
  },
};
