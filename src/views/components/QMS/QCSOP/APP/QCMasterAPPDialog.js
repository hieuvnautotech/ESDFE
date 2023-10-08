import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { qcAPPService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const QCMasterAPPDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

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
    QCAPPMasterName: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  useEffect(() => {
    if (mode === UPDATE_ACTION) {
      getProductMapping(initModal.QCAPPMasterId);
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
    resetForm();
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const getProductMapping = async (id) => {
    const res = await qcAPPService.getAPPMasterProduct(id);
    setFieldValue('Products', res.Data);
    return res;
  };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    if (mode == CREATE_ACTION) {
      const res = await qcAPPService.createAPPMaster(data);
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
      const res = await qcAPPService.modifyAPPMaster(data);
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
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              name="QCAPPMasterName"
              disabled={values.IsConfirm ? true : dialogState.isSubmit}
              value={values.QCAPPMasterName}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'qcOQC.QCOQCMasterName' }) + ' *'}
              error={touched.QCAPPMasterName && Boolean(errors.QCAPPMasterName)}
              helperText={touched.QCAPPMasterName && errors.QCAPPMasterName}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              required
              multiple={true}
              value={values.Products ? values.Products : []}
              label={intl.formatMessage({ id: 'qcOQC.ProductId' })}
              fetchDataFunc={qcAPPService.getProduct}
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
            <MuiAutocomplete
              required
              disabled={true}
              multiple={true}
              value={values.Products ? values.Products : []}
              label={intl.formatMessage({ id: 'general.model' })}
              displayLabel="ModelCode"
              name="Models"
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
              label={intl.formatMessage({ id: 'qcOQC.Explain' })}
              error={touched.Explain && Boolean(errors.Explain)}
              helperText={touched.Explain && errors.Explain}
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

const defaultValue = {
  QCAPPMasterId: null,
  QCAPPMasterName: '',
  Explain: '',
  Products: [],
};

export default QCMasterAPPDialog;
