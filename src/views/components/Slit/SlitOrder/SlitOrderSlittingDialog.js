import { useModal, useModal2 } from '@basesShared';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { SlitOrderService, IQCReceivingService } from '@services';
import { ErrorAlert, SuccessAlert, PrintMaterialSlit, PrintMaterial } from '@utils';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import ReactToPrint from 'react-to-print';
import * as yup from 'yup';
// import PrintChilds from '../../../WMS/Material/Receiving/PrintChilds';
import IQCCheckDialog from './IQCCheckDialog';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';

const SlitOrderSlittingDialog = ({ isOpen, onClose, initModal, fetchDataSlitOrder }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const [LotMaterial, setLotMaterial] = useState(null);
  const componentRef = React.useRef();
  const [listdataPrint, setListDataPrint] = useState([]);
  const [ParentId, setParentId] = useState(null);

  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
  });

  const [stateSlit, setStateSlit] = useState({
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
  });

  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const defaultValue = {
    SlitTurnId: null,
    SlitOrderId: initModal.SlitOrderId,
    MaterialLotId: null,
    MaterialLotCode: '',
    ProductId: null,
    ModelCode: '',
    LineId: null,
    BladeId: null,
    BladeName: '',
    LineCode: '',
    StaffIds: [],
    StaffCode: '',
    Turn: '',
    Width: '',
    Length: '',
    SlitQty: '',
    LossWidth: '',
    CheckTurn: false,
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      flex: 0.01,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'MaterialLotId', hide: true },
    { field: 'MaterialLotCode', headerName: intl.formatMessage({ id: 'slitOrder.RawMaterialLotCode' }), flex: 0.4 },
    { field: 'OriginWidth', headerName: intl.formatMessage({ id: 'slitOrder.OriginWidth' }), flex: 0.3 },
    { field: 'OriginLength', headerName: intl.formatMessage({ id: 'slitOrder.OriginLength' }), flex: 0.3 },
    { field: 'LossWidth', headerName: intl.formatMessage({ id: 'slitOrder.TotalLossWidth' }), flex: 0.4 },
    {
      field: 'View',
      headerName: 'View',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              {params.row?.ParentId == ParentId ? (
                <IconButton
                  color="success"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid green' } }]}
                  onClick={() => setParentId(null)}
                >
                  <RemoveRedEyeIcon fontSize="inherit" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid green' } }]}
                  onClick={() => setParentId(params.row?.ParentId)}
                >
                  <RemoveRedEyeIcon fontSize="inherit" />
                </IconButton>
              )}
            </Grid>
          </Grid>
        );
      },
    },
  ];

  const slitColumns = [
    {
      field: 'Turn',
      headerName: '',
      flex: 0.01,
      align: 'center',
      filterable: false,
    },
    { field: 'SlitTurnId', hide: true },
    { field: 'MaterialCode', headerName: intl.formatMessage({ id: 'bom.MaterialId' }), flex: 0.4 },
    { field: 'LossWidth', headerName: intl.formatMessage({ id: 'slitOrder.LossWidth' }), flex: 0.4 },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'slitOrder.WorkingTime' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    { field: 'SlitQty', headerName: intl.formatMessage({ id: 'slitOrder.SlitQty' }), flex: 0.3 },
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
                onClick={() => handlePrint(params.row)}
              >
                <PrintIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  const schemaY = yup.object().shape({
    MaterialLotId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    // ProductId: yup
    //   .number()
    //   .nullable()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),
    LineId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    StaffIds: yup
      .array()
      .nullable()
      .min(1, intl.formatMessage({ id: 'general.field_required' }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    BladeId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Turn: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        intl.formatMessage({ id: 'general.field_OnlyLetter' })
      ),
    Width: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .when('width', (value) => {
        return yup
          .number()
          .integer()
          .nullable()
          .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
          .lessThan(
            LotMaterial?.Width + 1,
            intl.formatMessage({ id: 'general.field_max' }, { max: LotMaterial?.Width })
          )
          .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    Length: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .when('length', (value) => {
        return yup
          .number()
          .integer()
          .nullable()
          .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
          .lessThan(
            LotMaterial?.Length + 1,
            intl.formatMessage({ id: 'general.field_max' }, { max: LotMaterial?.Length })
          )
          .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    SlitQty: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .when('Width', (value) => {
        if (value > 0) {
          let LossWidth = !LotMaterial?.IsFullLength && values?.LossWidth ? parseInt(values?.LossWidth) : 0;
          let maxSlit = parseInt((LotMaterial?.Width - LossWidth) / value);

          return yup
            .number()
            .integer()
            .nullable()
            .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
            .lessThan(maxSlit + 1, intl.formatMessage({ id: 'general.field_max' }, { max: maxSlit }))
            .required(intl.formatMessage({ id: 'general.field_required' }));
        }
      }),
    LossWidth: yup
      .number()
      .integer()
      .nullable()
      .lessThan(LotMaterial?.Width + 1, intl.formatMessage({ id: 'general.field_max' }, { max: LotMaterial?.Width })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: defaultValue,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  useEffect(() => {
    if (isOpen) {
      fetchData();
      fetchDataSlit();
    }
    return () => (isRendered = false);
  }, [isOpen, isShowing]);

  useEffect(() => {
    fetchData();
  }, [state.page]);

  useEffect(() => {
    fetchDataSlit();
  }, [stateSlit.page, ParentId]);

  //handle
  const handlePrint = async (item) => {
    const params = {
      isActived: true,
      SlitOrderId: item.SlitOrderId,
      Turn: item.Turn,
      ParentId: item.ParentId,
      page: 0,
      pageSize: 0,
    };

    const res = await SlitOrderService.getSlitTurnDetail(params);
    PrintMaterialSlit(res.Data);
  };

  async function fetchData(SlitOrderId) {
    setState({ ...state, isLoading: true });
    const params = {
      page: 0,
      pageSize: 0,
      SlitOrderId: SlitOrderId ?? initModal.SlitOrderId,
    };
    const res = await SlitOrderService.getSlitTurnRaw(params);
    if (res)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  async function fetchDataSlit(SlitOrderId) {
    const params = {
      page: 0,
      pageSize: 0,
      ParentId: ParentId,
      SlitOrderId: SlitOrderId ?? initModal.SlitOrderId,
    };
    const res = await SlitOrderService.getSlitTurn(params);
    if (res)
      setStateSlit({
        ...stateSlit,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
      });
  }

  const onSubmit = async (data) => {
    let lossWidth = data.LossWidth == '' || data.LossWidth == null ? 0 : parseInt(data.LossWidth);
    const res = await SlitOrderService.slit({ ...data, LossWidth: lossWidth });
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
      fetchDataSlit();
      fetchDataSlitOrder();
      handleReset();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
    }
  };

  const handleCloseDialog = () => {
    resetForm(defaultValue);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setDialogState({ ...dialogState, isSubmit: false });
    resetForm();
  };
  const handleResetSlit = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'slitOrder.confirm_reset' }))) {
      try {
        let res = await SlitOrderService.resetSlitTurn(item);
        if (res && res.HttpResponseCode === 200) {
          await fetchData(item.SlitOrderId);
          await fetchDataSlit(item.SlitOrderId);
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          fetchDataSlitOrder();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getDetailPanelContent = React.useCallback(
    ({ row }) => (
      <DetailPanelContent
        row={row}
        intl={intl}
        resetParent={toggle}
        handleReset={handleResetSlit}
        fetchDataSlitOrder={fetchDataSlitOrder}
      />
    ),
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 262, []);

  const getDetailPanelContentSlit = React.useCallback(
    ({ row }) => <DetailPanelContentSlit row={row} intl={intl} resetParent={toggle} />,
    []
  );

  const getDetailPanelHeightSlit = React.useCallback(() => 262, []);

  return (
    <MuiDialog
      maxWidth={false}
      fullWidth={true}
      title={intl.formatMessage({ id: 'slitOrder.Slit' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3}>
            <Grid item xs={12} sx={{ mb: 1 }}>
              <Typography variant="h6">Date: {moment(initModal?.OrderDate).format('YYYY-MM-DD')}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: 1 }}>
              <Typography variant="h6">Description: {initModal.Description}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <MuiAutocomplete
                required
                value={
                  values.MaterialLotId
                    ? { MaterialLotId: values.MaterialLotId, MaterialLotCode: values.MaterialLotCode }
                    : null
                }
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'slitOrder.RawMaterialLotCode' })}
                fetchDataFunc={() => SlitOrderService.getRawLotMaterial(initModal?.SlitOrderId)}
                displayLabel="MaterialLotCode"
                displayValue="MaterialLotId"
                onChange={(e, value) => {
                  setLotMaterial(value ?? null);
                  setFieldValue('CheckTurn', value?.Turn ? true : false);
                  setFieldValue('Turn', value?.Turn || '');
                  if (value?.StaffNameSlit != '' && value) {
                    const staffs = value?.StaffNameSlit.split(',');
                    let staffList = [];
                    staffs.forEach((element) => {
                      let item = element.split('|');
                      staffList.push({ StaffId: item[0], StaffName: item[1] });
                    });
                    setFieldValue('StaffIds', staffList);
                  }
                  setFieldValue('StaffName', value?.StaffName || '');
                  setFieldValue('LineId', value?.LineId || null);
                  setFieldValue('LineName', value?.LineName || '');
                  setFieldValue('Length', value?.Turn ? value?.Length : '');
                  setFieldValue('MaterialId', value?.MaterialId || null);
                  setFieldValue('MaterialLotCode', value?.MaterialLotCode || '');
                  setFieldValue('MaterialLotId', value?.MaterialLotId || null);
                  setFieldValue('BladeId', value?.BladeId || null);
                  setFieldValue('BladeName', value?.BladeName || null);
                  setFieldValue('LossWidthTurn', value?.LossWidth || '');
                }}
                error={touched.MaterialLotId && Boolean(errors.MaterialLotId)}
                helperText={touched.MaterialLotId && errors.MaterialLotId}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <MuiAutocomplete
                value={values.ProductId ? { ProductId: values.ProductId, ProductCode: values.ProductCode } : null}
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'product.product_code' })}
                fetchDataFunc={() =>
                  SlitOrderService.getListProductSlit({
                    SlitOrderId: initModal?.SlitOrderId,
                    MaterialId: values.MaterialId,
                  })
                }
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, value) => {
                  setFieldValue('ProductCode', value?.ProductCode || '');
                  setFieldValue('ProductId', value?.ProductId || null);
                }}
                error={touched.ProductId && Boolean(errors.ProductId)}
                helperText={touched.ProductId && errors.ProductId}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <MuiAutocomplete
                required
                multiple={true}
                value={values.StaffIds ? values.StaffIds : []}
                label={intl.formatMessage({ id: 'slitOrder.ListWorkers' })}
                fetchDataFunc={SlitOrderService.getWorkers}
                displayLabel="StaffName"
                displayValue="StaffId"
                name="StaffId"
                onChange={(e, value) => {
                  setFieldValue('StaffIds', value || []);
                }}
                error={touched.StaffIds && Boolean(errors.StaffIds)}
                helperText={touched.StaffIds && errors.StaffIds}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <MuiAutocomplete
                required
                value={values.LineId ? { LineId: values.LineId, LineName: values.LineName } : null}
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'slitOrder.ListMachine' })}
                fetchDataFunc={SlitOrderService.getMachine}
                displayLabel="LineName"
                displayValue="LineId"
                onChange={(e, value) => {
                  setFieldValue('LineName', value?.LineName || '');
                  setFieldValue('LineId', value?.LineId || '');
                }}
                error={touched.LineId && Boolean(errors.LineId)}
                helperText={touched.LineId && errors.LineId}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <MuiAutocomplete
                required
                value={values.BladeId ? { BladeId: values.BladeId, BladeName: values.BladeName } : null}
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'slitOrder.Blade' })}
                fetchDataFunc={SlitOrderService.getBlade}
                displayLabel="BladeName"
                displayValue="BladeId"
                onChange={(e, value) => {
                  setFieldValue('BladeName', value?.BladeName || '');
                  setFieldValue('BladeId', value?.BladeId || '');
                }}
                error={touched.BladeId && Boolean(errors.BladeId)}
                helperText={touched.BladeId && errors.BladeId}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <MuiAutocomplete
                required
                value={values.Turn ? { letter: values.Turn } : null}
                disabled={
                  values?.CheckTurn && values?.Turn == LotMaterial?.Turn && !LotMaterial?.IsFullLength
                    ? true
                    : dialogState.isSubmit
                }
                label={intl.formatMessage({ id: 'slitOrder.Turn' })}
                fetchDataFunc={() => SlitOrderService.getTurn(initModal?.SlitOrderId, values?.MaterialLotId)}
                displayLabel="letter"
                displayValue="letter"
                onChange={(e, value) => {
                  setFieldValue('Turn', value?.letter || '');
                  if (value?.letter == LotMaterial?.Turn) {
                    setFieldValue('LossWidthTurn', LotMaterial?.LossWidth || '');
                    setFieldValue('Length', LotMaterial?.Length || '');
                  }
                }}
                error={touched.Turn && Boolean(errors.Turn)}
                helperText={touched.Turn && errors.Turn}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                name="LossWidth"
                type="number"
                inputProps={{ min: 0, step: 'any' }}
                disabled={values?.CheckTurn && values?.Turn == LotMaterial?.Turn ? true : dialogState.isSubmit}
                value={values?.CheckTurn && values?.Turn == LotMaterial?.Turn ? values.LossWidthTurn : values.LossWidth}
                onChange={handleChange}
                label={intl.formatMessage({ id: 'slitOrder.LossWidth' })}
                error={touched.LossWidth && Boolean(errors.LossWidth)}
                helperText={touched.LossWidth && errors.LossWidth}
              />
            </Grid>
            <Grid item xs={12} container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="Width"
                  type="number"
                  inputProps={{ min: 0, step: 'any' }}
                  disabled={dialogState.isSubmit}
                  value={values.Width}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'slitOrder.SLW' }) + ' *'}
                  error={touched.Width && Boolean(errors.Width)}
                  helperText={touched.Width && errors.Width}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="Length"
                  type="number"
                  inputProps={{ min: 0, step: 'any' }}
                  disabled={values?.CheckTurn && values?.Turn == LotMaterial?.Turn ? true : dialogState.isSubmit}
                  value={values.Length}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'slitOrder.SLL' }) + ' *'}
                  error={touched.Length && Boolean(errors.Length)}
                  helperText={touched.Length && errors.Length}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                name="SlitQty"
                type="number"
                inputProps={{ min: 0, step: 'any' }}
                disabled={dialogState.isSubmit}
                value={values.SlitQty}
                onChange={handleChange}
                label={intl.formatMessage({ id: 'slitOrder.SlitQty' }) + ' *'}
                error={touched.SlitQty && Boolean(errors.SlitQty)}
                helperText={touched.SlitQty && errors.SlitQty}
              />
            </Grid>
            <Grid item xs={12}>
              <MuiButton
                text="create"
                type="submit"
                color="success"
                disabled={dialogState.isSubmit}
                sx={{ width: '100%', m: 0 }}
              />
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h6">Raw Material</Typography>
            <MuiDataGrid
              showLoading={state.isLoading}
              isPagingServer={true}
              headerHeight={35}
              columns={columns}
              rows={state.data}
              gridHeight={360}
              page={state.page - 1}
              pageSize={state.pageSize}
              rowCount={state.totalRow}
              getRowId={(rows) => rows.MaterialLotId}
              initialState={{ pinnedColumns: { right: ['action'] } }}
              onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
              getDetailPanelHeight={getDetailPanelHeight}
              getDetailPanelContent={getDetailPanelContent}
              hideFooter
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Slit Material
            </Typography>
            <MuiDataGrid
              showLoading={state.isLoading}
              isPagingServer={true}
              headerHeight={35}
              columns={slitColumns}
              rows={stateSlit.data}
              gridHeight={360}
              page={stateSlit.page - 1}
              pageSize={stateSlit.pageSize}
              rowCount={stateSlit.totalRow}
              getRowId={(rows) => rows.SlitTurnId}
              initialState={{ pinnedColumns: { right: ['action'] } }}
              onPageChange={(newPage) => setStateSlit({ ...stateSlit, page: newPage + 1 })}
              getDetailPanelHeight={getDetailPanelHeightSlit}
              getDetailPanelContent={getDetailPanelContentSlit}
              hideFooter
            />
          </Grid>
        </Grid>
      </form>
      {/* <PrintChilds printRef={componentRef} listData={listdataPrint} materialUnit={'Roll'} /> */}
    </MuiDialog>
  );
};

