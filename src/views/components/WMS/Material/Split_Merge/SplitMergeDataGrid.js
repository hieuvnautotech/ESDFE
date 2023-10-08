import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { useModal, useModal2, useModal3 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiSearchField, MuiDateField, CheckboxPrint } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Badge, Button, FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { addDays, ErrorAlert, SuccessAlert, PrintMaterial } from '@utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SplitMergeService } from '@services';
import ReactToPrint from 'react-to-print';

const DetailPanelContent = ({ row: rowProp, getDataPrint: getDataPrint, fromTo, updateQtyParent: updateQtyParent }) => {
  const intl = useIntl();
  let isDetailRendered = useRef(true);

  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
    MaterialLotId: rowProp.MaterialLotId,
  });

  const handleDelete = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: item.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await SplitMergeService.deleteDetailSplit(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchDetailData();
          await updateQtyParent(item);
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const fetchDetailData = async () => {
    if (isDetailRendered) {
      setDetailPanelState({ ...detailPanelState, isLoading: true });
      const params = {
        page: detailPanelState.page,
        pageSize: detailPanelState.pageSize,
        MaterialLotId: detailPanelState.MaterialLotId,
        Type: fromTo == 'Split' ? 'S' : 'M',
      };

      const res = await SplitMergeService.getSplitDetail(params);

      setDetailPanelState({
        ...detailPanelState,
        data: !res.Data ? [] : [...res.Data],
        totalRow: res.TotalRow,
        isLoading: false,
      });
    }
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 80,
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.MaterialLotChildId) +
        1 +
        (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 80,
      disableClickEventBubbling: true,
      sortable: false,
      hide: fromTo === 'Split' ? false : true,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
                disabled={params.row.IsConfirm ? true : false}
              >
                {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'MaterialLotChildId',
      headerName: 'Id',
      hide: true,
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'IQCReceiving.MaterialLotCode' }),
      width: 250,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Length' }),
      width: 150,
    },
  ];

  useEffect(() => {
    fetchDetailData();

    return () => {
      isDetailRendered = false;
    };
  }, [detailPanelState.page, detailPanelState.pageSize]);

  return (
    <React.Fragment>
      <Stack
        sx={{ py: 2, height: '100%', boxSizing: 'border-box', ml: 25 }}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0}
      >
        <Paper sx={{ flex: 1, width: '100%', p: 1 }}>
          <Stack direction="column" spacing={1}>
            <MuiDataGrid
              disabled={true}
              showLoading={detailPanelState.isLoading}
              isPagingServer={true}
              headerHeight={45}
              columns={detailPanelColumns}
              rows={detailPanelState.data}
              page={detailPanelState.page - 1}
              pageSize={detailPanelState.pageSize}
              rowCount={detailPanelState.totalRow}
              onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
              onPageSizeChange={(newPageSize) =>
                setDetailPanelState({ ...detailPanelState, pageSize: newPageSize, page: 1 })
              }
              // onSelectionModelChange={(newSelectedRowId) => {
              //   handleRowSelection(newSelectedRowId);
              // }}
              getRowId={(rows) => rows.MaterialLotChildId}
              initialState={{ pinnedColumns: { right: ['action'] } }}
              checkboxSelection
              components={{
                BaseCheckbox: CheckboxPrint,
              }}
              disableSelectionOnClick
              rowsPerPageOptions={[5, 10, 20]}
              onSelectionModelChange={(ids) => {
                getDataPrint(ids);
              }}
            />
          </Stack>
        </Paper>
      </Stack>
    </React.Fragment>
  );
};

DetailPanelContent.propTypes = {
  row: PropTypes.object.isRequired,
};

