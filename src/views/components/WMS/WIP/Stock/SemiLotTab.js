import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField, MuiAutocomplete } from '@controls';
import { Badge, Box, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { WIPStockService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PrintSemiFQC } from '@utils';

const SemiLotTab = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [rowSelected, setRowSelected] = useState([]);
  const [openDetailIds, setOpenDetailIds] = useState([]);
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      ProductType: null,
      WorkOrder: '',
      ModelName: '',
      ProductCode: '',
      SemiLotCode: '',
      ReceivedDate: null,
    },
  });

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [State.page, State.pageSize]);

  async function fetchData() {
    setOpenDetailIds([]);
    setState({ ...State, isLoading: true });

    const params = {
      ProductType: State.searchData.ProductType,
      WorkOrder: State.searchData.WorkOrder,
      ModelName: State.searchData.ModelName,
      ProductCode: State.searchData.ProductCode,
      SemiLotCode: State.searchData.SemiLotCode,
      ReceivedDate: State.searchData.ReceivedDate,
      isActived: true,
      page: State.page,
      pageSize: State.pageSize,
    };

    const res = await WIPStockService.getProductListStock(params);
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
      flex: 0.01,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.ProductId) + 1 + (State.page - 1) * State.pageSize,
    },
    { field: 'ModelName', headerName: intl.formatMessage({ id: 'slitOrder.ModelName' }), flex: 0.2 },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'mold.ProductCode' }), flex: 0.2 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), flex: 0.3 },
    { field: 'ProductTypeName', headerName: intl.formatMessage({ id: 'product.product_type' }), flex: 0.2 },
    { field: 'StockQty', headerName: intl.formatMessage({ id: 'general.Qty(R/EA)' }), flex: 0.2 },
    {
      field: 'SumActual',
      headerName: intl.formatMessage({ id: 'materialLot.StockQty' }),
      flex: 0.3,
      renderCell: (params) => {
        return <Typography sx={{ fontSize: 14 }}>{params.row.SumActual.toLocaleString()}</Typography>;
      },
    },
  ];
  const handlePrint = async () => {
    const res = await WIPStockService.GetListPrintQR(rowSelected);
    PrintSemiFQC(res.Data);
  };
  const getDetailPanelContent = React.useCallback(
    ({ row }) => (
      <DetailPanelContent row={row} intl={intl} searchData={State.searchData} getDataPrint={setRowSelected} />
    ),
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
                fetchDataFunc={WIPStockService.getProductType}
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
                label="WO.WOCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WorkOrder')}
              />
            </Grid>
            <Grid item style={{ width: '12%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.Model"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'ModelName')}
              />
            </Grid>
            <Grid item style={{ width: '12%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="mold.ProductCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'ProductCode')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
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
            <Grid item>
              <Badge badgeContent={rowSelected.length} color="warning">
                <MuiButton
                  text="print"
                  color="secondary"
                  onClick={handlePrint}
                  sx={{ mt: 0 }}
                  disabled={!rowSelected.length > 0}
                />
              </Badge>
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
        detailPanelExpandedRowIds={openDetailIds}
        onDetailPanelExpandedRowIdsChange={(ids) => setOpenDetailIds(ids)}
        initialState={{ pinnedColumns: { left: ['id', 'MaterialCode'] } }}
      />
    </React.Fragment>
  );
};

const DetailPanelContent = ({ row: rowProp, intl, searchData, getDataPrint: getDataPrint }) => {
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
      WorkOrder: rowProp.WorkOrder,
      ReceivedDate: rowProp.ReceivedDate,
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
      ProductId: detailPanelState.ProductId,
    };
    const res = await WIPStockService.getSemiLotList(params);

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
        index.api.getRowIndex(index.row.WOSemiLotMMSId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'WOCode',
      headerName: 'Work Order',
      flex: 0.3,
    },
    { field: 'SemiLotCode', headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }), flex: 0.5 },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'general.Qty(R/EA)' }),
      flex: 0.2,
      valueFormatter: (params) => (params?.value ? params?.value.toLocaleString() : null),
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.2,
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
        <Box
          sx={{
            '& .sttOK [data-field="WOCode"]': {
              backgroundColor: '#f5d742',
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
            getRowId={(rows) => rows.WOSemiLotMMSId}
            initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode'], right: ['action'] } }}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              getDataPrint(ids);
            }}
            getRowClassName={(params) => {
              if (moment(params.row.ExpirationDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD'))
                return `sttOK`;
            }}
          />
        </Box>
      </Paper>
    </Stack>
  );
};

export default SemiLotTab;
