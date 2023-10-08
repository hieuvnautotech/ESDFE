import { MuiDialog } from '@controls';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import QCMasterPQCDetailAS from './QCMasterPQCDetailAS';
import QCMasterPQCDetailSL from './QCMasterPQCDetailSL';

const QCMasterPQCDetailDialog = ({ isOpen, onClose, QCPQCMasterId }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [value, setValue] = React.useState('tab1');

  const handleCloseDialog = () => {
    setValue('tab1');
    onClose();
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'qcPQC.Detail' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <TabContext value={value ?? 'tab1'}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label={intl.formatMessage({ id: 'qcPQC.DetailAS' })} value="tab1" />
            <Tab label={intl.formatMessage({ id: 'qcPQC.DetailSL' })} value="tab2" />
          </TabList>
        </Box>
        <TabPanel value="tab1" sx={{ p: 0, pt: 2 }}>
          <QCMasterPQCDetailAS
            QCPQCMasterId={QCPQCMasterId}
            isOpen={isOpen}
            dialogState={dialogState}
            setDialogState={setDialogState}
          />
        </TabPanel>
        <TabPanel value="tab2" sx={{ p: 0, pt: 2 }}>
          <QCMasterPQCDetailSL
            QCPQCMasterId={QCPQCMasterId}
            isOpen={isOpen}
            dialogState={dialogState}
            setDialogState={setDialogState}
          />
        </TabPanel>
      </TabContext>
    </MuiDialog>
  );
};

export default QCMasterPQCDetailDialog;
