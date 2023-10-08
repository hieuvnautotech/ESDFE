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
import { loginService } from '@services';
import QCMasterIQC from './IQC/QCMasterIQC';
import QCMasterMold from './Mold/QCMasterMold';
import QCMasterOQC from './OQC/QCMasterOQC';
import QCMasterPQC from './PQC/QCMasterPQC';
import QCMasterAPP from './APP/QCMasterAPP';

const QCMaster = (props) => {
  const intl = useIntl();

  const [value, setValue] = useState('tab1');
  const [tabs, setTabs] = useState([]);

  async function handleGetTab() {
    var res = await loginService.getMenuTab('QC SOP');
    if (res.Data && res.Data.length > 0) {
      setTabs(res.Data);
      setValue(res.Data[0].menuName);
    }
  }

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    handleGetTab();
  }, []);

  return (
    <React.Fragment>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            {tabs.map((item, index) => {
              return <Tab key={index} value={item.menuName} label={item.languageKey} />;
            })}
          </TabList>
        </Box>
        <TabPanel value="Tab IQC" sx={{ p: 0 }}>
          <QCMasterIQC />
        </TabPanel>
        <TabPanel value="Tab PQC" sx={{ p: 0 }}>
          <QCMasterPQC />
        </TabPanel>
        <TabPanel value="Tab OQC" sx={{ p: 0 }}>
          <QCMasterOQC />
        </TabPanel>
        <TabPanel value="Tab APP" sx={{ p: 0 }}>
          <QCMasterAPP />
        </TabPanel>
        <TabPanel value="Tab Mold" sx={{ p: 0 }}>
          <QCMasterMold />
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

export default connect(mapStateToProps, mapDispatchToProps)(QCMaster);
