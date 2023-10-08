import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import { WIPReturnService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import WIPReturnDetail from './WIPReturnDetail';
import WIPReturnDialog from './WIPReturnDialog';
import WIPReturnLotDialog from './WIPReturnLotDialog';

export default function WIPReturn() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [isActivedRow, setIsActivedRow] = useState(0);
  const [View, setView] = useState(null);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      keyWord: '',
      showDelete: true,
      RMStatus: '',
      Description: '',
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [WIPRMId, setWIPRMId] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WIPRMId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WIPRMId', hide: true },
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
                onClick={() => handleDelete(params.row)}
                disabled={params.row.LotCheckStatus}
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
            {params.row.isActived && (
              <Grid item xs={4} style={{ textAlign: 'center' }}>
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
          </Grid>
        );
      },
    },
    {
      field: 'RMName',
      headerName: intl.formatMessage({ id: 'returnMaterial.RMName' }),
      flex: 0.5,
    },
    {
      field: 'RMStatus',
      headerName: intl.formatMessage({ id: 'returnMaterial.RMStatus' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? 'Received' : 'Waiting'),
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
        return o.WIPRMId == updateData.WIPRMId;
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
        let res = await WIPReturnService.deleteReturnMaterial(item);
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
    setWIPRMId(null);
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      AreaCode: 'WIP', //không đổi
      RMStatus: state.searchData.RMStatus != '' ? (state.searchData.RMStatus == '0' ? false : true) : null,
      RMName: state.searchData.keyWord,
      Description: state.searchData.Description,
      isActived: state.searchData.showDelete,
    };

    const res = await WIPReturnService.getReturnMaterialList(params);

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
          <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} />
        </Grid>
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
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="standard"
                label="returnMaterial.Description"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'Description')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'returnMaterial.RMStatus' })}
                fetchDataFunc={() => {
                  return {
                    Data: [
                      { value: '0', label: 'Waiting' },
                      { value: '1', label: 'Received' },
                    ],
                  };
                }}
                displayLabel="label"
                displayValue="value"
                onChange={(e, item) => handleSearch(item ? item?.value ?? '' : '', 'RMStatus')}
                variant="standard"
                fullWidth
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
        getRowId={(rows) => rows.WIPRMId}
        onSelectionModelChange={(Ids) => setWIPRMId(Ids[0])}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        onRowClick={(row) => {
          setIsActivedRow(row?.row?.isActived);
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />

      <WIPReturnDetail WIPRMId={WIPRMId} isActivedRow={isActivedRow} />

      <WIPReturnDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
      />

      <WIPReturnLotDialog RMModel={View} isOpen={isShowing2} onClose={toggle2} />
    </React.Fragment>
  );
}
