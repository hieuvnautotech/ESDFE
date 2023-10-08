import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import HoldRawMaterial from './TabRawMaterial/HoldRawMaterial';
import HoldMaterial from './TabMaterial/HoldMaterial';
import HoldSemiLot from './TabSemiLot/HoldSemiLot';
import HoldFinishGood from './TabFinishGood/HoldFinishGood';
import HoldLog from './TabLog/HoldLog';
import { loginService } from '@services';

const Holding = (props) => {
  const intl = useIntl();
  const [value, setValue] = useState('');
  const [tabs, setTabs] = useState([]);

  async function handleGetTab() {
    var res = await loginService.getMenuTab('Holding');
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
              return <Tab key={index} value={item.menuName} label={intl.formatMessage({ id: item.languageKey })} />;
            })}
          </TabList>
        </Box>
        <TabPanel value="TabRawMaterial" sx={{ p: 0 }}>
          <HoldRawMaterial />
        </TabPanel>
        <TabPanel value="TabMaterial" sx={{ p: 0 }}>
          <HoldMaterial />
        </TabPanel>
        <TabPanel value="TabSemiLot" sx={{ p: 0 }}>
          <HoldSemiLot />
        </TabPanel>
        <TabPanel value="TabFinishGood" sx={{ p: 0 }}>
          <HoldFinishGood />
        </TabPanel>
        <TabPanel value="TabLog" sx={{ p: 0 }}>
          <HoldLog />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  );
};

export default Holding;
