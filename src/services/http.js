import { API_URL, PREDICT_API_URL, testToken } from '../constants';
import { fetchRetry } from '../utils/functions';

export default class HttpService {
  constructor(baseUrl) {
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.baseUrl = baseUrl;

    testToken && this.setTokenInHeaders(testToken);
  }

  setTokenInHeaders(token) {
    this.headers = { Authorization: `Bearer ${token}`, ...this.headers };
  }

  req(method) {
    return (url, body, headers, type = 'normal') => {
      if (type === 'normal') {
        return fetch(`${this.baseUrl}/${url}`, {
          method,
          headers: { ...this.headers, ...(headers ?? {}) },
          body: body,
        })
          .then((res) => {
            if (!res.ok) {
              const error = new Error('HTTP status code: ' + res.status);
              error.response = res;
              error.status = res.status;
              throw error;
            }
            return res.json();
          })
          .then((body) => {
            return body;
          });
      } else {
        return fetchRetry(`${this.baseUrl}/${url}`, 120000, 200, {
          method,
          headers: { ...this.headers, ...(headers ?? {}) },
          body: body,
        })
          .then((res) => {
            if (!res.ok) {
              const error = new Error('HTTP status code: ' + res.status);
              error.response = res;
              error.status = res.status;
              throw error;
            }
            return res.json();
          })
          .then((body) => {
            return body;
          });
      }
    };
  }
  get = this.req('GET');
  post = this.req('POST');
}

export const http = new HttpService(API_URL);
export const httpPredict = new HttpService(PREDICT_API_URL);
