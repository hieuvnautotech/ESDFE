import React, { useEffect, useRef, useState } from 'react';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import { TabContext, TabList } from '@mui/lab';
import { Box, Grid, Tab, Tooltip, Typography } from '@mui/material';
import { ActualService } from '@services';
import { addDays, minusMonths } from '@utils';
import moment from 'moment';
import { useIntl } from 'react-intl';
import WOProcess from './WOProcess';
import WOProcessSemiLot from './WOProcessSemiLot';

export default function FQCActual() {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
    searchData: {
      keyWord: '',
      ProductCode: null,
      ProductCode: '',
      showDelete: true,
      StartDate: minusMonths(date, 1),
      EndDate: date,
    },
  });
  const [WOId, setWOId] = useState(null);
  const [value, setValue] = useState('tab1');
  const [isFinish, setIsFinish] = useState(false);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      width: 150,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'bom.ProductId' }),
      width: 150,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      width: 200,
    },
    {
      field: 'ModelName',
      headerName: intl.formatMessage({ id: 'WO.Model' }),
      width: 150,
    },
    {
      field: 'ManufacturingDate',
      headerName: intl.formatMessage({ id: 'WO.ManufacturingDate' }),
      width: 200,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'Target',
      headerName: intl.formatMessage({ id: 'WO.Target' }),
      width: 120,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'ProcessQty',
      headerName: intl.formatMessage({ id: 'WO.ProcessQty' }),
      width: 120,
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'bom.Description' }),
      width: 250,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.Description ?? ''} className="col-text-elip">
            <Typography sx={{ fontSize: 14 }}>{params.row.Description}</Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      width: 150,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
      width: 180,
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.modifiedName' }),
      width: 150,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
      width: 180,
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete, isFinish]);

  //handle
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    setIsFinish(newValue == 'tab1' ? false : true);
  };

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
    if (WOId != null) setWOId(null);
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      WOCode: state.searchData.keyWord,
      ProductCode: state.searchData.ProductCode,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      isActived: state.searchData.showDelete,
      isFinish: isFinish,
    };

    const res = await ActualService.getWOList(params);

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
        <Grid item xs={4}></Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="keyWord"
                label="WO.WOCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'keyWord')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'bom.ProductId' })}
                fetchDataFunc={ActualService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductCode ?? null : null, 'ProductCode')}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.StartSearchingDate' })}
                value={state.searchData.StartDate}
                onChange={(e) => handleSearch(e, 'StartDate')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.EndSearchingDate' })}
                value={state.searchData.EndDate}
                onChange={(e) => handleSearch(e, 'EndDate')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={() => fetchData()} sx={{ mr: 3, mt: 1 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="Processing" value="tab1" />
            <Tab label="Finished" value="tab2" />
          </TabList>
        </Box>
        <Grid container direction="row" justifyContent="space-between" columnSpacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <MuiDataGrid
              showLoading={state.isLoading}
              isPagingServer={true}
              headerHeight={30}
              columns={columns}
              rows={state.data}
              page={state.page - 1}
              pageSize={state.pageSize}
              rowCount={state.totalRow}
              onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
              getRowId={(rows) => rows.WOId}
              onSelectionModelChange={(Ids) => setWOId(Ids[0])}
              initialState={{ pinnedColumns: { right: ['action'], left: ['id', 'WOCode'] } }}
            />
          </Grid>
          <Grid item xs={6}>
            <WOProcessSemiLot WOId={WOId} />
          </Grid>
        </Grid>
      </TabContext>
      <WOProcess WOId={WOId} />
    </React.Fragment>
  );
}
