import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import barMocks from 'components/__mocks__/barMocks';
import { apiBarsGet } from 'api/bars';
import 'i18n/__mocks__/i18nMock';
import BarTableContainer from 'components/BarTableContainer';

jest.mock('api/bars');

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

jest.mock('components/pagination/withPagination', () => {
  const withPagination = Component => {
    return props => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        pagination={{
          onChangeItemsPerPage: () => {},
          onChangeCurrentPage: () => {},
        }}
      />
    );
  };

  return withPagination;
});

describe('BarTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiBarsGet.mockImplementation(() => Promise.resolve({ bars: barMocks, count: 2 }));
    const { queryByText } = render(<BarTableContainer />);

    await wait(() => {
      expect(apiBarsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiBarsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<BarTableContainer />);

    wait(() => {
      expect(apiBarsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
