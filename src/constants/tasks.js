export const EXPERIMENT_TASK_TEXT_CLASSIFICATION = 0;
export const EXPERIMENT_TASK_TEXT_TRANSLATION = 1;
export const EXPERIMENT_TASK_IMAGE_CLASSIFICATION = 100;
export const EXPERIMENT_TASK_AUDIO_CLASSIFICATION = 200;
export const EXPERIMENT_TASK_AUDIO_SPEECH2TEXT = 201;

export const TASKS_ALLOWED = [
  EXPERIMENT_TASK_TEXT_CLASSIFICATION,
  EXPERIMENT_TASK_TEXT_TRANSLATION,
  EXPERIMENT_TASK_IMAGE_CLASSIFICATION,
  EXPERIMENT_TASK_AUDIO_CLASSIFICATION,
  EXPERIMENT_TASK_AUDIO_SPEECH2TEXT,
];

export const EXPERIMENT_TASKS = {
  0: 'Text classification',
  1: 'Text Translation',
  2: 'Entities recognition',
  3: 'Question and answer',
  4: 'Smart extractor',
  100: 'Image classification',
  200: 'Audio classification',
  201: 'Audio speech to text',
};

export const EXPERIMENT_TYPES_URL = {
  0: 'text',
  1: 'image',
  2: 'audio',
};

export const URL_TASK_MAP = {
  0: 'classification/predict',
  1: 'translation/translate',
  2: 'information-extraction/extract-entities',
  3: 'question-answering/ask',
  4: 'smart-extraction/extract',
  100: 'classification/predict-from-web',
  200: 'classification/predict-from-web',
  201: 'classification/predict-from-web',
};
