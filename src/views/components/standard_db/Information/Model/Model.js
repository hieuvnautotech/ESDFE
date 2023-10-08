import { useModal } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiDateField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography, Stack, TextField } from '@mui/material';
import { ModelService } from '@services';
import { ErrorAlert, SuccessAlert, addDays } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import ModelDialog from './ModelDialog';

export default function Model() {
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
    pageSize: 20,
    searchData: {
      ModelCode: '',
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.ModelId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'ModelId', hide: true },
    { field: 'row_version', hide: true },
    // {
    //   field: 'action',
    //   headerName: '',
    //   width: 80,
    //   disableClickEventBubbling: true,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Grid container spacing={1} alignItems="center" justifyContent="center">
    //         <Grid item xs={6} style={{ textAlign: 'center' }}>
    //           <IconButton
    //             aria-label="delete"
    //             color="error"
    //             size="small"
    //             sx={[{ '&:hover': { border: '1px solid red' } }]}
    //             onClick={() => handleDelete(params.row)}
    //           >
    //             {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
    //           </IconButton>
    //         </Grid>
    //         <Grid item xs={6} style={{ textAlign: 'center' }}>
    //           <IconButton
    //             aria-label="edit"
    //             color="warning"
    //             size="small"
    //             sx={[{ '&:hover': { border: '1px solid orange' } }]}
    //             onClick={() => handleUpdate(params.row)}
    //           >
    //             <EditIcon fontSize="inherit" />
    //           </IconButton>
    //         </Grid>
    //       </Grid>
    //     );
    //   },
    // },
    {
      field: 'ModelCode',
      headerName: intl.formatMessage({ id: 'general.model' }),
      flex: 0.7,
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
        return o.ModelId == updateData.ModelId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleDelete = async (material) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: material.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await ModelService.deleteModel({
          ModelId: material.ModelId,
          row_version: material.row_version,
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
      ModelCode: state.searchData.ModelCode,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await ModelService.getModelList(params);

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
        <Grid item xs={3}>
          {/* <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} /> */}
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="ModelCode"
                label="general.code"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'ModelCode')}
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
        getRowId={(rows) => rows.ModelId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { left: ['id', 'ModelCode'], right: ['action'] } }}
      />

      <ModelDialog
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
