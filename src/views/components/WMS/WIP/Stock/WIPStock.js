import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MaterialTab from './MaterialTab';
import SemiLotTab from './SemiLotTab';

const WIPStock = (props) => {
  const intl = useIntl();
  const [value, setValue] = React.useState('StockMaterial');

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="Material" value="StockMaterial" />
            <Tab label="Semi Lot" value="StockSemiLot" />
          </TabList>
        </Box>
        <TabPanel value="StockMaterial" sx={{ p: 0 }}>
          <MaterialTab />
        </TabPanel>
        <TabPanel value="StockSemiLot" sx={{ p: 0 }}>
          <SemiLotTab />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  );
};
User_Operations.toString = function () {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  return { language };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};

export default connect(mapStateToProps, mapDispatchToProps)(WIPStock);
