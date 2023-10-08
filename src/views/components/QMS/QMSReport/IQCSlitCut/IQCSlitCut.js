import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabGeneral from './TabGeneral';
import TabDetail from './TabDetail';
import { QMSReportService } from '@services';

const IQCSlitCut = (props) => {
  const intl = useIntl();
  const [value, setValue] = React.useState('General');
  const [QCStandard, setQCStandard] = useState([]);
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  async function getQCStandard() {
    const res = await QMSReportService.getQCStandard();
    if (res.Data) {
      setQCStandard(res.Data);
    }
  }

  useEffect(() => {
    getQCStandard();
  }, [value]);
  return (
    <React.Fragment>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="General" value="General" />
            <Tab label="Detail" value="Detail" />
          </TabList>
        </Box>
        <TabPanel value="General" sx={{ p: 0 }}>
          <TabGeneral />
        </TabPanel>
        <TabPanel value="Detail" sx={{ p: 0 }}>
          <TabDetail QCStandard={QCStandard} />
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

export default connect(mapStateToProps, mapDispatchToProps)(IQCSlitCut);
