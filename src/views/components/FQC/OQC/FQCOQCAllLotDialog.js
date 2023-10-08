import { MuiDialog } from '@controls';
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { FQCOQCService } from '@services';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const FQCOQCAllLotDialog = ({ isOpen, onClose, RMModel }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
  });

  //useEffect
  useEffect(() => {
    if (isOpen && RMModel?.PressLotCode != null) fetchData();
    return () => {
      isRendered = false;
    };
  }, [isOpen, RMModel?.PressLotCode]);

  async function fetchData() {
    setState({ ...state, isLoading: true });

    const params = {
      PressLotCode: RMModel?.PressLotCode,
      page: 0,
      pageSize: 0,
    };
    const res = await FQCOQCService.getDetail(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        isLoading: false,
      });
  }

  const handleCloseDialog = () => {
    onClose();
  };

  const style = {
    titleCell: {
      padding: '8px',
      border: '1px solid #4e4e4e8f',
      fontWeight: 600,
      fontSize: '20px',
    },
    dataCell: {
      padding: '8px',
      border: '1px solid #4e4e4e8f',
      fontSize: '18px',
    },
    titleMain: {
      border: '1px solid #4e4e4e8f',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60px',
    },
    styleBorderAndCenter: {
      borderRight: '1px solid #4e4e4e8f',
      textAlign: 'center',
    },
    borderBot: {
      borderBottom: '1px solid #4e4e4e8f',
      padding: '10px',
    },
  };

  return (
    <MuiDialog
      maxWidth="lg"
      title={'Lot Detail'}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
      isShowButtonPrint
    >
      <Grid container flexDirection="row" alignItems="center" justifyContent="center" textAlign="center">
        <Grid item xs={3} md={3} sx={{ ...style.titleMain, borderRight: 'none' }}>
          <Typography sx={{ fontSize: '30px', fontWeight: 800 }}>ESD</Typography>
        </Grid>
        <Grid item xs={5.5} md={5.5} style={style.titleMain}>
          <Typography sx={{ fontSize: '25px', fontWeight: 700 }}>{RMModel?.PressLotCode}</Typography>
        </Grid>
        <Grid item xs={3.5} md={3.5} sx={{ height: '60px' }}>
          <Typography style={{ ...style.titleMain, borderLeft: 'none' }}>
            {intl.formatMessage({ id: 'general.checkqc' })}:
            {RMModel?.CheckResult != null
              ? RMModel?.CheckResult
                ? 'OK'
                : 'NG'
              : intl.formatMessage({ id: 'IQCReceiving.NotYet' })}
          </Typography>
        </Grid>
        <Typography sx={{ fontSize: '20px', fontWeight: 600, mt: 3, mb: 1, textAlign: 'right' }}>
          Material Lot List
        </Typography>
        {state.data && state.data.length > 0 && (
          <TableContainer>
            <Table sx={{ minWidth: 500 }}>
              <TableBody>
                <TableRow sx={{ backgroundColor: '#ececec' }}>
                  <TableCell style={{ ...style.titleCell, textAlign: 'center' }}>#</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'WO.SemiLotCode' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'BuyerQR.BuyerQR' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'work_order.ActualQty' })}</TableCell>
                </TableRow>
                {state.data.map((item, index) => {
                  return (
                    <TableRow key={`MATERIALDetail_${index}`}>
                      <TableCell style={{ ...style.dataCell, textAlign: 'center' }}>{index + 1}</TableCell>
                      <TableCell style={style.dataCell}>{item?.SemiLotCode}</TableCell>
                      <TableCell style={style.dataCell}>{item?.BuyerQR}</TableCell>
                      <TableCell style={{ ...style.dataCell, textAlign: 'right' }}>{item?.ActualQty}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </MuiDialog>
  );
};

export default FQCOQCAllLotDialog;
