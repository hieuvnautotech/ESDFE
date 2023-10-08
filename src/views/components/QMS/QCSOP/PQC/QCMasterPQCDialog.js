import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { qcPQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import moment from 'moment';

const QCMasterPQCDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputKey, setInputKey] = useState(null);

  const schemaY = yup.object().shape({
    Products: yup
      .array()
      .nullable()
      .when('products', (e) => {
        if (mode == CREATE_ACTION)
          return yup
            .array()
            .nullable()
            .min(1, intl.formatMessage({ id: 'general.field_required' }))
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    QCPQCMasterName: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    REVDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Process: yup
      .array()
      .nullable()
      .when('process', (e) => {
        if (mode == CREATE_ACTION)
          return yup
            .array()
            .nullable()
            .min(1, intl.formatMessage({ id: 'general.field_required' }))
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
  });

  useEffect(() => {
    if (mode === UPDATE_ACTION) {
      getProductMapping(initModal.QCPQCMasterId);
      getProcessMapping(initModal.QCPQCMasterId);
    }
  }, [isOpen, UPDATE_ACTION]);

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode == CREATE_ACTION ? defaultValue : initModal,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleReset = () => {
    setSelectedFile(null);
    resetForm();
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const getProductMapping = async (id) => {
    const res = await qcPQCService.getPQCMasterProduct(id);
    setFieldValue('Products', res.Data);
    return res;
  };

  const getProcessMapping = async (id) => {
    const res = await qcPQCService.getPQCMasterProcess(id);
    setFieldValue('Process', res.Data);
    return res;
  };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('QCPQCMasterName', data?.QCPQCMasterName);
    formData.append('REVDate', moment(data?.REVDate).format('YYYY-MM-DD'));
    formData.append('Description', data?.Description ?? '');
    formData.append('Explain', data?.Explain ?? '');
    //formData.append('ProcessId', data?.ProcessId ?? null);
    if (data.Products != null)
      data.Products.forEach((element) => {
        formData.append('Products', element.ProductId);
      });
    if (data.Process != null)
      data.Process.forEach((element) => {
        formData.append('Process', element.ProcessCode);
      });
    if (mode == CREATE_ACTION) {
      const res = await qcPQCService.createPQCMaster(formData);
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
      formData.append('QCPQCMasterId', data?.QCPQCMasterId);
      if (data?.ImageFile != null) formData.append('ImageFile', data?.ImageFile);
      formData.append('row_version', data?.row_version);
      const res = await qcPQCService.modifyPQCMaster(formData);
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

  const changeHandler = async (event) => {
    // await resetInputFile();
    setSelectedFile(event.target.files[0]);
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: mode == CREATE_ACTION ? 'general.create' : 'general.modify' })}
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
              name="QCPQCMasterName"
              disabled={values.IsConfirm ? true : dialogState.isSubmit}
              value={values.QCPQCMasterName}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'qcPQC.QCPQCMasterName' }) + ' *'}
              error={touched.QCPQCMasterName && Boolean(errors.QCPQCMasterName)}
              helperText={touched.QCPQCMasterName && errors.QCPQCMasterName}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiDateField
              required
              disabled={values.IsConfirm ? true : dialogState.isSubmit}
              label={intl.formatMessage({ id: 'qcPQC.REVDate' })}
              value={values.REVDate ?? null}
              onChange={(e) => setFieldValue('REVDate', e)}
              error={touched.REVDate && Boolean(errors.REVDate)}
              helperText={touched.REVDate && errors.REVDate}
            />
          </Grid>
          <Grid item xs={12}>
            {/* <MuiAutocomplete
              required
              value={values.ProductId ? { ProductId: values.ProductId, ProductCode: values.ProductCode } : null}
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'qcPQC.ProductId' })}
              fetchDataFunc={qcPQCService.getProduct}
              displayLabel="ProductCode"
              displayValue="ProductId"
              onChange={(e, value) => {
                setFieldValue('ProductCode', value?.ProductCode || '');
                setFieldValue('ProductId', value?.ProductId || '');
              }}
              error={touched.ProductId && Boolean(errors.ProductId)}
              helperText={touched.ProductId && errors.ProductId}
            /> */}
            <MuiAutocomplete
              required
              multiple={true}
              value={values.Products ? values.Products : []}
              label={intl.formatMessage({ id: 'qcPQC.ProductId' })}
              fetchDataFunc={qcPQCService.getProduct}
              displayLabel="ProductCode"
              displayValue="ProductId"
              name="Products"
              onChange={(e, value) => {
                setFieldValue('Products', value || []);
              }}
              error={touched.Products && Boolean(errors.Products)}
              helperText={touched.Products && errors.Products}
            />
          </Grid>
          <Grid item xs={12}>
            {/* <MuiAutocomplete
              required
              value={
                values.ProcessId ? { commonDetailId: values.ProcessId, commonDetailName: values.ProcessCode } : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'bom.ProcessId' })}
              fetchDataFunc={qcPQCService.getProcess}
              displayLabel="commonDetailName"
              displayValue="commonDetailId"
              onChange={(e, value) => {
                setFieldValue('ProcessCode', value?.commonDetailName || '');
                setFieldValue('ProcessId', value?.commonDetailId || null);
              }}
              error={touched.ProcessId && Boolean(errors.ProcessId)}
              helperText={touched.ProcessId && errors.ProcessId}
            /> */}

            <MuiAutocomplete
              required
              multiple={true}
              value={values.Process ? values.Process : []}
              label={intl.formatMessage({ id: 'bom.ProcessId' })}
              fetchDataFunc={qcPQCService.getProcess}
              displayLabel="ProcessName"
              displayValue="ProcessCode"
              name="Process"
              onChange={(e, value) => setFieldValue('Process', value || [])}
              error={touched.Process && Boolean(errors.Process)}
              helperText={touched.Process && errors.Process}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Explain"
              disabled={values.IsConfirm ? true : dialogState.isSubmit}
              value={values.Explain}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'qcPQC.Explain' })}
              error={touched.Explain && Boolean(errors.Explain)}
              helperText={touched.Explain && errors.Explain}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Description"
              //disabled={dialogState.isSubmit}
              value={values.Description}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'qcPQC.Description' })}
              disabled={values.IsConfirm ? true : dialogState.isSubmit}
            />
          </Grid>

          <Grid item xs={12}>
            <input type="file" name="file" key={inputKey || ''} onChange={changeHandler} />
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

const defaultValue = {
  QCPQCMasterId: null,
  QCPQCMasterName: '',
  REVDate: '',
  Description: '',
  // ProductId: null,
  // ProductCode: '',
  ProcessId: null,
  ProcessCode: '',
  Explain: '',
  Products: [],
  Process: [],
};

export default QCMasterPQCDialog;
