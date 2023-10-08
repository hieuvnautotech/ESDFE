import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField, MuiAutocomplete, MuiTextField } from '@controls';
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FGMappingService } from '@services';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import moment from 'moment';
import { ErrorAlert, SuccessAlert, PrintBoxQR } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import DeleteIcon from '@mui/icons-material/Delete';

const FGMapping = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const lotInputRef = useRef();
  const [BuyerQRList, setBuyerQRList] = useState([]);
  const [BoxQR, setBoxQR] = useState('');
  const [Print, setPrint] = useState([]);
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
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
    pageSize: 10,
  });

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [State.page, State.pageSize]);

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
      ProductId: State.searchData.ProductId,
      BoxQR: State.searchData.BoxQR,
      BuyerQR: State.searchData.BuyerQR,
      SearchDate: State.searchData.createdDate,
      page: State.page,
      pageSize: State.pageSize,
    };

    const res = await FGMappingService.getAll(params);
    if (res && isRendered)
      setState({
        ...State,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  async function fetchDataDetail() {
    const params = {
      BoxQR: BoxQR,
      BuyerQR: State.searchData.BuyerQR,
      page: StateDetail.page,
      pageSize: StateDetail.pageSize,
    };

    const res = await FGMappingService.getDetail(params);
    if (res && isRendered)
      setStateDetail({
        ...StateDetail,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
      });
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...State.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...State, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...State, searchData: { ...newSearchData } });
    }
  };

  const scanColumns = [
    { field: 'BuyerQRId', headerName: '', flex: 0.3, hide: true },
    {
      field: 'action',
      headerName: '',
      width: 80,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'id',
      headerName: '',
      align: 'center',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.BuyerQRId) + 1 + (State.page - 1) * State.pageSize,
    },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'WO.ProductCode' }), flex: 0.2 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), flex: 0.4 },
    { field: 'BuyerQR', headerName: intl.formatMessage({ id: 'BoxQR.BuyerQR' }), flex: 0.4 },
    {
      field: 'PackingAmount',
      headerName: intl.formatMessage({ id: 'BoxQR.ActualQty' }),
      flex: 0.4,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

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
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'WO.ProductCode' }), flex: 0.4 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), flex: 0.4 },
    { field: 'BoxQR', headerName: intl.formatMessage({ id: 'BoxQR.BoxQR' }), flex: 0.5 },
    {
      field: 'BoxStatusName',
      headerName: intl.formatMessage({ id: 'BoxQR.BoxStatus' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? intl.formatMessage({ id: params?.value }) : null),
    },
    {
      field: 'PackingAmount',
      headerName: intl.formatMessage({ id: 'BoxQR.ActualQty' }),
      flex: 0.2,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'UnMapping',
      headerName: 'Un Map',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          params.row.BoxStatus == '001' && (
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <IconButton
                  color="info"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid skyblue' } }]}
                  onClick={() => handleUnMapping(params.row)}
                >
                  <LinkOffIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          )
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
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'materialLot.LotNo' }),
      width: 150,
    },
    {
      field: 'PackingAmount',
      headerName: intl.formatMessage({ id: 'BoxQR.ActualQty' }),
      width: 80,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
  ];

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
    const index = _.findIndex(BuyerQRList, function (o) {
      return o.BuyerQR == lot;
    });

    if (index !== -1) {
      ErrorAlert(intl.formatMessage({ id: 'BuyerQR.Error_BuyerQRScanned' }));
    } else {
      setState({ ...State, isSubmit: true });
      let BuyerQRFirst = BuyerQRList[0]?.BuyerQR;
      const res = await FGMappingService.scanBuyerQR({ FirstBuyerQR: BuyerQRFirst, BuyerQR: lot });

      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setBuyerQRList([res.Data, ...BuyerQRList]);
        setState({ ...State, isSubmit: false });
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setState({ ...State, isSubmit: false });
      }
    }

    lotInputRef.current.value = '';
    lotInputRef.current.focus();
  };

  const handleDelete = (row) => {
    let newArr = BuyerQRList.filter((x) => x.BuyerQR != row.BuyerQR);
    setBuyerQRList(newArr);
  };

  const handleCreate = async () => {
    setState({ ...State, isSubmit: true });
    const res = await FGMappingService.createBuyerQR(BuyerQRList);

    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setBuyerQRList([]);
      fetchData();
      setState({ ...State, isSubmit: false });
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setState({ ...State, isSubmit: false });
    }
  };

  const handleUnMapping = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'BoxQR.confirm_unmapping' }))) {
      try {
        let res = await FGMappingService.unMapping(item);
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

  const handlePrint = async () => {
    const res = await FGMappingService.getPrint(Print);
    PrintBoxQR(res.Data);
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
              label={intl.formatMessage({ id: 'BoxQR.BuyerQR' })}
            />
          </Grid>
          <Grid item>
            <MuiButton text="scan" color="info" onClick={scanBtnClick} sx={{ ml: 1, mr: 1, marginTop: '10px' }} />
          </Grid>
          <Grid item>
            <MuiButton
              text="reset"
              color="warning"
              onClick={() => setBuyerQRList([])}
              sx={{ ml: 1, mr: 1, marginTop: '10px' }}
              disabled={BuyerQRList.length > 0 ? false : true}
            />
          </Grid>
          <Grid item>
            <MuiButton
              text="confirm"
              color="success"
              onClick={handleCreate}
              sx={{ ml: 1, mr: 1, marginTop: '10px' }}
              disabled={BuyerQRList.length > 0 ? false : true}
            />
          </Grid>
        </Grid>
      </Grid>
      <MuiDataGrid
        isPagingServer={true}
        headerHeight={40}
        columns={scanColumns}
        gridHeight={320}
        rows={BuyerQRList}
        pageSize={8}
        getRowId={(rows) => rows.BuyerQRId}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        hideFooter
      />
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end" sx={{ mt: 1, mb: 1 }}>
        <Grid item xs={3}>
          <MuiButton
            text="print"
            color="info"
            onClick={handlePrint}
            sx={{ ml: 1, mr: 1, marginTop: '10px' }}
            disabled={Print.length > 0 ? false : true}
          />
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'materialSO.ProductId' })}
                fetchDataFunc={FGMappingService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="standard"
                label="BoxQR.BoxQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BoxQR')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="standard"
                label="BoxQR.BuyerQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiDateField
                disabled={State.isLoading}
                label={intl.formatMessage({ id: 'general.createdDate' })}
                value={State.searchData.createdDate}
                onChange={(e) => handleSearch(e, 'createdDate')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="space-between" columnSpacing={2}>
        <Grid item xs={6}>
          <MuiDataGrid
            checkboxSelection
            showLoading={State.isLoading}
            isPagingServer={true}
            headerHeight={40}
            columns={boxColumns}
            gridHeight={400}
            rows={State.data}
            page={State.page - 1}
            pageSize={State.pageSize}
            rowCount={State.totalRow}
            onRowClick={(params) => {
              setBoxQR(params.row.BoxQR);
              setStateDetail({
                data: [],
                totalRow: 0,
                page: 1,
                pageSize: 10,
              });
            }}
            onPageChange={(newPage) => setState({ ...State, page: newPage + 1 })}
            getRowId={(rows) => rows.BoxQR}
            onSelectionModelChange={(ids) => setPrint(ids)}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiDataGrid
            showLoading={State.isLoading}
            isPagingServer={true}
            headerHeight={40}
            columns={buyerColumns}
            gridHeight={400}
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
};

export default FGMapping;
