import { MuiAutocomplete, MuiButton, MuiDateField, MuiDialog } from '@controls';
import { MoldCheckFormDto } from '@models';
import Autocomplete from '@mui/material/Autocomplete';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { moldService } from '@services';
import { dateToTicks, ErrorAlert, isNullUndefinedEmptyStr } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import MoldCheckFormText from './MoldCheckFormText';
import MoldCheckFormValue from './MoldCheckFormValue';

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

const MoldCheckDialog = (props) => {
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
  const [qcMasterId, setQCMasterId] = useState(0);
  const [inputCheckValue, setInputCheckValue] = useState('');

  const [isSubmit, setIsSubmit] = useState(false);
  const [disableText, setDisableText] = useState(true);
  const [disableValue, setDisableValue] = useState(true);

  const [moldCheckForm, setMoldCheckForm] = useState({
    ...MoldCheckFormDto,
  });

  const handleCloseDialog = () => {
    setMoldCheckForm({ ...MoldCheckFormDto });
    onClose();
  };

  const getMoldCheckFormMapping = async (qcMasterId, mode) => {
    if (qcMasterId) {
      const params = {
        QCMasterId: qcMasterId,
      };

      const res = await moldService.getMoldCheckFormMapping(params);

      if (res && isRendered) {
        switch (mode) {
          case Mode.CHANGE_QC_FORM:
            setMoldCheckForm({
              ...moldCheckForm,
              MoldCheckMasterId: dateToTicks(new Date()),
              UpdateAvailable: true,
              StaffId: 0,
              StaffName: '',
              CheckDate: moment(),
              CheckResult: true,
              MoldCheckDetailTextDtos: res.Data.MoldCheckDetailTextDtos.length
                ? [...res.Data.MoldCheckDetailTextDtos]
                : [],
              MoldCheckDetailValueDtos: res.Data.MoldCheckDetailValueDtos.length
                ? [...res.Data.MoldCheckDetailValueDtos]
                : [],
            });
            setTabCheckNo(0);
            setCheckValue(checkOptions[0]);
            break;

          case Mode.ADD_PERIOD:
            setMoldCheckForm({
              // ...moldCheckForm,
              MoldId: initModal.MoldId,
              QCMasterId: initModal.QCMasterId,
              QCMasterName: initModal.QCMasterName,
              CheckNo: initModal.CheckNo,
              MoldCheckMasterId: dateToTicks(new Date()),
              UpdateAvailable: true,
              StaffId: 0,
              StaffName: '',
              CheckDate: moment(),
              CheckResult: true,
              MoldCheckDetailTextDtos: res.Data.MoldCheckDetailTextDtos.length
                ? [...res.Data.MoldCheckDetailTextDtos]
                : [],
              MoldCheckDetailValueDtos: res.Data.MoldCheckDetailValueDtos.length
                ? [...res.Data.MoldCheckDetailValueDtos]
                : [],
            });
            setTabCheckNo(0);
            break;

          default:
            setMoldCheckForm({
              // ...moldCheckForm,
              MoldId: initModal.MoldId,
              QCMasterId: initModal.QCMasterId,
              QCMasterName: initModal.QCMasterName,
              CheckNo: initModal.CheckNo,
              MoldCheckMasterId: dateToTicks(new Date()),
              UpdateAvailable: true,
              StaffId: 0,
              StaffName: '',
              CheckDate: moment(),
              CheckResult: true,
              MoldCheckDetailTextDtos: res.Data.MoldCheckDetailTextDtos.length
                ? [...res.Data.MoldCheckDetailTextDtos]
                : [],
              MoldCheckDetailValueDtos: res.Data.MoldCheckDetailValueDtos.length
                ? [...res.Data.MoldCheckDetailValueDtos]
                : [],
            });
            setTabCheckNo(initModal.CheckNo);
            setCheckValue(checkOptions[0]);
            break;
        }
      }
    } else {
    }
  };

  const getMoldCheckFormHistory = async (moldId, checkNo) => {
    if (moldId && checkNo) {
      const params = {
        MoldId: moldId,
        CheckNo: checkNo,
      };

      const res = await moldService.getMoldCheckFormHistory(params);

      if (res && isRendered) {
        setMoldCheckForm({
          ...moldCheckForm,
          MoldId: initModal.MoldId,
          QCMasterId: res.Data.QCMasterId,
          QCMasterName: res.Data.QCMasterName,
          CheckNo: initModal.CheckNo,
          MoldCheckMasterId: res.Data.MoldCheckMasterId,
          UpdateAvailable: res.Data.UpdateAvailable,
          StaffId: res.Data.StaffId,
          StaffName: res.Data.StaffName,
          CheckDate: moment(res.Data.CheckDate).format('YYYY-MM-DD'),
          CheckResult: res.Data.CheckResult,
          MoldCheckDetailTextDtos: res.Data.MoldCheckDetailTextDtos.length ? [...res.Data.MoldCheckDetailTextDtos] : [],
          MoldCheckDetailValueDtos: res.Data.MoldCheckDetailValueDtos.length
            ? [...res.Data.MoldCheckDetailValueDtos]
            : [],
        });

        if (res.Data.CheckResult) {
          setCheckValue(checkOptions[0]);
        } else {
          setCheckValue(checkOptions[1]);
        }

        setTabCheckNo(res.Data.CheckNo);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTabCheckNo(initModal.CheckNo ?? 0);
      setHistoryCheckForm(initModal.CheckNo ?? 0);
      if (initModal.CheckNo === 0) {
        getMoldCheckFormMapping(initModal.QCMasterId, Mode.DEFAULT);
      } else {
        getMoldCheckFormHistory(initModal.MoldId, initModal.CheckNo);
      }
    }
  }, [initModal, isOpen]);

  useEffect(() => {
    getMoldCheckFormMapping(qcMasterId, Mode.CHANGE_QC_FORM);

    return () => {
      isRendered = false;
      console.log('un-mount');
    };
  }, [qcMasterId]);

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

    for (let i = 0; i < moldCheckForm.MoldCheckDetailTextDtos.length; i++) {
      if (isNullUndefinedEmptyStr(moldCheckForm.MoldCheckDetailTextDtos[i])) {
        flag = 2;
        break;
      }
    }

    for (let i = 0; i < moldCheckForm.MoldCheckDetailValueDtos.length; i++) {
      if (isNullUndefinedEmptyStr(moldCheckForm.MoldCheckDetailValueDtos[i])) {
        flag = 3;
        break;
      }
    }

    switch (flag) {
      case 1:
        if (moldCheckForm.StaffId === 0 || !moldCheckForm.StaffId) {
          ErrorAlert(
            intl.formatMessage({
              id: 'mold.staff_select',
            })
          );
        } else {
          await handleSaveMoldCheck(moldCheckForm);
        }
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
      const res = await moldService.createMoldCheckFormMapping(params);
      if (res === 'general.success') {
        setIsSubmit(false);
        const moldData = await moldService.getMoldById({ moldId: params.MoldId });
        setUpdateData({ ...moldData.Data });
        handleCloseDialog();
      } else {
        ErrorAlert(
          // intl.formatMessage({
          //   id: res,
          // })
          intl.formatMessage({ id: res }, { CheckNo: parseInt(initModal.CheckNo) + 1 })
        );
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
      await getMoldCheckFormMapping(initModal.QCMasterId, Mode.ADD_PERIOD);
    }
  };

  const handleChangeHistoryCheck = async (event, value) => {
    setHistoryCheckForm(value);
    getMoldCheckFormHistory(moldCheckForm.MoldId, value);
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
              moldCheckForm.QCMasterId
                ? {
                    QCMasterId: moldCheckForm.QCMasterId,
                    QCMasterName: moldCheckForm.QCMasterName,
                  }
                : null
            }
            displayLabel="QCMasterName"
            displayValue="QCMasterId"
            onChange={(e, item) => {
              setMoldCheckForm({
                ...moldCheckForm,
                QCMasterId: item ? item.QCMasterId ?? null : null,
                QCMasterName: item ? item.QCMasterName ?? null : null,
              });
              setQCMasterId(item ? item.QCMasterId ?? null : null);
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
              moldCheckForm.StaffId
                ? {
                    StaffId: moldCheckForm.StaffId,
                    StaffName: moldCheckForm.StaffName,
                  }
                : null
            }
            onChange={(e, item) =>
              setMoldCheckForm({
                ...moldCheckForm,
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
            value={moldCheckForm.CheckDate}
            onChange={(e) =>
              setMoldCheckForm({
                ...moldCheckForm,
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
                setMoldCheckForm({
                  ...moldCheckForm,
                  CheckResult: true,
                });
              } else {
                setMoldCheckForm({
                  ...moldCheckForm,
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
          <Item>{`Serial: ${initModal?.MoldSerial} - ${initModal.MoldName}`}</Item>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {qcMasterId != null && qcMasterId != undefined ? (
          <>
            {moldCheckForm.MoldCheckDetailTextDtos.length ? (
              <MoldCheckFormText
                moldCheckForm={moldCheckForm}
                setMoldCheckForm={setMoldCheckForm}
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

            {moldCheckForm.MoldCheckDetailValueDtos.length ? (
              <MoldCheckFormValue
                moldCheckForm={moldCheckForm}
                setMoldCheckForm={setMoldCheckForm}
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
          </>
        ) : null}
      </Grid>

      <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Pagination
          count={tabCheckNo === 0 ? 0 : moldCheckForm.CheckNo}
          page={historyCheckForm}
          onChange={handleChangeHistoryCheck}
        />
        <MuiButton
          disabled={initModal.MoldStatus === 63808920528495}
          text={tabCheckNo != 0 ? 'periodcheck' : 'save'}
          color={tabCheckNo == 0 ? 'success' : 'warning'}
          onClick={tabCheckNo == 0 ? handleSaveForm : handleAddPeriod}
        />
      </Grid>
    </MuiDialog>
  );
};
export default MoldCheckDialog;
