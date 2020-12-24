import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import barMocks from 'components/__mocks__/barMocks';
import BarTable from 'components/BarTable';

describe('BarTable', () => {
  it('shows bars', () => {
    const { getByText } = render(<BarTable items={barMocks} />);
    expect(
      getByText(
        'Maxime fugit quisquam voluptatem et. Animi corrupti fuga autem. Aut molestiae et eveniet sint tempore ipsam id nemo quia.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Non saepe cupiditate doloremque dolorem. Vel ipsum consectetur consequatur voluptas alias laboriosam magnam maiores. Distinctio reiciendis minima aut error aut rerum architecto quo sequi. Consequatur eum mollitia mollitia cum velit.'
      )
    ).toBeInTheDocument();
  });

  it('shows no bars message', () => {
    const { queryByText } = render(<BarTable items={[]} />);
    expect(
      queryByText(
        'Maxime fugit quisquam voluptatem et. Animi corrupti fuga autem. Aut molestiae et eveniet sint tempore ipsam id nemo quia.'
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Non saepe cupiditate doloremque dolorem. Vel ipsum consectetur consequatur voluptas alias laboriosam magnam maiores. Distinctio reiciendis minima aut error aut rerum architecto quo sequi. Consequatur eum mollitia mollitia cum velit.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.bar.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(<BarTable items={barMocks} onSelect={onSelectMock} />);
    fireEvent.click(
      getByText(
        'Maxime fugit quisquam voluptatem et. Animi corrupti fuga autem. Aut molestiae et eveniet sint tempore ipsam id nemo quia.'
      )
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
