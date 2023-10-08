import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import { Badge, Box, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { MaterialStockService, IQCReceivingService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PrintMaterial } from '@utils';

const MaterialOKTab = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [rowSelected, setRowSelected] = useState([]);
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      MaterialCode: '',
      MaterialLotCode: '',
      LotNo: '',
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
    setState({ ...State, isLoading: true });
    const params = {
      MaterialCode: State.searchData.MaterialCode,
      MaterialLotCode: State.searchData.MaterialLotCode,
      ReceivedDate: State.searchData.ReceivedDate,
      LotNo: State.searchData.LotNo,
      isActived: true,
      page: State.page,
      pageSize: State.pageSize,
    };
    const res = await MaterialStockService.getMaterialList(params);
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
    { field: 'MaterialId', headerName: '', flex: 0.3, hide: true },
    {
      field: 'id',
      headerName: '',
      width: 50,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialId) + 1 + (State.page - 1) * State.pageSize,
    },
    { field: 'MaterialCode', headerName: intl.formatMessage({ id: 'materialLot.MaterialCode' }), flex: 0.2 },
    { field: 'MaterialName', headerName: intl.formatMessage({ id: 'material.MaterialName' }), flex: 0.15 },
    { field: 'MaterialUnit', headerName: intl.formatMessage({ id: 'material.Unit' }), flex: 0.1 },
    {
      field: 'StockQty',
      headerName: intl.formatMessage({ id: 'materialLot.StockQty' }),
      flex: 0.1,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'TotalStock',
      headerName: intl.formatMessage({ id: 'materialLot.TotalStock' }),
      flex: 0.1,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
  ];
  const handlePrint = async () => {
    const list = await IQCReceivingService.PrintMaterialLot(rowSelected);
    PrintMaterial(list.Data);
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
        <Grid item xs={3}></Grid>
        <Grid item xs>
          <Grid container columnSpacing={1} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '18%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="materialLot.LotNo"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'LotNo')}
              />
            </Grid>
            <Grid item style={{ width: '18%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="materialLot.MaterialCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialCode')}
              />
            </Grid>
            <Grid item style={{ width: '18%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="materialLot.MaterialLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialLotCode')}
              />
            </Grid>
            <Grid item style={{ width: '18%' }}>
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
        getRowId={(rows) => rows.MaterialId}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
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
    MaterialId: rowProp.MaterialId,
  });

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      isActived: true,
      MaterialLotCode: rowProp.MaterialLotCode,
      LotNo: rowProp.LotNo,
      ReceivedDate: rowProp.ReceivedDate,
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
      MaterialId: detailPanelState.MaterialId,
    };

    const res = await MaterialStockService.getMaterialLotList(params);

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
        index.api.getRowIndex(index.row.MaterialLotId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      width: 300,
    },
    {
      field: 'POOrderCode',
      headerName: intl.formatMessage({ id: 'PO.POOrderCode' }),
      width: 120,
    },
    { field: 'MaterialTypeName', headerName: intl.formatMessage({ id: 'material.MaterialTypeName' }), width: 200 },
    { field: 'LocationShelfCode', headerName: intl.formatMessage({ id: 'location.LocationCode' }), width: 150 },
    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'materialLot.LotNo' }),
      width: 170,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'materialLot.Length' }),
      width: 100,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'materialLot.Width' }),
      width: 100,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'TotalStock',
      headerName: intl.formatMessage({ id: 'materialLot.Stock' }),
      width: 80,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'materialLot.ReceivedDate' }),
      width: 120,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'ExpirationDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ExpirationDate' }),
      width: 150,
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
            '& .sttOK [data-field="MaterialLotCode"]': {
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
            getRowId={(rows) => rows.MaterialLotId}
            initialState={{ pinnedColumns: { right: ['action'] } }}
            checkboxSelection
            onSelectionModelChange={(ids) => getDataPrint(ids)}
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

export default MaterialOKTab;
