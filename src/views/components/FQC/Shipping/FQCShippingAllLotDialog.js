import { MuiDialog } from '@controls';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { FQCShippingService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const FQCShippingAllLotDialog = ({ isOpen, onClose, RMModel }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const lotInputRef = useRef();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
  });

  //useEffect
  useEffect(() => {
    if (isOpen && RMModel?.FQCSOId != null) fetchData();
    return () => {
      isRendered = false;
    };
  }, [isOpen, RMModel?.FQCSOId]);

  async function fetchData() {
    setState({ ...state, isLoading: true });

    const res = await FQCShippingService.getFQCSODetailAll({
      FQCSOId: RMModel?.FQCSOId,
      page: 0,
      pageSize: 0,
      isActived: true,
    });

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
          <Typography sx={{ fontSize: '25px', fontWeight: 700 }}>
            {intl.formatMessage({ id: 'FQCSO.FQCSOName' })}: {RMModel?.FQCSOName}
          </Typography>
        </Grid>
        <Grid item xs={3.5} md={3.5} sx={{ border: '1px solid #4e4e4e8f', height: '60px', borderLeft: 'none' }}>
          <Box sx={{ borderBottom: '1px solid #4e4e4e8f' }}>
            <Typography sx={{ fontSize: '18px' }}>
              {intl.formatMessage({ id: 'FQCSO.ShippingDate' })}: {moment(RMModel?.ShippingDate).format('YYYY-MM-DD')}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '18px' }}>
              {intl.formatMessage({ id: 'general.createdName' })}: {RMModel?.createdName}
            </Typography>
          </Box>
        </Grid>
        <Typography sx={{ fontSize: '20px', fontWeight: 600, mt: 3, mb: 1, textAlign: 'right' }}>
          Material Lot List
        </Typography>
        {state.data && state.data.length > 0 && (
          <TableContainer>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableBody>
                <TableRow sx={{ backgroundColor: '#ececec' }}>
                  <TableCell style={{ ...style.titleCell, textAlign: 'center' }}>#</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'materialSO.ProductId' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'product.product_name' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'WO.SemiLotCode' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'materialLot.LotStatus' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'work_order.ActualQty' })}</TableCell>
                </TableRow>
                {state.data.map((item, index) => {
                  return (
                    <TableRow key={`MATERIALDetail_${index}`}>
                      <TableCell style={{ ...style.dataCell, textAlign: 'center' }}>{index + 1}</TableCell>
                      <TableCell style={style.dataCell}>{item?.ProductCode}</TableCell>
                      <TableCell style={style.dataCell}>{item?.ProductName}</TableCell>
                      <TableCell style={style.dataCell}>{item?.SemiLotCode}</TableCell>
                      <TableCell style={style.dataCell}>{item?.LotStatus ? 'Received' : 'Waiting'}</TableCell>
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

export default FQCShippingAllLotDialog;
