import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import BarDetails from 'components/BarDetails';
import barMock from 'components/__mocks__/barMocks';

describe('BarDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<BarDetails bar={barMock} />);

    expect(getByText('entities.bar.name')).toBeInTheDocument();
  });
});
