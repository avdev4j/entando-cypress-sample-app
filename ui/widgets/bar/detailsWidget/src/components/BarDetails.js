import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import barType from 'components/__types__/bar';
import BarFieldTable from 'components/bar-field-table/BarFieldTable';

const BarDetails = ({ t, bar }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Bar',
        })}
      </h3>
      <BarFieldTable bar={bar} />
    </Box>
  );
};

BarDetails.propTypes = {
  bar: barType,
  t: PropTypes.func.isRequired,
};

BarDetails.defaultProps = {
  bar: {},
};

export default withTranslation()(BarDetails);
