import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { MuiButton, MuiDataGrid, MuiSearchField, MuiDateField, MuiTextField, MuiAutocomplete } from '@controls';
import { Box, Grid } from '@mui/material';
import { FQCReceivingService } from '@services';
import moment from 'moment';
import { ErrorAlert, SuccessAlert } from '@utils';
import _ from 'lodash';
import FQCReceivingDetail from './FQCReceivingDetail';
import { FACTORYOPTION } from '@constants/ConfigConstants';

export default function FQCReceiving(props) {
  const intl = useIntl();

  let isRendered = useRef(true);
  //const [factory, setFactory] = useState('');
  const lotInputRef = useRef(null);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
    searchData: {
      WONo: '',
      ProductCode: '',
      SemiLotCode: '',
      Shift: '',
      MappingDate: null,
    },
  });
  const [deleteData, setDeleteData] = useState({});

  const fetchData = async () => {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      WONo: state.searchData.WONo,
      ProductCode: state.searchData.ProductCode,
      SemiLotCode: state.searchData.SemiLotCode,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      Shift: state.searchData.Shift,
    };
    const res = await FQCReceivingService.getAll(params);
    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  };

  const debouncedFetchData = _.debounce(fetchData, 0);

  useEffect(() => {
    return () => {
      isRendered = false;
    };
  }, []);

  useEffect(() => {
    if (deleteData?.WOSemiLotMMSId > 0) debouncedFetchData();
    return debouncedFetchData.cancel;
  }, [deleteData]);

  useEffect(() => {
    fetchData();
    lotInputRef.current.focus();
  }, [state.page, state.pageSize, state.searchData.showDelete]);

  useEffect(() => {
    if (!_.isEmpty(deleteData)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.WOSemiLotMMSId == deleteData.WOSemiLotMMSId;
      });
      if (index !== -1) {
        newArr[index] = deleteData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [deleteData]);

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
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'appRouting.SemiLotCode' }),
      width: 250,
    },
    {
      field: 'PressLotCode',
      headerName: intl.formatMessage({ id: 'WO.PressLotCode' }),
      width: 150,
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
      field: 'Shift',
      headerName: intl.formatMessage({ id: 'WO.WorkShift' }),
      width: 150,
      renderCell: (params) => {
        if (params.row.Shift == 'N') {
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
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.created_date' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];
  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };
  const handleScan = async (inputValue) => {
    if (inputValue.lot.trim() === '') {
      ErrorAlert(intl.formatMessage({ id: 'lot.facAndLot_required' }));
      return;
    }
    const res = await FQCReceivingService.scanReceiving({
      SemiLotCode: String(inputValue.lot.trim()),
    });
    if (res && isRendered) {
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDeleteData(res.Data);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    } else {
      ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
    }
  };

  const handleLotInputChange = (e) => {
    lotInputRef.current.value = e.target.value;
  };

  const scanBtnClick = async () => {
    const lot = lotInputRef.current.value.trim();
    await handleScan({ lot });
    lotInputRef.current.value = '';
    lotInputRef.current.focus();
  };
  const shiftOption = () => {
    let value = {
      Data: [
        { Shift: 'N', ShiftName: intl.formatMessage({ id: 'appRouting.Night' }) },
        { Shift: 'D', ShiftName: intl.formatMessage({ id: 'appRouting.Day' }) },
      ],
    };
    return value;
  };
  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid item xs={12}>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                fullWidth
                disabled={state.isLoading}
                size="small"
                label="appRouting.WONo"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WONo')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                fullWidth
                disabled={state.isLoading}
                size="small"
                label="appRouting.Product"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'ProductCode')}
              />
            </Grid>
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
            {/* <Grid item style={{ width: '10%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.created_date' })}
                value={state.searchData.MappingDate}
                onChange={(e) => handleSearch(e, 'MappingDate')}
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
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 0 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justifyContent="start" alignItems="center" sx={{ maxWidth: '50%', pl: 2 }} spacing={2}>
        <Grid xs={9} md={9} item container direction="row">
          <Grid item>
            <MuiTextField
              ref={lotInputRef}
              label="Lot"
              onChange={handleLotInputChange}
              onKeyDown={keyPress}
              sx={{ mt: 1, mb: 1, width: 450 }}
            />
          </Grid>
          <Grid item>
            <MuiButton
              text="scan"
              color="success"
              onClick={scanBtnClick}
              sx={{ ml: 1, mb: 1, mr: 2, marginTop: '10px' }}
            />
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

        onPageChange={(newPage) => {
          setState({ ...state, page: newPage + 1 });
        }}
        getRowId={(rows) => rows.WOSemiLotMMSId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, deleteData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        footerCustom={[
          `${intl.formatMessage({ id: 'WO.totalActualQty' })}: ${
            state.data[0]?.totalActualQty ? Number(state.data[0]?.totalActualQty).toLocaleString() : 0
          }`,
        ]}
      />
      <FQCReceivingDetail updatedData={deleteData} />
    </>
  );
}
