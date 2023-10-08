import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { qcIQCService } from '@services';
import { addDays, ErrorAlert, SuccessAlert, minusMonths } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QCIQCDetailDialog from './QCIQCDetailDialog';
import QCMasterIQCDialog from './QCMasterIQCDialog';

const QCMasterIQC = (props) => {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      keyWord: '',
      IQCType: '',
      Explain: '',
      showDelete: true,
      StartDate: minusMonths(date, 1),
      EndDate: date,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [QCIQCMasterId, setQCIQCMasterId] = useState(null);
  const [IQCType, setIQCType] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.QCIQCMasterId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'QCIQCMasterId', hide: true },
    { field: 'row_version', hide: true },
    { field: 'IQCType', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 120,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <IconButton
                color="success"
                size="small"
                sx={[{ '&:hover': { border: '1px solid green' } }]}
                disabled={params.row.isActived ? false : true}
                onClick={() => handleCopy(params.row)}
              >
                <ContentCopyIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                disabled={params.row.IsConfirm ? true : false}
                onClick={() => handleDelete(params.row)}
              >
                {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="edit"
                color="warning"
                size="small"
                sx={[{ '&:hover': { border: '1px solid orange' } }]}
                disabled={params.row.IsConfirm ? true : false}
                onClick={() => handleUpdate(params.row)}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'Detail',
      headerName: intl.formatMessage({ id: 'qcIQC.Detail' }),
      width: 100,
      align: 'center',
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleDetail(params.row)}
            sx={{ paddingTop: '1px', paddingBottom: '1px' }}
          >
            {intl.formatMessage({ id: 'qcIQC.Detail' })}
          </Button>
        );
      },
    },
    {
      field: 'Confirm',
      headerName: intl.formatMessage({ id: 'qcIQC.Confirm' }),
      width: 120,
      align: 'center',
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color={params.row.IsConfirm ? 'success' : 'info'}
            size="small"
            onClick={() => handleConfirm(params.row)}
            sx={{ paddingTop: '1px', paddingBottom: '1px' }}
          >
            {intl.formatMessage({ id: params.row.IsConfirm ? 'qcIQC.Confirmed' : 'qcIQC.Confirm' })}
          </Button>
        );
      },
    },
    {
      field: 'QCIQCMasterName',
      headerName: intl.formatMessage({ id: 'qcIQC.QCIQCMasterName' }),
      width: 350,
    },
    {
      field: 'IQCTypeName',
      headerName: intl.formatMessage({ id: 'qcIQC.IQCType' }),
      valueFormatter: (params) => intl.formatMessage({ id: params?.value }),
      width: 150,
    },
    {
      field: 'Explain',
      headerName: intl.formatMessage({ id: 'qcIQC.Explain' }),
      width: 250,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.Explain} className="col-text-elip">
            <Typography sx={{ fontSize: 14, maxWidth: 10000 }}>{params.row.Explain}</Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      width: 120,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.modifiedName' }),
      width: 120,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...state.data];
      if (data.length > state.pageSize) {
        data.pop();
      }
      setState({
        ...state,
        data: [...data],
        totalRow: state.totalRow + 1,
      });
    }
  }, [newData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.QCIQCMasterId == updateData.QCIQCMasterId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleConfirm = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: !item.IsConfirm ? 'qcMaster.Confirm_apply' : 'qcMaster.Confirm_unapply',
        })
      )
    ) {
      try {
        let res = await qcIQCService.confirmIQCMaster(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: item.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await qcIQCService.deleteIQCMaster(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAdd = () => {
    setMode(CREATE_ACTION);
    setRowData();
    toggle();
  };

  const handleUpdate = async (row) => {
    setMode(UPDATE_ACTION);
    setRowData(row);
    toggle();
  };

  const handleCopy = async (row) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_save' }))) {
      try {
        const res = await qcIQCService.copy(row);
        if (res.HttpResponseCode === 200 && res.Data) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          setNewData(res.Data);
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDetail = async (row) => {
    setQCIQCMasterId(row.QCIQCMasterId);
    setIQCType(row.IQCType);
    toggle2();
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      QCIQCMasterName: state.searchData.keyWord,
      Explain: state.searchData.Explain,
      IQCType: state.searchData.IQCType,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await qcIQCService.getIQCMasterList(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={3}>
          <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} />
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="keyWord"
                label="qcIQC.QCIQCMasterName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'keyWord')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="Explain"
                label="qcIQC.Explain"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'Explain')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                translationLabel
                label={intl.formatMessage({ id: 'qcIQC.IQCType' })}
                fetchDataFunc={qcIQCService.getMaterialType}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailCode"
                onChange={(e, item) => handleSearch(item ? item.commonDetailCode ?? null : null, 'IQCType')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch
                defaultChecked={true}
                color="primary"
                onChange={(e) => handleSearch(e.target.checked, 'showDelete')}
              />
            }
            label={intl.formatMessage({
              id: state.searchData.showDelete ? 'general.data_actived' : 'general.data_deleted',
            })}
          />
        </Grid>
      </Grid>

      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.QCIQCMasterId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { left: ['id', 'Detail', 'Confirm'], right: ['action'] } }}
      />

      <QCMasterIQCDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
      />
      <QCIQCDetailDialog isOpen={isShowing2} onClose={toggle2} QCIQCMasterId={QCIQCMasterId} IQCType={IQCType} />
    </React.Fragment>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(QCMasterIQC);
