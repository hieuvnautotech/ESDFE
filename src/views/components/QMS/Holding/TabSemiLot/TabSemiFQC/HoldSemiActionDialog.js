import { MuiButton, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Button, Grid, TextField } from '@mui/material';
import { HoldSemiLotService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { useModal, useModal2 } from '@basesShared';
import HoldSemiFQCDialog from './HoldSemiFQCDialog';

const HoldSemiActionDialog = ({ isOpen, onClose, initModal, resetList }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const { isShowing, toggle } = useModal();

  const handleCloseDialog = () => {
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
    initialValues: { Reason: '' },
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleScrap = async () => {
    if (window.confirm(intl.formatMessage({ id: 'Holding.confirm_scrap' }))) {
      try {
        const res = await HoldSemiLotService.scrapFQC({ WOSemiLotFQCId: initModal?.WOSemiLotFQCId });
        if (res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          resetList();
          setDialogState({ ...dialogState, isSubmit: false });
          handleCloseDialog();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
          setDialogState({ ...dialogState, isSubmit: false });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <React.Fragment>
      <MuiDialog
        maxWidth="sm"
        title={intl.formatMessage({ id: 'general.action' })}
        isOpen={isOpen}
        disabledCloseBtn={dialogState.isSubmit}
        disable_animate={300}
        onClose={handleCloseDialog}
      >
        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
              <Button variant="contained" color="success" onClick={() => toggle()} sx={{ width: '100%' }}>
                {intl.formatMessage({ id: 'Holding.Release' })}
              </Button>
            </Grid>
            {!initModal?.IsHandCheck && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="warning"
                  //onClick={() => handleDetail(params.row)}
                  sx={{ width: '100%' }}
                >
                  {intl.formatMessage({ id: 'Holding.ReCheck' })}
                </Button>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button variant="contained" color="error" onClick={() => handleScrap()} sx={{ width: '100%' }}>
                {intl.formatMessage({ id: 'Holding.Scrap' })}
              </Button>
            </Grid>
          </Grid>
        </form>
      </MuiDialog>
      <HoldSemiFQCDialog
        isOpen={isShowing}
        onClose={toggle}
        initModal={initModal}
        resetList={resetList}
        unHold={true}
        closeAction={handleCloseDialog}
      />
    </React.Fragment>
  );
};

export default HoldSemiActionDialog;
