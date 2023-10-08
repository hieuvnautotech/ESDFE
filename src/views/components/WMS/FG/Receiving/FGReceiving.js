import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiIconButton } from '@controls';
import { FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import { BuyerQRShippingService, FGReceivingService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import FGReceivingLot from './FGReceivingLot';
import FQCReceivingAllLotDialog from './FQCReceivingAllLotDialog';

export default function FGReceiving() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [View, setView] = useState(null);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      ProductId: null,
      showDelete: true,
      FQCSOName: '',
      Description: '',
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [FQCSOId, setFQCSOId] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.FQCSOId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'FQCSOId', hide: true },
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
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <MuiIconButton color="success" onClick={() => handleViewLot(params.row)} text="view" />
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'FQCSOName',
      headerName: intl.formatMessage({ id: 'FQCSO.FQCSOName' }),
      width: 150,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'returnMaterial.ProductId' }),
      width: 150,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      width: 250,
    },
    {
      field: 'Status',
      headerName: intl.formatMessage({ id: 'materialLot.LotStatus' }),
      width: 120,
      renderCell: (params) => {
        return (
          <Typography sx={{ fontSize: 14 }}>
            {params.row.OrderQty == params.row.ReceivedQty
              ? intl.formatMessage({ id: 'general.received' })
              : intl.formatMessage({ id: 'general.waiting' })}
          </Typography>
        );
      },
    },
    {
      field: 'OrderQty',
      headerName: intl.formatMessage({ id: 'FQCSO.OrderQty' }),
      width: 120,
    },
    {
      field: 'ScanQty',
      headerName: intl.formatMessage({ id: 'FQCSO.ScanQty' }),
      width: 120,
    },
    {
      field: 'EAQty',
      headerName: intl.formatMessage({ id: 'FQCSO.EAQty' }),
      width: 120,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
    },
    {
      field: 'ShippingDate',
      headerName: intl.formatMessage({ id: 'FQCSO.ShippingDate' }),
      width: 120,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'returnMaterial.Description' }),
      width: 180,
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
      width: 120,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 120,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.modifiedName' }),
      width: 120,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      width: 120,
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

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...state.data];
      if (data.length > state.pageSize) {
        data.pop();
      }
      setState({
        ...state,
        data: [...data],
        totalRow: state.totalRow + 1,
      });
    }
  }, [newData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.FQCSOId == updateData.FQCSOId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleDelete = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: item.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await FGReceivingService.deleteFQCSO(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdateLot = async (item) => {
    let newArr = [...state.data];
    const index = _.findIndex(newArr, function (o) {
      return o.FQCSOId == item.FQCSOId;
    });
    if (index !== -1) {
      newArr[index] = {
        ...newArr[index],
        ScanQty: newArr[index].ScanQty + item.ScanQty,
        EAQty: newArr[index].EAQty + item.ActualQty,
      };
    }

    setState({ ...state, data: [...newArr] });
  };

  const handleViewLot = async (row) => {
    setView(row);
    toggle2();
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
    setFQCSOId(null);
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      ProductId: state.searchData.ProductId,
      Description: state.searchData.Description,
      FQCSOName: state.searchData.FQCSOName,
      isActived: state.searchData.showDelete,
    };

    const res = await FGReceivingService.getFQCSOList(params);

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
                label="FQCSO.FQCSOName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'FQCSOName')}
              />
            </Grid>
            <Grid item style={{ width: '28%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'returnMaterial.ProductId' })}
                fetchDataFunc={FGReceivingService.getProductList}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item?.ProductId ?? null : null, 'ProductId')}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item style={{ width: '35%' }}>
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

        <Grid item>
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch
                defaultChecked={true}
                color="primary"
                onChange={(e) => handleSearch(e.target.checked, 'showDelete')}
              />
            }
            label={intl.formatMessage({
              id: state.searchData.showDelete ? 'general.data_actived' : 'general.data_deleted',
            })}
          />
        </Grid>
      </Grid>

      <MuiDataGrid
        disableRowSelectionOnClick
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.FQCSOId}
        onSelectionModelChange={(Ids) => setFQCSOId(Ids[0])}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />

      <FGReceivingLot FQCSOId={FQCSOId} handleUpdateLot={handleUpdateLot} />

      <FQCReceivingAllLotDialog RMModel={View} isOpen={isShowing2} onClose={toggle2} />
    </React.Fragment>
  );
}
