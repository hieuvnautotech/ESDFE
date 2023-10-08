import { useModal } from '@basesShared';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialSOService, wipReceivingService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import WIPReceivingDetailSC from './WIPReceivingDetailSC';
import SlitReceivingAllLotDialog from './SlitReceivingAllLotDialog';

export default function WIPReceivingSC() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const [SlitSOId, setWIPSOId] = useState(null);
  const [View, setView] = useState(null);
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

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.SlitSOId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'SlitSOId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 80,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="success"
                size="small"
                sx={[{ '&:hover': { border: '1px solid green' } }]}
                onClick={() => handleViewLot(params.row)}
              >
                <VisibilityIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'SlitSOName',
      headerName: intl.formatMessage({ id: 'SlitSO.SlitSOName' }),
      flex: 0.5,
    },

    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'materialSO.ProductId' }),
      flex: 0.5,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      flex: 0.5,
    },
    {
      field: 'SlitSOStatus',
      headerName: intl.formatMessage({ id: 'SlitSO.SlitSOStatus' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? 'Received' : 'Waiting'),
    },
    // {
    //   field: 'LocationName',
    //   headerName: intl.formatMessage({ id: 'materialSO.LocationId' }),
    //   flex: 0.5,
    // },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'materialSO.Description' }),
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

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  const handleViewLot = async (row) => {
    setView(row);
    toggle();
  };

  async function fetchData() {
    setWIPSOId(null);
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,

      SlitSOName: state.searchData.keyWord,
      ProductId: state.searchData.ProductId,
      Description: state.searchData.Description,
      isActived: state.searchData.showDelete,
    };

    const res = await wipReceivingService.getMaterialWIP(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end" sx={{ mb: 1 }}>
        <Grid item xs={3}></Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="standard"
                label="SlitSO.SlitSOName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'keyWord')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'materialSO.ProductId' })}
                fetchDataFunc={MaterialSOService.getProductList}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="standard"
                label="materialSO.Description"
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
        getRowId={(rows) => rows.SlitSOId}
        onSelectionModelChange={(Ids) => setWIPSOId(Ids[0])}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />

      <WIPReceivingDetailSC SlitSOId={SlitSOId} fetchDataMaster={fetchData} />

      <SlitReceivingAllLotDialog SlitSOModel={View} isOpen={isShowing} onClose={toggle} />
    </React.Fragment>
  );
}
