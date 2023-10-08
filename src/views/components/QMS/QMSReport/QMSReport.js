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
import IQCRawMaterial from './IQCRawMaterial/IQCRawMaterial';
import TabPQC from './PQC/TabPQC';
import TabOQC from './OQC/TabOQC';
import IQCSlitCut from './IQCSlitCut/IQCSlitCut';
import TabFQC from './FQC/TabFQC';
import TabMaterial from './IQCMaterial/TabMaterial';

const QMSReport = (props) => {
  const intl = useIntl();
  const [value, setValue] = React.useState('IQCRawMaterial');

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="IQC Raw Material" value="IQCRawMaterial" />
            <Tab label="IQC Material" value="IQCMaterial" />
            <Tab label="IQC SLIT/CUT" value="IQCSlitCut" />
            <Tab label="PQC" value="PQC" />
            <Tab label="FQC" value="FQC" />
            <Tab label="OQC" value="OQC" />
          </TabList>
        </Box>
        <TabPanel value="IQCRawMaterial" sx={{ p: 0 }}>
          <IQCRawMaterial />
        </TabPanel>
        <TabPanel value="IQCMaterial" sx={{ p: 0 }}>
          <TabMaterial />
        </TabPanel>
        <TabPanel value="IQCSlitCut" sx={{ p: 0 }}>
          <IQCSlitCut />
        </TabPanel>
        <TabPanel value="PQC" sx={{ p: 0 }}>
          <TabPQC />
        </TabPanel>
        <TabPanel value="FQC" sx={{ p: 0 }}>
          <TabFQC />
        </TabPanel>
        <TabPanel value="OQC" sx={{ p: 0 }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(QMSReport);
