import { BASE_URL, CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import {
  MuiAutocomplete,
  MuiButton,
  MuiDateField,
  MuiDialog,
  MuiResetButton,
  MuiSubmitButton,
  MuiTextField,
  MuiSelectField,
} from '@controls';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Grid, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import { moldService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import readXlsxFile from 'read-excel-file';
import * as yup from 'yup';

import { MoldDto } from '@models';

const MoldDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode, valueOption, fetchData }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [dataReadFile, setDataReadFile] = useState([]);
  const refFile = useRef();
  const [value, setValue] = React.useState('tab1');
  const [selectedFile, setSelectedFile] = useState(null);

  const schema_yup = yup.object().shape({
    MoldCode: yup.string().required(intl.formatMessage({ id: 'mold.MoldCode_required' })),
    MoldName: yup.string().required(intl.formatMessage({ id: 'mold.MoldName_required' })),
    MoldVersion: yup.string().required(intl.formatMessage({ id: 'mold.MoldVersion_required' })),
    Products: yup
      .array()
      .nullable()
      .min(1, intl.formatMessage({ id: 'mold.Product_required' }))
      .required(intl.formatMessage({ id: 'mold.Product_required' })),

    // LineTypes: yup
    //   .array()
    //   .nullable()
    //   .min(1, intl.formatMessage({ id: 'mold.LineType_required' }))
    //   .required(intl.formatMessage({ id: 'mold.LineType_required' })),

    SupplierId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'mold.Supplier_required' }))
      .moreThan(0, intl.formatMessage({ id: 'mold.Supplier_required' })),

    QCMasterId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'mold.Supplier_required' }))
      .moreThan(0, intl.formatMessage({ id: 'mold.Supplier_required' })),

    MoldType: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'mold.Supplier_required' }))
      .moreThan(0, intl.formatMessage({ id: 'mold.Supplier_required' })),

    MaxNumber: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'mold.MaxNumber_required' }))
      .moreThan(0, intl.formatMessage({ id: 'mold.min_value' })),

    PeriodNumber: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'mold.PeriodNumber_required' }))
      .moreThan(0, intl.formatMessage({ id: 'mold.min_value' })),
    MoldStatus: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'mold.MoldStatus_required' })),
    CurrentNumber: yup
      .number()
      .integer()
      .nullable()
      .moreThan(-1, intl.formatMessage({ id: 'general.field_min' }, { min: 0 })),
  });

  const formik = useFormik({
    validationSchema: schema_yup,
    initialValues: mode == CREATE_ACTION ? MoldDto : initModal,
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
    delete data?.LineTypes;
    if (mode == CREATE_ACTION) {
      const res = await moldService.createMold(data);
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setNewData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await moldService.modifyMold({
        ...data,
        MoldId: initModal.MoldId,
        row_version: initModal.row_version,
      });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setUpdateData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };

  const schema = {
    'MOLD SERIAL': {
      prop: 'MoldCode',
      type: String,
      required: true,
    },
    'MOLD CODE': {
      prop: 'MoldCode',
      type: String,
      required: true,
    },
    'MODEL CODE': {
      prop: 'ModelCode',
      type: String,
      required: true,
    },
    INCH: {
      prop: 'Inch',
      type: String,
      required: true,
    },
    'MOLD TYPE CODE': {
      prop: 'MoldTypeCode',
      type: String,
      required: true,
    },
    'MACHINE TYPE CODE': {
      prop: 'MachineTypeCode',
      type: String,
      required: true,
    },
    'ETA DATE': {
      prop: 'ETADate',
      type: String,
      required: true,
    },
    'MACHINE TON': {
      prop: 'MachineTon',
      type: String,
      required: true,
    },
    CABITY: {
      prop: 'Cabity',
      type: Number,
      required: true,
    },
    'ETA STATUS': {
      prop: 'ETAStatus',
      type: Boolean,
      required: true,
    },
    REMARK: {
      prop: 'Remark',
      type: String,
    },
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);

    // if (event.target.files[0]?.name !== 'Mold.xlsx') {
    //   ErrorAlert(intl.formatMessage({ id: 'Files.Mold' }));
    // }

    readXlsxFile(event.target.files[0]).then(function (data) {
      setDataReadFile(data);
    });
  };

  const handleSubmitFile = async (rows) => {
    const res = await moldService.createMoldByExcel(rows);
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
      handleCloseDialog();
    } else {
      if (res.HttpResponseCode === 400 && res.ResponseMessage === 'general.duplicated_code') {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
      if (res.HttpResponseCode === 400 && res.ResponseMessage === 'mold.duplicated_serial') {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
      if (res.HttpResponseCode === 400 && res.ResponseMessage === '') {
        ErrorAlert(intl.formatMessage({ id: 'Files.Data_Invalid' }));
      }
    }
  };

  const handleUpload = async () => {
    setDialogState({ ...dialogState, isSubmit: true });
    if (!selectedFile) {
      ErrorAlert('Chưa chọn file update');
    }

    readXlsxFile(selectedFile, { schema }).then(({ rows, errors }) => {
      errors.length === 0;

      handleSubmitFile(rows);
    });

    // document.getElementById('upload-excel').value = '';
    document.getElementById('upload-excel-product').text = '';
    setSelectedFile(null);
    refFile.current.value = '';
    refFile.current.text = '';
    setDataReadFile([]);
    setDialogState({ ...dialogState, isSubmit: false });
  };

  const getProductMapping = async (id) => {
    const res = await moldService.getProductMapping({ moldId: id });
    setFieldValue('Products', res.Data);
    return res;
  };

  // const getLineTypeMapping = async (id) => {
  //   const res = await moldService.getLineTypeMapping({ moldId: id });
  //   setFieldValue('LineTypes', res.Data);
  //   return res;
  // };

  useEffect(() => {
    if (mode == CREATE_ACTION) {
      formik.initialValues = MoldDto;
    } else {
      formik.initialValues = initModal;
    }
  }, [initModal, mode]);

  useEffect(() => {
    if (mode === UPDATE_ACTION) {
      getProductMapping(initModal.MoldId);
      // getLineTypeMapping(initModal.MoldId);
      // setMaterialId(initModal.MaterialId);
    }
  }, [initModal]);

  return (
    <MuiDialog
      maxWidth="lg"
      title={intl.formatMessage({
        id: mode == CREATE_ACTION ? 'general.create' : 'general.modify',
      })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <MuiTextField
                required
                autoFocus
                name="MoldCode"
                disabled={dialogState.isSubmit}
                value={values?.MoldCode}
                onChange={handleChange}
                label={intl.formatMessage({ id: 'mold.MoldCode' })}
                error={touched.MoldCode && Boolean(errors.MoldCode)}
                helperText={touched.MoldCode && errors.MoldCode}
              />
            </Grid>
            <Grid item xs={6}>
              <MuiTextField
                required
                name="MoldName"
                disabled={dialogState.isSubmit}
                value={values?.MoldName}
                onChange={handleChange}
                label={intl.formatMessage({ id: 'mold.MoldName' })}
                error={touched.MoldName && Boolean(errors.MoldName)}
                helperText={touched.MoldName && errors.MoldName}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <MuiAutocomplete
                required
                multiple={true}
                value={values?.Products ? values?.Products : []}
                label={intl.formatMessage({ id: 'mold.ProductCode' })}
                fetchDataFunc={moldService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                name="Products"
                onChange={(e, value) => {
                  setFieldValue('Products', value || []);
                }}
                error={touched?.Products && Boolean(errors?.Products)}
                helperText={touched?.Products && errors?.Products}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="text"
                size="small"
                name="MoldVersion"
                label={intl.formatMessage({ id: 'mold.Version' }) + ' *'}
                disabled={dialogState.isSubmit}
                value={values.MoldVersion}
                onChange={handleChange}
                error={touched.MoldVersion && Boolean(errors.MoldVersion)}
                helperText={touched.MoldVersion && errors.MoldVersion}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            {/* <Grid item xs={6}>
              <MuiAutocomplete
                multiple={true}
                value={values?.LineTypes ? values?.LineTypes : []}
                label={intl.formatMessage({ id: 'mold.LineType' })}
                fetchDataFunc={moldService.getLineType}
                displayLabel="commonDetailNameEn"
                displayValue="commonDetailId"
                name="LineTypes"
                onChange={(e, value) => {
                  setFieldValue('LineTypes', value || []);
                }}
                error={touched.LineTypes && Boolean(errors.LineTypes)}
                helperText={touched.LineTypes && errors.LineTypes}
              />
            </Grid> */}

            <Grid item xs={6}>
              <MuiDateField
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'mold.ProductionDate' })}
                value={values?.ProductionDate ?? null}
                onChange={(e) => setFieldValue('ProductionDate', e)}
                error={touched.ProductionDate && Boolean(errors.ProductionDate)}
                helperText={touched.ProductionDate && errors.ProductionDate}
              />
            </Grid>
            <Grid item xs={6}>
              <MuiAutocomplete
                required
                label={intl.formatMessage({ id: 'mold.QCMasterName' })}
                fetchDataFunc={moldService.getQCMasters}
                displayLabel="QCMoldMasterName"
                displayValue="QCMoldMasterId"
                value={
                  values?.QCMasterId
                    ? {
                        QCMoldMasterId: values?.QCMasterId,
                        QCMoldMasterName: values?.QCMasterName,
                      }
                    : null
                }
                onChange={(e, value) => {
                  setFieldValue('QCMasterName', value?.QCMoldMasterName || '');
                  setFieldValue('QCMasterId', value?.QCMoldMasterId || 0);
                }}
                error={touched.QCMasterId && Boolean(errors.QCMasterId)}
                helperText={touched.QCMasterId && errors.QCMasterId}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <MuiAutocomplete
                required
                // disabled={!initModal?.CheckUpdateMoldType}
                value={
                  values.MoldType
                    ? {
                        commonDetailId: values.MoldType,
                        commonDetailLanguge: values.MoldTypeName,
                      }
                    : null
                }
                label={intl.formatMessage({ id: 'mold.moldType' })}
                fetchDataFunc={moldService.getMoldType}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailId"
                name="MoldType"
                onChange={(e, value) => {
                  setFieldValue('MoldType', value?.commonDetailId || '');
                  setFieldValue('MoldTypeName', value?.commonDetailLanguge || '');
                }}
                error={touched.MoldType && Boolean(errors.MoldType)}
                helperText={touched.MoldType && errors.MoldType}
              />
            </Grid>
            <Grid item xs={6}>
              <MuiAutocomplete
                required
                label={intl.formatMessage({ id: 'mold.SupplierCode' })}
                fetchDataFunc={moldService.getSupplier}
                displayLabel="SupplierCode"
                displayValue="SupplierId"
                value={
                  values?.SupplierId
                    ? {
                        SupplierId: values.SupplierId,
                        SupplierCode: values.SupplierCode,
                      }
                    : null
                }
                onChange={(e, value) => {
                  setFieldValue('SupplierCode', value?.SupplierCode || '');
                  setFieldValue('SupplierId', value?.SupplierId || 0);
                }}
                error={touched.SupplierId && Boolean(errors.SupplierId)}
                helperText={touched.SupplierId && errors.SupplierId}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <MuiTextField
                required
                label={intl.formatMessage({ id: 'mold.MaxNumber' })}
                type="number"
                name="MaxNumber"
                value={values?.MaxNumber ?? 0}
                onChange={handleChange}
                error={touched.MaxNumber && Boolean(errors.MaxNumber)}
                helperText={touched.MaxNumber && errors.MaxNumber}
              />
            </Grid>

            <Grid item xs={6}>
              <MuiTextField
                required
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'mold.CurrentNumber' })}
                type="number"
                name="CurrentNumber"
                value={values?.CurrentNumber ?? 0}
                onChange={handleChange}
                error={touched.CurrentNumber && Boolean(errors.CurrentNumber)}
                helperText={touched.CurrentNumber && errors.CurrentNumber}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <MuiAutocomplete
                required
                label={intl.formatMessage({ id: 'mold.MoldStatusName' })}
                fetchDataFunc={moldService.getStatusCRUD}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailCode"
                value={
                  values?.MoldStatus
                    ? {
                        commonDetailCode: values?.MoldStatus,
                        commonDetailLanguge: values?.MoldStatusName,
                      }
                    : null
                }
                onChange={(e, value) => {
                  setFieldValue('MoldStatus', value?.commonDetailCode || '');
                  setFieldValue('MoldStatusName', value?.commonDetailLanguge || '');
                }}
                error={touched.MoldStatus && Boolean(errors.MoldStatus)}
                helperText={touched.MoldStatus && errors.MoldStatus}
                name="MoldStatus"
              />
            </Grid>
            <Grid item xs={6}>
              <MuiTextField
                required
                disabled={dialogState.isSubmit}
                label={intl.formatMessage({ id: 'mold.PeriodNumber' })}
                type="number"
                name="PeriodNumber"
                value={values?.PeriodNumber ?? 0}
                onChange={handleChange}
                error={touched.PeriodNumber && Boolean(errors.PeriodNumber)}
                helperText={touched.PeriodNumber && errors.PeriodNumber}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <MuiTextField
              name="Remark"
              disabled={dialogState.isSubmit}
              value={values?.Remark}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'mold.Remark' })}
              // error={touched.Remark && Boolean(errors.Remark)}
              // helperText={touched.Remark && errors.Remark}
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
export default MoldDialog;
