import React, { useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import { useIntl } from 'react-intl';
import HoldLogRawMaterial from './TabLogRawMaterial/HoldLogRawMaterial';
import HoldLogMaterial from './TabLogMaterial/HoldLogMaterial';
import TabHoldLogFG from './TabHoldLogFG';
import TabLogSemiLot from './TabLogSemiLot/TabLogSemiLot';
import { loginService } from '@services';

const HoldLog = (props) => {
  const intl = useIntl();
  const [value, setValue] = useState('');
  const [tabs, setTabs] = useState([]);

  async function handleGetTab() {
    var res = await loginService.getMenuTab('TabLog');
    if (res.Data && res.Data.length > 0) {
      setTabs(res.Data);
      setValue(res.Data[0].menuName);
    }
  }

  useEffect(() => {
    handleGetTab();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, marginTop: 5, marginTop: 1, textAlign: 'center', borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} centered>
            {tabs.map((item, index) => {
              return <Tab key={index} value={item.menuName} label={intl.formatMessage({ id: item.languageKey })} />;
            })}
          </TabList>
        </Box>
        <TabPanel value="TabLogRawMaterial" sx={{ p: 0 }}>
          <HoldLogRawMaterial />
        </TabPanel>
        <TabPanel value="TabLogMaterial" sx={{ p: 0 }}>
          <HoldLogMaterial />
        </TabPanel>
        <TabPanel value="TabLogSemiLot" sx={{ p: 0 }}>
          <TabLogSemiLot />
        </TabPanel>
        <TabPanel value="TabLogFinishGood" sx={{ p: 0 }}>
          <TabHoldLogFG />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  );
};

export default HoldLog;
