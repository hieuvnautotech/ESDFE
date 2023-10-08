import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField, MuiSearchField, MuiIconButton } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import { FGShippingOrderService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import FGShippingOrderDialog from './FGShippingOrderDialog';
import FGShippingOrderBoxQR from './FGShippingOrderBoxQR';
import FGShippingOrderViewAllDialog from './FGShippingOrderViewAllDialog';
// import FGShippingOrderBoxQR from './FGShippingOrderBoxQR';
// import FGShippingOrderViewAllDialog from './FGShippingOrderViewAllDialog';

export default function FGShippingOrder() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      DeliveryDate: null,
      BuyerId: null,
      showDelete: true,
      FGSOCode: '',
      BuyerCode: '',
      ProductCode: '',
      BuyerQR: '',
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [FGSOId, setFGSOId] = useState(null);
  const [View, setView] = useState(null);
  const [isActivedRow, setIsActivedRow] = useState(0);
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.FGSOId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'FGSOId', hide: true },
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
            {/* <Grid item xs={3} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
                disabled={params.row.DeliveryScanQty > 0 ? true : false}
              >
                {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid>
            {params.row?.isActived && (
              <Grid item xs={3} style={{ textAlign: 'center' }}>
                <IconButton
                  aria-label="edit"
                  color="warning"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid orange' } }]}
                  onClick={() => handleUpdate(params.row)}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            )} */}
            {params.row?.isActived && (
              <Grid item xs={6} style={{ textAlign: 'center' }}>
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
            )}
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <MuiIconButton color="primary" onClick={() => handleDownload(params.row)} text="excel" />
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'FGSOCode',
      headerName: intl.formatMessage({ id: 'FGSO.FGSOCode' }),
      flex: 0.3,
    },
    {
      field: 'BuyerCode',
      headerName: intl.formatMessage({ id: 'buyer.BuyerCode' }),
      flex: 0.4,
    },
    {
      field: 'FGSODate',
      headerName: intl.formatMessage({ id: 'FGSO.FGSODate' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'FGSONumber',
      headerName: intl.formatMessage({ id: 'FGSO.FGSONumber' }),
      flex: 0.3,
    },
    {
      field: 'DeliveryDate',
      headerName: intl.formatMessage({ id: 'FGSO.DeliveryDate' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'bom.ProductId' }),
      flex: 0.3,
    },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), flex: 0.4 },
    {
      field: 'UnitCode',
      headerName: intl.formatMessage({ id: 'FGSO.UnitCode' }),
      flex: 0.25,
    },
    {
      field: 'Quantity',
      headerName: intl.formatMessage({ id: 'FGSO.Quantity' }),
      flex: 0.25,
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      flex: 0.3,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.35,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    // {
    //   field: 'modifiedName',
    //   headerName: intl.formatMessage({ id: 'general.modifiedName' }),
    //   flex: 0.4,
    // },
    // {
    //   field: 'modifiedDate',
    //   headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
    //   flex: 0.4,
    //   valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    // },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.searchData.showDelete]);

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
        return o.FGSOId == updateData.FGSOId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleDownload = async (item) => {
    try {
      await FGShippingOrderService.downloadReport(item);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: item.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await FGShippingOrderService.deleteFGShippingOrder(item);
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

  const handleViewLot = async (row) => {
    setView(row);
    toggle2();
  };

  const handleAdd = () => {
    setMode(CREATE_ACTION);
    setRowData();
    toggle();
  };

  const handleUpdate = async (row) => {
    setMode(UPDATE_ACTION);
    setRowData(row);
    toggle();
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
    setFGSOId(null);
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,

      DeliveryDate: state.searchData.DeliveryDate,
      BuyerId: state.searchData.BuyerId,
      FGSOCode: state.searchData.FGSOCode,
      BuyerCode: state.searchData.BuyerCode,
      ProductCode: state.searchData.ProductCode,
      BuyerQR: state.searchData.BuyerQR,
      isActived: state.searchData.showDelete,
    };

    const res = await FGShippingOrderService.getFGShippingOrderList(params);

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
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        {/* <Grid item xs={3}>
          <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} />
        </Grid> */}
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                variant="standard"
                label="buyer.BuyerCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerCode')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                variant="standard"
                label="bom.ProductId"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'ProductCode')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                variant="standard"
                label="BoxQR.BuyerQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                variant="standard"
                label="FGSO.FGSOCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'FGSOCode')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'purchase_order.DeliveryDate' })}
                value={state.searchData.DeliveryDate}
                onChange={(e) => handleSearch(e, 'DeliveryDate')}
                variant="standard"
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
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.FGSOId}
        onSelectionModelChange={(Ids) => setFGSOId(Ids[0])}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        onRowClick={(row) => {
          setIsActivedRow(row?.row?.isActived);
        }}
      />

      <FGShippingOrderBoxQR FGSOId={FGSOId} isActivedRow={isActivedRow} />

      <FGShippingOrderDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
      />

      <FGShippingOrderViewAllDialog FGSOModel={View} isOpen={isShowing2} onClose={toggle2} />
    </React.Fragment>
  );
}
