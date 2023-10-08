import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiDialog, MuiSubmitButton, MuiButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { HoldSemiLotService } from '@services';

const HoldSemiFQCDialog = ({ isOpen, onClose, initModal, resetList, unHold, DataSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const defaultValue = useMemo(() => {
    return {
      WOSemiLotFQCId: initModal?.WOSemiLotFQCId,
      Reason: '',
      LotStatus: initModal?.LotStatus,
      IsPicture: false,
      File: '',
    };
  }, [initModal?.WOSemiLotFQCId]);

  const handleCloseDialog = () => {
    setSelectedFile(null);
    onClose();
  };
  const schemaY = yup.object().shape({
    Reason: yup
      .string()
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

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });
    const formData = new FormData();
    formData.append('File', selectedFile);
    formData.append('Reason', data?.Reason);
    DataSelect.forEach((e) => {
      formData.append('ListId', e);
    });
    formData.append('IsPicture', selectedFile?.type.includes('image') ?? false);
    const res = unHold ? await HoldSemiLotService.unHoldFQC(formData) : await HoldSemiLotService.holdFQC(formData);
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      resetForm();
      resetList();
      setDialogState({ ...dialogState, isSubmit: false });
      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };
  const changeHandler = async (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <React.Fragment>
      <MuiDialog
        maxWidth="sm"
        title={intl.formatMessage({ id: 'Holding.Reason' })}
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
                name="Reason"
                disabled={dialogState.isSubmit}
                onChange={handleChange}
                label={intl.formatMessage({ id: 'Holding.Reason' }) + ' *'}
                error={touched.Reason && Boolean(errors.Reason)}
                helperText={touched.Reason && errors.Reason}
              />
            </Grid>
            <Grid item xs={12}>
              <input type="file" id="file-upload" name="File" onChange={changeHandler} />
            </Grid>
            <Grid item xs={12}>
              <Grid container direction="row-reverse">
                <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </MuiDialog>
    </React.Fragment>
  );
};

export default HoldSemiFQCDialog;
