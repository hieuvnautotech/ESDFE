import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { permissionService, menuService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const CreatePermissionDialog = ({ initModal, isOpen, onClose, refreshGrid }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    permissionCode: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    menuId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: defaultValue,
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

    const res = await permissionService.createPermission(data);
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      handleReset();
      refreshGrid();
      setDialogState({ ...dialogState, isSubmit: false });
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
              name="permissionCode"
              disabled={dialogState.isSubmit}
              value={values.permissionCode}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'permission.permissionName' }) + ' *'}
              error={touched.permissionCode && Boolean(errors.permissionCode)}
              helperText={touched.permissionCode && errors.permissionCode}
            />
          </Grid>

          <Grid item xs={12}>
            <MuiAutocomplete
              required
              value={values.menuId ? { menuId: values.menuId, menuName: values.menuName } : null}
              disabled={values.LotCheckStatus ? true : dialogState.isSubmit}
              label={intl.formatMessage({ id: 'menu.menuName' })}
              fetchDataFunc={() => menuService.getParentMenus(4)}
              displayGroup="parentMenuName"
              displayLabel="menuName"
              displayValue="menuId"
              onChange={(e, value) => {
                setFieldValue('menuName', value?.menuName || '');
                setFieldValue('menuId', value?.menuId || '');
              }}
              error={touched.menuId && Boolean(errors.menuId)}
              helperText={touched.menuId && errors.menuId}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox values={values.isBase} onChange={(e) => setFieldValue('isBase', e.target.checked)} />}
              label="Create Base"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox values={values.forRoot} onChange={(e) => setFieldValue('forRoot', e.target.checked)} />
              }
              label="For root only"
            />
          </Grid>
          {values.isBase && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="Description"
                  disabled={true}
                  value={values.permissionCode.toUpperCase() + '_READ'}
                  label={intl.formatMessage({ id: 'permission.permissionName' })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="Description"
                  disabled={true}
                  value={values.permissionCode.toUpperCase() + '_CREATE'}
                  label={intl.formatMessage({ id: 'permission.permissionName' })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="Description"
                  disabled={true}
                  value={values.permissionCode.toUpperCase() + '_UPDATE'}
                  label={intl.formatMessage({ id: 'permission.permissionName' })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="Description"
                  disabled={true}
                  value={values.permissionCode.toUpperCase() + '_DELETE'}
                  label={intl.formatMessage({ id: 'permission.permissionName' })}
                />
              </Grid>
            </>
          )}
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
  permissionId: 0,
  menuId: null,
  menuName: '',
  permissionCode: '',
  permissionName: '',
  isBase: false,
  forRoot: false,
};

export default CreatePermissionDialog;
