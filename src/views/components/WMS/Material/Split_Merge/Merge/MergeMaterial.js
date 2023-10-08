import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { ErrorAlert, SuccessAlert, PrintMaterial } from '@utils';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MuiButton, MuiTextField, MaterialLabel } from '@controls';
import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { SplitMergeService } from '@services';
import ReactToPrint from 'react-to-print';
import SplitMergeDataGrid from '../SplitMergeDataGrid';

const MergeMaterial = (props) => {
  let isRendered = useRef(true);
  const [newData, setNewData] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const componentRef = React.useRef();
  const lotInputRef = useRef(null);
  const intl = useIntl();
  const [LotModel, setLotModel] = useState(null);
  const [LotModel2, setLotModel2] = useState(null);
  const [state, setState] = useState({ isLoading: false });

  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };

  const scanBtnClick = async () => {
    let inputVal = '';

    if (lotInputRef.current.value) {
      inputVal = lotInputRef.current.value.trim().toUpperCase();
      if (LotModel != null && LotModel.MaterialLotCode == inputVal) {
        lotInputRef.current.value = '';
        return ErrorAlert(intl.formatMessage({ id: 'lot.Scan2LotDifferenceToMerge' }));
      }
      setState({ ...state, isLoading: true });

      var res = await SplitMergeService.getMaterialLabel(inputVal);

      if (res.HttpResponseCode === 200 && res.Data) {
        if (LotModel == null) setLotModel(res.Data);
        else setLotModel2(res.Data);
        lotInputRef.current.value = '';
        setState({ ...state, isLoading: false });
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        lotInputRef.current.value = '';
        setState({ ...state, isLoading: false });
      }
      lotInputRef.current.focus();
    }
  };

  const saveBtnClick = async () => {
    if (LotModel != null && LotModel2 != null) {
      if (window.confirm(intl.formatMessage({ id: 'lot.confirm_merge' }))) {
        try {
          setState({ ...state, isLoading: true });
          var res = await SplitMergeService.mergeLot({
            MaterialLotId1: String(LotModel.MaterialLotId),
            MaterialLotId2: String(LotModel2.MaterialLotId),
          });

          if (res.HttpResponseCode === 200 && res.Data) {
            SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
            setLotModel(res.Data);
            setLotModel2(null);
            setNewData({ ...res.Data });
            setDeleteData({ ...LotModel2 });
            setState({ ...state, isLoading: false });
          } else {
            ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
            setState({ ...state, isLoading: false });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      ErrorAlert(intl.formatMessage({ id: 'lot.Scan2LotToMerge' }));
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
          <Grid item sx={{ mb: 1, textAlign: 'right', display: 'flex', alignItems: 'center' }}>
            <MuiTextField
              autoFocus
              sx={{ width: 300, mr: 1 }}
              ref={lotInputRef}
              label="Lot"
              onChange={(e) => (lotInputRef.current.value = e.target.value)}
              onKeyDown={keyPress}
            />
            <MuiButton text="scan" color="primary" onClick={scanBtnClick} sx={{ whiteSpace: 'nowrap' }} />
          </Grid>
        </Grid>
        <Grid item>
          {/* <MuiButton text="print" disabled={LotModel == null ? true : false} onClick={() => toggle()} color="info" /> */}
          <Button
            variant="contained"
            color="primary"
            disabled={LotModel?.MaterialLotId == null ? true : false}
            sx={{ whiteSpace: 'nowrap', mr: 1 }}
            onClick={() => handlePrint([LotModel?.MaterialLotId, LotModel2?.MaterialLotId ?? ''])}
          >
            {intl.formatMessage({ id: 'general.print' })}
          </Button>
          <MuiButton
            color="warning"
            disabled={!LotModel?.MaterialLotId && !LotModel2?.MaterialLotId}
            onClick={() => {
              setLotModel(null);
              setLotModel2(null);
              lotInputRef.current.value = '';
              lotInputRef.current.focus();
            }}
            text="reset"
            sx={{ whiteSpace: 'nowrap', mr: 1 }}
          />
          <MuiButton
            text="save"
            color="success"
            onClick={saveBtnClick}
            sx={{ whiteSpace: 'nowrap', mr: 2 }}
            disabled={LotModel2 == null ? true : false}
          />
        </Grid>
      </Grid>
      <Box className="d-flex justify-content-between px-5 mt-2 mb-2">
        <MaterialLabel info={LotModel} />
        {LotModel2 && <MaterialLabel info={LotModel2} />}
      </Box>
      <SplitMergeDataGrid deleteData={deleteData} fromTo="Merge" />
    </React.Fragment>
  );
};

User_Operations.toString = function () {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  return { language };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};

export default connect(mapStateToProps, mapDispatchToProps)(MergeMaterial);
