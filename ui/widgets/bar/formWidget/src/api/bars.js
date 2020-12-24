import { getDefaultOptions, request } from 'api/helpers';

const resource = 'bars';

export const apiBarGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiBarPost = async (serviceUrl, bar) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: bar ? JSON.stringify(bar) : null,
  };
  return request(url, options);
};

export const apiBarPut = async (serviceUrl, bar) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: bar ? JSON.stringify(bar) : null,
  };
  return request(url, options);
};

export const apiBarDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
