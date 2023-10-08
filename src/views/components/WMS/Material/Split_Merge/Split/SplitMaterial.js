import { Box, Button, Grid } from '@mui/material';
import React, { useEffect, useRef, useState, memo } from 'react';
import { MuiButton, MuiTextField, MaterialLabel } from '@controls';
import { useIntl } from 'react-intl';
import { SplitMergeService } from '@services';
import { ErrorAlert, SuccessAlert, PrintMaterial } from '@utils';
import ReactToPrint from 'react-to-print';
import SplitMergeDataGrid from '../SplitMergeDataGrid';

const SplitMaterial = memo((props) => {
  const [newData, setNewData] = useState({});
  const intl = useIntl();
  const lotInputRef = useRef(null);
  const qtyInputRef = useRef(null);
  const componentRef = React.useRef();
  const [LotModel, setLotModel] = useState(null);
  const [LotModelSplit, setLotModelSplit] = useState(null);
  const [state, setState] = useState({ isLoading: false });

  const scanBtnClick = async () => {
    let inputVal = '';

    if (lotInputRef.current.value) {
      setState({ ...state, isLoading: true });
      inputVal = lotInputRef.current.value.trim().toUpperCase();
      var res = await SplitMergeService.getMaterialLabel(inputVal);
      if (res.HttpResponseCode === 200 && res.Data) {
        setLotModel(res.Data);
        setLotModelSplit(null);

        setState({ ...state, isLoading: false });
      } else {
        let mess = res.ResponseMessage.split('|');
        setLotModel(null);
        if (mess.length > 1) ErrorAlert(intl.formatMessage({ id: mess[0] }) + mess[1]);
        else ErrorAlert(intl.formatMessage({ id: mess[0] }));
        lotInputRef.current.value = '';
        setState({ ...state, isLoading: false });
      }
    }
  };

  const splitBtnClick = async () => {
    let inputVal = '';

    if (qtyInputRef.current.value) {
      inputVal = qtyInputRef.current.value.trim();
      if (inputVal > 0 && inputVal < LotModel.Length) {
        setLotModelSplit({ ...LotModel, Length: Number(inputVal), MaterialLotId: null, MaterialLotCode: '' });
        setLotModel({ ...LotModel, Length: Number(LotModel.Length - inputVal) });
      } else {
        ErrorAlert(intl.formatMessage({ id: 'lot.QtyNotEnough' }));
      }
    }
  };

  const saveBtnClick = async () => {
    if (window.confirm(intl.formatMessage({ id: 'lot.confirm_split' }))) {
      try {
        let inputVal = 0;
        if (qtyInputRef.current.value) {
          inputVal = qtyInputRef.current.value;

          setState({ ...state, isLoading: true });
          var res = await SplitMergeService.splitLot({
            MaterialLotId: String(LotModel.MaterialLotId),
            MaterialLotCode: String(LotModel?.MaterialLotCode.slice(0, LotModel?.MaterialLotCode.length - 4)),
            MaterialLotCode2: LotModel?.MaterialLotCode,
            Length: Number(inputVal),
          });

          if (res.HttpResponseCode === 200 && res.Data) {
            SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
            setLotModelSplit(res.Data);
            setNewData({ ...LotModel, ReceivedDate: res.Data?.ReceivedDate });
            setState({ ...state, isLoading: false });
          } else {
            ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
            setState({ ...state, isLoading: false });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };

  const handlePrint = async (ids) => {
    const res = await SplitMergeService.GetListPrintQR(ids);
    PrintMaterial(res.Data);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2.5} justifyContent="space-between" alignItems="width-end">
        <Grid item xs={7}>
          <Grid item sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
            <MuiTextField
              autoFocus
              sx={{ width: 300, mr: 1 }}
              ref={lotInputRef}
              label="Lot"
              onChange={(e) => (lotInputRef.current.value = e.target.value)}
              onKeyDown={keyPress}
            />
            <MuiButton text="scan" color="primary" onClick={scanBtnClick} sx={{ whiteSpace: 'nowrap' }} />

            <MuiTextField
              type="number"
              disabled={
                LotModel == null
                  ? true
                  : LotModelSplit == null
                  ? false
                  : LotModelSplit?.MaterialLotId == null
                  ? true
                  : false
              }
              sx={{ width: 300, mr: 1, ml: 5 }}
              ref={qtyInputRef}
              label={intl.formatMessage({ id: 'lot.SplitQty' })}
              onChange={(e) => (qtyInputRef.current.value = parseInt(e.target.value))}
            />
            <MuiButton
              disabled={
                LotModel == null
                  ? true
                  : LotModelSplit == null
                  ? false
                  : LotModelSplit?.MaterialLotId == null
                  ? true
                  : false
              }
              text="split"
              color="primary"
              onClick={splitBtnClick}
              sx={{ whiteSpace: 'nowrap', mr: 1 }}
            />
            <MuiButton
              color="warning"
              disabled={LotModelSplit == null ? true : LotModelSplit?.MaterialLotId != null ? true : false}
              onClick={() => {
                scanBtnClick();
                setLotModelSplit(null);
              }}
              text="cancel"
              sx={{ whiteSpace: 'nowrap', mr: 1 }}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={LotModelSplit == null ? true : LotModelSplit?.MaterialLotId == null ? true : false}
            sx={{ whiteSpace: 'nowrap', mr: 1 }}
            onClick={() => handlePrint([LotModelSplit?.MaterialLotId, LotModel?.MaterialLotId])}
          >
            {intl.formatMessage({ id: 'general.print' })}
          </Button>
          <MuiButton
            color="warning"
            disabled={!LotModel?.MaterialLotId && !LotModelSplit?.MaterialLotId}
            onClick={() => {
              setLotModel(null);
              setLotModelSplit(null);
              lotInputRef.current.value = '';
              qtyInputRef.current.value = '';
              lotInputRef.current.focus();
            }}
            text="reset"
            sx={{ whiteSpace: 'nowrap', mr: 1 }}
          />
          <MuiButton
            text="save"
            color="success"
            onClick={saveBtnClick}
            sx={{ whiteSpace: 'nowrap', mr: 1 }}
            disabled={
              (LotModelSplit == null ? true : LotModelSplit?.MaterialLotId != null ? true : false) ||
              !LotModel?.MaterialLotId
            }
          />
        </Grid>
      </Grid>
      <Box className="d-flex justify-content-between px-5 mt-2 mb-2">
        <MaterialLabel info={LotModel} />
        {LotModelSplit && <MaterialLabel info={LotModelSplit} />}
        {/* {LotModelSplit?.MaterialLotId && (
          <PrintMaterialLabels
            ids={[LotModelSplit?.MaterialLotId, LotModel?.MaterialLotId]}
            printRef={componentRef}
            fromTo="Action"
          />
        )}  */}
      </Box>
      <SplitMergeDataGrid newData={newData} fromTo="Split" />
    </React.Fragment>
  );
});
export default SplitMaterial;
