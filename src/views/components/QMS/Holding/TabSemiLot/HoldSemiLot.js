import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import { loginService } from '@services';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import TabSemiFQC from './TabSemiFQC/TabSemiFQC';
import TabSemiMMS from './TabSemiMMS/TabSemiMMS';

const HoldSemiLot = (props) => {
  const intl = useIntl();
  const [value, setValue] = useState('');
  const [tabs, setTabs] = useState([]);

  async function handleGetTab() {
    var res = await loginService.getMenuTab('TabSemiLot');
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
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example" centered>
            {tabs.map((item, index) => {
              return <Tab key={index} value={item.menuName} label={intl.formatMessage({ id: item.languageKey })} />;
            })}
          </TabList>
        </Box>
        <TabPanel value="TabSemiLotMMS" sx={{ p: 0 }}>
          <TabSemiMMS />
        </TabPanel>
        <TabPanel value="TabSemiLotFQC" sx={{ p: 0 }}>
          <TabSemiFQC />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  );
};

export default HoldSemiLot;
