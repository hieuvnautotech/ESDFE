import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiDataGrid, MuiDialog, MuiButton, MuiIconButton } from '@controls';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { WOService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, IconButton, Paper, Stack } from '@mui/material';
import { ErrorAlert, isNumber, SuccessAlert, PrintSemiMMS } from '@utils';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import WOSemiLotDetail from './WOSemiLotDetail';
import WOProcessMaterial from './WOProcessMaterial';
import WOPressLotDialog from './WOPressLotDialog';
import WOSemiCheckPQCSLDialog from './WOSemiCheckPQCSLDialog';
import { useTokenStore } from '@stores';
import PrintIcon from '@mui/icons-material/Print';

const WOSemiLot = ({ WOProcessId, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [RowCheck, setRowCheck] = useState({});
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [mode, setMode] = useState(CREATE_ACTION);

  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
  });
  const [stateMold, setStateMold] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
  });
  const { isShowing, toggle } = useModal();
  const [rowData, setRowData] = useState({});
  const [newData, setNewData] = useState({});
  const { isShowing2, toggle2 } = useModal2();

  const setWOSemiLotMMSId = useTokenStore((state) => state.setWOSemiLotMMSId);
  const WOSemiLotMMSId = useTokenStore((state) => state.WOSemiLotMMSId);

  const handleCloseDialog = () => {
    onClose();
  };
  const handleAdd = async () => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_create' }))) {
      try {
        const res = await WOService.createSemiLot({
          WOProcessId: WOProcessId,
        });
        if (res.HttpResponseCode === 200 && res.Data) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          setNewData({ ...res.Data });
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
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
        let res = await WOService.deleteSemiLot(item);
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

  const handlePrint = async (item) => {
    const res = await WOService.getPrintInfo(item.WOSemiLotMMSId);
    PrintSemiMMS([res.Data]);
  };

  const handleCheckPQC = async (row) => {
    setRowCheck(row);
    toggle();
  };

  const handleCloseCheckPQC = () => {
    toggle();
    fetchData();
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotMMSId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOSemiLotMMSId', hide: true },
    { field: 'WOProcessId', hide: true },
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
              <MuiIconButton color="error" onClick={() => handleCheckPQC(params.row)} text="checkqc" />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                disabled={params.row.IsConfirm ? true : false}
                onClick={() => handleDelete(params.row)}
              >
                {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <IconButton
                color="info"
                size="small"
                sx={[{ '&:hover': { border: '1px solid skyblue' } }]}
                onClick={() => handlePrint(params.row)}
              >
                <PrintIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    // {
    //   field: 'PQC',
    //   headerName: 'PQC',
    //   width: 80,
    //   disableClickEventBubbling: true,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         size="small"
    //         onClick={() => handleCheckPQC(params.row)}
    //         sx={{ paddingTop: '1px', paddingBottom: '1px' }}
    //       >
    //         {intl.formatMessage({ id: 'WO.Check' })}
    //       </Button>
    //     );
    //   },
    // },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      width: 350,
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      width: 100,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      width: 100,
      editable: true,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 180,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'countRowMMSDetail',
      headerName: intl.formatMessage({ id: 'WO.mtcnt' }),
      width: 100,
    },
    {
      field: 'CheckResult',
      headerName: intl.formatMessage({ id: 'WO.PQCSemilotStatus' }),
      width: 100,
      renderCell: (params) => {
        {
          {
            if (params.row.CheckResult) return 'OK';
            else {
              if (params.row.CheckResult == false) return 'NG';
              else return 'Not Yet';
            }
          }
        }
      },
    },

    // {
    //   field: 'Description',
    //   headerName: intl.formatMessage({ id: 'general.description' }),
    //   width: 250,
    //   renderCell: (params) => {
    //     return (
    //       <Tooltip title={params.row.Description ?? ''} className="col-text-elip">
    //         <Typography sx={{ fontSize: 14 }}>{params.row.Description}</Typography>
    //       </Tooltip>
    //     );
    //   },
    // },
  ];
  const columnsMold = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.WOProcessMoldId) + 1 + (stateMold.page - 1) * stateMold.pageSize,
    },
    { field: 'MoldId', hide: true },
    { field: 'WOProcessId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'MoldName',
      headerName: intl.formatMessage({ id: 'WO.mold' }),
      flex: 1,
    },
    {
      field: 'PressingTimes',
      headerName: intl.formatMessage({ id: 'WO.PressingTime' }),
      flex: 0.6,
      editable: true,
    },
  ];
  //useEffect
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }

    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, isOpen, WOProcessId]);
  useEffect(() => {
    if (isOpen) {
      fetchDataMold();
    }

    return () => {
      isRendered = false;
    };
  }, [stateMold.page, stateMold.pageSize, isOpen, WOProcessId]);

  async function fetchData() {
    setWOSemiLotMMSId(1);
    setState({ ...state, isLoading: true });
    const params = {
      WOProcessId: WOProcessId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await WOService.getWOSemiLotMMS(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  async function fetchDataMold() {
    setWOSemiLotMMSId(null);
    setStateMold({ ...stateMold, isLoading: true });
    const params = {
      WOProcessId: WOProcessId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await WOService.getWOProcessMoldList(params);

    if (res && res.Data && isRendered)
      setStateMold({
        ...stateMold,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
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

  const handleRowUpdate = async (newRow) => {
    if (!isNumber(newRow.ActualQty)) {
      newRow.ActualQty = null;
    } else {
      newRow.ActualQty = newRow.ActualQty >= 0 ? parseInt(newRow.ActualQty) : null;
    }
    if (newRow.ActualQty >= 0) {
      if (window.confirm(intl.formatMessage({ id: 'general.confirm_save' }))) {
        try {
          const res = await WOService.modifyWOSemiLotQuantity(newRow);
          if (res.HttpResponseCode === 200) {
            SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
            fetchData();
            setDialogState({ ...dialogState, isSubmit: false });
          } else {
            ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
            setDialogState({ ...dialogState, isSubmit: false });
          }
        } catch (error) {
          console.log(error);
        }
      }
      newRow.ActualQty = newRow.OriginQty;
    }

    return newRow;
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.log('update error', error);
    ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
  }, []);

  const handleRowUpdateMold = async (newRow) => {
    if (!isNumber(newRow.PressingTimes)) {
      newRow.PressingTimes = null;
    } else {
      newRow.PressingTimes = newRow.PressingTimes > 0 ? parseInt(newRow.PressingTimes) : null;
    }
    if (newRow.PressingTimes > 0) {
      if (window.confirm(intl.formatMessage({ id: 'general.confirm_save' }))) {
        try {
          newRow.WOProcessId = WOProcessId;
          const res = await WOService.createWOMoldPressingTime(newRow);
          if (res.HttpResponseCode === 200) {
            SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
            fetchData();
            setDialogState({ ...dialogState, isSubmit: false });
          } else {
            ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
            setDialogState({ ...dialogState, isSubmit: false });
          }
        } catch (error) {
          console.log(error);
        }
      }
      newRow.ActualQty = newRow.OriginQty;
    }

    return newRow;
  };
  const handleProcessRowUpdateErrorMold = React.useCallback((error) => {
    console.log('update error', error);
    ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
  }, []);

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} intl={intl} searchData={stateMold.searchData} />,
    []
  );
  const getDetailPanelHeight = React.useCallback(() => 260, []);
  return (
    <MuiDialog
      maxWidth={false}
      fullWidth={true}
      title={intl.formatMessage({ id: 'WO.semilotmaterialmapping' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={8}>
          <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
            <Grid item xs={3}>
              <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} />
            </Grid>
          </Grid>
          <MuiDataGrid
            showLoading={state.isLoading}
            isPagingServer={true}
            headerHeight={35}
            columns={columns}
            rows={state.data}
            page={state.page - 1}
            pageSize={state.pageSize}
            rowCount={state.totalRow}
            onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
            getRowId={(rows) => rows.WOSemiLotMMSId}
            onSelectionModelChange={(Ids) => setWOSemiLotMMSId(Ids[0])}
            // onRowClick={(params) => {
            //   setWOSemiLotMMS(params.row);
            // }}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
            }}
            initialState={{ pinnedColumns: { left: ['id', 'SemiLotCode'], right: ['PQC', 'action'] } }}
            processRowUpdate={handleRowUpdate}
            //isCellEditable={(params) => params.row.QCResult === true}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Grid>
        <Grid item xs={4} sx={{ marginTop: '3rem' }}>
          <MuiDataGrid
            showLoading={stateMold.isLoading}
            isPagingServer={true}
            headerHeight={35}
            columns={columnsMold}
            rows={stateMold.data}
            page={stateMold.page - 1}
            pageSize={stateMold.pageSize}
            rowCount={stateMold.totalRow}
            onPageChange={(newPage) => setStateMold({ ...stateMold, page: newPage + 1 })}
            getRowId={(rows) => rows.WOProcessMoldId}
            onSelectionModelChange={(Ids) => setWOSemiLotMMSId(Ids[0])}
            // onRowClick={(params) => {
            //   setWOSemiLotMMS(params.row);
            // }}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
            }}
            initialState={{ pinnedColumns: { left: ['id', 'SemiLotCode'], right: ['PQC', 'action'] } }}
            processRowUpdate={handleRowUpdateMold}
            //isCellEditable={(params) => params.row.QCResult === true}
            onProcessRowUpdateError={handleProcessRowUpdateErrorMold}
            experimentalFeatures={{ newEditingApi: true }}
            rowThreshold={0}
            getDetailPanelHeight={getDetailPanelHeight}
            getDetailPanelContent={getDetailPanelContent}
          />
        </Grid>
      </Grid>

      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={8} sx={{ marginTop: '8px' }}>
          <WOSemiLotDetail />
        </Grid>
        <Grid item xs={4}>
          <WOProcessMaterial />
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="space-around">
        <Grid item xs={11} direction="row" justifyContent="flex-start" alignItems="center">
          <ArrowBackIosNewIcon
            fontSize="inherit"
            sx={{ marginRight: '1rem', fontSize: '30px', cursor: 'pointer' }}
            onClick={handleCloseDialog}
          />
        </Grid>
        <Grid item xs={1} direction="row" justifyContent="flex-end" alignItems="center">
          <ArrowForwardIosIcon
            fontSize="inherit"
            sx={{ marginLeft: '5rem', fontSize: '30px', cursor: 'pointer' }}
            onClick={() => toggle2()}
          />
        </Grid>
      </Grid>
      <WOPressLotDialog WOProcessId={WOProcessId} isOpen={isShowing2} onClose={toggle2} />
      <WOSemiCheckPQCSLDialog RowCheck={RowCheck} isOpen={isShowing} onClose={handleCloseCheckPQC} />
    </MuiDialog>
  );
};
const DetailPanelContent = ({ row: rowProp, intl, searchData }) => {
  let isDetailRendered = useRef(true);

  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
    MoldId: rowProp.MoldId,
    WOProcessId: rowProp.WOProcessId,
  });

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      isActived: true,
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
      MoldId: detailPanelState.MoldId,
      WOProcessId: detailPanelState.WOProcessId,
    };

    const res = await WOService.getWOProcessMoldListDetail(params);

    setDetailPanelState({
      ...detailPanelState,
      data: res.Data ?? [],
      totalRow: res.TotalRow,
      isLoading: false,
    });
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.WOMoldPressingId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'PressingTimes',
      headerName: intl.formatMessage({ id: 'WO.PressingTime' }),
      flex: 0.5,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
      editable: true,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp, searchData]);

  const handleRowUpdateMold = async (newRow) => {
    if (!isNumber(newRow.PressingTimes)) {
      newRow.PressingTimes = null;
    } else {
      newRow.PressingTimes = newRow.PressingTimes > 0 ? parseInt(newRow.PressingTimes) : null;
    }
    if (newRow.PressingTimes > 0) {
      if (window.confirm(intl.formatMessage({ id: 'general.confirm_modify' }))) {
        try {
          const res = await WOService.updateWOMoldPressingTime(newRow);
          if (res.HttpResponseCode === 200) {
            SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
            fetchDetailData();
          } else {
            ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
          }
        } catch (error) {
          console.log(error);
        }
      }
      newRow.ActualQty = newRow.OriginQty;
    }

    return newRow;
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.log('update error', error);
    ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
  }, []);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <MuiDataGrid
          showLoading={detailPanelState.isLoading}
          isPagingServer={true}
          headerHeight={35}
          columns={detailPanelColumns}
          rows={detailPanelState.data}
          page={detailPanelState.page - 1}
          pageSize={detailPanelState.pageSize}
          rowCount={detailPanelState.totalRow}
          onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
          getRowId={(rows) => rows.WOMoldPressingId}
          initialState={{ pinnedColumns: { right: ['action'] } }}
          processRowUpdate={handleRowUpdateMold}
          nProcessRowUpdateError={handleProcessRowUpdateError}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Paper>
    </Stack>
  );
};
export default WOSemiLot;
