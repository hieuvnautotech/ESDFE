import { useModal, useModal2, useModal3 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiDateField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography, Stack, TextField } from '@mui/material';
import { SlitOrderService } from '@services';
import { ErrorAlert, SuccessAlert, addDays, minusMonths } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { SlitOrderDataPrint } from './SlitOrderDataPrint';
import SlitOrderDialog from './SlitOrderDialog';
import SlitOrderDetail from './SlitOrderDetail';
import SlitOrderSlittingDialog from './SlitOrderSlittingDialog';

export default function SlitOrder() {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      ProductId: null,
      showDelete: true,
      StartDate: minusMonths(date, 1),
      EndDate: date,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [rowDataSlitOrder, setRowDataSlitOrder] = useState({});
  const [SlitOrderId, setSlitOrderId] = useState(null);
  const [rowMaster, setRowMaster] = useState({});
  const [modeAction, setModeAction] = useState(0);
  const [isActivedRow, setIsActivedRow] = useState(0);
  const { isShowing2, toggle2 } = useModal2();
  const { isShowing3, toggle3 } = useModal3();
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.SlitOrderId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'SlitOrderId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 120,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            {params.row.isActived && (
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <IconButton
                  aria-label="delete"
                  color="success"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid green' } }]}
                  onClick={() => handleSlit(params.row)}
                >
                  <ContentCutIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            )}
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
                disabled={params.row.OrderStatus ? true : params.row.DeleteStatus ? true : false}
              >
                {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid>
            {params.row.isActived && (
              <Grid item xs={4} style={{ textAlign: 'center' }}>
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
            )}
          </Grid>
        );
      },
    },
    {
      field: 'OrderDate',
      headerName: intl.formatMessage({ id: 'slitOrder.Date' }),
      flex: 0.5,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'OrderStatusName',
      headerName: intl.formatMessage({ id: 'slitOrder.Status' }),
      flex: 0.4,
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'general.description' }),
      flex: 0.7,
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
        return o.SlitOrderId == updateData.SlitOrderId;
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
        let res = await SlitOrderService.deleteSlitOrder({
          SlitOrderId: item.SlitOrderId,
          row_version: item.row_version,
        });
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
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      ProductId: state.searchData.ProductId,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      isActived: state.searchData.showDelete,
    };

    const res = await SlitOrderService.getAll(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const handleSlit = async (row) => {
    setRowDataSlitOrder(row);
    toggle2();
  };
  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={3}>
          <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} />
          <MuiButton
            text="print"
            color="secondary"
            onClick={toggle3}
            sx={{ mt: 1 }}
            disabled={rowMaster?.SlitOrderId == null ? true : false}
          />
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.product_code' })}
                fetchDataFunc={SlitOrderService.getProductList}
                displayLabel="ProductCode"
                displayValue="ProductId"
                variant="standard"
                onChange={(e, value) => handleSearch(value?.ProductId ?? null, 'ProductId')}
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
        getRowId={(rows) => rows.SlitOrderId}
        onSelectionModelChange={(Ids) => setSlitOrderId(Ids[0])}
        onCellClick={(row) => {
          setModeAction(row.row?.OrderStatus);
          setRowMaster(row?.row);
          setIsActivedRow(row.row?.isActived);
        }}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { left: ['id', 'OrderDate', 'Description'], right: ['action'] } }}
      />
      <SlitOrderDetail SlitOrderId={SlitOrderId} modeAction={modeAction} isActivedRow={isActivedRow} />
      <SlitOrderDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
      />
      <SlitOrderSlittingDialog
        initModal={rowDataSlitOrder}
        isOpen={isShowing2}
        onClose={toggle2}
        SlitOrderId={SlitOrderId}
        fetchDataSlitOrder={fetchData}
      />
      <SlitOrderDataPrint isShowing={isShowing3} onClose={toggle3} rowMaster={rowMaster} />
    </React.Fragment>
  );
}
