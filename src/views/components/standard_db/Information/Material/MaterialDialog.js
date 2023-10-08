import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { materialService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const MaterialDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    MaterialCode: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    MaterialName: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    MaterialUnit: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    SupplierId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    IQCMaterialId: yup
      .number()
      .nullable()
      .when('MaterialUnit', (MaterialUnit) => {
        if (MaterialUnit != 'EA')
          return yup
            .number()
            .nullable()
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    // IQCRawMaterialId: yup
    //   .number()
    //   .nullable()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),
    Length: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Width: yup
      .number()
      .integer()
      .nullable()
      .when('MaterialUnit', (MaterialUnit) => {
        if (MaterialUnit != 'EA')
          return yup
            .number()
            .integer()
            .nullable()
            .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    ExpirationMonth: yup
      .number()
      .integer()
      .nullable()
      .moreThan(-1, intl.formatMessage({ id: 'general.field_min' }, { min: 0 }))
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
    //const IQCMaterialId = data?.MaterialUnit == 'Roll' ? data?.IQCMaterialId : null;
    setDialogState({ ...dialogState, isSubmit: true });

    if (mode == CREATE_ACTION) {
      const res = await materialService.createMaterial({
        ...data,
        Width: Number(data.Width),
        ExpirationMonth: Number(data.ExpirationMonth),
      });
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
      const res = await materialService.modifyMaterial({
        ...data,
        Width: Number(data.Width),
        ExpirationMonth: Number(data.ExpirationMonth),
        // IQCMaterialId: IQCMaterialId,
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
  const materialIQC = () => {
    let value = {
      Data: [
        { Id: 1, IQCName: 'Form IQC 01' },
        { Id: 2, IQCName: 'Form IQC 02' },
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
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              name="MaterialCode"
              //disabled={dialogState.isSubmit}
              disabled={true}
              value={values.MaterialCode}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'material.MaterialCode' }) + ' *'}
              error={touched.MaterialCode && Boolean(errors.MaterialCode)}
              helperText={touched.MaterialCode && errors.MaterialCode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="MaterialName"
              //disabled={dialogState.isSubmit}
              disabled={true}
              value={values.MaterialName}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'material.MaterialName' }) + ' *'}
              error={touched.MaterialName && Boolean(errors.MaterialName)}
              helperText={touched.MaterialName && errors.MaterialName}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              value={values.MaterialUnit ? { UnitId: values.MaterialUnit, UnitName: values.MaterialUnit } : null}
              //disabled={dialogState.isSubmit}
              disabled={true}
              label={intl.formatMessage({ id: 'material.Unit' })}
              fetchDataFunc={() => {
                return {
                  Data: [
                    { UnitId: 'Roll', UnitName: 'Roll' },
                    { UnitId: 'EA', UnitName: 'EA' },
                  ],
                };
              }}
              displayLabel="UnitName"
              displayValue="UnitId"
              onChange={(e, value) => {
                setFieldValue('MaterialUnit', value?.UnitName || '');
              }}
              error={touched.MaterialUnit && Boolean(errors.MaterialUnit)}
              helperText={touched.MaterialUnit && errors.MaterialUnit}
            />
          </Grid>

          <Grid item xs={6}>
            <MuiAutocomplete
              required
              value={values.SupplierId ? { SupplierId: values.SupplierId, SupplierCode: values.SupplierCode } : null}
              //disabled={dialogState.isSubmit}
              // disabled={true}
              label={intl.formatMessage({ id: 'material.SupplierId' })}
              fetchDataFunc={materialService.getSupplier}
              displayLabel="SupplierCode"
              displayValue="SupplierId"
              onChange={(e, value) => {
                setFieldValue('SupplierCode', value?.SupplierCode || '');
                setFieldValue('SupplierId', value?.SupplierId || '');
              }}
              error={touched.SupplierId && Boolean(errors.SupplierId)}
              helperText={touched.SupplierId && errors.SupplierId}
            />
          </Grid>

          {/* <Grid item xs={6}>
            <MuiAutocomplete
              required
              value={
                values.IQCRawMaterialId
                  ? { QCIQCMasterId: values.IQCRawMaterialId, QCIQCMasterName: values.IQCRawMaterialName }
                  : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'material.IQCRawMaterialId' })}
              fetchDataFunc={materialService.GetIQCRawMaterial}
              displayLabel="QCIQCMasterName"
              displayValue="QCIQCMasterId"
              onChange={(e, value) => {
                setFieldValue('IQCRawMaterialName', value?.QCIQCMasterName || '');
                setFieldValue('IQCRawMaterialId', value?.QCIQCMasterId || '');
              }}
              error={touched.IQCRawMaterialId && Boolean(errors.IQCRawMaterialId)}
              helperText={touched.IQCRawMaterialId && errors.IQCRawMaterialId}
            />
          </Grid>*/}

          {values.MaterialUnit != 'EA' ? (
            <>
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
                  label={intl.formatMessage({ id: 'material.standard_Width' }) + ' *'}
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
                  disabled={dialogState.isSubmit}
                  value={values.Length}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'material.standard_Length' }) + ' *'}
                  error={touched.Length && Boolean(errors.Length)}
                  helperText={touched.Length && errors.Length}
                />
              </Grid>
            </>
          ) : (
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
                label={intl.formatMessage({ id: 'material.standard_EA' }) + ' *'}
                error={touched.Length && Boolean(errors.Length)}
                helperText={touched.Length && errors.Length}
              />
            </Grid>
          )}

          {values.MaterialUnit != 'EA' && (
            <Grid item xs={6}>
              <MuiAutocomplete
                required
                value={
                  values.IQCMaterialId
                    ? { QCIQCMasterId: values.IQCMaterialId, QCIQCMasterName: values.IQCMaterialName }
                    : null
                }
                //disabled={dialogState.isSubmit}
                // disabled={true}
                label={intl.formatMessage({ id: 'material.IQCMaterialId' })}
                fetchDataFunc={materialService.GetIQCMaterial}
                displayLabel="QCIQCMasterName"
                displayValue="QCIQCMasterId"
                onChange={(e, value) => {
                  setFieldValue('IQCMaterialName', value?.QCIQCMasterName || '');
                  setFieldValue('IQCMaterialId', value?.QCIQCMasterId || '');
                }}
                error={touched.IQCMaterialId && Boolean(errors.IQCMaterialId)}
                helperText={touched.IQCMaterialId && errors.IQCMaterialId}
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="ExpirationMonth"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              //disabled={dialogState.isSubmit}
              // disabled={true}
              value={values.ExpirationMonth}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'material.ExpirationMonth' })}
              error={touched.ExpirationMonth && Boolean(errors.ExpirationMonth)}
              helperText={touched.ExpirationMonth && errors.ExpirationMonth}
            />
          </Grid>
          <Grid item xs={values.MaterialUnit == 'EA' ? 6 : 12}>
            <TextField
              fullWidth
              size="small"
              name="Description"
              //disabled={dialogState.isSubmit}
              // disabled={true}
              value={values.Description}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'material.Description' })}
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
  MaterialId: null,
  MaterialCode: '',
  MaterialName: '',
  MaterialUnit: '',
  IQCMaterialId: null,
  IQCMaterialName: '',
  //IQCRawMaterialId: null,
  IQCRawMaterialName: '',
  SupplierId: null,
  SupplierCode: '',
  Width: '',
  Length: '',
  Description: '',
  ExpirationMonth: '',
};

export default MaterialDialog;
