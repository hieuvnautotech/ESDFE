import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import { Grid } from '@mui/material';
import { HistoryReplacementSemiLotService } from '@services';
import { addDays, minusMonths } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import HistoryReplacementSemiLotDetail from './HistoryReplacementSemiLotDetail';

export default function HistoryReplacementSemiLot() {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      BuyerQR: '',
      SemiLotCode: '',
      WOCode: '',
      StartDate: minusMonths(date, 1),
      EndDate: date,
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
      renderCell: (index) => index.api.getRowIndex(index.row.SemiLotCode) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'BuyerQR',
      headerName: intl.formatMessage({ id: 'BuyerQR.BuyerQR' }),
      width: 280,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      width: 300,
    },
    {
      field: 'worker',
      headerName: intl.formatMessage({ id: 'slitOrder.StaffName' }),
      width: 200,
    },
    {
      field: 'ok_qty',
      align: 'right',
      headerName: intl.formatMessage({ id: 'History.ok_qty' }),
      width: 100,
    },
    {
      field: 'ng_qty',
      align: 'right',
      headerName: intl.formatMessage({ id: 'History.ng_qty' }),
      width: 100,
    },
    {
      field: 'insertqty',
      align: 'right',
      headerName: intl.formatMessage({ id: 'History.insertqty' }),
      width: 100,
    },
    {
      field: 'counthangbu',
      align: 'right',
      headerName: intl.formatMessage({ id: 'History.counthangbu' }),
      width: 100,
    },
    {
      field: 'total',
      align: 'right',
      headerName: intl.formatMessage({ id: 'History.total' }),
      width: 100,
    },

    {
      field: 'process',
      headerName: intl.formatMessage({ id: 'History.process' }),
      width: 260,
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'work_order.WoCode' }),
      width: 180,
    },
    {
      field: 'date_working',
      headerName: intl.formatMessage({ id: 'History.date_working' }),
      width: 180,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'remark',
      headerName: intl.formatMessage({ id: 'mold.Remark' }),
      width: 150,
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
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await HistoryReplacementSemiLotService.getAll(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs sx={{ mb: 1 }}>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                label="BuyerQR.BuyerQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                label="WO.WOCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WOCode')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.StartSearchingDate' })}
                value={state.searchData.StartDate}
                onChange={(e) => handleSearch(e, 'StartDate')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.EndSearchingDate' })}
                value={state.searchData.EndDate}
                onChange={(e) => handleSearch(e, 'EndDate')}
                variant="standard"
              />
            </Grid>
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
        getRowId={(rows) => rows.SemiLotCode}
        onRowClick={(params, event) => setSemiLotCode(params.row.SemiLotCode)}
        initialState={{ pinnedColumns: { left: ['id', 'BuyerQR', 'SemiLotCode'] } }}
      />
      <HistoryReplacementSemiLotDetail SemiLotCode={SemiLotCode} />
    </React.Fragment>
  );
}
