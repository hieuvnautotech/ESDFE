import { MuiButton, MuiDataGrid, MuiTextField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton } from '@mui/material';
import { FGShippingOrderService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export default function FGShippingOrderBoxQR({ FGSOId, isActivedRow }) {
  const intl = useIntl();
  let isRendered = useRef(true);
  const lotInputRef = useRef();
  const [BoxQR, setBoxQR] = useState('');
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 13,
    searchData: {
      ProductId: null,
      BoxQR: '',
      BuyerQR: '',
      createdDate: null,
    },
  });

  const [StateDetail, setStateDetail] = useState({
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 13,
  });

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [State.page, State.pageSize, FGSOId]);

  useEffect(() => {
    fetchDataDetail();
    return () => {
      isRendered = false;
    };
  }, [StateDetail.page, StateDetail.pageSize, BoxQR]);

  async function fetchData() {
    setState({ ...State, isLoading: true });
    setBoxQR('');

    const params = {
      FGSOId: FGSOId,
      page: State.page,
      pageSize: State.pageSize,
    };

    const res = await FGShippingOrderService.getBoxQRList(params);
    if (res && isRendered)
      setState({
        ...State,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  async function fetchDataDetail() {
    setStateDetail({ ...StateDetail, isLoading: true });

    const params = {
      BoxQR: BoxQR,
      page: State.page,
      pageSize: State.pageSize,
    };

    const res = await FGShippingOrderService.getBuyerQRList(params);
    if (res && isRendered)
      setStateDetail({
        ...StateDetail,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const boxColumns = [
    { field: 'ProductId', headerName: '', flex: 0.3, hide: true },
    {
      field: 'id',
      headerName: '',
      align: 'center',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.BoxQR) + 1 + (State.page - 1) * State.pageSize,
    },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'WO.ProductCode' }), flex: 0.3 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), flex: 0.4 },
    { field: 'BoxQR', headerName: intl.formatMessage({ id: 'BoxQR.BoxQR' }), flex: 0.6 },
    {
      field: 'PackingAmount',
      headerName: intl.formatMessage({ id: 'BoxQR.ActualQty' }),
      flex: 0.2,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'Delete',
      headerName: 'Delete',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      hide: !isActivedRow,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDeleteBoxQR(params.row)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  const buyerColumns = [
    { field: 'BoxId', headerName: '', flex: 0.3, hide: true },
    {
      field: 'id',
      headerName: '',
      align: 'center',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.BoxId) + 1 + (State.page - 1) * State.pageSize,
    },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'WO.ProductCode' }), flex: 0.3 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), flex: 0.4 },
    { field: 'BuyerQR', headerName: intl.formatMessage({ id: 'BoxQR.BuyerQR' }), flex: 0.6 },
    {
      field: 'PackingAmount',
      headerName: intl.formatMessage({ id: 'BoxQR.ActualQty' }),
      flex: 0.2,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
  ];

  const handleDeleteBoxQR = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await FGShippingOrderService.deleteBoxQR(item);
        if (res && res.HttpResponseCode === 200) {
          await fetchData();
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLotInputChange = (e) => {
    lotInputRef.current.value = e.target.value;
  };

  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };

  const scanBtnClick = async () => {
    const lot = lotInputRef.current.value.trim();
    const res = await FGShippingOrderService.scanBoxQR({ FGSOId: FGSOId, BoxQR: lot });

    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      await fetchData();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
    }

    lotInputRef.current.value = '';
    lotInputRef.current.focus();
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid container direction="row">
          <Grid item>
            <MuiTextField
              size="small"
              ref={lotInputRef}
              sx={{ mt: 1, width: 350 }}
              onChange={handleLotInputChange}
              onKeyDown={keyPress}
              disabled={FGSOId ? false : true}
              label={intl.formatMessage({ id: 'BoxQR.BoxQR' })}
            />
          </Grid>
          <Grid item>
            <MuiButton
              text="scan"
              color="info"
              onClick={scanBtnClick}
              sx={{ ml: 1, mr: 1, marginTop: '10px' }}
              disabled={FGSOId ? false : true}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction="row" justifyContent="space-between" columnSpacing={2}>
        <Grid item xs={6}>
          <MuiDataGrid
            showLoading={State.isLoading}
            isPagingServer={true}
            headerHeight={40}
            columns={boxColumns}
            gridHeight={380}
            rows={State.data}
            page={State.page - 1}
            pageSize={State.pageSize}
            rowCount={State.totalRow}
            onRowClick={(params) => setBoxQR(params.row.BoxQR)}
            onPageChange={(newPage) => setState({ ...State, page: newPage + 1 })}
            getRowId={(rows) => rows.BoxQR}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiDataGrid
            showLoading={State.isLoading}
            isPagingServer={true}
            headerHeight={40}
            columns={buyerColumns}
            gridHeight={380}
            rows={StateDetail.data}
            page={StateDetail.page - 1}
            pageSize={StateDetail.pageSize}
            rowCount={StateDetail.totalRow}
            onPageChange={(newPage) => setStateDetail({ ...StateDetail, page: newPage + 1 })}
            getRowId={(rows) => rows.BoxId}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
