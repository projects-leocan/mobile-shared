import { HttpError, NetworkError, CacheError } from './errors';
import { Config } from '../network';
import { get } from 'lodash/object';
import moment from 'moment';
import { api as defaultApi } from '../api';

import { tokenSelector, apiSelector, hotelIdSelector, userIdSelector, userSelector } from '../selectors/auth';
import { call, select } from 'redux-saga/effects';

const tryParseJSON = (json) => {
  if (!json) {
    return null;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error(`Failed to parse unexpected JSON response: ${json}`);
  }
};

export const getResponseBody = (res) => {
  const contentType = res.headers.get('Content-Type');
  return contentType.indexOf('json') >= 0 ? res.text().then(tryParseJSON) : res.text();
};

function checkHeaders(url, options) {
  if (get(options, 'headers.Authorization') && get(options, 'headers.Authorization') === 'Bearer null') {
    return Promise.reject('Bearer Authorization is null.')
  }

  return Promise.resolve(url, options);
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.text().then((text) => text ? JSON.parse(text) : null);
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status === 304) {
    return Promise.reject(304)
  }

  throw new HttpError(response.statusText, response);
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           An object containing either "data" or "err"
 */
const timeoutPromise = (ms) => (promise) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(Config.ERROR_MESSAGE))
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

const timeout = timeoutPromise(Config.TIMEOUT_TIME);

export function request(url, options) {
  return timeout(fetch(url, options))
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      if (err === 304) {
        return;
      }
      
      const error = (err instanceof HttpError) ? err : new NetworkError(err, url);
      throw error;
    })
}

export const authRequest = function * authRequest(url, options) {
  const token = yield select(tokenSelector);
  const api = yield select(apiSelector) || defaultApi;
  
  let headers = {
    'Authorization': `Bearer ${token}`,
  };
  if (options && ['PUT', 'POST', 'DELETE'].includes(options.method)) {
    headers['Content-Type'] = 'application/json';
  }
  
  return yield call(request, `${api}${url}`, {
    ...options,
    headers
  });
}

export const effectRequest = (url, options, meta) => {
  const { auth: { data: { token, user, api, userId }}} = meta;

  if (options.photo) {
    const formData = new FormData();
    // formData.append('file', {
    //   uri: options.photo,
    //   name: 'photo.jpg',
    //   type: 'image/jpeg'
    // });
    formData.append('fileUpload', {
      uri: options.photo,
      name: 'photo.jpg',
      type: 'image/jpeg'
    });

    return request(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data;',
      },
      body: formData,
    }).then(res => {
      // console.log(res);
      return res.url;
    }).catch(error => {
      throw new NetworkError({ message: error.toString() }, url);
    })
  }

  let headers = {
    'Authorization': `Bearer ${token}`,
  }
  if (options && ['PUT', 'POST', 'DELETE'].includes(options.method)) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.headers) {
    headers = {
      ...headers,
      ...options.headers
    }
  }
  if (get(meta, 'auth.useUserSession')) {
    options.body = {
      ...options.body,
      session: { user: user },
      platform: user.isAttendant ? 'attendant' : 'inspector'
    }
  } else if (get(meta, 'auth.useUserId')) {
    options.body = {
      ...options.body,
      userId
    }
  }

  const fetchOptions = {
    ...options,
    body: JSON.stringify(options.body),
    headers
  }

  return timeout(fetch(`${api || defaultApi}${url}`, fetchOptions))
    .then(res => {
    if (res.ok) {
      return getResponseBody(res);
    } else {
      return getResponseBody(res).then(body => {
        throw new NetworkError({message: body || ''}, `${api || defaultApi}${url}`);
      })
    }
  })
}

export const logError = function * logError(message, extra = '', app = 'inspector') {
  const { auth: { userId, hotelId }} = yield select();

  console.log(userId, hotelId, message, extra, app)

  if (!userId || !hotelId) {
    console.warn('Missing userId or hotelId')
    return true
  }

  return yield call(request, 'https://api.roomchecking.com/app_error', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      hotel_id: hotelId,
      user_id: userId,
      date_ts: moment().unix(),
      app,
      message,
      extra
    })
  })
}

export default request;
