import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField, MuiAutocomplete } from '@controls';
import { Box, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FGStockService, FQCStock } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const FGStock = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      WorkOrder: '',
      Model: null,
      ProductId: null,
      BuyerQR: '',
      ReceivedDate: null,
      ProductType: null,
    },
  });

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [State.page, State.pageSize]);

  async function fetchData() {
    setState({ ...State, isLoading: true });

    const params = {
      WorkOrder: State.searchData.WorkOrder,
      ModelId: State.searchData.Model,
      ProductId: State.searchData.ProductId,
      BuyerQR: State.searchData.BuyerQR,
      ReceivedDate: State.searchData.ReceivedDate,
      ProductType: State.searchData.ProductType,
      isActived: true,
      page: State.page,
      pageSize: State.pageSize,
    };

    const res = await FGStockService.getAll(params);
    if (res && isRendered)
      setState({
        ...State,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
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

  const columns = [
    { field: 'ProductId', headerName: '', flex: 0.3, hide: true },
    {
      field: 'id',
      headerName: '',
      align: 'center',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.ProductId) + 1 + (State.page - 1) * State.pageSize,
    },
    { field: 'ModelName', headerName: intl.formatMessage({ id: 'slitOrder.ModelName' }), flex: 0.4 },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'mold.ProductCode' }), flex: 0.4 },
    { field: 'ProductTypeName', headerName: intl.formatMessage({ id: 'product.product_type' }), flex: 0.4 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), flex: 0.4 },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'general.total' }),
      flex: 0.4,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
  ];

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} intl={intl} searchData={State.searchData} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 260, []);

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '12%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.product_type' })}
                fetchDataFunc={FQCStock?.getProductType}
                displayLabel="commonDetailName"
                displayValue="commonDetailId"
                onChange={(e, item) => handleSearch(item ? item.commonDetailId ?? null : null, 'ProductType')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '12%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="work_order.WO"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WorkOrder')}
              />
            </Grid>
            <Grid item style={{ width: '12%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.Model' })}
                fetchDataFunc={FGStockService.getModel}
                displayLabel="commonDetailName"
                displayValue="commonDetailId"
                onChange={(e, item) => handleSearch(item ? item.commonDetailId ?? null : null, 'Model')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '18%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'bom.ProductId' })}
                fetchDataFunc={FGStockService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item style={{ width: '20%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="BuyerQR.BuyerQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
            <Grid item style={{ width: '12%' }}>
              <MuiDateField
                disabled={State.isLoading}
                label={intl.formatMessage({ id: 'materialLot.ReceivedDate' })}
                value={State.searchData.ReceivedDate}
                onChange={(e) => handleSearch(e, 'ReceivedDate')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 0 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MuiDataGrid
        showLoading={State.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        gridHeight={736}
        rows={State.data}
        page={State.page - 1}
        pageSize={State.pageSize}
        rowCount={State.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setState({ ...State, page: newPage + 1 })}
        getRowId={(rows) => rows.ProductId}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        initialState={{ pinnedColumns: { left: ['id', 'MaterialCode'] } }}
      />
    </React.Fragment>
  );
};

const DetailPanelContent = ({ row: rowProp, intl, searchData }) => {
  let isDetailRendered = useRef(true);

  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
    ProductId: rowProp.ProductId,
  });

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      isActived: true,
      BuyerQR: rowProp.BuyerQR,
      WorkOrder: rowProp.WorkOrder,
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
      ProductId: detailPanelState.ProductId,
    };

    const res = await FGStockService.getDetail(params);
    setDetailPanelState({
      ...detailPanelState,
      data: res.Data ?? [],
      totalRow: res.TotalRow,
      isLoading: false,
    });
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.WOSemiLotFQCId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'BuyerQR.LotNo' }),
      flex: 0.4,
    },
    {
      field: 'BuyerQR',
      headerName: intl.formatMessage({ id: 'BuyerQR.BuyerQR' }),
      flex: 0.8,
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'work_order.WoCode' }),
      flex: 0.4,
    },
    {
      field: 'ActualQty',
      headerName: 'Qty (Roll/EA)',
      flex: 0.3,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'LocationCode',
      headerName: intl.formatMessage({ id: 'Location.Location' }),
      flex: 0.3,
    },
    {
      field: 'LotStatus',
      headerName: intl.formatMessage({ id: 'materialLot.LotStatus' }),
      flex: 0.5,
      renderCell: (params) => {
        return <span>{intl.formatMessage({ id: params?.row?.LotStatus })}</span>;
      },
    },
    {
      field: 'ExpirationDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ExpirationDate' }),
      flex: 0.5,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      flex: 0.3,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
      flex: 0.5,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp, searchData]);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <Box
          sx={{
            '& .sttOK': {
              backgroundColor: '#f5d742',
            },
            '& .sttExpired': {
              backgroundColor: '#D80032',
            },
          }}
        >
          <MuiDataGrid
            showLoading={detailPanelState.isLoading}
            isPagingServer={true}
            headerHeight={35}
            columns={detailPanelColumns}
            rows={detailPanelState.data}
            page={detailPanelState.page - 1}
            pageSize={detailPanelState.pageSize}
            rowCount={detailPanelState.totalRow}
            onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
            getRowId={(rows) => rows.WOSemiLotFQCId}
            initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode'], right: ['action'] } }}
            getRowClassName={(params) => {
              if (moment(params.row.ExpirationDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD'))
                return `sttExpired`;
              else if (
                moment(params.row.ExpirationDate).add(-1, 'M').format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD')
              )
                return `sttOK`;
            }}
          />
        </Box>
      </Paper>
    </Stack>
  );
};

export default FGStock;
