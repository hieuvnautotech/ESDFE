import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { IQCReceivingService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const IQCAddDialog = ({ isOpen, onClose, IQCModel, setUpdateData }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const schemaY = yup.object().shape({
    Length: yup
      .number()
      .integer()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    // .when('width', (value) => {
    //   if (IQCModel?.Length > 0)
    //     return yup
    //       .number()
    //       .nullable()
    //       .integer()
    //       .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
    //       .lessThan(IQCModel?.Length + 1, intl.formatMessage({ id: 'general.field_max' }, { max: IQCModel?.Length }))
    //       .required(intl.formatMessage({ id: 'general.field_required' }));
    // }),
    QuantityInBundle: yup
      .number()
      .integer()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: { ...IQCModel, Length: '', QuantityInBundle: '' },
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

    const res = await IQCReceivingService.addLot(data);
    if (res.HttpResponseCode === 200) {
      setUpdateData(res.Data);
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
      handleReset();
      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.create' })}
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
              name="MaterialCode"
              disabled={true}
              value={values.MaterialCode}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'materialLot.MaterialCode' }) + ' *'}
            />
          </Grid>
          {values.MaterialUnit != 'EA' && (
            <Grid item xs={12}>
              <TextField
                autoFocus
                fullWidth
                size="small"
                name="Width"
                disabled={true}
                value={values.BundleWidth}
                onChange={handleChange}
                label={intl.formatMessage({ id: 'materialLot.Width' }) + ' *'}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Length"
              disabled={dialogState.isSubmit}
              value={values.Length}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'materialLot.Length' })}
              error={touched.Length && Boolean(errors.Length)}
              helperText={touched.Length && errors.Length}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="QuantityInBundle"
              disabled={dialogState.isSubmit}
              value={values.QuantityInBundle}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'IQCReceiving.QuantityInBundle' })}
              error={touched.QuantityInBundle && Boolean(errors.QuantityInBundle)}
              helperText={touched.QuantityInBundle && errors.QuantityInBundle}
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

export default IQCAddDialog;
