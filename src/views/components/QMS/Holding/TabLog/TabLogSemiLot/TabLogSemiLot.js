import React, { useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabSemiMMS from './TabSemiMMS';
import TabSemiFQC from './TabSemiFQC';
import { useIntl } from 'react-intl';
import { loginService } from '@services';

const TabLogSemiLot = (props) => {
  const intl = useIntl();
  const [value, setValue] = useState('');
  const [tabs, setTabs] = useState([]);

  async function handleGetTab() {
    var res = await loginService.getMenuTab('TabLogSemiLot');
    if (res.Data && res.Data.length > 0) {
      setTabs(res.Data);
      setValue(res.Data[0].menuName);
    }
  }

  useEffect(() => {
    console.log('first');
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
        <TabPanel value="TabLogSemiLotMMS" sx={{ p: 0 }}>
          <TabSemiMMS />
        </TabPanel>
        <TabPanel value="TabLogSemiLotFQC" sx={{ p: 0 }}>
          <TabSemiFQC />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  );
};

export default TabLogSemiLot;
