import { useModal } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiDateField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { TabContext, TabList, TabPanel, TreeItem, TreeView } from '@mui/lab';
import { FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography, Box, Tab } from '@mui/material';
import { WOService } from '@services';
import { ErrorAlert, SuccessAlert, addDays, minusMonths } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import WODialog from './WODialog';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTokenStore } from '@stores';
import WOProcess from './WOProcess';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';

export default function WorkOrder() {
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
      keyWord: '',
      ProductCode: '',
      ProductCode: '',
      showDelete: true,
      StartDate: minusMonths(date, 1),
      EndDate: date,
    },
  });
  const [state2, setState2] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [WOId, setWOId] = useState(null);
  const [WOId2, setWOId2] = useState(null);
  const [value, setValue] = React.useState('tab1');
  const [isActivedRow, setIsActivedRow] = useState(0);

  const setIdWO = useTokenStore((state) => state.setWOId);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.WOId) +
        1 +
        (value == 'tab1' ? (state.page - 1) * state.pageSize : (state2.page - 1) * state2.pageSize),
    },
    { field: 'WOId', hide: true },
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
            {params.row?.isActived && (
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <IconButton
                  color="success"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid green' } }]}
                  onClick={() => handleFinish(params.row)}
                >
                  {params.row.isFinish ? (
                    <UnpublishedOutlinedIcon fontSize="inherit" />
                  ) : (
                    <CheckCircleOutlineIcon fontSize="inherit" />
                  )}
                </IconButton>
              </Grid>
            )}
            {!params.row.isFinish && (
              <>
                {params.row?.isActived && (
                  <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <IconButton
                      color="warning"
                      size="small"
                      sx={[{ '&:hover': { border: '1px solid orange' } }]}
                      onClick={() => handleUpdate(params.row)}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </Grid>
                )}
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  <IconButton
                    color="error"
                    size="small"
                    sx={[{ '&:hover': { border: '1px solid red' } }]}
                    onClick={() => handleDelete(params.row)}
                    disabled={params.row.ProcessQty > 0 ? true : false}
                  >
                    {params.row?.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
                  </IconButton>
                </Grid>
              </>
            )}
          </Grid>
        );
      },
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      width: 200,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'bom.ProductId' }),
      width: 170,
    },
    {
      field: 'ModelCode',
      headerName: intl.formatMessage({ id: 'WO.Model' }),
      width: 150,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      width: 200,
    },
    {
      field: 'BomVersion',
      headerName: intl.formatMessage({ id: 'bom.BomVersion' }),
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
    if (value == 'tab1') fetchData();
    else fetchData2();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state2.page, state2.pageSize, state.searchData.showDelete, value]);

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
      let newArr = value == 'tab1' ? [...state.data] : [...state2.data];
      const index = _.findIndex(newArr, function (o) {
        return o.WOId == updateData.WOId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }
      if (value == 'tab1') setState({ ...state, data: [...newArr] });
      else setState2({ ...state, data: [...newArr] });
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
        let res = await WOService.deleteWO(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          if (value == 'tab1') await fetchData();
          else await fetchData2();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
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

  const handleFinish = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({ id: item.isFinish ? 'general.confirm_unfinish' : 'slitOrder.confirm_finish' })
      )
    ) {
      try {
        let res = await WOService.finishWO(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          if (value == 'tab1') await fetchData();
          else await fetchData2();
          resetParent();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
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
      isFinish: false,
    };

    const res = await WOService.getWOList(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  async function fetchData2() {
    if (WOId2 != null) setWOId2(null);
    setState2({ ...state2, isLoading: true });
    const params = {
      page: state2.page,
      pageSize: state2.pageSize,
      WOCode: state.searchData.keyWord,
      ProductCode: state.searchData.ProductCode,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      isActived: state.searchData.showDelete,
      isFinish: true,
    };

    const res = await WOService.getWOList(params);

    if (res && isRendered)
      setState2({
        ...state2,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={2}>
          <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} />
        </Grid>
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
                fetchDataFunc={WOService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductCodeTemp ?? null : null, 'ProductCode')}
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
              <MuiButton
                text="search"
                color="info"
                onClick={() => {
                  if (value == 'tab1') fetchData();
                  else fetchData2();
                }}
                sx={{ mr: 3, mt: 1 }}
              />
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

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="Processing" value="tab1" />
            <Tab label="Finished" value="tab2" />
          </TabList>
        </Box>
        <TabPanel value="tab1" sx={{ p: 0, pt: 1 }}>
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
            getRowId={(rows) => rows.WOId}
            onSelectionModelChange={(Ids) => {
              setWOId(Ids[0]);
              setIdWO(Ids[0]);
            }}
            onRowClick={(params) => {
              setIsActivedRow(params.row?.isActived);
            }}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
            }}
            initialState={{ pinnedColumns: { right: ['action'], left: ['id', 'WOCode'] } }}
          />
          <WOProcess WOId={WOId} isActivedRow={isActivedRow} />
        </TabPanel>
        <TabPanel value="tab2" sx={{ p: 0, pt: 1 }}>
          <MuiDataGrid
            showLoading={state2.isLoading}
            isPagingServer={true}
            headerHeight={45}
            columns={columns}
            rows={state2.data}
            page={state2.page - 1}
            pageSize={state2.pageSize}
            rowCount={state2.totalRow}
            onPageChange={(newPage) => setState2({ ...state2, page: newPage + 1 })}
            getRowId={(rows) => rows.WOId}
            onSelectionModelChange={(Ids) => setWOId2(Ids[0])}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
            }}
            initialState={{ pinnedColumns: { right: ['action'], left: ['id', 'WOCode'] } }}
          />
          <WOProcess WOId={WOId2} finished={true} isActivedRow={isActivedRow} />
        </TabPanel>
      </TabContext>

      <WODialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
      />
    </React.Fragment>
  );
}
