import React, { useEffect, useRef, useState, memo } from 'react';
import { useIntl } from 'react-intl';
import { MuiButton, MuiDataGrid, MuiSearchField, MuiDateField, MuiAutocomplete } from '@controls';
import { Box, Grid } from '@mui/material';
import { FQCReceivingService } from '@services';
import moment from 'moment';
const FQCReceivingDetail = memo(({ updatedData }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      SemiLotCode: '',
      ProductCode: '',
      Shift: '',
      StartDate: null,
      EndDate: null,
    },
  });

  const fetchData = async () => {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      SemiLotCode: state.searchData.SemiLotCode,
      ProductCode: state.searchData.ProductCode,
      Shift: state.searchData.Shift,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
    };
    const res = await FQCReceivingService.getDetailHistory(params);
    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  };

  useEffect(() => {
    return () => {
      isRendered = false;
    };
  }, []);

  useEffect(async () => {
    await fetchData();
  }, [state.page, state.pageSize, state.searchData.showDelete, updatedData]);

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({
        ...state,
        page: 1,
        searchData: { ...newSearchData },
      });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  const columns = [
    { field: 'WOSemiLotMMSId', headerName: '', hide: true },
    {
      field: 'id',
      headerName: '',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotMMSId) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'ModelName',
      headerName: 'Model',
      width: 150,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'product.product_code' }),
      width: 150,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      width: 200,
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'appRouting.WONo' }),
      width: 200,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'appRouting.SemiLotCode' }),
      width: 350,
    },
    {
      field: 'OriginQty',
      headerName: 'Origin Qty',
      width: 150,
      valueFormatter: (params) => (params?.value ? params?.value.toLocaleString() : null),
    },
    {
      field: 'ActualQty',
      headerName: 'Actual Qty',
      width: 150,
      valueFormatter: (params) => (params?.value ? params?.value.toLocaleString() : null),
    },
    {
      field: 'ReceivedDateShort',
      headerName: intl.formatMessage({ id: 'materialLot.ReceivedDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    // {
    //   field: 'Shift',
    //   headerName: 'Shift',
    //   width: 150,
    //   renderCell: (params) => {
    //     if (
    //       moment(params.row.ReceivedDate).format('HH:mm:ss') > '20:00:00' ||
    //       moment(params.row.ReceivedDate).format('HH:mm:ss') < '08:00:00'
    //     ) {
    //       return (
    //         <span className=" badge badge-dark" style={{ fontSize: '16px' }}>
    //           {intl.formatMessage({ id: 'appRouting.Night' })}
    //         </span>
    //       );
    //     } else {
    //       return (
    //         <span className="badge badge-success" style={{ fontSize: '16px' }}>
    //           {intl.formatMessage({ id: 'appRouting.Day' })}
    //         </span>
    //       );
    //     }
    //   },
    // },
    {
      field: 'Shift',
      headerName: intl.formatMessage({ id: 'WO.WorkShift' }),
      width: 150,
      renderCell: (params) => {
        if (params.row.Shift == 'B') {
          return (
            <span className=" badge badge-dark" style={{ fontSize: '16px' }}>
              {intl.formatMessage({ id: 'appRouting.Night' })}
            </span>
          );
        } else {
          return (
            <span className="badge badge-success" style={{ fontSize: '16px' }}>
              {intl.formatMessage({ id: 'appRouting.Day' })}
            </span>
          );
        }
      },
    },

    {
      field: 'ReceivedDate',
      headerName: 'Received Date Time',
      width: 180,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];
  const shiftOption = () => {
    let value = {
      Data: [
        { Shift: 'B', ShiftName: intl.formatMessage({ id: 'appRouting.Night' }) },
        { Shift: 'A', ShiftName: intl.formatMessage({ id: 'appRouting.Day' }) },
      ],
    };
    return value;
  };

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid item xs={1}></Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '20%' }}>
              <MuiSearchField
                fullWidth
                disabled={state.isLoading}
                size="small"
                label="appRouting.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item style={{ width: '18%' }}>
              <MuiSearchField
                fullWidth
                disabled={state.isLoading}
                size="small"
                label="appRouting.Product"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'ProductCode')}
              />
            </Grid>
            {/* <Grid item style={{ width: '14%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'appRouting.Date' })}
                value={state.searchData.Date}
                onChange={(e) => handleSearch(e, 'Date')}
                variant="standard"
              />
            </Grid> */}
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
            <Grid item sx={{ minWidth: '10%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'WO.WorkShift' })}
                fetchDataFunc={shiftOption}
                displayLabel="ShiftName"
                displayValue="Shift"
                onChange={(e, item) => handleSearch(item ? item.Shift ?? null : null, 'Shift')}
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
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        // rowHeight={30}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        // rowsPerPageOptions={[5, 10, 20, 30]}
        getRowClassName={(params) => {
          if (updatedData?.WOSemiLotMMSId == params.row?.WOSemiLotMMSId) {
            return `Mui-created`;
          }
        }}
        onPageChange={(newPage) => {
          setState({ ...state, page: newPage + 1 });
        }}
        getRowId={(rows) => rows.WOSemiLotMMSId}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        footerCustom={[
          `${intl.formatMessage({ id: 'WO.totalActualQty' })}: ${
            state.data[0]?.totalActualQty ? Number(state.data[0]?.totalActualQty).toLocaleString() : 0
          }`,
        ]}
      />
    </>
  );
});
export default FQCReceivingDetail;