const DetailPanelContent = ({ row: rowProp, intl, resetParent, handleReset, fetchDataSlitOrder }) => {
  let isDetailRendered = useRef(true);
  const componentRef = React.useRef();
  const { isShowing, toggle } = useModal();
  const [rowData, setRowData] = useState({});
  const [listdataPrint, setListDataPrint] = useState([]);
  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
    MaterialId: rowProp.MaterialId,
  });

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      isActived: true,
      SlitOrderId: rowProp.SlitOrderId,
      MaterialLotId: rowProp.MaterialLotId,
      page: 0,
      pageSize: 0,
    };

    const res = await SlitOrderService.getSlitTurnRawDetail(params);

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
        index.api.getRowIndex(index.row.MaterialLotId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      width: 300,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'slitOrder.ActualWidth' }),
      width: 120,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'slitOrder.ActualLength' }),
      width: 120,
    },
    {
      field: 'Delete',
      headerName: 'Delete',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            {rowProp.MaterialLotId != params.row.MaterialLotId && (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <IconButton
                  color="error"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid red' } }]}
                  onClick={() => handleDelete(params.row)}
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
      field: 'Finish',
      headerName: 'Finish',
      width: 80,
      headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            {rowProp.MaterialLotId == params.row.MaterialLotId && (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <IconButton
                  color="success"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid green' } }]}
                  onClick={() => handleFinish(params.row)}
                >
                  {params.row?.IsFinish ? (
                    <UnpublishedOutlinedIcon fontSize="inherit" />
                  ) : (
                    <CheckCircleOutlineIcon fontSize="inherit" />
                  )}
                </IconButton>
              </Grid>
            )}
          </Grid>
        );
      },
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
                onClick={() => handlePrint(params.row)}
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
            {rowProp.MaterialLotId == params.row.MaterialLotId && (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <IconButton
                  color="error"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid red' } }]}
                  onClick={() => handleReset(params.row)}
                  disabled={params.row.IsFinish}
                >
                  <AutorenewIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            )}
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
            {rowProp.MaterialLotId == params.row.MaterialLotId && (
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
            )}
          </Grid>
        );
      },
    },
  ];

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await SlitOrderService.deleteSlitTurn(item);
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

  const handleFinish = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({ id: item.IsFinish ? 'general.confirm_unfinish' : 'slitOrder.confirm_finish' })
      )
    ) {
      try {
        let res = await SlitOrderService.finishSlitTurn(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchDetailData();
          resetParent();
          fetchDataSlitOrder();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePrint = async (item) => {
    const res = await IQCReceivingService.PrintMaterialLot([item.MaterialLotId]);
    PrintMaterial(res.Data);
  };

  // const handleReset = async (item) => {
  //   if (window.confirm(intl.formatMessage({ id: 'slitOrder.confirm_reset' }))) {
  //     try {
  //       let res = await SlitOrderService.resetSlitTurn(item);
  //       if (res && res.HttpResponseCode === 200) {
  //         SuccessAlert(intl.formatMessage({ id: 'general.success' }));
  //         resetParent();
  //       } else {
  //         ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const handleUpdate = async (item) => {
    setRowData(item);
    toggle();
  };

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp]);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <MuiDataGrid
          showLoading={detailPanelState.isLoading}
          isPagingServer={true}
          headerHeight={35}
          gridHeight={260}
          columns={detailPanelColumns}
          rows={detailPanelState.data}
          page={detailPanelState.page - 1}
          pageSize={detailPanelState.pageSize}
          rowCount={detailPanelState.totalRow}
          onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
          getRowId={(rows) => rows.MaterialLotId}
          initialState={{ pinnedColumns: { right: ['Delete', 'Finish', 'Print', 'Reset', 'Edit'] } }}
          hideFooter
        />
        <EditLengthDialog isOpen={isShowing} onClose={toggle} initModal={rowData} fetchDetailData={fetchDetailData} />
        {/* <PrintChilds printRef={componentRef} listData={listdataPrint} materialUnit={'Roll'} /> */}
      </Paper>
    </Stack>
  );
};

