import { useModal, useModal2, useModal3 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid } from '@controls';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Grid, IconButton, Paper, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { bomService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import { match } from 'ramda';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import BomProcessDialog from './BomProcessDialog';
import BomProcessMaterialDialog from './BomProcessMaterialDialog';

export default function BomProcess({ Bom }) {
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
    pageSize: 8,
    searchData: {
      keyWord: '',
      ProcessCode: '',
      showDelete: true,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [BomProcess, setBomProcess] = useState(null);

  const [rowPM, setRowPM] = useState({});
  const [modePM, setModePM] = useState(CREATE_ACTION);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.BomProcessId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'BomProcessId', hide: true },
    { field: 'BomId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 80,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="success"
                size="small"
                sx={[{ '&:hover': { border: '1px solid green' } }]}
                onClick={() => handleAddMaterial(params.row)}
              >
                <ArchiveIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            {/* <Grid item xs={4} style={{ textAlign: 'center' }}>
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
            </Grid> */}
          </Grid>
        );
      },
    },
    {
      field: 'Step',
      headerName: intl.formatMessage({ id: 'bom.Step' }),
      flex: 0.6,
    },
    {
      field: 'BomProcessCode',
      headerName: intl.formatMessage({ id: 'bom.ProcessId' }),
      flex: 0.6,
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
  }, [state.page, state.pageSize, state.searchData.showDelete, Bom, isShowing3]);

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
        return o.BomProcessId == updateData.BomProcessId;
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
        let res = await bomService.deleteBomProcess(item);
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

  const handleAddMaterial = async (row) => {
    setBomProcess(row);
    setModePM(CREATE_ACTION);
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
    setState({ ...state, isLoading: true });
    const params = {
      ProductCode: Bom?.ProductCode,
      BuyerCode: Bom?.BuyerCode,
      BomVersion: Bom?.BomVersion,
      DateApply: Bom?.DateApply,
      Ver: Bom?.Ver,
      ProcessCode: state.searchData.ProcessCode,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await bomService.getBomProcessList(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const getDetailPanelContent = React.useCallback(
    ({ row }) => (
      <DetailPanelContent
        row={row}
        intl={intl}
        setRowPM={setRowPM}
        setModePM={setModePM}
        toggle2={toggle2}
        reLoad={isShowing3}
        Bom={Bom}
      />
    ),
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 260, []);

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={3}>
          {/* <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} disabled={Bom ? false : true} /> */}
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                disabled={Bom ? false : true}
                label={intl.formatMessage({ id: 'bom.ProcessId' })}
                fetchDataFunc={bomService.getProcess}
                displayLabel="commonDetailCode"
                displayValue="commonDetailCode"
                onChange={(e, item) => handleSearch(item ? item.commonDetailCode ?? null : null, 'ProcessCode')}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item>
              <MuiButton
                text="search"
                color="info"
                onClick={fetchData}
                sx={{ mr: 3, mt: 1 }}
                disabled={Bom ? false : true}
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
                disabled={Bom ? false : true}
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
        getRowId={(rows) => rows.BomProcessId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
      />

      <BomProcessDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
        BomId={Bom}
      />

      <BomProcessMaterialDialog
        mode={modePM}
        BomProcess={BomProcess}
        isOpen={isShowing2}
        onClose={toggle2}
        initModal={rowPM}
        handleReload={toggle3}
      />
    </React.Fragment>
  );
}

const DetailPanelContent = ({ row: rowProp, intl, setRowPM, setModePM, toggle2, reLoad, Bom }) => {
  console.log(rowProp);
  let isDetailRendered = useRef(true);

  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
  });

  const fetchDetailData = async () => {
    if (isDetailRendered) {
      setDetailPanelState({ ...detailPanelState, isLoading: true });
      const params = {
        ProductCode: rowProp.ProductCode,
        BuyerCode: rowProp.BuyerCode,
        BomVersion: rowProp.BomVersion,
        DateApply: rowProp.DateApply,
        Ver: rowProp.Ver,
        Step: rowProp.Step,
        BomProcessCode: rowProp.BomProcessCode,
        page: detailPanelState.page,
        pageSize: detailPanelState.pageSize,
      };
      const res = await bomService.getBomProcessMaterialList(params);

      setDetailPanelState({
        ...detailPanelState,
        data: !res.Data ? [] : [...res.Data],
        totalRow: res.TotalRow,
        isLoading: false,
      });
    }
  };

  const handleCalculate = (e, check) => {
    let value =
      ((e.ProductNorms * 1) / (e.Width * (e.Length / 1000)) / e.TimeCut) * (1 + e.Attrition / 100 - e.Reuse / 100);
    if (check) return value.toFixed(2);
    else return (value / e.TimeCut).toFixed(2);
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.ProcessMaterialId) +
        1 +
        (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 80,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={6} style={{ textAlign: 'center' }}>
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
            <Grid item xs={6} style={{ textAlign: 'center' }}>
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
          </Grid>
        );
      },
    },
    { field: 'MaterialCode', headerName: intl.formatMessage({ id: 'bom.MaterialId' }), width: 200 },
    { field: 'MaterialName', headerName: intl.formatMessage({ id: 'material.MaterialName' }), width: 200 },
    { field: 'CuttingSize', headerName: intl.formatMessage({ id: 'bom.CuttingSize' }), width: 120 },
    {
      field: 'BomProcessType',
      headerName: intl.formatMessage({ id: 'bom.BomProcessType' }),
      width: 120,
      renderCell: (params) => {
        return (
          <Typography sx={{ fontSize: 14 }}>
            {params?.row?.BomProcessType === 'MA'
              ? 'Main'
              : params?.row?.BomProcessType === 'PR'
              ? 'Process'
              : 'Packing'}
          </Typography>
        );
      },
    },
    { field: 'Pitch', headerName: intl.formatMessage({ id: 'bom.Pitch' }), width: 120 },
    { field: 'Cavity', headerName: intl.formatMessage({ id: 'bom.Cavity' }), width: 120 },
    { field: 'RollUse', headerName: intl.formatMessage({ id: 'bom.RollUse' }), width: 120 },
    { field: 'Note', headerName: intl.formatMessage({ id: 'bom.Note' }), width: 120 },
    // {
    //   field: 'Calculate1',
    //   headerName: intl.formatMessage({ id: 'bom.Calculate1' }),
    //   width: 120,
    //   renderCell: (params) => {
    //     return <Typography sx={{ fontSize: 14 }}>{handleCalculate(params.row, true)}</Typography>;
    //   },
    // },
    // {
    //   field: 'Calculate2',
    //   headerName: intl.formatMessage({ id: 'bom.Calculate2' }),
    //   width: 120,
    //   renderCell: (params) => {
    //     return <Typography sx={{ fontSize: 14 }}>{handleCalculate(params.row, false)}</Typography>;
    //   },
    // },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      width: 140,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 160,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.modifiedName' }),
      width: 140,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      width: 160,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  useEffect(() => {
    fetchDetailData();
    return () => {
      isDetailRendered = false;
    };
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp, reLoad]);

  const handleUpdate = async (row) => {
    setModePM(UPDATE_ACTION);
    setRowPM(row);
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
        let res = await bomService.deleteBomProcessMaterial(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchDetailData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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
          getRowId={(rows) => rows.ProcessMaterialId}
          initialState={{ pinnedColumns: { right: ['action'] } }}
        />
      </Paper>
    </Stack>
  );
};
