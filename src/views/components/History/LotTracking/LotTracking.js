import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { LotTrackingService } from '@services';
import { addDays } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export default function LotTracking() {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 30,
    searchData: {
      BuyerQR: '',
      SemiLotCode: '',
      WOCode: '',
    },
  });
  const [SemiLotCode, setSemiLotCode] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'ProcessName',
      headerName: intl.formatMessage({ id: 'History.process' }),
      width: 260,
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      width: 150,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      width: 300,
    },
    {
      field: 'OriginQty',
      headerName: 'Qty (Roll/EA)',
      width: 160,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'StaffName',
      headerName: intl.formatMessage({ id: 'slitOrder.StaffName' }),
      width: 200,
    },
    {
      field: 'MoldName',
      headerName: intl.formatMessage({ id: 'mold.MoldName' }),
      width: 200,
    },
    {
      field: 'StartDate',
      headerName: intl.formatMessage({ id: 'History.start_dt' }),
      width: 180,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'EndDate',
      headerName: intl.formatMessage({ id: 'History.end_dt' }),
      width: 180,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize]);

  //handle
  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    setSemiLotCode(null);
    const params = {
      BuyerQR: state.searchData.BuyerQR,
      SemiLotCode: state.searchData.SemiLotCode,
      WOCode: state.searchData.WOCode,
      page: 0,
      pageSize: 0,
    };

    const res = await LotTrackingService.getAll(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} intl={intl} searchData={state.searchData} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 420, []);
  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs sx={{ mb: 1 }}>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '20%' }}>
              <MuiSearchField
                label="BuyerQR.BuyerQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
            <Grid item style={{ width: '20%' }}>
              <MuiSearchField
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            {/* <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                label="WO.WOCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WOCode')}
              />
            </Grid> */}

            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.id}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        initialState={{ pinnedColumns: { left: ['id', 'ProcessName'] } }}
        hideFooter
      />
    </React.Fragment>
  );
}
//bảng 2
const DetailPanelContent = ({ row: rowProp, intl, searchData }) => {
  let isDetailRendered = useRef(true);
  const getDetailPanelContentOffDetail = React.useCallback(
    ({ row }) => <DetailPanelContentOffDetail row={row} intl={intl} />,
    []
  );
  const getDetailPanelHeightOfDetail = React.useCallback(() => 140, []);
  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
    SemiLotCode: rowProp.SemiLotCode,
  });

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      isActived: true,
      SemiLotCode: rowProp.SemiLotCode,
      page: 0,
      pageSize: 0,
    };

    const res = await LotTrackingService.getDetail(params);

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
        index.api.getRowIndex(index.row.id) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    { field: 'MaterialLotCode', headerName: intl.formatMessage({ id: 'WO.MaterialLotCode' }), width: 400 },
    {
      field: 'OKQty',
      headerName: 'OK Qty',
      width: 160,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
      width: 160,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'ExportDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ExportDate' }),
      width: 160,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'ExpirationDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ExpirationDate' }),
      width: 160,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    { field: 'LotNo', headerName: intl.formatMessage({ id: 'IQCReceiving.LotNo' }), width: 100 },
    { field: 'SlitOrCut', headerName: intl.formatMessage({ id: 'History.SlitOrCut' }), width: 100 },
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
          getDetailPanelHeight={getDetailPanelHeightOfDetail}
          getDetailPanelContent={getDetailPanelContentOffDetail}
          onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
          getRowId={(rows) => rows.id}
          hideFooter
          //initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode'], right: ['action'] } }}
        />
      </Paper>
    </Stack>
  );
};

//bảng 3
const DetailPanelContentOffDetail = ({ row: rowProp, intl, searchData }) => {
  let isDetailRendered = useRef(true);

  const [detailPanelState2, setDetailPanelState2] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 0,
    pageSize: 1,
    MaterialLotCode: rowProp.MaterialLotCode,
  });

  const fetchDetailData2 = async () => {
    setDetailPanelState2({ ...detailPanelState2, isLoading: true });
    const params = {
      isActived: true,
      MaterialLotCode: rowProp.MaterialLotCode,
      page: 0,
      pageSize: 0,
    };

    const res = await LotTrackingService.getDetailSlit(params);

    setDetailPanelState2({
      ...detailPanelState2,
      data: res.Data ?? [],
      totalRow: res.TotalRow,
      isLoading: false,
    });
  };

  const detailPanelColumns2 = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.SlitOrderId) + 1 + (detailPanelState2.page - 1) * detailPanelState2.pageSize,
    },

    { field: 'Description', headerName: intl.formatMessage({ id: 'general.description' }), width: 200 },
    { field: 'OrderDate', headerName: intl.formatMessage({ id: 'History.OrderDate' }), width: 200 },
    { field: 'StaffNameSlit', headerName: intl.formatMessage({ id: 'staff.StaffName' }), width: 200 },
    { field: 'LineName', headerName: intl.formatMessage({ id: 'WO.machine' }), width: 200 },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 200,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  useEffect(() => {
    fetchDetailData2();
  }, [detailPanelState2.page, detailPanelState2.pageSize, rowProp]);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <MuiDataGrid
          showLoading={detailPanelState2.isLoading}
          isPagingServer={true}
          headerHeight={35}
          columns={detailPanelColumns2}
          rows={detailPanelState2.data}
          page={detailPanelState2.page - 1}
          pageSize={detailPanelState2.pageSize}
          rowCount={detailPanelState2.totalRow}
          onPageChange={(newPage) => setDetailPanelState2({ ...detailPanelState2, page: newPage + 1 })}
          getRowId={(rows) => rows.SlitOrderId}
          hideFooter
          //initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode'], right: ['action'] } }}
        />
      </Paper>
    </Stack>
  );
};
