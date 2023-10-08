import { useModal } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Grid, IconButton, Switch } from '@mui/material';
import { BladeService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import BladeDialog from './BladeDialog';

import BladeCheckDialog from './BladeCheckDialog';
import BladeHistoryDialog from './BladeHistoryDialog';
import BladeCheckQCDialog from './BladeCheckQCDialog';

export default function Blade() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const [BladeState, setBladeState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      keyWord: '',
      BladeStatus: '',
      ProductCode: '',
      showDelete: true,
      // StartDate: addDays(date, -7),
      // EndDate: date,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});

  //BladeCheckDialog
  const [openBladeCheckDialog, setOpenBladeCheckDialog] = useState(false);
  const [openBladeHistoryDialog, setOpenBladeHistoryDialog] = useState(false);

  const handleOpenCheckForm = async (row, isOpen) => {
    setOpenBladeCheckDialog(isOpen);
    setRowData({ ...row });
  };
  const handleCloseCheckForm = async () => {
    setOpenBladeCheckDialog(false);
  };

  const handleOpenHistory = async (row, isOpen) => {
    setOpenBladeHistoryDialog(isOpen);
    setRowData({ ...row });
  };
  const handleCloseHistory = async () => {
    setOpenBladeHistoryDialog(false);
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.BladeId) + 1 + (BladeState.page - 1) * BladeState.pageSize,
    },
    { field: 'BladeId', hide: true },
    { field: 'SupplierId', hide: true },
    { field: 'QCMoldMasterId', hide: true },
    { field: 'LineId', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 160,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="check form"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleOpenCheckForm(params.row, true)}
              >
                <CheckBoxIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="history"
                color="warning"
                size="small"
                sx={[{ '&:hover': { border: '1px solid orange' } }]}
                onClick={() => handleOpenHistory(params.row, true)}
              >
                <HistoryIcon fontSize="inherit" />
              </IconButton>
            </Grid>
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
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <IconButton
                disabled={params.row.BladeStatus !== '000'}
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
    {
      field: 'BladeStatusName',
      headerName: intl.formatMessage({ id: 'Blade.BladeStatusName' }),
      width: 150,
    },
    {
      field: 'BladeName',
      headerName: intl.formatMessage({ id: 'Blade.BladeName' }),
      width: 250,
    },
    {
      field: 'BladeSize',
      headerName: intl.formatMessage({ id: 'Blade.BladeSize' }),
      width: 200,
    },
    {
      field: 'SupplierName',
      headerName: intl.formatMessage({ id: 'Blade.SupplierCode' }),
      width: 200,
    },
    {
      field: 'ImportDate',
      headerName: intl.formatMessage({ id: 'Blade.ImportDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'QCMoldMasterName',
      headerName: intl.formatMessage({ id: 'Blade.QCMasterName' }),
      width: 200,
    },
    {
      field: 'CutMaxNumber',
      headerName: intl.formatMessage({ id: 'Blade.CutMaxNumber' }),
      width: 150,
    },
    {
      field: 'PeriodicCheck',
      headerName: intl.formatMessage({ id: 'Blade.SoMetDiMai' }),
      width: 150,
    },
    {
      field: 'CutCurrentNumber',
      headerName: intl.formatMessage({ id: 'Blade.CutCurrentNumber' }),
      width: 150,
    },
    {
      field: 'UsingNumber',
      headerName: 'Using Number',
      width: 150,
    },
    {
      field: 'LineName',
      headerName: intl.formatMessage({ id: 'Blade.LineName' }),
      width: 200,
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'Blade.Description' }),
      width: 300,
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      width: 150,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.modifiedName' }),
      width: 150,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [BladeState.page, BladeState.pageSize, BladeState.searchData.isActived]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...BladeState.data];
      if (data.length > BladeState.pageSize) {
        data.pop();
      }
      setBladeState({
        ...BladeState,
        data: [...data],
        totalRow: BladeState.totalRow + 1,
      });
    }
  }, [newData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...BladeState.data];
      const index = _.findIndex(newArr, function (o) {
        return o.BladeId == updateData.BladeId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setBladeState({ ...BladeState, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleDelete = async (Blade) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: Blade.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        if (Blade.BladeStatus !== '000' || Blade.BladeStatusName !== 'NOT YET CHECK') {
          ErrorAlert(intl.formatMessage({ id: 'Blade.cannot_delete' }));
        } else {
          let res = await BladeService.deleteBlade({
            BladeId: Blade.BladeId,
            row_version: Blade.row_version,
            isActived: Blade.isActived,
          });
          if (res && res.HttpResponseCode === 200) {
            SuccessAlert(intl.formatMessage({ id: 'general.success' }));
            await fetchData();
          } else {
            ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAdd = () => {
    setMode(CREATE_ACTION);
    setRowData({});
    toggle();
  };

  const handleUpdate = (row) => {
    setMode(UPDATE_ACTION);
    setRowData({ ...row });
    toggle();
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...BladeState.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'isActived') {
      setBladeState({ ...BladeState, page: 1, searchData: { ...newSearchData } });
    } else {
      setBladeState({ ...BladeState, searchData: { ...newSearchData } });
    }
  };

  const handleCellClick = (param, event) => {
    //disable click cell
    event.defaultMuiPrevented = param.field === 'action';
  };

  async function fetchData() {
    if (isRendered) {
      setBladeState({ ...BladeState, isLoading: true });
    }

    const params = {
      page: BladeState.page,
      pageSize: BladeState.pageSize,
      BladeName: BladeState.searchData.BladeName,
      BladeStatus: BladeState.searchData.BladeStatus,
      isActived: BladeState.searchData.isActived,
    };

    const res = await BladeService.get(params);
    if (res && isRendered)
      setBladeState({
        ...BladeState,
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
                label="Blade.BladeName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BladeName')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'Blade.BladeStatusName' })}
                fetchDataFunc={BladeService.getStatus}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailCode"
                onChange={(e, item) => handleSearch(item ? item.commonDetailCode ?? null : null, 'BladeStatus')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mb: 1 }} />
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
                onChange={(e) => handleSearch(e.target.checked, 'isActived')}
              />
            }
            label={intl.formatMessage({
              id: BladeState.searchData.isActived ? 'general.data_actived' : 'general.data_deleted',
            })}
          />
        </Grid>
      </Grid>

      <MuiDataGrid
        showLoading={BladeState.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={BladeState.data}
        gridHeight={736}
        page={BladeState.page - 1}
        pageSize={BladeState.pageSize}
        rowCount={BladeState.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setBladeState({ ...BladeState, page: newPage + 1 })}
        onPageSizeChange={(newPageSize) => setBladeState({ ...BladeState, pageSize: newPageSize, page: 1 })}
        onCellClick={handleCellClick}
        getRowId={(rows) => rows.BladeId}
        getRowClassName={(params) => {
          const sttBlade = params.row?.BladeStatusName;
          if (_.isEqual(params.row, newData)) return `Mui-created`;
          if (
            params.row?.PeriodicCheck * (params.row?.CheckNo == 0 ? 1 : params.row?.CheckNo) - 5 <=
              params.row?.UsingNumber &&
            params.row?.UsingNumber != 0 &&
            sttBlade != 'NG' &&
            sttBlade != 'HOLD' &&
            sttBlade != 'SCRAP'
          ) {
            return `Mui-mold-hold`;
          }
          if (sttBlade == 'NG' || sttBlade == 'HOLD' || sttBlade == 'SCRAP') {
            return `Mui-mold-red`;
          }
        }}
        initialState={{
          pinnedColumns: {
            left: ['id', 'check-history', 'BladeStatusName', 'BladeName'],
            right: ['action'],
          },
        }}
      />

      <BladeDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
        fetchData={fetchData}
      />

      {/* <BladeCheckDialog
        initModal={rowData}
        isOpen={openBladeCheckDialog}
        onClose={handleCloseCheckForm}
        setUpdateData={setUpdateData}
      /> */}

      <BladeCheckQCDialog
        RowCheck={rowData}
        isOpen={openBladeCheckDialog}
        onClose={handleCloseCheckForm}
        setUpdateData={setUpdateData}
      />

      <BladeHistoryDialog initModal={rowData} isOpen={openBladeHistoryDialog} onClose={handleCloseHistory} />
    </React.Fragment>
  );
}
