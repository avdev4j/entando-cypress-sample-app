import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import barType from 'components/__types__/bar';

const BarFieldTable = ({ t, bar }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>{t('common.name')}</TableCell>
        <TableCell>{t('common.value')}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
          <span>{t('entities.bar.id')}</span>
        </TableCell>
        <TableCell>
          <span>{bar.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bar.name')}</span>
        </TableCell>
        <TableCell>
          <span>{bar.name}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

BarFieldTable.propTypes = {
  bar: barType,
  t: PropTypes.func.isRequired,
};

BarFieldTable.defaultProps = {
  bar: [],
};

export default withTranslation()(BarFieldTable);
