import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField, MuiTextField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton } from '@mui/material';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { SlitPutAwayService } from '@services';
import { ErrorAlert, SuccessAlert, isNumber } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

const SlitPutAway = (props) => {
  let isRendered = useRef(true);
  const intl = useIntl();
  const initETDLoad = new Date();
  const [newData, setNewData] = useState({});
  const lotInputRef = useRef(null);
  const [locationId, setLocationId] = useState(null);
  const [putAwayState, setPutAwayState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      searchStartDay: initETDLoad,
      searchEndDay: initETDLoad,
    },
  });

  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };

  const handleLotInputChange = (e) => {
    lotInputRef.current.value = e.target.value;
  };

  const handleDelete = async (lot) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await SlitPutAwayService.handleDeleteRaw(lot);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          await fetchData();
          // await eslService.updateESLDataByBinId(lot.BinId);
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchData = async () => {
    setPutAwayState({ ...putAwayState, isLoading: true });

    const params = {
      page: putAwayState.page,
      pageSize: putAwayState.pageSize,
      searchStartDay: putAwayState.searchData.searchStartDay,
      searchEndDay: putAwayState.searchData.searchEndDay,
    };

    const res = await SlitPutAwayService.get(params);
    if (res && isRendered)
      setPutAwayState({
        ...putAwayState,
        data: !res.Data ? [] : [...res.Data],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  };

  useEffect(() => {
    fetchData();
    lotInputRef.current.focus();
    return () => {
      isRendered = false;
    };
  }, [putAwayState.page, putAwayState.pageSize]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...putAwayState.data];
      if (data.length > putAwayState.pageSize) {
        data.pop();
      }
      setPutAwayState({
        ...putAwayState,
        data: [...data],
        totalRow: putAwayState.totalRow + 1,
      });
    }
  }, [newData]);

  const scanBtnClick = async () => {
    const lot = lotInputRef.current.value;
    await handlePutAway(lot);
    lotInputRef.current.value = '';
    lotInputRef.current.focus();
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 80,
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.MaterialLotId) + 1 + (putAwayState.page - 1) * putAwayState.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 80,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container direction="row" alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      flex: 0.7,
    },
    {
      field: 'LocationShelfCode',
      headerName: intl.formatMessage({ id: 'location.LocationCode' }),
      flex: 0.5,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'materialLot.Length' }),
      flex: 0.5,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'materialLot.Width' }),
      flex: 0.5,
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'materialLot.ReceivedDate' }),
      flex: 0.5,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
  ];

  const handlePutAway = async (inputValue) => {
    if (locationId != null) {
      const res = await SlitPutAwayService.scanPutAway({
        MaterialLotCode: inputValue.trim(),
        LocationShelfId: locationId,
      });

      if (res && isRendered) {
        if (res.HttpResponseCode === 200 && res.Data) {
          setNewData({ ...res.Data });
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } else {
        ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
      }
    } else {
      ErrorAlert(intl.formatMessage({ id: 'materialPutAway.SelectLocation' }));
    }
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...putAwayState.searchData };
    newSearchData[inputName] = e;
    setPutAwayState({ ...putAwayState, searchData: { ...newSearchData } });
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Grid item container spacing={2} xs={6}>
          <Grid item sx={{ width: '250px' }}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'location.LocationCode' })}
              fetchDataFunc={SlitPutAwayService.getLocation}
              displayLabel="LocationCode"
              displayValue="LocationId"
              onChange={(e, item) => setLocationId(item?.LocationId ?? null)}
              variant="standard"
            />
          </Grid>
          <Grid item sx={{ width: '350px', mt: 0.5 }}>
            <MuiTextField ref={lotInputRef} label="Lot" onChange={handleLotInputChange} onKeyDown={keyPress} />
          </Grid>
          <Grid item sx={{ mt: 0 }}>
            <MuiButton text="scan" color="success" onClick={scanBtnClick} />
          </Grid>
        </Grid>
        <Grid item container spacing={2} xs={6} direction="row" justifyContent="flex-end" alignItems="center">
          <Grid item>
            <MuiDateField
              disabled={putAwayState.isLoading}
              label="From Incoming Date"
              value={putAwayState.searchData.searchStartDay}
              onChange={(e) => {
                handleSearch(e ? moment(e).format('YYYY-MM-DD') : null, 'searchStartDay');
              }}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <MuiDateField
              disabled={putAwayState.isLoading}
              label="To Incoming Date"
              value={putAwayState.searchData.searchEndDay}
              onChange={(e) => {
                handleSearch(e ? moment(e).format('YYYY-MM-DD') : null, 'searchEndDay');
              }}
              variant="standard"
            />
          </Grid>
          <Grid item sx={{ ml: 0.5 }}>
            <MuiButton text="search" color="info" onClick={fetchData} />
          </Grid>
        </Grid>
      </Grid>

      <MuiDataGrid
        showLoading={putAwayState.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={putAwayState.data}
        page={putAwayState.page - 1}
        pageSize={putAwayState.pageSize}
        rowCount={putAwayState.totalRow}
        rowsPerPageOptions={[5, 10, 15, 20]}
        onPageChange={(newPage) => {
          setPutAwayState({ ...putAwayState, page: newPage + 1 });
        }}
        getRowId={(rows) => rows.MaterialLotId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(SlitPutAway);
