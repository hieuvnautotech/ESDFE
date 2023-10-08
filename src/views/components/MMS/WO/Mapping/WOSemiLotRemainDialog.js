import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField, MuiDateTimeField } from '@controls';
import { Grid, IconButton, TextField } from '@mui/material';
import { SlitOrderService, WOService, qcPQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
const WOSemiLotRemainDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    RemainQty: yup
      .number()
      .integer()
      .nullable()
      .when('remainqty', (value) => {
        return yup
          .number()
          .integer()
          .nullable()
          .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
          .lessThan(
            initModal?.OriginQty + 1,
            intl.formatMessage({ id: 'general.field_max' }, { max: initModal?.OriginQty })
          )
          .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
  });
  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: initModal,
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

    const res = await WOService.returnSemiLotDetail(data);
    if (res.HttpResponseCode === 200 && res.Data) {
      setDialogState({ ...dialogState, isSubmit: false });
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      onClose();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };
  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'WO.Remain' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="RemainQty"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              value={values?.RemainQty ?? ''}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'WO.Remain' })}
              error={touched.RemainQty && Boolean(errors.RemainQty)}
              helperText={touched.RemainQty && errors.RemainQty}
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

export default WOSemiLotRemainDialog;
