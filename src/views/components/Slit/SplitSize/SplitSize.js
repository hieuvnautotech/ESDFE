import { useModal, useModal2 } from '@basesShared';
import { MuiButton, MuiDataGrid, MuiDialog, MuiResetButton, MuiSearchField, MuiSubmitButton } from '@controls';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import { Box, IconButton, Paper, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { IQCReceivingService, SlitOrderService, SplitSizeService } from '@services';
import { ErrorAlert, PrintMaterial, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import SplitSizeDialog from './SplitSizeDialog';

const SplitSize = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [rowData, setRowData] = useState({});
  const [rowSelected, setRowSelected] = useState([]);
  const [openDetailIds, setOpenDetailIds] = useState([]);
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      MaterialCode: '',
      MaterialLotCode: '',
    },
  });

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [State.page, State.pageSize]);

  async function fetchData() {
    setState({ ...State, isLoading: true });

    const params = {
      MaterialLotCode: State.searchData.MaterialLotCode,
      page: State.page,
      pageSize: State.pageSize,
    };

    const res = await SplitSizeService.get(params);
    if (res && isRendered)
      setState({
        ...State,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...State.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...State, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...State, searchData: { ...newSearchData } });
    }
  };

  const handleUpdate = async (item) => {
    setRowData(item);
    toggle2();
  };

  const columns = [
    { field: 'MaterialLotId', headerName: '', flex: 0.3, hide: true },
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (State.page - 1) * State.pageSize,
    },
    { field: 'MaterialLotCode', headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }), flex: 0.5 },
    { field: 'OriginWidth', headerName: intl.formatMessage({ id: 'slitOrder.OriginWidth' }), flex: 0.3 },
    { field: 'OriginLength', headerName: intl.formatMessage({ id: 'slitOrder.OriginLength' }), flex: 0.3 },
    { field: 'Width', headerName: intl.formatMessage({ id: 'material.Width' }), flex: 0.3 },
    { field: 'Length', headerName: intl.formatMessage({ id: 'material.Length' }), flex: 0.3 },
    {
      field: 'Print',
      headerName: 'Print',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                color="info"
                size="small"
                sx={[{ '&:hover': { border: '1px solid skyblue' } }]}
                onClick={() => handlePrintSingle(params.row)}
              >
                <PrintIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'Reset',
      headerName: 'Reset',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleReset(params.row)}
                //disabled={params.row.IsFinish}
              >
                <AutorenewIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'Edit',
      headerName: 'Edit',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                color="warning"
                size="small"
                sx={[{ '&:hover': { border: '1px solid orange' } }]}
                onClick={() => handleUpdate(params.row)}
                disabled={params.row.IsFinish}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  const handlePrintSingle = async (item) => {
    const res = await IQCReceivingService.PrintMaterialLot([item.MaterialLotId]);
    PrintMaterial(res.Data);
  };

  const handleReset = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'slitOrder.confirm_reset' }))) {
      try {
        let res = await SplitSizeService.reset(item);
        if (res && res.HttpResponseCode === 200) {
          await fetchData();
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getDataPrint = (data) => {
    setRowSelected(data);
  };

  const handlePrint = async () => {
    const res = await IQCReceivingService.PrintMaterialLot(rowSelected);
    PrintMaterial(res.Data);
  };

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} intl={intl} searchData={State.searchData} getDataPrint={getDataPrint} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 260, []);

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid item xs={2}>
          <MuiButton text="split" color="success" onClick={toggle} sx={{ mt: 0 }} />
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '18%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="materialLot.MaterialLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialLotCode')}
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 0 }} />
            </Grid>
            {/* <Grid item>
              <Badge badgeContent={rowSelected.length} color="warning">
                <MuiButton
                  text="print"
                  color="secondary"
                  sx={{ mt: 0 }}
                  disabled={!rowSelected.length > 0}
                  onClick={handlePrint}
                />
              </Badge>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      <MuiDataGrid
        showLoading={State.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        gridHeight={736}
        rows={State.data}
        page={State.page - 1}
        pageSize={State.pageSize}
        rowCount={State.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setState({ ...State, page: newPage + 1 })}
        getRowId={(rows) => rows.MaterialLotId}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        detailPanelExpandedRowIds={openDetailIds}
        onDetailPanelExpandedRowIdsChange={(ids) => setOpenDetailIds(ids)}
      />

      <SplitSizeDialog isOpen={isShowing} onClose={toggle} fetchData={fetchData} />

      <EditLengthDialog isOpen={isShowing2} onClose={toggle2} initModal={rowData} fetchDetailData={fetchData} />
    </React.Fragment>
  );
};

const DetailPanelContent = ({ row: rowProp, intl, searchData, getDataPrint: getDataPrint }) => {
  let isDetailRendered = useRef(true);
  const [rowData, setRowData] = useState({});
  const { isShowing2, toggle2 } = useModal2();
  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
  });

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      MaterialLotId: rowProp.MaterialLotId,
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
    };

    const res = await SplitSizeService.getDetail(params);

    setDetailPanelState({
      ...detailPanelState,
      data: res.Data ?? [],
      totalRow: res.TotalRow,
      isLoading: false,
    });
  };

  const handleUpdate = async (item) => {
    setRowData(item);
    toggle2();
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.MaterialLotId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'product.product_code' }), flex: 0.4 },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      flex: 0.6,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'materialLot.Width' }),
      flex: 0.3,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'materialLot.Length' }),
      flex: 0.3,
    },
    {
      field: 'Print',
      headerName: 'Print',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                color="info"
                size="small"
                sx={[{ '&:hover': { border: '1px solid skyblue' } }]}
                onClick={() => handlePrintSingle(params.row)}
              >
                <PrintIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'Edit',
      headerName: 'Edit',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                color="warning"
                size="small"
                sx={[{ '&:hover': { border: '1px solid orange' } }]}
                onClick={() => handleUpdate(params.row)}
                disabled={params.row.IsFinish}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  const handlePrintSingle = async (item) => {
    const res = await IQCReceivingService.PrintMaterialLot([item.MaterialLotId]);
    PrintMaterial(res.Data);
  };

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp, searchData]);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <Box
          sx={{
            '& .sttOK [data-field="MaterialLotCode"]': {
              backgroundColor: '#f5d742',
            },
          }}
        >
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
            getRowId={(rows) => rows.MaterialLotId}
            initialState={{ pinnedColumns: { right: ['action'] } }}
            // checkboxSelection
            // onSelectionModelChange={(ids) => getDataPrint(ids)}
            // getRowClassName={(params) => {
            //   if (moment(params.row.ExpirationDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD'))
            //     return `sttOK`;
            // }}
          />
        </Box>
      </Paper>
      <EditLengthDialog isOpen={isShowing2} onClose={toggle2} initModal={rowData} fetchDetailData={fetchDetailData} />
    </Stack>
  );
};

const EditLengthDialog = ({ initModal, isOpen, onClose, fetchDetailData }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    Length: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: initModal,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleReset = () => {
    resetForm();
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    const res = await SlitOrderService.editSlitTurn({ ...initModal, ...data });
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
      fetchDetailData();
      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              name="Length"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={dialogState.isSubmit}
              value={values.Length}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'slitOrder.Length' }) + ' *'}
              error={touched.Length && Boolean(errors.Length)}
              helperText={touched.Length && errors.Length}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
              <MuiResetButton onClick={handleReset} disabled={dialogState.isSubmit} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

export default SplitSize;
