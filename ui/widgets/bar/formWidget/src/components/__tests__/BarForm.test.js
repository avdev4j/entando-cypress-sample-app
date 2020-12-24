import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import barMock from 'components/__mocks__/barMocks';
import BarForm from 'components/BarForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Bar Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <BarForm bar={barMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.bar.name').value).toBe(
      'Maxime fugit quisquam voluptatem et. Animi corrupti fuga autem. Aut molestiae et eveniet sint tempore ipsam id nemo quia.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <BarForm bar={barMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('bar-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
