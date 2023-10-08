import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField, MuiAutocomplete } from '@controls';
import { Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FQCStockService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const FQCStock = (props) => {
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
      LotStatus: '',
      Model: null,
      ProductId: null,
      SemiLotCode: '',
      ReceivedDate: null,
      ProductType: null,
      BuyerQR: null,
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
      SemiLotCode: State.searchData.SemiLotCode,
      ReceivedDate: State.searchData.ReceivedDate,
      LotStatus: State.searchData.LotStatus,
      ProductType: State.searchData.ProductType,
      BuyerQR: State.searchData.BuyerQR,
      isActived: true,
      page: State.page,
      pageSize: State.pageSize,
    };

    const res = await FQCStockService.getAll(params);
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
    { field: 'ModelName', headerName: intl.formatMessage({ id: 'slitOrder.ModelName' }), width: 200 },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'mold.ProductCode' }), width: 200 },
    { field: 'ProductTypeName', headerName: intl.formatMessage({ id: 'product.product_type' }), width: 200 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), width: 250 },
    {
      field: 'Waiting',
      headerName: intl.formatMessage({ id: 'FQCStock.FQCStock010' }),
      width: 150,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    // {
    //   field: 'Checking',
    //   headerName: intl.formatMessage({ id: 'FQCStock.FQCStock016' }),
    //   width: 150,
    //   align: 'right',
    //   valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    // },
    {
      field: 'Checking',
      headerName: intl.formatMessage({ id: 'FQCStock.FQCStock009' }),
      width: 100,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'WaitingCheckOQC',
      headerName: intl.formatMessage({ id: 'FQCStock.WaitingCheckOQC' }),
      width: 160,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'OQCOK',
      headerName: intl.formatMessage({ id: 'FQCStock.OQCOK' }),
      width: 100,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'Packed',
      headerName: intl.formatMessage({ id: 'FQCStock.Packed' }),
      width: 150,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'Sorting',
      headerName: intl.formatMessage({ id: 'FQCStock.Sorting' }),
      width: 150,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'Total',
      headerName: intl.formatMessage({ id: 'FQCStock.Total' }),
      width: 150,
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
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={11} md={11}>
          <Grid container columnSpacing={2} direction="row" justifyContent="start" alignItems="center">
            <Grid item xs={2} md={2}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.product_type' })}
                fetchDataFunc={FQCStockService.getProductType}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailId"
                onChange={(e, item) => handleSearch(item ? item.commonDetailId ?? null : null, 'ProductType')}
                variant="standard"
              />
            </Grid>

            <Grid item xs={2} md={2}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.Model' })}
                fetchDataFunc={FQCStockService.getModel}
                displayLabel="ModelCode"
                displayValue="ModelId"
                onChange={(e, item) => handleSearch(item ? item.commonDetailId ?? null : null, 'Model')}
                variant="standard"
              />
            </Grid>
            <Grid item xs={2} md={2}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'bom.ProductId' })}
                fetchDataFunc={FQCStockService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item xs={2} md={2}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="work_order.WoCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WorkOrder')}
              />
            </Grid>
            <Grid item xs={2} md={2}>
              <MuiDateField
                disabled={State.isLoading}
                label={intl.formatMessage({ id: 'general.createdDate' })}
                value={State.searchData.ReceivedDate}
                onChange={(e) => handleSearch(e, 'ReceivedDate')}
                variant="standard"
              />
            </Grid>
            <Grid item xs={2} md={2}>
              <MuiAutocomplete
                translationLabel
                label={intl.formatMessage({ id: 'materialLot.LotStatus' })}
                fetchDataFunc={() => FQCStockService.getStatus()}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailId"
                onChange={(e, item) => handleSearch(item ? item.commonDetailCode ?? null : null, 'LotStatus')}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item xs={4} md={4}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item xs={4} md={4}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="BuyerQR.BuyerQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1} md={1}>
          <MuiButton text="search" color="info" onClick={fetchData} />
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
        //initialState={{ pinnedColumns: { left: ['id', 'MaterialCode'] } }}
      />
    </React.Fragment>
  );
};

const DetailPanelContent = ({ row: rowProp, intl, searchData }) => {
  // console.log('SASASASAS', rowProp);
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
      SemiLotCode: rowProp.SemiLotCode,
      BuyerQR: rowProp.BuyerQR,
      WorkOrder: rowProp.WorkOrder,
      LotStatus: rowProp.LotStatus,
      createdDateSearch: rowProp.createdDate,
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
      ProductId: detailPanelState.ProductId,
    };

    const res = await FQCStockService.getDetail(params);

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
      field: 'WOCode',
      headerName: 'Work Order',
      width: 200,
    },
    { field: 'SemiLotCode', headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }), width: 330 },
    { field: 'BuyerQR', headerName: intl.formatMessage({ id: 'BuyerQR.BuyerQR' }), width: 330 },
    {
      field: 'ActualQty',
      headerName: 'Qty (Roll/EA)',
      width: 160,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'LotStatusName',
      headerName: intl.formatMessage({ id: 'materialLot.LotStatus' }),
      width: 180,
      renderCell: (params) => {
        return <span>{intl.formatMessage({ id: params?.row?.LotStatusName })}</span>;
      },
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 160,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'ExpirationDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ExpirationDate' }),
      flex: 0.2,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
  ];

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp, searchData]);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
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
          //initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode'], right: ['action'] } }}
        />
      </Paper>
    </Stack>
  );
};

export default FQCStock;
