import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField, MuiDateTimeField } from '@controls';
import { Grid, IconButton, TextField } from '@mui/material';
import { ActualService, WOService, qcPQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';

const WOProcessStaffDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode, WOProcessId }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const defaultValue = {
    WOProcessStaffId: null,
    WOProcessId: WOProcessId,
    StartDate: null,
    EndDate: null,
    StaffSerial: '',
  };
  const schemaY = yup.object().shape({
    StaffId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    StartDate: yup
      .date()
      .nullable()
      .when('startDate', (value) => {
        if (mode == UPDATE_ACTION)
          return yup
            .date()
            .nullable()
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    EndDate: yup
      .date()
      .nullable()
      .when('endDate', (value) => {
        if (mode == UPDATE_ACTION)
          return yup
            .date()
            .nullable()
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
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
      const res = await ActualService.createProcessStaff(data);
      if (res.HttpResponseCode === 200 && res.Data) {
        setDialogState({ ...dialogState, isSubmit: false });
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setNewData({ ...res.Data });
        handleReset();
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await ActualService.modifyProcessStaff({
        ...data,
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
            <MuiAutocomplete
              disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
              label={intl.formatMessage({ id: 'WO.staff' })}
              fetchDataFunc={ActualService.getStaff}
              displayLabel="StaffName"
              displayValue="StaffId"
              value={
                values.StaffId
                  ? {
                      StaffId: values.StaffId,
                      StaffName: values.StaffName,
                    }
                  : null
              }
              onChange={(e, value) => {
                setFieldValue('StaffName', value?.StaffName || '');
                setFieldValue('StaffId', value?.StaffId || null);
              }}
              error={touched.StaffId && Boolean(errors.StaffId)}
              helperText={touched.StaffId && errors.StaffId}
            />
          </Grid>
          {mode == UPDATE_ACTION && (
            <>
              <Grid item xs={6}>
                <MuiDateTimeField
                  required
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'WO.StartDate' })}
                  value={values.StartDate ?? null}
                  onChange={(e) => setFieldValue('StartDate', e)}
                  error={touched.StartDate && Boolean(errors.StartDate)}
                  helperText={touched.StartDate && errors.StartDate}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiDateTimeField
                  required
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'WO.EndDate' })}
                  value={values.EndDate ?? null}
                  onChange={(e) => setFieldValue('EndDate', e)}
                  error={touched.EndDate && Boolean(errors.EndDate)}
                  helperText={touched.EndDate && errors.EndDate}
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

export default WOProcessStaffDialog;
