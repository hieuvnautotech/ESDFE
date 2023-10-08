import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { WOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const WODialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    ProductId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    BomVersion: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ManufacturingDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Target: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
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
      const res = await WOService.createWO(data);
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
      const res = await WOService.modifyWO(data);
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
            <MuiAutocomplete
              required
              value={
                values.ProductId
                  ? {
                      ProductId: values.ProductId,
                      ProductCode: values.ProductCode + ' - ' + values.ModelCode + ' - ' + values?.ProductName,
                    }
                  : null
              }
              disabled={dialogState.isSubmit || mode == UPDATE_ACTION}
              label={intl.formatMessage({ id: 'bom.ProductId' })}
              fetchDataFunc={() => WOService.getProduct()}
              displayLabel="ProductCode"
              displayValue="ProductId"
              onChange={(e, value) => {
                setFieldValue('CodeNo', value?.CodeNo || '');
                setFieldValue('BomVersion', value?.BomVersion || '');
                setFieldValue('ProductCode', value?.ProductCodeTemp || '');
                setFieldValue('ModelCode', value?.ModelCode || '');
                setFieldValue('ProductName', value?.ProductName || '');
                setFieldValue('ProductId', value?.ProductId || null);
              }}
              error={touched.ProductId && Boolean(errors.ProductId)}
              helperText={touched.ProductId && errors.ProductId}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              required
              value={values.BomVersion ? { BomVersion: values.BomVersion } : null}
              disabled={values.ProductId == null ? true : dialogState.isSubmit}
              label={intl.formatMessage({ id: 'WO.BomId' })}
              fetchDataFunc={() => WOService.getBom(values.ProductId)}
              displayLabel="BomVersion"
              displayValue="BomVersion"
              onChange={(e, value) => {
                setFieldValue('BomVersion', value?.BomVersion || '');
                // setFieldValue('BomVersion', value?.BomId || null);
              }}
              error={touched.BomVersion && Boolean(errors.BomVersion)}
              helperText={touched.BomVersion && errors.BomVersion}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Target"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={dialogState.isSubmit}
              value={values.Target}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'WO.Target' }) + ' *'}
              error={touched.Target && Boolean(errors.Target)}
              helperText={touched.Target && errors.Target}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiDateField
              required
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'WO.ManufacturingDate' })}
              value={values.ManufacturingDate ?? null}
              onChange={(e) => setFieldValue('ManufacturingDate', e)}
              error={touched.ManufacturingDate && Boolean(errors.ManufacturingDate)}
              helperText={touched.ManufacturingDate && errors.ManufacturingDate}
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
              label={intl.formatMessage({ id: 'bom.Description' })}
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
  BomId: null,
  CodeNo: '',
  ProductId: null,
  ProductCode: '',
  ManufacturingDate: '',
  Description: '',
  Target: '',
  BomVersion: '',
};

export default WODialog;
