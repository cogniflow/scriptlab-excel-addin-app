export const STATUS_PENDING = 0; //pending
export const STATUS_IN_QUEUE = 1; //waiting
export const STATUS_RUNNING = 2; //running
export const STATUS_FINISHED = 3; //ready
export const STATUS_CANCELED_BY_USER = 4; //canceled
export const STATUS_CANCELED_BY_TIMEOUT = 5; //timed out
export const STATUS_FINISHED_WITH_ERROR = 6; //error

export const EXPERIMENT_TYPES = {
  0: 'Text',
  1: 'Image',
  2: 'Audio',
};

export const testToken = '';
// "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmMDk0Mjg4Yi0wYWFjLTRhYWQtOGRmNi00NjhlZTY4OWEwNGUiLCJhY2NvdW50X3R5cGUiOjMsImV4cCI6MTY0Njg1NjEwM30.Qc222N0PhQjdBAP84aCc979rmoCWkK9AKq1ddnk2yzY";

export const VISIBILITY = {
  PRIVATE: { value: 0, label: 'private' },
  PUBLIC: { value: 1, label: 'public' },
  COMPANY: { value: 2, label: 'organization' },
  COMMUNITY: { value: 3, label: 'community' },
};
