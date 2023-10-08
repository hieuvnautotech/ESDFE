import { MuiButton, MuiDataGrid, MuiDialog } from '@controls';
import { Grid, TextField } from '@mui/material';
import { BuyerMappingService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const BuyerCodeDialog = ({ isOpen, onClose, setDataMapping }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [data, setData] = useState([]);
  const semiInputRef = useRef();
  const buyerInputRef = useRef();

  const columns = [
    {
      field: 'LotStatusName',
      headerName: intl.formatMessage({ id: 'general.status' }),
      valueFormatter: (params) => (params?.value ? intl.formatMessage({ id: params?.value }) : null),
      flex: 0.3,
    },
    {
      field: 'BuyerQR',
      headerName: intl.formatMessage({ id: 'BuyerQR.BuyerQR' }),
      flex: 0.6,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.6,
    },
    {
      field: 'WorkOrder',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      flex: 0.3,
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      flex: 0.2,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'product.product_code' }),
      flex: 0.3,
    },
  ];

  const inputChangeSemi = (e) => {
    semiInputRef.current.value = e.target.value;
  };

  const inputChangeBuyer = (e) => {
    buyerInputRef.current.value = e.target.value;
  };

  const keyPressSemi = async (e) => {
    if (e.key === 'Enter') {
      await handleGetBuyerQR();
    }
  };

  const handleGetBuyerQR = async (e) => {
    const lot = semiInputRef.current.value.trim() ?? '';
    if (lot != '') {
      var res = await BuyerMappingService.getBuyerQR(lot);
      if (res.Data && res.HttpResponseCode === 200) {
        setData([res.Data]);
        buyerInputRef.current.focus();
      } else {
        setData([]);
        semiInputRef.current.value = '';
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    }
  };

  const keyPressBuyer = async (e) => {
    if (e.key === 'Enter') {
      await handleChangeBuyerQR();
    }
  };

  const handleChangeBuyerQR = async () => {
    const semi = semiInputRef.current.value.trim();
    const buyer = buyerInputRef.current.value.trim();
    if (semi != '' && buyer != '') {
      const res = await BuyerMappingService.changeBuyerQR({ BuyerQR: buyer, SemiLotCode: semi });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setData([]);

        buyerInputRef.current.value = '';
        semiInputRef.current.value = '';
        semiInputRef.current.focus();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));

        buyerInputRef.current.value = '';
        buyerInputRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    const semi = semiInputRef.current.value.trim();
    const buyer = buyerInputRef.current.value.trim();

    if (semi != '' && buyer != '') {
      handleChangeBuyerQR();
    } else if (semi != '') {
      handleGetBuyerQR();
    } else if (semi != '' && data.length > 0) {
      buyer.current.focus();
    } else {
      semiInputRef.current.focus();
    }
  };

  const handleCloseDialog = () => {
    setData([]);
    onClose();
  };

  return (
    <MuiDialog
      maxWidth="lg"
      title={intl.formatMessage({ id: 'BuyerQR.ChangeBuyerQR' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ pt: 1 }}>
        <Grid item xs={4}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            name="SemiLotCode"
            disabled={dialogState.isSubmit}
            inputRef={semiInputRef}
            onChange={inputChangeSemi}
            onKeyDown={keyPressSemi}
            label={intl.formatMessage({ id: 'BuyerQR.BuyerQR' }) + ' *'}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size="small"
            name="BuyerQR"
            disabled={dialogState.isSubmit}
            inputRef={buyerInputRef}
            onChange={inputChangeBuyer}
            onKeyDown={keyPressBuyer}
            label={intl.formatMessage({ id: 'BuyerQR.ChangeBuyerQR' }) + ' *'}
          />
        </Grid>
        <Grid item xs={4}>
          <MuiButton text="scan" color="info" sx={{ mt: 0 }} onClick={handleSubmit} />
        </Grid>
        <Grid item xs={12}>
          <MuiDataGrid
            isPagingServer={true}
            headerHeight={40}
            columns={columns}
            rows={data}
            page={0}
            pageSize={5}
            rowCount={data.length}
            getRowId={(rows) => rows.WOSemiLotFQCId}
            hideFooter
          />
        </Grid>
      </Grid>
    </MuiDialog>
  );
};

export default BuyerCodeDialog;
