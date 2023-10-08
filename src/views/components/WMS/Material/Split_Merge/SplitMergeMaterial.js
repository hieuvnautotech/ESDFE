import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import SplitMaterial from './Split/SplitMaterial';
import MergeMaterial from './Merge/MergeMaterial';
import { memo } from 'react';

const SplitMergeMaterial = memo((props) => {
  const [value, setValue] = React.useState('split');

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Split" value="split" />
            <Tab label="Merge" value="merge" />
          </TabList>
        </Box>
        <TabPanel value="split" sx={{ p: 0 }}>
          <SplitMaterial />
        </TabPanel>
        <TabPanel value="merge" sx={{ p: 0 }}>
          <MergeMaterial />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  );
});
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

export default connect(mapStateToProps, mapDispatchToProps)(SplitMergeMaterial);
