import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiBarGet } from 'api/bar';
import barApiGetResponseMock from 'components/__mocks__/barMocks';
import BarDetailsContainer from 'components/BarDetailsContainer';

jest.mock('api/bar');

jest.mock('auth/withKeycloak', () => {
  const withKeycloak = Component => {
    return props => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        keycloak={{
          initialized: true,
          authenticated: true,
        }}
      />
    );
  };

  return withKeycloak;
});

beforeEach(() => {
  apiBarGet.mockClear();
});

describe('BarDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiBarGet.mockImplementation(() => Promise.resolve(barApiGetResponseMock));

    render(<BarDetailsContainer id="1" />);

    await wait(() => {
      expect(apiBarGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiBarGet.mockImplementation(() => Promise.resolve(barApiGetResponseMock));

    const { getByText } = render(<BarDetailsContainer id="1" />);

    await wait(() => {
      expect(apiBarGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.bar.name')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiBarGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<BarDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiBarGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
