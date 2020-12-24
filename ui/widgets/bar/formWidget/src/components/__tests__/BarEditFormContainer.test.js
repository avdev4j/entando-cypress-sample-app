import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiBarGet, apiBarPut } from 'api/bars';
import BarEditFormContainer from 'components/BarEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import barMock from 'components/__mocks__/barMocks';

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

describe('BarEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiBarGet.mockImplementation(() => Promise.resolve(barMock));
    const { queryByText } = render(
      <BarEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiBarGet).toHaveBeenCalledTimes(1);
      expect(apiBarGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiBarGet.mockImplementation(() => Promise.resolve(barMock));
    apiBarPut.mockImplementation(() => Promise.resolve(barMock));

    const { findByTestId, queryByText } = render(
      <BarEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiBarPut).toHaveBeenCalledTimes(1);
      expect(apiBarPut).toHaveBeenCalledWith('', barMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiBarGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <BarEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiBarGet).toHaveBeenCalledTimes(1);
      expect(apiBarGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiBarGet.mockImplementation(() => Promise.resolve(barMock));
    apiBarPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <BarEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiBarGet).toHaveBeenCalledTimes(1);
      expect(apiBarGet).toHaveBeenCalledWith('', '1');

      expect(apiBarPut).toHaveBeenCalledTimes(1);
      expect(apiBarPut).toHaveBeenCalledWith('', barMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
