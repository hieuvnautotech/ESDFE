import { MuiAutocomplete, MuiButton, MuiDateField, MuiDialog } from '@controls';
import { BladeCheckFormDto } from '@models';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { moldService, BladeService } from '@services';
import { ErrorAlert, isNullUndefinedEmptyStr, dateToTicks } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import BladeCheckFormText from './BladeCheckFormText';
import BladeCheckFormValue from './BladeCheckFormValue';

const checkOptions = ['OK', 'NG'];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

const BladeCheckDialog = (props) => {
  let isRendered = useRef(true);
  const intl = useIntl();

  const Mode = {
    DEFAULT: 'default',
    ADD_PERIOD: 'add-period',
    CHANGE_QC_FORM: 'change-qc-form',
  };

  const { isOpen, onClose, initModal, setUpdateData } = props;
  const [pageText, setPageText] = useState(1);
  const [pageTextSize, setPageTextSize] = useState(5);
  const [pageValue, setPageValue] = useState(1);
  const [pageValueSize, setPageValueSize] = useState(5);

  const [checkValue, setCheckValue] = useState(checkOptions[0]);
  const [tabCheckNo, setTabCheckNo] = useState(0);
  const [historyCheckForm, setHistoryCheckForm] = useState(0);
  const [qcMoldMasterId, setQCMoldMasterId] = useState(0);
  const [inputCheckValue, setInputCheckValue] = useState('');

  const [isSubmit, setIsSubmit] = useState(false);
  const [disableText, setDisableText] = useState(true);
  const [disableValue, setDisableValue] = useState(true);

  const [bladeCheckForm, setBladeCheckForm] = useState({
    ...BladeCheckFormDto,
  });

  const handleCloseDialog = () => {
    setBladeCheckForm({ ...BladeCheckFormDto });
    onClose();
  };

  const getbladeCheckFormMapping = async (qcMoldMasterId, mode) => {
    if (qcMoldMasterId) {
      const params = {
        QCMoldMasterId: qcMoldMasterId,
      };

      const res = await BladeService.getbladeCheckFormMapping(params);
      if (res && isRendered) {
        switch (mode) {
          case Mode.CHANGE_QC_FORM:
            setBladeCheckForm({
              ...bladeCheckForm,
              BladeCheckMasterId: dateToTicks(new Date()),
              UpdateAvailable: true,
              StaffId: 0,
              StaffName: '',
              CheckDate: moment(),
              CheckResult: true,
              BladeCheckDetailTextDtos: res.Data?.BladeCheckDetailTextDtos?.length
                ? [...res.Data?.BladeCheckDetailTextDtos]
                : [],
              BladeCheckDetailValueDtos: res.Data?.BladeCheckDetailValueDtos?.length
                ? [...res.Data?.BladeCheckDetailValueDtos]
                : [],
            });
            setTabCheckNo(0);
            setCheckValue(checkOptions[0]);
            break;

          case Mode.ADD_PERIOD:
            setBladeCheckForm({
              // ...bladeCheckForm,
              BladeId: initModal?.BladeId,
              QCMoldMasterId: initModal?.QCMoldMasterId,
              QCMoldMasterName: initModal?.QCMoldMasterName,
              CheckNo: initModal?.CheckNo,
              BladeCheckMasterId: dateToTicks(new Date()),
              UpdateAvailable: true,
              StaffId: 0,
              StaffName: '',
              CheckDate: moment(),
              CheckResult: true,
              BladeCheckDetailTextDtos: res.Data?.BladeCheckDetailTextDtos?.length
                ? [...res.Data?.BladeCheckDetailTextDtos]
                : [],
              BladeCheckDetailValueDtos: res.Data?.BladeCheckDetailValueDtos?.length
                ? [...res.Data?.BladeCheckDetailValueDtos]
                : [],
            });
            setTabCheckNo(0);
            break;

          default:
            setBladeCheckForm({
              // ...bladeCheckForm,
              BladeId: initModal?.BladeId,
              QCMoldMasterId: initModal?.QCMoldMasterId,
              QCMoldMasterName: initModal?.QCMoldMasterName,
              CheckNo: initModal?.CheckNo,
              BladeCheckMasterId: dateToTicks(new Date()),
              UpdateAvailable: true,
              StaffId: 0,
              StaffName: '',
              CheckDate: moment(),
              CheckResult: true,
              BladeCheckDetailTextDtos: res.Data?.BladeCheckDetailTextDtos?.length
                ? [...res.Data?.BladeCheckDetailTextDtos]
                : [],
              BladeCheckDetailValueDtos: res.Data?.BladeCheckDetailValueDtos?.length
                ? [...res.Data?.BladeCheckDetailValueDtos]
                : [],
            });
            setTabCheckNo(initModal?.CheckNo);
            setCheckValue(checkOptions[0]);
            break;
        }
      }
    }
  };

  const getbladeCheckFormHistory = async (bladeId, checkNo) => {
    if (bladeId && checkNo) {
      const params = {
        BladeId: bladeId,
        CheckNo: checkNo,
      };

      const res = await BladeService.getbladeCheckFormHistory(params);
      if (res && isRendered) {
        setBladeCheckForm({
          ...bladeCheckForm,
          BladeId: initModal?.BladeId,
          QCMoldMasterId: res.Data?.QCMoldMasterId,
          QCMoldMasterName: res.Data?.QCMoldMasterName,
          CheckNo: initModal?.CheckNo,
          BladeCheckMasterId: res.Data?.BladeCheckMasterId,
          UpdateAvailable: res.Data?.UpdateAvailable,
          StaffId: res.Data?.StaffId,
          StaffName: res.Data?.StaffName,
          CheckDate: moment(res.Data?.CheckDate).format('YYYY-MM-DD'),
          CheckResult: res.Data?.CheckResult,
          BladeCheckDetailTextDtos: res.Data?.BladeCheckDetailTextDtos?.length
            ? [...res.Data?.BladeCheckDetailTextDtos]
            : [],
          BladeCheckDetailValueDtos: res.Data?.BladeCheckDetailValueDtos?.length
            ? [...res.Data?.BladeCheckDetailValueDtos]
            : [],
        });

        if (res.Data?.CheckResult) {
          setCheckValue(checkOptions[0]);
        } else {
          setCheckValue(checkOptions[1]);
        }

        setTabCheckNo(res.Data?.CheckNo);
      }
    }
  };

  useEffect(() => {
    setTabCheckNo(initModal?.CheckNo ?? 0);
    setHistoryCheckForm(initModal?.CheckNo ?? 0);
    if (initModal?.CheckNo === 0) {
      getbladeCheckFormMapping(initModal?.QCMoldMasterId, Mode.DEFAULT);
    } else {
      getbladeCheckFormHistory(initModal?.BladeId, initModal?.CheckNo);
    }
  }, [initModal]);

  useEffect(() => {
    getbladeCheckFormMapping(qcMoldMasterId, Mode.CHANGE_QC_FORM);
    return () => {
      isRendered = false;
      console.log('un-mount');
    };
  }, [qcMoldMasterId]);

  // const preProcessEditCellProps = (field) => {
  //   return (params) => {
  //     // console.log('params.row: ', params.row[field]);
  //     // console.log('params.props: ', params.props);
  //     // console.log({ r: params.row[field], p: params.props.value });

  //     // if (params.row[field] !== params.props.value) {
  //     const input = params.props.value;
  //     const result = parseFloat(input);
  //     if (isNaN(result)) {
  //       return { ...params.props, error: true };
  //     } else {
  //       return { ...params.props, error: false };
  //     }
  //     // }

  //     // if (/*params.row[field] !== params.props.value &&*/ !isNumber(params.props.value)) {
  //     //   console.log('erre');
  //     //   return { ...params.props, error: true };
  //     // }
  //     // return { ...params.props, error: false };
  //   };
  // };

  const handleSaveForm = async () => {
    let flag = 1;
    const data = { ...bladeCheckForm, BladeId: initModal.BladeId };
    // setBladeCheckForm({ ...bladeCheckForm, BladeId: initModal.BladeId });
    for (let i = 0; i < data?.BladeCheckDetailTextDtos?.length; i++) {
      if (isNullUndefinedEmptyStr(data?.BladeCheckDetailTextDtos[i])) {
        flag = 2;
        break;
      }
    }

    for (let i = 0; i < data?.BladeCheckDetailValueDtos?.length; i++) {
      if (isNullUndefinedEmptyStr(data?.BladeCheckDetailValueDtos[i])) {
        flag = 3;
        break;
      }
    }

    switch (flag) {
      case 1:
        if (!data?.QCMoldMasterId || data?.QCMoldMasterId === 0) {
          ErrorAlert(
            intl.formatMessage({
              id: 'mold.checkForm_select',
            })
          );
          return;
        }
        if (data?.StaffId === 0 || !data?.StaffId) {
          ErrorAlert(
            intl.formatMessage({
              id: 'mold.staff_select',
            })
          );
          return;
        }
        await handleSaveMoldCheck(data);
        break;
      case 2:
        ErrorAlert(
          intl.formatMessage({
            id: 'mold.full_fill_text_checking',
          })
        );
        break;
      default:
        ErrorAlert(
          intl.formatMessage({
            id: 'mold.full_fill_value_checking',
          })
        );
        break;
    }
  };

  const handleSaveMoldCheck = async (params) => {
    setIsSubmit(true);
    if (
      window.confirm(
        intl.formatMessage({
          id: 'general.confirm_save',
        })
      )
    ) {
      const res = await BladeService.createbladeCheckFormMapping(params);
      if (res === 'general.success') {
        setIsSubmit(false);
        const moldData = await BladeService.getbladeById({ bladeId: params.BladeId });
        setUpdateData({ ...moldData.Data });
        handleCloseDialog();
      }
    }
  };

  const handleAddPeriod = async () => {
    if (
      window.confirm(
        intl.formatMessage({
          id: 'general.confirm_add_period',
        })
      )
    ) {
      await getbladeCheckFormMapping(initModal?.QCMoldMasterId, Mode.ADD_PERIOD);
    }
  };

  const handleChangeHistoryCheck = async (event, value) => {
    setHistoryCheckForm(value);
    getbladeCheckFormHistory(bladeCheckForm?.BladeId, value);
  };
  return (
    <MuiDialog
      maxWidth="xl"
      title="DEV FORM"
      isOpen={isOpen}
      disabledCloseBtn={isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
        <Grid xs={4}>
          <MuiAutocomplete
            label={intl.formatMessage({ id: 'mold.QCMasterName' })}
            disabled={tabCheckNo != 0}
            fetchDataFunc={moldService.getQCMasters}
            value={
              bladeCheckForm?.QCMoldMasterId
                ? {
                    QCMoldMasterId: bladeCheckForm?.QCMoldMasterId,
                    QCMoldMasterName: bladeCheckForm?.QCMoldMasterName,
                  }
                : null
            }
            displayLabel="QCMoldMasterName"
            displayValue="QCMoldMasterId"
            onChange={(e, item) => {
              setBladeCheckForm({
                ...bladeCheckForm,
                QCMoldMasterId: item ? item.QCMoldMasterId ?? null : null,
                QCMoldMasterName: item ? item.QCMoldMasterName ?? null : null,
              });
              setQCMoldMasterId(item ? item.QCMoldMasterId ?? null : null);
            }}
          />
        </Grid>
        <Grid xs={4}>
          <MuiAutocomplete
            label={intl.formatMessage({ id: 'staff.StaffCode' })}
            disabled={tabCheckNo != 0}
            fetchDataFunc={moldService.getStaff}
            displayLabel="StaffName"
            displayValue="StaffId"
            value={
              bladeCheckForm?.StaffId
                ? {
                    StaffId: bladeCheckForm?.StaffId,
                    StaffName: bladeCheckForm?.StaffName,
                  }
                : null
            }
            onChange={(e, item) =>
              setBladeCheckForm({
                ...bladeCheckForm,
                StaffId: item ? item.StaffId ?? null : null,
                StaffName: item ? item.StaffName ?? null : null,
              })
            }
          />
        </Grid>
        <Grid xs={4}>
          <MuiDateField
            disabled={tabCheckNo != 0}
            label={intl.formatMessage({
              id: 'mold.CheckDate',
            })}
            value={bladeCheckForm?.CheckDate}
            onChange={(e) =>
              setBladeCheckForm({
                ...bladeCheckForm,
                CheckDate: e ?? null,
              })
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <Autocomplete
            value={checkValue}
            disabled={tabCheckNo != 0}
            onChange={(event, newValue) => {
              setCheckValue(newValue);
              if (newValue === 'OK') {
                setBladeCheckForm({
                  ...bladeCheckForm,
                  CheckResult: true,
                });
              } else {
                setBladeCheckForm({
                  ...bladeCheckForm,
                  CheckResult: false,
                });
              }
            }}
            inputValue={inputCheckValue}
            onInputChange={(event, newInputValue) => {
              setInputCheckValue(newInputValue);
            }}
            options={checkOptions}
            fullWidth
            size="small"
            renderInput={(params) => <TextField {...params} label={intl.formatMessage({ id: 'mold.CheckStatus' })} />}
          />
        </Grid>
        <Grid xs={8}>
          <Item>{`Serial: ${initModal?.BladeSize} - ${initModal?.BladeName}`}</Item>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Text Grid */}
        {bladeCheckForm?.BladeCheckDetailTextDtos?.length ? (
          <BladeCheckFormText
            bladeCheckForm={bladeCheckForm}
            setBladeCheckForm={setBladeCheckForm}
            pageText={pageText}
            setPageText={setPageText}
            pageTextSize={pageTextSize}
            setPageTextSize={setPageTextSize}
            disableText={disableText}
            setDisableText={setDisableText}
            tabCheckNo={tabCheckNo}
          />
        ) : (
          ''
        )}

        {/* Value Grid */}
        {bladeCheckForm?.BladeCheckDetailValueDtos?.length ? (
          <BladeCheckFormValue
            bladeCheckForm={bladeCheckForm}
            setBladeCheckForm={setBladeCheckForm}
            pageValue={pageValue}
            setPageValue={setPageValue}
            pageValueSize={pageValueSize}
            setPageValueSize={setPageValueSize}
            disableValue={disableValue}
            setDisableValue={setDisableValue}
            tabCheckNo={tabCheckNo}
          />
        ) : (
          ''
        )}
      </Grid>

      <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Pagination
          count={tabCheckNo === 0 ? 0 : bladeCheckForm?.CheckNo}
          page={historyCheckForm}
          onChange={handleChangeHistoryCheck}
        />
        <MuiButton
          sx={{ mt: 1.2 }}
          disabled={initModal?.BladeStatus === 63808920528495}
          text={tabCheckNo != 0 ? 'periodcheck' : 'save'}
          color={tabCheckNo == 0 ? 'success' : 'warning'}
          onClick={tabCheckNo == 0 ? handleSaveForm : handleAddPeriod}
        />
      </Grid>
    </MuiDialog>
  );
};
export default BladeCheckDialog;
