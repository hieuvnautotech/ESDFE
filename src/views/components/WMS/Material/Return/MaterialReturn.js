import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import { Grid, Tooltip, Typography } from '@mui/material';
import { MaterialReturnService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import MaterialReturnDetail from './MaterialReturnDetail';

export default function MaterialReturn() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      keyWord: '',
      ProductId: null,
      showDelete: true,
      Description: '',
    },
  });
  const [RMId, setRMId] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.RMId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'RMId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'RMName',
      headerName: intl.formatMessage({ id: 'returnMaterial.RMName' }),
      flex: 0.5,
    },
    // {
    //   field: 'ProductCode',
    //   headerName: intl.formatMessage({ id: 'returnMaterial.ProductId' }),
    //   flex: 0.5,
    // },
    {
      field: 'RMStatus',
      headerName: intl.formatMessage({ id: 'returnMaterial.RMStatus' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? 'Received' : 'Waiting'),
    },
    {
      field: 'AreaName',
      headerName: intl.formatMessage({ id: 'location.AreaId' }),
      flex: 0.5,
      renderCell: (params) => {
        return <span>{intl.formatMessage({ id: params?.row?.AreaName })}</span>;
      },
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'returnMaterial.Description' }),
      flex: 0.6,
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
      flex: 0.4,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.modifiedName' }),
      flex: 0.4,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete]);

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
    setRMId(null);
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,

      RMName: state.searchData.keyWord,
      ProductId: state.searchData.ProductId,
      Description: state.searchData.Description,
      isActived: state.searchData.showDelete,
    };

    const res = await MaterialReturnService.getReturnMaterialList(params);

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
        <Grid item xs={3}></Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="standard"
                label="returnMaterial.RMName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'keyWord')}
              />
            </Grid>
            {/* <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'returnMaterial.ProductId' })}
                fetchDataFunc={MaterialReturnService.getProductList}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
                variant="standard"
                fullWidth
              />
            </Grid> */}
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="standard"
                label="returnMaterial.Description"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'Description')}
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
        getRowId={(rows) => rows.RMId}
        onSelectionModelChange={(Ids) => setRMId(Ids[0])}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />

      <MaterialReturnDetail RMId={RMId} />
    </React.Fragment>
  );
}
