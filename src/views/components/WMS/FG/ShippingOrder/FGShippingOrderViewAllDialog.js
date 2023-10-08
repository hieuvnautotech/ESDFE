import { MuiDialog } from '@controls';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { FGShippingOrderService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const FGShippingOrderViewAllDialog = ({ isOpen, onClose, FGSOModel }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
  });

  //useEffect
  useEffect(() => {
    if (isOpen && FGSOModel?.FGSOId != null) fetchData();
    return () => {
      isRendered = false;
    };
  }, [isOpen, FGSOModel]);

  async function fetchData() {
    setState({ ...state, isLoading: true });

    const res = await FGShippingOrderService.getAllBuyerQRList({ FGSOId: FGSOModel.FGSOId });

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        isLoading: false,
      });
  }

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
      fontSize: '14px',
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
      title={'View Detail'}
      isOpen={isOpen}
      disabledCloseBtn={state.isLoading}
      disable_animate={300}
      onClose={onClose}
      isShowButtonPrint
    >
      <Grid container flexDirection="row" alignItems="center" justifyContent="center" textAlign="center">
        <Grid item xs={3} md={3} sx={{ ...style.titleMain, borderRight: 'none' }}>
          <Typography sx={{ fontSize: '30px', fontWeight: 800 }}>ESD</Typography>
        </Grid>
        <Grid item xs={5.5} md={5.5} style={style.titleMain}>
          <Typography sx={{ fontSize: '25px', fontWeight: 700 }}>FG SHIPPING: {FGSOModel?.FGSOCode}</Typography>
        </Grid>
        <Grid item xs={3.5} md={3.5} sx={{ border: '1px solid #4e4e4e8f', height: '60px', borderLeft: 'none' }}>
          <Box sx={{ borderBottom: '1px solid #4e4e4e8f' }}>
            <Typography sx={{ fontSize: '18px' }}>
              {intl.formatMessage({ id: 'FGSO.DeliveryDate' })}: {moment(FGSOModel?.DeliveryDate).format('YYYY-MM-DD')}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '18px' }}>
              {intl.formatMessage({ id: 'general.createdName' })}: {FGSOModel?.createdName}
            </Typography>
          </Box>
        </Grid>
        <Typography sx={{ fontSize: '20px', fontWeight: 600, mt: 3, mb: 1, textAlign: 'right' }}>
          BuyerQR List
        </Typography>
        {state.data && state.data.length > 0 && (
          <TableContainer>
            <Table sx={{ minWidth: 500 }}>
              <TableBody>
                <TableRow sx={{ backgroundColor: '#ececec' }}>
                  <TableCell style={{ ...style.titleCell, textAlign: 'center' }}>#</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'BoxQR.BoxQR' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'BoxQR.BuyerQR' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'WO.ProductCode' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'general.createdDate' })}</TableCell>
                  <TableCell style={style.titleCell}>{intl.formatMessage({ id: 'BoxQR.ActualQty' })}</TableCell>
                </TableRow>
                {state.data.map((item, index) => {
                  return (
                    <TableRow key={`key_${index}`}>
                      <TableCell style={{ ...style.dataCell, textAlign: 'center' }}>{index + 1}</TableCell>
                      <TableCell style={style.dataCell}>{item?.BoxQR}</TableCell>
                      <TableCell style={style.dataCell}>{item?.BuyerQR}</TableCell>
                      <TableCell style={style.dataCell}>{item?.ProductCode}</TableCell>
                      <TableCell style={style.dataCell}>{moment(item?.BoxShipDate).format('YYYY-MM-DD')}</TableCell>
                      <TableCell style={{ ...style.dataCell, textAlign: 'right' }}>{item?.PackingAmount}</TableCell>
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

export default FGShippingOrderViewAllDialog;
