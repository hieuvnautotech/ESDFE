import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDateField, MuiDialog, MuiResetButton, MuiSubmitButton, MuiTextField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { BladeService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const BladeDialog = (props) => {
  const intl = useIntl();

  const { initModal, isOpen, onClose, setNewData, setUpdateData, mode, fetchData } = props;

  const defaultValue = {
    BladeId: null,
    BladeName: '',
    BladeSize: '',
    SupplierId: null,
    ImportDate: null,
    QCMoldMasterId: null,
    CutMaxNumber: 0,
    PeriodicCheck: 0,
    CutCurrentNumber: 0,
    BladeStatus: '',
    LineId: null,
    Description: '',
  };

  const [dialogState, setDialogState] = useState({
    ...initModal,
    isSubmit: false,
  });
  const schemaY = yup.object().shape({
    BladeName: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
    BladeSize: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
    SupplierId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .moreThan(0, intl.formatMessage({ id: 'general.field_required' })),
    QCMoldMasterId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),

    ImportDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),

    LineId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .moreThan(0, intl.formatMessage({ id: 'general.field_required' })),
    BladeStatus: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    PeriodicCheck: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),

    CutMaxNumber: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),

    CutCurrentNumber: yup
      .number()
      .integer()
      .nullable()
      .moreThan(-1, intl.formatMessage({ id: 'general.field_min' }, { min: 0 })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode == CREATE_ACTION ? defaultValue : initModal,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  useEffect(() => {
    if (mode == CREATE_ACTION) {
      formik.initialValues = defaultValue;
    } else {
      formik.initialValues = initModal;
    }
  }, [initModal, mode]);

  const handleReset = () => {
    resetForm();
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    if (mode == CREATE_ACTION) {
      const res = await BladeService.createBlade(data);
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setNewData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      } else {
        setDialogState({ ...dialogState, isSubmit: false });
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    } else {
      const res = await BladeService.modifyBlade(data);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setUpdateData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
        handleCloseDialog();
      } else {
        setDialogState({ ...dialogState, isSubmit: false });
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    }
  };

  useEffect(() => {
    if (mode == CREATE_ACTION) {
      formik.initialValues = defaultValue;
    } else {
      formik.initialValues = initModal;
    }
  }, [initModal, mode]);
  const materialIQC = () => {
    let value = {
      Data: [
        { Id: 1, IQCName: 'Form IQC Blade 01' },
        { Id: 2, IQCName: 'Form IQC Blade 02' },
      ],
    };
    return value;
  };
  return (
    <MuiDialog
      maxWidth="md"
      title={intl.formatMessage({ id: mode == CREATE_ACTION ? 'general.create' : 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              name="BladeName"
              disabled={dialogState.isSubmit}
              value={values.BladeName}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'Blade.BladeName' }) + ' *'}
              error={touched.BladeName && Boolean(errors.BladeName)}
              helperText={touched.BladeName && errors.BladeName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'Blade.BladeSize' }) + ' *'}
              name="BladeSize"
              value={values.BladeSize}
              onChange={handleChange}
              error={touched.BladeSize && Boolean(errors.BladeSize)}
              helperText={touched.BladeSize && errors.BladeSize}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              label={intl.formatMessage({ id: 'Blade.SupplierCode' })}
              fetchDataFunc={BladeService.getSupplier}
              displayLabel="SupplierName"
              displayValue="SupplierId"
              value={
                values.SupplierId
                  ? {
                      SupplierId: values.SupplierId,
                      SupplierName: values.SupplierName,
                    }
                  : null
              }
              onChange={(e, value) => {
                setFieldValue('SupplierName', value?.SupplierName || '');
                setFieldValue('SupplierId', value?.SupplierId || 0);
              }}
              error={touched.SupplierId && Boolean(errors.SupplierId)}
              helperText={touched.SupplierId && errors.SupplierId}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiDateField
              required
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'Blade.ImportDate' })}
              value={values.ImportDate ?? null}
              onChange={(e) => setFieldValue('ImportDate', e)}
              error={touched.ImportDate && Boolean(errors.ImportDate)}
              helperText={touched.ImportDate && errors.ImportDate}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              label={intl.formatMessage({ id: 'Blade.QCMasterName' })}
              fetchDataFunc={BladeService.getQCMasters}
              displayLabel="QCMoldMasterName"
              displayValue="QCMoldMasterId"
              value={
                values.QCMoldMasterId
                  ? {
                      QCMoldMasterId: values.QCMoldMasterId,
                      QCMoldMasterName: values.QCMoldMasterName,
                    }
                  : null
              }
              onChange={(e, value) => {
                setFieldValue('QCMoldMasterName', value?.QCMoldMasterName || '');
                setFieldValue('QCMoldMasterId', value?.QCMoldMasterId || null);
              }}
              error={touched.QCMoldMasterId && Boolean(errors.QCMoldMasterId)}
              helperText={touched.QCMoldMasterId && errors.QCMoldMasterId}
            />
          </Grid>
          {/* <Grid item xs={6}>
            <MuiAutocomplete
              required
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'Blade.QCMasterName' })}
              fetchDataFunc={materialIQC}
              displayLabel="IQCName"
              displayValue="Id"
            />
          </Grid> */}
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              size="small"
              name="CutMaxNumber"
              type="number"
              disabled={dialogState.isSubmit}
              value={values.CutMaxNumber}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'Blade.CutMaxNumber' })}
              error={touched.CutMaxNumber && Boolean(errors.CutMaxNumber)}
              helperText={touched.CutMaxNumber && errors.CutMaxNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              size="small"
              name="PeriodicCheck"
              type="number"
              disabled={dialogState.isSubmit}
              value={values.PeriodicCheck}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'Blade.SoMetDiMai' })}
              error={touched.PeriodicCheck && Boolean(errors.PeriodicCheck)}
              helperText={touched.PeriodicCheck && errors.PeriodicCheck}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="CutCurrentNumber"
              type="number"
              disabled={dialogState.isSubmit}
              value={values.CutCurrentNumber}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'Blade.CutCurrentNumber' })}
              error={touched.CutCurrentNumber && Boolean(errors.CutCurrentNumber)}
              helperText={touched.CutCurrentNumber && errors.CutCurrentNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              label={intl.formatMessage({ id: 'Blade.BladeStatusName' })}
              fetchDataFunc={BladeService.getStatus}
              displayValue="commonDetailCode"
              displayLabel="commonDetailLanguge"
              value={
                values.BladeStatus
                  ? {
                      commonDetailCode: values.BladeStatus,
                      commonDetailLanguge: values.BladeStatusName,
                    }
                  : null
              }
              onChange={(e, value) => {
                setFieldValue('BladeStatus', value?.commonDetailCode || null);
                setFieldValue('BladeStatusName', value?.commonDetailLanguge || '');
              }}
              error={touched.BladeStatus && Boolean(errors.BladeStatus)}
              helperText={touched.BladeStatus && errors.BladeStatus}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              label={intl.formatMessage({ id: 'Blade.LineName' })}
              fetchDataFunc={BladeService.getLine}
              displayLabel="LineName"
              displayValue="LineId"
              value={
                values.LineId
                  ? {
                      LineId: values.LineId,
                      LineName: values.LineName,
                    }
                  : null
              }
              onChange={(e, value) => {
                setFieldValue('LineName', value?.LineName || '');
                setFieldValue('LineId', value?.LineId || 0);
              }}
              error={touched.LineId && Boolean(errors.LineId)}
              helperText={touched.LineId && errors.LineId}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Description"
              disabled={dialogState.isSubmit}
              value={values.Description}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'Blade.Description' })}
              error={touched.Description && Boolean(errors.Description)}
              helperText={touched.Description && errors.Description}
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

export default BladeDialog;
