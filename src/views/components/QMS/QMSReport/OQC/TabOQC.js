import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import { QCReportService } from '@services';
import React, { useEffect, useState } from 'react';
import OQCDetail from './OQCDetail';
import OQCGeneral from './OQCGeneral';

const TabOQC = (props) => {
  const [value, setValue] = React.useState('General');
  const [QCStandard, setQCStandard] = useState([]);
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  async function getQCStandard() {
    const res = await QCReportService.getQCStandardOQC();
    if (res.Data) {
      setQCStandard(res.Data);
    }
  }

  useEffect(() => {
    getQCStandard();
  }, [value]);

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChangeTab}>
          <Tab label="General" value="General" />
          <Tab label="Detail" value="Detail" />
        </TabList>
      </Box>
      <TabPanel value="General" sx={{ p: 0 }}>
        <OQCGeneral />
      </TabPanel>
      <TabPanel value="Detail" sx={{ p: 0 }}>
        <OQCDetail QCStandard={QCStandard} />
      </TabPanel>
    </TabContext>
  );
};

export default TabOQC;
