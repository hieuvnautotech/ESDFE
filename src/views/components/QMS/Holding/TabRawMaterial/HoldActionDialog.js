import { CREATE_ACTION } from '@constants/ConfigConstants';
import { useModal, useModal2 } from '@basesShared';
import { MuiButton, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Button, Grid, TextField } from '@mui/material';
import { HoldRawMaterialService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import * as ConfigConstants from '@constants/ConfigConstants';
import HoldDialog from './HoldDialog';
import IQCCheckDialog from './IQCCheckDialog';

const HoldActionDialog = ({ isOpen, onClose, MaterialLot, resetList }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();

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

  const changeHandler = async (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // const onSubmit = async (data) => {
  //   setDialogState({ ...dialogState, isSubmit: true });

  //   const formData = new FormData();
  //   formData.append('file', selectedFile);
  //   formData.append('MaterialLotId', MaterialLotId);
  //   formData.append('Reason', data?.Reason ?? '');

  //   const res = await HoldRawMaterialService.hold(formData);
  //   if (res.HttpResponseCode === 200) {
  //     SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
  //     resetForm();
  //     resetList();
  //     setDialogState({ ...dialogState, isSubmit: false });
  //     handleCloseDialog();
  //   } else {
  //     ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
  //     setDialogState({ ...dialogState, isSubmit: false });
  //   }
  // };

  const handleScrap = async () => {
    if (window.confirm(intl.formatMessage({ id: 'Holding.confirm_scrap' }))) {
      try {
        const res = await HoldRawMaterialService.scrap({ MaterialLotId: MaterialLot?.MaterialLotId });
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

            {!MaterialLot?.IsHandCheck && (
              <Grid item xs={12}>
                <Button variant="contained" color="warning" onClick={() => toggle2()} sx={{ width: '100%' }}>
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
      <HoldDialog
        isOpen={isShowing}
        onClose={toggle}
        MaterialLot={MaterialLot}
        resetList={resetList}
        unHold={true}
        closeAction={handleCloseDialog}
      />

      <IQCCheckDialog initModal={MaterialLot} isOpen={isShowing2} onClose={toggle2} />
    </React.Fragment>
  );
};

export default HoldActionDialog;
