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

import TabFQC from './TabFQC';
import TabIQCRawMaterial from './TabIQCRawMaterial';
import TabIQCSlitCut from './TabIQCSlitCut';
import TabOQC from './TabOQC';
import TabPQC from './TabPQC';

const QCKPI = (props) => {
  const intl = useIntl();

  const [value, setValue] = React.useState('tab1');

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="IQC Raw Material" value="tab1" />
            <Tab label="IQC Slit/Cut" value="tab2" />
            <Tab label="PQC" value="tab3" />
            <Tab label="FQC" value="tab4" />
            <Tab label="OQC" value="tab5" />
          </TabList>
        </Box>
        <TabPanel value="tab1" sx={{ p: 0 }}>
          <TabIQCRawMaterial />
        </TabPanel>
        <TabPanel value="tab2" sx={{ p: 0 }}>
          <TabIQCSlitCut />
        </TabPanel>
        <TabPanel value="tab3" sx={{ p: 0 }}>
          <TabPQC />
        </TabPanel>
        <TabPanel value="tab4" sx={{ p: 0 }}>
          <TabFQC />
        </TabPanel>
        <TabPanel value="tab5" sx={{ p: 0 }}>
          <TabOQC />
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

export default connect(mapStateToProps, mapDispatchToProps)(QCKPI);
