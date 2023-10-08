import { MuiDialog } from '@controls';
import { Button, Grid, IconButton, TextField } from '@mui/material';
import { SlitOrderService, WOService, qcPQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import CheckIcon from '@mui/icons-material/Check';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import WOMold from './Mapping/WOMold';
import WOStaff from './Mapping/WOStaff';
import WOLine from './Mapping/WOLine';
import WOMoldStaffLine from './Mapping/WOMoldStaffLine';
import WOSemiLot from './Mapping/WOSemiLot';
import { useModal, useModal2, useModal3 } from '@basesShared';

const WOProcessMappingDialog = ({ RowCheck, isOpen, onClose }) => {
  console.log(RowCheck, 'RowCheck********');
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const { isShowing3, toggle3 } = useModal3();
  const [isShowing4, setIsShowing4] = useState(false);
  const [isShowing5, setIsShowing5] = useState(false);

  function toggle4() {
    setIsShowing4(!isShowing4);
  }
  function toggle5() {
    setIsShowing5(!isShowing5);
  }
  const handleCloseDialog = () => {
    onClose();
  };
  const handleCheckNewMoldWorkerMachine = async (item) => {
    try {
      let res = await WOService.getCheckNewMoldWorkerMachine(item);
      if (res && res.HttpResponseCode === 200) {
        toggle5();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MuiDialog
      maxWidth="md"
      title={intl.formatMessage({ id: 'WO.compositeMaterialMapping' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <RemoveRedEyeOutlinedIcon
              fontSize="inherit"
              sx={{ marginRight: '1rem', fontSize: '20px', cursor: 'pointer' }}
              onClick={() => toggle4()}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => toggle()}
              sx={{ paddingTop: '3px', paddingBottom: '3px', marginRight: '10px' }}
            >
              <CheckIcon fontSize="20px" sx={{ marginRight: '8px' }} /> {intl.formatMessage({ id: 'WO.mold' })}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => toggle2()}
              sx={{ paddingTop: '3px', paddingBottom: '3px', marginRight: '10px' }}
            >
              <CheckIcon fontSize="inherit" sx={{ marginRight: '8px' }} /> {intl.formatMessage({ id: 'WO.staff' })}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => toggle3()}
              sx={{ paddingTop: '3px', paddingBottom: '3px', marginRight: '10px' }}
            >
              <CheckIcon fontSize="inherit" sx={{ marginRight: '8px' }} /> {intl.formatMessage({ id: 'WO.machine' })}
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            name="ProductCode"
            type="text"
            disabled
            value={RowCheck?.ProductCode + ' - ' + RowCheck?.ProductName ?? ''}
            label={intl.formatMessage({ id: 'WO.ProductCode' })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            name="ProcessCode"
            type="text"
            disabled
            value={RowCheck?.ProcessCode ?? ''}
            label={intl.formatMessage({ id: 'WO.ProcessCode' })}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <ArrowForwardIosIcon
              fontSize="inherit"
              sx={{ marginRight: '1rem', fontSize: '30px', cursor: 'pointer' }}
              // onClick={() => toggle5()}
              onClick={() => handleCheckNewMoldWorkerMachine(RowCheck?.WOProcessId)}
            />
          </Grid>
        </Grid>
      </Grid>
      <WOMold WOProcessId={RowCheck?.WOProcessId} isOpen={isShowing} onClose={toggle} />
      <WOStaff WOProcessId={RowCheck?.WOProcessId} isOpen={isShowing2} onClose={toggle2} />
      <WOLine WOProcessId={RowCheck?.WOProcessId} isOpen={isShowing3} onClose={toggle3} />
      <WOMoldStaffLine WOProcessId={RowCheck?.WOProcessId} isOpen={isShowing4} onClose={toggle4} />
      <WOSemiLot WOProcessId={RowCheck?.WOProcessId} isOpen={isShowing5} onClose={toggle5} />
    </MuiDialog>
  );
};
export default WOProcessMappingDialog;
