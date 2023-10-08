import { MuiButton, MuiDataGrid, MuiSearchField, MuiAutocomplete } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { Switch, Tooltip, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { SuccessAlert } from '@utils';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useModal } from '@basesShared';
import { QCToolService } from '@services';
import QCToolDialog from './QCToolDialog';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';

const TabTool = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const handleAdd = () => {
    setMode(CREATE_ACTION);
    setRowData();
    toggle();
  };

  const handleUpdate = (row) => {
    setMode(UPDATE_ACTION);
    setRowData({ ...row });
    toggle();
  };

  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      QCName: '',
      QCApply: null,
      showDelete: true,
    },
  });
  const [newData, setNewData] = useState();
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete]);

  useEffect(() => {
    if (!_.isEmpty(newData) && isRendered) {
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
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData) && isRendered) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.QCToolId == updateData.QCToolId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      QCName: state.searchData.QCName,
      QCApply: state.searchData.QCApply,
      showDelete: state.searchData.showDelete,
    };
    const res = await QCToolService.getQCToolList(params);
    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };
  const handleDelete = async (row) => {
    let message = state.searchData.showDelete
      ? intl.formatMessage({ id: 'general.confirm_delete' })
      : intl.formatMessage({ id: 'general.confirm_redo_deleted' });
    if (window.confirm(message)) {
      try {
        let res = await QCToolService.deleteQCTool({
          QCToolId: row.QCToolId,
          row_version: row.row_version,
        });
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getQCApply = async () => {
    const res = await QCToolService.getQCApply();
    return res;
  };
  const columns = [
    { field: 'QCToolId', headerName: '', flex: 0.3, hide: true },
    { field: 'QCTypeId', flex: 0.3, hide: true },
    { field: 'QCTypeName', hide: true },
    { field: 'QCItemId', flex: 0.3, hide: true },
    { field: 'QCItemName', hide: true },
    { field: 'Apply', hide: true },
    { field: 'QCName', flex: 0.3, hide: true },
    { field: 'QCStandardId', flex: 0.3, hide: true },
    { field: 'QCStandardName', hide: true },
    {
      field: 'id',
      headerName: '',
      flex: 0.01,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.QCToolId) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 100,
      // headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={6}>
              <IconButton
                aria-label="edit"
                color="warning"
                size="small"
                sx={[{ '&:hover': { border: '1px solid orange' } }]}
                onClick={() => handleUpdate(params.row)}
              >
                {params.row.isActived ? <EditIcon fontSize="inherit" /> : ''}
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <IconButton
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

    {
      field: 'QCFullName',
      headerName: intl.formatMessage({ id: 'standardQC.QCName' }),
      flex: 2,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.QCFullName ?? ''} className="col-text-elip">
            <Typography sx={{ fontSize: 14 }}>{params.row.QCFullName}</Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'QCApplyName',
      headerName: intl.formatMessage({ id: 'standardQC.QCApply' }),
      flex: 0.3,
    },

    { field: 'isActived', headerName: 'isActived', flex: 0.3, hide: true },
    { field: 'createdName', headerName: intl.formatMessage({ id: 'general.createdName' }), flex: 0.3 },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.3,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    { field: 'modifiedName', headerName: intl.formatMessage({ id: 'general.modifiedName' }), flex: 0.3 },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      flex: 0.3,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
  ];
  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid item xs={6}>
          <MuiButton text="create" color="success" onClick={handleAdd} />
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '35%' }}>
              <MuiSearchField
                fullWidth
                variant="QCName"
                size="small"
                label="standardQC.QCName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'QCName')}
              />
            </Grid>
            <Grid item style={{ width: '35%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'standardQC.QCApply' })}
                fetchDataFunc={getQCApply}
                displayLabel="commonDetailName"
                displayValue="commonDetailId"
                onChange={(e, item) => handleSearch(item ? item.commonDetailId ?? null : null, 'QCApply')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 0, mr: 3 }} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <FormControlLabel
            sx={{ mb: 0 }}
            control={
              <Switch
                defaultChecked={true}
                color="primary"
                onChange={(e) => handleSearch(e.target.checked, 'showDelete')}
              />
            }
            label={state.searchData.showDelete ? 'Active Data' : 'Delete Data'}
          />
        </Grid>
      </Grid>
      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        gridHeight={736}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        onPageSizeChange={(newPageSize) => setState({ ...state, pageSize: newPageSize, page: 1 })}
        getRowId={(rows) => rows.QCToolId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) {
            return `Mui-created`;
          }
        }}
        initialState={{ pinnedColumns: { left: ['id', 'QCFullName'], right: ['action'] } }}
      />
      <QCToolDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
        fetchData={fetchData}
      />
    </React.Fragment>
  );
};

export default TabTool;