const SplitMergeDataGrid = (props) => {
  const { newData, deleteData, fromTo } = props;
  const intl = useIntl();
  const date = new Date();
  const componentRef = React.useRef();
  const [rowSelected, setRowSelected] = useState([]);
  const [openDetailIds, setOpenDetailIds] = useState([]);
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 17,
    searchData: {
      MaterialCode: '',
      MaterialName: '',
      ReceivedDate: date,
    },
  });

  const [rowData, setRowData] = useState({});

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'MaterialLotId', hide: true },
    { field: 'row_version', hide: true },
    // {
    //   field: 'action',
    //   headerName: '',
    //   width: 80,
    //   disableClickEventBubbling: true,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Grid container spacing={1} alignItems="center" justifyContent="center">
    //         <Grid item xs={6} style={{ textAlign: 'center' }}>
    //           <IconButton
    //             aria-label="delete"
    //             color="error"
    //             size="small"
    //             sx={[{ '&:hover': { border: '1px solid red' } }]}
    //             onClick={() => handleDelete(params.row)}
    //             disabled={params.row.IsConfirm ? true : false}
    //           >
    //             {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
    //           </IconButton>
    //         </Grid>
    //       </Grid>
    //     );
    //   },
    // },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'IQCReceiving.MaterialLotCode' }),
      width: 250,
    },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'material.MaterialCode' }),
      width: 200,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      width: 450,
    },

    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'IQCReceiving.LotNo' }),
      width: 150,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Length' }),
      width: 150,
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
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
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.MaterialLotId == newData.MaterialLotId;
      });

      if (index !== -1) {
        //update
        newArr[index] = newData;
        setState({
          ...state,
          data: newArr,
          totalRow: state.totalRow + 1,
        });
      } else {
        const data = [newData, ...state.data];
        if (data.length > state.pageSize) {
          data.pop();
        }
        if (isRendered)
          setState({
            ...state,
            data: [...data],
            totalRow: state.totalRow + 1,
          });
      }
    }
  }, [newData]);

  useEffect(() => {
    setOpenDetailIds([]);
    if (!_.isEmpty(deleteData)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.MaterialLotId == deleteData.MaterialLotId;
      });
      if (index !== -1) {
        newArr[index] = deleteData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [deleteData]);

  //handle

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  const handlePrint = async () => {
    const res = await SplitMergeService.GetListPrintQR(rowSelected);
    PrintMaterial(res.Data);
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      MaterialCode: state.searchData.MaterialCode,
      MaterialName: state.searchData.MaterialName,
      ReceivedDate: state.searchData.ReceivedDate,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
      Type: fromTo == 'Split' ? 'S' : 'M',
    };

    const res = await SplitMergeService.getSplitList(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const getDataPrint = (data) => {
    setRowSelected(data);
  };

  const updateQtyParent = (data) => {
    setState((prevState) => {
      const updatedData = prevState.data.map((record) => {
        if (record.MaterialLotId == data.MaterialLotParentId) {
          return {
            ...record,
            Length: record.Length + data?.Length, // Adjust the quantity update logic
          };
        }
        return record;
      });

      return {
        ...prevState,
        data: updatedData,
      };
    });
  };

  const getDetailPanelContent = React.useCallback(
    ({ row }) => (
      <DetailPanelContent row={row} getDataPrint={getDataPrint} fromTo={fromTo} updateQtyParent={updateQtyParent} />
    ),
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 300, []);
  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={3}>
          {/* <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} /> */}
          <ReactToPrint
            trigger={() => {
              return (
                <Badge badgeContent={rowSelected.length} color="success">
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={!rowSelected.length > 0}
                    sx={{ whiteSpace: 'nowrap', marginBottom: '-25px' }}
                    onClick={handlePrint}
                  >
                    {intl.formatMessage({ id: 'general.print' })}
                  </Button>
                </Badge>
              );
            }}
            content={() => componentRef.current}
          />
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="MaterialCode"
                label="IQCReceiving.MaterialLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialCode')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="MaterialName"
                label="material.MaterialCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialName')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label="Received Date"
                value={state.searchData.ReceivedDate}
                onChange={(e) => {
                  handleSearch(e ? moment(e).format('YYYY-MM-DD') : null, 'ReceivedDate');
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
            </Grid>
          </Grid>
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
        getRowId={(rows) => rows.MaterialLotId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
          if (_.isEqual(params.row, deleteData)) return `Mui-deleted-data`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        detailPanelExpandedRowIds={openDetailIds}
        onDetailPanelExpandedRowIdsChange={(ids) => setOpenDetailIds(ids)}
      />
      {/* <PrintMaterialLabels ids={rowSelected} printRef={componentRef} fromTo="DataGrid" /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(SplitMergeDataGrid);
