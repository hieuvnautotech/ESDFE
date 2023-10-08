import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiDataGrid, MuiDialog, MuiButton } from '@controls';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { WOService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, IconButton, Paper, Stack } from '@mui/material';
import { ErrorAlert, isNumber, SuccessAlert, PrintSemiMMS, PrintPressLot } from '@utils';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { useTokenStore } from '@stores';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const WOPressLotDialog = ({ WOProcessId, isOpen, onClose }) => {
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
  const [statePressLot, setStatePressLot] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
  });
  const { isShowing, toggle } = useModal();
  const [rowData, setRowData] = useState({});
  const [WOSemiLotMMSSelectId, setWOSemiLotMMSSelectId] = useState([]);
  const [newData, setNewData] = useState({});
  const { isShowing2, toggle2 } = useModal2();
  const [PressLotIds, setPressLotIds] = useState([]);

  const setWOSemiLotMMSId = useTokenStore((state) => state.setWOSemiLotMMSId);
  const WOSemiLotMMSId = useTokenStore((state) => state.WOSemiLotMMSId);

  const handleCloseDialog = () => {
    onClose();
  };
  const handleAdd = async () => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_create' }))) {
      try {
        const res = await WOService.createPressLot({
          WOProcessId: WOProcessId,
          ListId: WOSemiLotMMSSelectId,
        });
        if (res.HttpResponseCode === 200 && res.Data) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          setNewData({ ...res.Data });
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...statePressLot.data];
      if (data.length > statePressLot.pageSize) {
        data.pop();
      }
      setStatePressLot({
        ...statePressLot,
        data: [...data],
        totalRow: statePressLot.totalRow + 1,
      });
    }
  }, [newData]);

  const handlePrint = async (item) => {
    const res = await WOService.getPrintInfo(item.WOSemiLotMMSId);
    PrintSemiMMS([res.Data]);
  };

  const handlePrintPressLot = async () => {
    let ListPrint = [];
    PressLotIds.forEach((id) => {
      let item = statePressLot.data.find((x) => x.WOSemiLotMMSId == id);
      if (item) ListPrint.push(item);
    });

    PrintPressLot(ListPrint);
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
      field: 'PressLotCode',
      headerName: intl.formatMessage({ id: 'WO.PressLot' }),
      width: 200,
    },
  ];
  const columnsPressLot = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.WOSemiLotMMSId) + 1 + (statePressLot.page - 1) * statePressLot.pageSize,
    },
    { field: 'WOSemiLotMMSId', hide: true },
    { field: 'WOProcessId', hide: true },
    {
      field: 'ModelCode',
      headerName: intl.formatMessage({ id: 'general.model' }),
      width: 120,
    },
    {
      field: 'PressLotCode',
      headerName: intl.formatMessage({ id: 'WO.PressLot' }),
      width: 200,
    },
    {
      field: 'Serial',
      headerName: intl.formatMessage({ id: 'WO.Serial' }),
      width: 50,
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
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'UnMapping',
      headerName: 'Un Map',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          //  params.ActualQty > 0 && (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                color="info"
                size="small"
                sx={[{ '&:hover': { border: '1px solid skyblue' } }]}
                onClick={() => handleUnMapping(params.row)}
              >
                <LinkOffIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
          // )
        );
      },
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
      fetchDataPressLot();
    }

    return () => {
      isRendered = false;
    };
  }, [statePressLot.page, statePressLot.pageSize, isOpen, WOProcessId]);

  async function fetchData() {
    setWOSemiLotMMSId(1);
    setState({ ...state, isLoading: true });
    const params = {
      WOProcessId: WOProcessId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await WOService.getWOSemiLotPressLot(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  async function fetchDataPressLot() {
    setWOSemiLotMMSId(null);
    setStatePressLot({ ...statePressLot, isLoading: true });
    const params = {
      WOProcessId: WOProcessId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await WOService.getWOProcessPressLotList(params);

    if (res && res.Data && isRendered)
      setStatePressLot({
        ...statePressLot,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleUnMapping = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'WO.confirm_unMapping' }))) {
      try {
        let res = await WOService.unMapping(item);
        if (res && res.HttpResponseCode === 200) {
          await fetchData();
          await fetchDataPressLot();
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <MuiDialog
      maxWidth={false}
      fullWidth={true}
      title={intl.formatMessage({ id: 'WO.presslotlotcreate' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={7}>
          <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
            <Grid item xs={3}>
              <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} />
            </Grid>
          </Grid>
          <MuiDataGrid
            checkboxSelection
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
            onSelectionModelChange={(Ids) => {
              setWOSemiLotMMSSelectId(Ids);
              setWOSemiLotMMSId(Ids[0]);
            }}
            // getRowClassName={(params) => {
            //   if (_.isEqual(params.row, newData)) return `Mui-created`;
            // }}
            // initialState={{ pinnedColumns: { left: ['id', 'SemiLotCode'] } }}
          />
        </Grid>
        <Grid item xs={5}>
          <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
            <Grid item xs={3}>
              <MuiButton text="print" color="info" onClick={handlePrintPressLot} sx={{ mt: 1 }} />
            </Grid>
          </Grid>
          <MuiDataGrid
            checkboxSelection
            showLoading={statePressLot.isLoading}
            isPagingServer={true}
            headerHeight={35}
            columns={columnsPressLot}
            rows={statePressLot.data}
            page={statePressLot.page - 1}
            pageSize={statePressLot.pageSize}
            rowCount={statePressLot.totalRow}
            onPageChange={(newPage) => setStatePressLot({ ...statePressLot, page: newPage + 1 })}
            getRowId={(rows) => rows.WOSemiLotMMSId}
            onSelectionModelChange={(Ids) => {
              setWOSemiLotMMSId(Ids[0]);
              setPressLotIds(Ids);
            }}
            // onRowClick={(params) => {
            //   setWOSemiLotMMS(params.row);
            // }}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
            }}
            // initialState={{ pinnedColumns: { left: ['id', 'PressLotCode'] } }}
          />
        </Grid>
        <Grid container direction="row" justifyContent="space-around">
          <Grid item xs={12} direction="row" justifyContent="flex-start" alignItems="center">
            <ArrowBackIosNewIcon
              fontSize="inherit"
              sx={{ marginRight: '1rem', fontSize: '30px', cursor: 'pointer' }}
              onClick={handleCloseDialog}
            />
          </Grid>
        </Grid>
      </Grid>
    </MuiDialog>
  );
};

export default WOPressLotDialog;
