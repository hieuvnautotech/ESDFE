import { useModal, useModal2, useModal3 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiDateField } from '@controls';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Grid, IconButton, Paper, Select, Stack, Switch } from '@mui/material';
import { ActualService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
//import MappingDialog from './MappingDialog';
// import WOProcessDialog from './WOProcessDialog';
// import WOProcessMaterialDialog from './WOProcessMaterialDialog';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import WOProcessStaffDialog from './WOProcessStaffDialog';
import WOProcessSemiLotDialog from './WOProcessSemiLotDialog';
import WOProcessSemiLotOQCDialog from './WOProcessSemiLotOQCDialog';
// import WOProcessPQCDialog from './WOProcessPQCDialog';
// import WOProcessMappingDialog from './Mapping/WOProcessMappingDialog';

export default function WOProcessStaff({ WOProcessId, WOId, ProcessCode }) {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const { isShowing3, toggle3 } = useModal3();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
    searchData: {
      keyWord: '',
      ProcessId: null,
      showDelete: true,
      StartDate: null,
      StaffId: null,
      EndDate: null,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [WOProcessStaff, setWOProcessStaff] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOProcessStaffId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOProcessId', hide: true },
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
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleMapping(params.row)}
              >
                <AddIcon fontSize="inherit" />
              </IconButton>
            </Grid>
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
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
              >
                {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    { field: 'WOProcessStaffId', hide: true },
    { field: 'StaffId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'StaffName',
      headerName: intl.formatMessage({ id: 'staff.StaffCode' }),
      width: 180,
    },
    {
      field: 'OKQty',
      headerName: intl.formatMessage({ id: 'WO.OKQty' }),
      width: 100,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'NGQty',
      headerName: intl.formatMessage({ id: 'WO.NGQty' }),
      width: 100,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'StartDate',
      headerName: intl.formatMessage({ id: 'WO.StartDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'EndDate',
      headerName: intl.formatMessage({ id: 'WO.EndDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, WOProcessId]);

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
        return o.WOProcessStaffId == updateData.WOProcessStaffId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
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

  const handleMapping = (item) => {
    setWOProcessStaff(item);
    // setRowData();
    toggle2();
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
        let res = await ActualService.deleteProcessStaff(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData(null);
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
    setState({ ...state, isLoading: true });
    const params = {
      WOProcessId: WOProcessId,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      StaffId: state.searchData.StaffId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await ActualService.getWOProcessStaffList(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const handleClose = () => {
    fetchData();
    toggle2();
  };
  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={2}>
          <MuiButton
            text="create"
            color="success"
            onClick={handleAdd}
            sx={{ mt: 1 }}
            disabled={WOProcessId == null ? true : false}
          />
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '30%' }}>
              <MuiAutocomplete
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'WO.staff' })}
                fetchDataFunc={ActualService.getStaff}
                displayLabel="StaffName"
                displayValue="StaffId"
                onChange={(e, value) => handleSearch(value?.StaffId, 'StaffId')}
                variant="standard"
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
                onClick={() => fetchData()}
                sx={{ mt: 1 }}
                disabled={WOProcessId == null ? true : false}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
        getRowId={(rows) => rows.WOProcessStaffId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { left: ['id', 'StaffName'], right: ['action'] } }}
      />
      <WOProcessStaffDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
        WOProcessId={WOProcessId}
      />
      {/* {ProcessCode == 'OQC' ? (
        <WOProcessSemiLotOQCDialog
          WOProcessId={WOProcessId}
          WOProcessStaff={WOProcessStaff}
          WOId={WOId}
          isOpen={isShowing2}
          onClose={handleClose}
        />
      ) : (
        <WOProcessSemiLotDialog WOProcessStaff={WOProcessStaff} WOId={WOId} isOpen={isShowing2} onClose={toggle2} />
      )} */}

      <WOProcessSemiLotDialog WOProcessStaff={WOProcessStaff} WOId={WOId} isOpen={isShowing2} onClose={toggle2} />
    </React.Fragment>
  );
}
