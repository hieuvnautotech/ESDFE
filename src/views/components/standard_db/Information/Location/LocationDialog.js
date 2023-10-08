import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { locationService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const LocationDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    LocationCode: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
    AreaCode: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

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

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    if (mode == CREATE_ACTION) {
      const res = await locationService.createLocation({ ...data, Width: Number(data.Width) });
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
      const res = await locationService.modifyLocation({ ...data, Width: Number(data.Width) });
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
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'location.LocationCode' }) + ' *'}
              name="LocationCode"
              value={values.LocationCode}
              onChange={handleChange}
              error={touched.LocationCode && Boolean(errors.LocationCode)}
              helperText={touched.LocationCode && errors.LocationCode}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              translationLabel
              required
              value={
                values.AreaCode ? { commonDetailCode: values.AreaCode, commonDetailLanguge: values.AreaName } : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'location.AreaCode' })}
              fetchDataFunc={locationService.getArea}
              displayLabel="commonDetailLanguge"
              displayValue="commonDetailCode"
              onChange={(e, value) => {
                setFieldValue('AreaName', value?.commonDetailLanguge || '');
                setFieldValue('AreaCode', value?.commonDetailCode || '');
              }}
              error={touched.AreaCode && Boolean(errors.AreaCode)}
              helperText={touched.AreaCode && errors.AreaCode}
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
  LocationId: null,
  LocationCode: '',
  AreaCode: '',
};

export default LocationDialog;