const DetailPanelContentSlit = ({ row: rowProp, intl, resetParent }) => {
  let isDetailRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [rowData, setRowData] = useState({});
  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
    MaterialId: rowProp.MaterialId,
  });

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      isActived: true,
      SlitOrderId: rowProp.SlitOrderId,
      Turn: rowProp.Turn,
      ParentId: rowProp.ParentId,
      page: 0,
      pageSize: 0,
    };

    const res = await SlitOrderService.getSlitTurnDetail(params);

    setDetailPanelState({
      ...detailPanelState,
      data: res.Data ?? [],
      totalRow: res.TotalRow,
      isLoading: false,
    });
  };

  const handleUpdateSlit = (item) => {
    setRowData(item);
    toggle2();
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.SlitTurnId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'product.product_code' }),
      width: 120,
    },

    {
      field: 'BladeName',
      headerName: intl.formatMessage({ id: 'slitOrder.Blade' }),
      width: 120,
    },
    {
      field: 'LineName',
      headerName: intl.formatMessage({ id: 'slitOrder.LineName' }),
      width: 120,
    },
    {
      field: 'StaffNameSlit',
      headerName: intl.formatMessage({ id: 'slitOrder.StaffName' }),
      width: 120,
    },
    {
      field: 'LotStatusName',
      headerName: intl.formatMessage({ id: 'slitOrder.LotStatusName' }),
      width: 120,
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      width: 250,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'slitOrder.Width' }),
      width: 120,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'slitOrder.Length' }),
      width: 120,
    },
    {
      field: 'CheckQC',
      headerName: 'Check QC',
      width: 100,
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
                // disabled={
                //   params.row.IsFinish
                //     ? true
                //     : params.row.LotStatusName == 'STOCK' || params.row.LotStatusName == 'NG'
                //     ? true
                //     : false
                // }
                onClick={() => handleOpenCheckIQC(params.row)}
              >
                <CheckBoxIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'StaffName',
      headerName: intl.formatMessage({ id: 'slitOrder.StaffNameCheck' }),
      width: 120,
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
                disabled={params.row.IsFinish}
                onClick={() => handleUpdateSlit(params.row)}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp]);

  const handleOpenCheckIQC = (item) => {
    setRowData({ ...item });
    toggle();
  };

  const handleCloseCheckIQC = (item) => {
    toggle();
    fetchDetailData();
  };

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <MuiDataGrid
          showLoading={detailPanelState.isLoading}
          isPagingServer={true}
          headerHeight={35}
          gridHeight={260}
          columns={detailPanelColumns}
          rows={detailPanelState.data}
          page={detailPanelState.page - 1}
          pageSize={detailPanelState.pageSize}
          rowCount={detailPanelState.totalRow}
          onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
          getRowId={(rows) => rows.SlitTurnId}
          initialState={{ pinnedColumns: { right: ['CheckQC', 'Edit'] } }}
          hideFooter
        />
      </Paper>
      <IQCCheckDialog RowCheck={rowData} isOpen={isShowing} onClose={handleCloseCheckIQC} />
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

export default SlitOrderSlittingDialog;
