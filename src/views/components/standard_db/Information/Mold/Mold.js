import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiIconButton } from '@controls';
import { MoldDto } from '@models';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Grid, IconButton, Switch } from '@mui/material';
import { moldService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import MoldDialog from './MoldDialog';

import MoldCheckDialog from './MoldCheckDialog';
import MoldHistoryDialog from './MoldHistoryDialog';
import MoldCheckQCDialog from './MoldCheckQCDialog';

export default function Mold() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [moldState, setMoldState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      ...MoldDto,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});

  //MoldCheckDialog
  const [openMoldCheckDialog, setOpenMoldCheckDialog] = useState(false);
  const [openMoldHistoryDialog, setOpenMoldHistoryDialog] = useState(false);

  const handleCheckPQC = async (row, isOpen) => {
    toggle2();
    setRowData(row);
  };

  const handleOpenHistory = async (row, isOpen) => {
    setOpenMoldHistoryDialog(isOpen);
    setRowData({ ...row });
    // alert(
    //   intl.formatMessage({
    //     id: 'general.work_in_progress',
    //   })
    // );
  };

  const handleCloseHistory = async () => {
    setOpenMoldHistoryDialog(false);
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MoldId) + 1 + (moldState.page - 1) * moldState.pageSize,
    },

    { field: 'MoldId', hide: true },

    {
      field: 'action',
      headerName: '',
      width: 135,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <MuiIconButton
                color="error"
                onClick={() => handleCheckPQC(params.row)}
                text="checkqc"
                disabled={!params.row.QCMasterId || !params?.row?.isActived}
              />
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
                disabled={params.row.MoldStatusName !== 'NOT YET CHECK'}
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

    // {
    //   field: 'check-history',
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
    //             aria-label="check form"
    //             color="error"
    //             size="small"
    //             sx={[{ '&:hover': { border: '1px solid red' } }]}
    //             onClick={() => handleOpenCheckForm(params.row, true)}
    //           >
    //             {/* {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />} */}
    //             <CheckBoxIcon fontSize="inherit" />
    //           </IconButton>
    //         </Grid>
    //         <Grid item xs={6} style={{ textAlign: 'center' }}>
    //           <IconButton
    //             aria-label="history"
    //             color="warning"
    //             size="small"
    //             sx={[{ '&:hover': { border: '1px solid orange' } }]}
    //             onClick={() => handleOpenHistory(params.row, true)}
    //           >
    //             <HistoryIcon fontSize="inherit" />
    //           </IconButton>
    //         </Grid>
    //       </Grid>
    //     );
    //   },
    // },

    {
      field: 'MoldStatusName',
      headerName: intl.formatMessage({ id: 'mold.MoldStatusName' }),
      width: 150,
    },

    {
      field: 'MoldCode',
      headerName: intl.formatMessage({ id: 'mold.MoldCode' }),
      width: 150,
    },

    {
      field: 'MoldName',
      headerName: intl.formatMessage({ id: 'mold.MoldName' }),
      width: 300,
    },

    {
      field: 'MoldVersion',
      headerName: intl.formatMessage({ id: 'mold.Version' }),
      width: 200,
    },

    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'mold.ProductCode' }),
      width: 250,
    },

    {
      field: 'MoldTypeName',
      headerName: intl.formatMessage({ id: 'mold.moldType' }),
      width: 150,
    },

    {
      field: 'CurrentNumber',
      headerName: intl.formatMessage({ id: 'mold.CurrentNumber' }),
      width: 150,
    },

    {
      field: 'MaxNumber',
      headerName: intl.formatMessage({ id: 'mold.MaxNumber' }),
      width: 150,
    },

    {
      field: 'PeriodNumber',
      headerName: intl.formatMessage({ id: 'mold.PeriodNumber' }),
      width: 150,
    },
    // {
    //   field: 'UsingNumber',
    //   headerName: 'Using Number',
    //   width: 150,
    // },
    {
      field: 'CheckNo',
      headerName: intl.formatMessage({ id: 'mold.CheckNo' }),
      width: 150,
    },
    {
      field: 'ProductionDate',
      headerName: intl.formatMessage({ id: 'mold.ProductionDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },

    {
      field: 'Remark',
      headerName: intl.formatMessage({ id: 'mold.Remark' }),
      width: 300,
    },

    {
      field: 'SupplierCode',
      headerName: intl.formatMessage({ id: 'mold.SupplierCode' }),
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
  }, [moldState.page, moldState.pageSize, moldState.searchData.isActived]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...moldState.data];
      if (data.length > moldState.pageSize) {
        data.pop();
      }
      setMoldState({
        ...moldState,
        data: [...data],
        totalRow: moldState.totalRow + 1,
      });
    }
  }, [newData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...moldState.data];
      const index = _.findIndex(newArr, function (o) {
        return o.MoldId == updateData.MoldId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setMoldState({ ...moldState, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleDelete = async (mold) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: mold.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        if (mold.MoldStatus !== '000' || mold.MoldStatusName !== 'NOT YET CHECK') {
          ErrorAlert(intl.formatMessage({ id: 'mold.cannot_delete' }));
        } else {
          let res = await moldService.deleteMold({
            MoldId: mold.MoldId,
            row_version: mold.row_version,
            isActived: mold.isActived,
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
    setRowData({ ...MoldDto });
    toggle();
  };

  const handleUpdate = (row) => {
    setMode(UPDATE_ACTION);
    setRowData({ ...row });
    toggle();
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...moldState.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'isActived') {
      setMoldState({ ...moldState, page: 1, searchData: { ...newSearchData } });
    } else {
      setMoldState({ ...moldState, searchData: { ...newSearchData } });
    }
  };

  const handleCellClick = (param, event) => {
    //disable click cell
    event.defaultMuiPrevented = param.field === 'action';
  };

  async function fetchData() {
    if (isRendered) {
      setMoldState({ ...moldState, isLoading: true });
    }

    const params = {
      page: moldState.page,
      pageSize: moldState.pageSize,
      MoldCode: moldState.searchData.MoldCode,
      MoldName: moldState.searchData.MoldName,
      MoldStatus: moldState.searchData.MoldStatus,
      ProductId: moldState.searchData.ProductId,
      isActived: moldState.searchData.isActived,
    };

    const res = await moldService.get(params);
    if (res && isRendered)
      setMoldState({
        ...moldState,
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
                label="mold.MoldCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MoldCode')}
              />
            </Grid>

            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                label="mold.MoldName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MoldName')}
              />
            </Grid>

            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'mold.MoldStatusName' })}
                fetchDataFunc={moldService.getStatus}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailLanguge"
                onChange={(e, item) => handleSearch(item ? item.commonDetailLanguge ?? null : null, 'MoldStatus')}
                variant="standard"
              />
            </Grid>

            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'mold.ProductCode' })}
                fetchDataFunc={moldService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
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
              id: moldState.searchData.isActived ? 'general.data_actived' : 'general.data_deleted',
            })}
          />
        </Grid>
      </Grid>

      <MuiDataGrid
        showLoading={moldState.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={moldState.data}
        gridHeight={736}
        page={moldState.page - 1}
        pageSize={moldState.pageSize}
        rowCount={moldState.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setMoldState({ ...moldState, page: newPage + 1 })}
        onPageSizeChange={(newPageSize) => setMoldState({ ...moldState, pageSize: newPageSize, page: 1 })}
        onCellClick={handleCellClick}
        getRowId={(rows) => rows.MoldId}
        getRowClassName={(params) => {
          const sttMold = params.row?.MoldStatusName;
          if (_.isEqual(params.row, newData)) return `Mui-created`;
          if (
            params.row?.PeriodNumber * (params.row?.CheckNo == 0 ? 1 : params.row?.CheckNo) - 5 <=
              params.row?.UsingNumber &&
            params.row?.UsingNumber != 0 &&
            sttMold != 'NG' &&
            sttMold != 'HOLD' &&
            sttMold != 'SCRAP'
          ) {
            return `Mui-mold-hold`;
          }
          if (sttMold == 'NG' || sttMold == 'HOLD' || sttMold == 'SCRAP') {
            return `Mui-mold-red`;
          }
        }}
        initialState={{
          pinnedColumns: {
            left: ['id', 'check-history', 'MoldStatusName', 'MoldCode', 'MoldName'],
            right: ['action'],
          },
        }}
      />

      <MoldDialog
        fetchData={fetchData}
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
      />

      <MoldCheckQCDialog RowCheck={rowData} isOpen={isShowing2} onClose={toggle2} setUpdateData={setUpdateData} />
      <MoldHistoryDialog initModal={rowData} isOpen={openMoldHistoryDialog} onClose={handleCloseHistory} />
    </React.Fragment>
  );
}
