import { CREATE_ACTION, BASE_URL } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import TabContext from '@mui/lab/TabContext';
import { Grid, TextField } from '@mui/material';
import { QCItemService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const StandardQCDialog = (props) => {
  const intl = useIntl();

  const { initModal, isOpen, onClose, setNewData, setUpdateData, mode, fetchData } = props;

  const defaultValue = {
    QCTypeId: 0,
    QCTypeName: '',
    QCName: '',
    QCApply: 0,
  };
  const [dialogState, setDialogState] = useState({
    ...initModal,
    isSubmit: false,
  });
  const schemaY = yup.object().shape({
    QCTypeId: yup
      .number()
      .min(1, intl.formatMessage({ id: 'general.field_required' }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    QCName: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
    QCApply: yup
      .number()
      .min(1, intl.formatMessage({ id: 'general.field_required' }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
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
      const res = await QCItemService.create(data);
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setNewData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        // handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await QCItemService.modify({
        ...data,
        QCId: initModal.QCId,
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
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCType' }) + ' *'}
              fetchDataFunc={QCItemService.getQCType}
              displayLabel="QCTypeName"
              displayValue="QCTypeId"
              displayGroup="QCApplyName"
              value={values.QCTypeId ? { QCTypeId: values.QCTypeId, QCTypeName: values.QCTypeName } : null}
              disabled={dialogState.isSubmit}
              onChange={(e, value) => {
                setFieldValue('QCApply', value?.QCApply || '');
                setFieldValue('QCApplyName', value?.QCApplyName || '');
                setFieldValue('QCTypeName', value?.QCTypeName || '');
                setFieldValue('QCTypeId', value?.QCTypeId || '');
              }}
              error={touched.QCTypeId && Boolean(errors.QCTypeId)}
              helperText={touched.QCTypeId && errors.QCTypeId}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'standardQC.QCName' }) + ' *'}
              name="QCName"
              value={values.QCName}
              onChange={handleChange}
              error={touched.QCName && Boolean(errors.QCName)}
              helperText={touched.QCName && errors.QCName}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCApply' }) + ' *'}
              fetchDataFunc={QCItemService.getQCApply}
              displayLabel="commonDetailName"
              displayValue="commonDetailId"
              value={values.QCApply ? { commonDetailId: values.QCApply, commonDetailName: values.QCApplyName } : null}
              disabled={true}
              onChange={(e, value) => {
                setFieldValue('QCApplyName', value?.commonDetailName || '');
                setFieldValue('QCApply', value?.commonDetailId || '');
              }}
              error={touched.QCApply && Boolean(errors.QCApply)}
              helperText={touched.QCApply && errors.QCApply}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
              <MuiResetButton onClick={resetForm} disabled={dialogState.isSubmit} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

export default StandardQCDialog;
