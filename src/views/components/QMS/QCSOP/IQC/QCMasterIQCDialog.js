import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { qcIQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { QCIQCMasterDto } from '@models';
const QCMasterIQCDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  // const CreateDialog = (props) => {
  const intl = useIntl();
  const [qcType, setqcType] = useState(['']);
  const dataModalRef = useRef({ ...initModal });
  const [dialogState, setDialogState] = useState({
    isSubmit: false,
  });
  const schemaY = yup.object().shape({
    QCIQCMasterName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Explain: yup.string().trim(),
    IQCType: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode == CREATE_ACTION ? QCIQCMasterDto : initModal,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });
  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  useEffect(() => {
    setqcType('');
    resetForm({ ...initModal });
  }, [initModal]);

  const handleReset = () => {
    setqcType('');
    resetForm();
    setDialogState({
      ...dialogState,
    });
  };

  const handleCloseDialog = () => {
    setqcType('');
    resetForm();
    setDialogState({
      ...dialogState,
    });
    onClose();
  };
  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    if (mode == CREATE_ACTION) {
      const res = await qcIQCService.create(data);
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
      const res = await qcIQCService.modify(data);
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
      maxWidth="sm"
      title={intl.formatMessage({ id: mode == CREATE_ACTION ? 'general.create' : 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  name="QCIQCMasterName"
                  disabled={dialogState.isSubmit}
                  value={values.QCIQCMasterName}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'qcIQC.QCIQCMasterName' }) + ' *'}
                  error={touched.QCIQCMasterName && Boolean(errors.QCIQCMasterName)}
                  helperText={touched.QCIQCMasterName && errors.QCIQCMasterName}
                />
              </Grid>
              <Grid item xs={12}>
                <MuiAutocomplete
                  required
                  translationLabel
                  value={
                    values.IQCType
                      ? { commonDetailCode: values.IQCType, commonDetailLanguge: values.IQCTypeName }
                      : null
                  }
                  disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'qcIQC.IQCType' })}
                  fetchDataFunc={qcIQCService.getMaterialType}
                  displayLabel="commonDetailLanguge"
                  displayValue="commonDetailCode"
                  onChange={(e, value) => {
                    setFieldValue('IQCTypeName', value?.commonDetailLanguge || '');
                    setFieldValue('IQCType', value?.commonDetailCode || '');
                  }}
                  error={touched.IQCType && Boolean(errors.IQCType)}
                  helperText={touched.IQCType && errors.IQCType}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  name="Explain"
                  disabled={dialogState.isSubmit}
                  value={values.Explain}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'qcIQC.Explain' })}
                  error={touched.Explain && Boolean(errors.Explain)}
                  helperText={touched.Explain && errors.Explain}
                />
              </Grid>
            </Grid>
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

export default QCMasterIQCDialog;
