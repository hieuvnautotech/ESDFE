import { useModal, useModal2, useModal3 } from '@basesShared';
import { MuiButton, MuiDataGrid, MuiDialog } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import MergeIcon from '@mui/icons-material/Merge';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Grid, IconButton, Button } from '@mui/material';
import { ActualService } from '@services';
import { ErrorAlert, SuccessAlert, PrintSemiFQC } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import WOProcessSemiLotDetailCheckQCDialog from './WOProcessSemiLotDetailCheckQCDialog';
import WOProcessSemiLotDetailDialog from './WOProcessSemiLotDetailDialog';
import WOProcessSemiLotAddReplaceDialog from './WOProcessSemiLotAddReplaceDialog';
import WOProcessSemiLotMergeDialog from './WOProcessSemiLotMergeDialog';

const WOProcessSemiLotDialog = ({ WOProcessStaff, WOId, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
  });
  const [stateDetail, setStateDetail] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
  });
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const { isShowing3, toggle3 } = useModal3();
  const [isShowing4, setisShowing4] = useState(false);
  const [newData, setNewData] = useState({});
  const [newDataDetail, setNewDataDetail] = useState({});
  const [WOSemiLotFQCId, setWOSemiLotFQCId] = useState(null);
  const [WOSemiLotFQCDetail, setWOSemiLotFQCDetail] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotFQCId) + 1 + (state.page - 1) * state.pageSize,
    },
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
                aria-label="add"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleMerge(params.row)}
              >
                <MergeIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="add"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleAddReplace(params.row)}
              >
                <AddIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
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
    { field: 'WOSemiLotFQCId', hide: true },
    { field: 'row_version', hide: true },

    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
      flex: 0.4,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.7,
    },
    {
      field: 'PressLotCode',
      headerName: intl.formatMessage({ id: 'WO.PressLotCode' }),
      flex: 0.4,
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
  ];

  const detailColumns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.WOSemiLotDetailId) + 1 + (stateDetail.page - 1) * stateDetail.pageSize,
    },
    { field: 'WOSemiLotFQCId', hide: true },
    { field: 'row_version', hide: true },
    { field: 'IsFinish', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 110,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              {params.row.Description != 'Hangbu' && (
                <IconButton
                  aria-label="edit"
                  color="success"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid green' } }]}
                  onClick={() => handleCheckQC(params.row)}
                >
                  <CheckCircleOutlineIcon fontSize="inherit" />
                </IconButton>
              )}
            </Grid>
            {!params.row.IsFinish && (
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <IconButton
                  aria-label="stop"
                  color="error"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid red' } }]}
                  onClick={() => handleStopInheritance(params.row)}
                >
                  <AirlineStopsIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            )}
            {params.row.IsFinish && params.row.Description != 'Hangbu' ? (
              ''
            ) : (
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <IconButton
                  aria-label="delete"
                  color="error"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid red' } }]}
                  onClick={() => handleDeleteDetail(params.row)}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            )}
          </Grid>
        );
      },
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'WO.MaterialLotCode' }),
      width: 400,
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      width: 200,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'general.description' }),
      width: 150,
    },
    // {
    //   field: 'createdName',
    //   headerName: intl.formatMessage({ id: 'general.createdName' }),
    //   width: 150,
    // },
    // {
    //   field: 'createdDate',
    //   headerName: intl.formatMessage({ id: 'general.createdDate' }),
    //   valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    //   width: 180,
    // },
    // {
    //   field: 'modifiedName',
    //   headerName: intl.formatMessage({ id: 'general.modifiedName' }),
    //   width: 150,
    // },
    // {
    //   field: 'modifiedDate',
    //   headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
    //   valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    //   width: 180,
    // },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
    return () => (isRendered = false);
  }, [isOpen, WOProcessStaff, state.page]);

  useEffect(() => {
    if (isOpen) {
      fetchDataDetail();
    }
    return () => (isRendered = false);
  }, [isOpen, WOSemiLotFQCId, stateDetail.page]);

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
    if (!_.isEmpty(newDataDetail)) {
      const data = [newDataDetail, ...stateDetail.data];
      if (data.length > stateDetail.pageSize) {
        data.pop();
      }
      setStateDetail({
        ...stateDetail,
        data: [...data],
        totalRow: stateDetail.totalRow + 1,
      });
    }
  }, [newDataDetail]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOProcessId: WOProcessStaff.WOProcessId,
      WOProcessStaffId: WOProcessStaff.WOProcessStaffId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await ActualService.getWOSemiLotFQC(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  async function fetchDataDetail() {
    setStateDetail({ ...stateDetail, isLoading: true });
    const params = {
      WOSemiLotFQCId: WOSemiLotFQCId,
      page: stateDetail.page,
      pageSize: stateDetail.pageSize,
    };

    const res = await ActualService.getWOSemiLotDetail(params);

    if (res && res.Data && isRendered)
      setStateDetail({
        ...stateDetail,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleAdd = async () => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_create' }))) {
      try {
        const res = await ActualService.createSemiLot({
          WOProcessId: WOProcessStaff.WOProcessId,
          WOProcessStaffId: WOProcessStaff.WOProcessStaffId,
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

  const handlePrint = async (item) => {
    const res = await ActualService.getPrintInfo(item.WOSemiLotFQCId);
    PrintSemiFQC([res.Data]);
  };

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await ActualService.deleteSemiLot(item);
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

  const handleDeleteDetail = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await ActualService.deleteSemiLotDetail(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchDataDetail(null);
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleStopInheritance = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'semiFqc.comfirm_stopInheritance' }))) {
      try {
        let res = await ActualService.stopInheritanceSemiLotDetail(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchDataDetail(null);
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleCheckQC = async (item) => {
    console.log(item, 'SAAAAAAAAA');
    setWOSemiLotFQCDetail(item);
    toggle2();
  };

  const handleClose = async () => {
    setState({
      isLoading: false,
      data: [],
      totalRow: 0,
      page: 1,
      pageSize: 7,
    });
    setStateDetail({
      isLoading: false,
      data: [],
      totalRow: 0,
      page: 1,
      pageSize: 7,
    });
    onClose();
  };
  const handelClodeCheckQC = async () => {
    toggle2();
    fetchData();
    fetchDataDetail();
  };
  const handelClodeAddHB = async () => {
    toggle3();
    fetchData();
    fetchDataDetail();
  };
  const handleAddReplace = async (item) => {
    setWOSemiLotFQCId(item.WOSemiLotFQCId);
    toggle3();
  };
  const handleMerge = async (item) => {
    setWOSemiLotFQCId(item.WOSemiLotFQCId);
    setisShowing4(true);
  };
  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'semiFqc.semilotMapping' })}
      isOpen={isOpen}
      disabledCloseBtn={state.isLoading}
      disable_animate={300}
      onClose={handleClose}
    >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <MuiButton text="create" color="success" onClick={handleAdd} />
        </Grid>
        <Grid item xs={12}>
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
            getRowId={(rows) => rows.WOSemiLotFQCId}
            onSelectionModelChange={(Ids) => setWOSemiLotFQCId(Ids[0])}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
            }}
            initialState={{ pinnedColumns: { right: ['action'], left: ['id', 'WOCode'] } }}
          />
        </Grid>
        <Grid item xs={12}>
          <MuiButton text="create" color="success" onClick={toggle} disabled={WOSemiLotFQCId == null ? true : false} />
        </Grid>
        <Grid item xs={12}>
          <MuiDataGrid
            showLoading={stateDetail.isLoading}
            isPagingServer={true}
            headerHeight={35}
            columns={detailColumns}
            rows={stateDetail.data}
            page={stateDetail.page - 1}
            pageSize={stateDetail.pageSize}
            rowCount={stateDetail.totalRow}
            onPageChange={(newPage) => setStateDetail({ ...stateDetail, page: newPage + 1 })}
            getRowId={(rows) => rows.WOSemiLotDetailId}
            //onSelectionModelChange={(Ids) => setWOId(Ids[0])}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newDataDetail)) return `Mui-created`;
              if (params.row.IsFinish) return `Mui-finish-data`;
            }}
            initialState={{ pinnedColumns: { right: ['action'], left: ['id', 'WOCode'] } }}
          />
        </Grid>
      </Grid>
      <WOProcessSemiLotDetailDialog
        WOId={WOId}
        WOSemiLotFQCId={WOSemiLotFQCId}
        isOpen={isShowing}
        onClose={toggle}
        setNewData={setNewDataDetail}
      />
      <WOProcessSemiLotAddReplaceDialog
        WOId={WOId}
        WOSemiLotFQCId={WOSemiLotFQCId}
        isOpen={isShowing3}
        onClose={handelClodeAddHB}
        setNewData={setNewDataDetail}
      />
      <WOProcessSemiLotDetailCheckQCDialog
        WOId={WOId}
        WOSemiLotFQCId={WOSemiLotFQCId}
        isOpen={isShowing2}
        onClose={handelClodeCheckQC}
        setNewData={setNewDataDetail}
        WOSemiLotFQCDetail={WOSemiLotFQCDetail}
      />

      <WOProcessSemiLotMergeDialog
        WOId={WOId}
        WOSemiLotFQCId={WOSemiLotFQCId}
        isOpen={isShowing4}
        onClose={() => setisShowing4(false)}
        setNewData={setNewDataDetail}
      />
    </MuiDialog>
  );
};

export default WOProcessSemiLotDialog;
