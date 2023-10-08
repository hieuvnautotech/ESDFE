import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import UndoIcon from '@mui/icons-material/Undo';
import { Badge, Button, FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GRID_DETAIL_PANEL_TOGGLE_COL_DEF } from '@mui/x-data-grid-pro';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { IQCReceivingService } from '@services';
import { ErrorAlert, PrintBundle, PrintMaterial, SuccessAlert, minusMonths } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IQCAddDialog from './IQCAddDialog';
import IQCCheckDialog from './IQCCheckDialog';
import IQCReceivingDialog from './IQCReceivingDialog';
import IQCCheckFormMaterialSUS from './IQCCheckFormMaterialSUS';

const DetailPanelContent = ({ row: rowProp, intl, searchData, setDataPrint }) => {
  let isDetailRendered = useRef(true);
  const [rowData, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
    MaterialReceiveId: rowProp.MaterialReceiveId,
  });

  const handleOpenCheckIQCForm = async (row) => {
    // toggle();
    setRowData(row);

    if (row.MaterialLotCode.includes('SUS')) toggle2();
    else toggle();
  };

  const handleCloseCheckForm = async () => {
    fetchDetailData();
    toggle();
  };

  const handleCloseCheckFormSUS = async () => {
    fetchDetailData();
    toggle2();
  };

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
      MaterialReceiveId: detailPanelState.MaterialReceiveId,
    };

    const res = await IQCReceivingService.getMaterialLot(params);

    setDetailPanelState({
      ...detailPanelState,
      data: res.Data ?? [],
      totalRow: res.TotalRow,
      isLoading: false,
    });
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      align: 'center',
      width: 40,
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.MaterialLotId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    { field: 'MaterialLotId', headerName: 'Id', hide: true },
    { field: 'StaffId', headerName: 'StaffId', hide: true },
    { field: 'StaffName', headerName: 'StaffName', hide: true },
    { field: 'CheckResult', headerName: 'CheckResult', hide: true },
    { field: 'LotStatus', headerName: 'LotStatus', hide: true },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'IQCReceiving.MaterialLotCode' }),
      width: 300,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Width' }),
      width: 100,
      type: 'number',
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Length' }),
      width: 100,
      type: 'number',
    },
    {
      field: 'MaterialLength',
      headerName: intl.formatMessage({ id: 'IQCReceiving.Quantity' }),
      width: 100,
      type: 'number',
      renderCell: (params) => {
        return (
          <Typography sx={{ fontSize: 14 }}>
            {params.row.MaterialLength > 0 ? (params.row.Length / params.row.MaterialLength).toFixed(2) : 0}
          </Typography>
        );
      },
    },
    {
      field: 'StockQty',
      headerName: intl.formatMessage({ id: 'IQCReceiving.Area' }),
      width: 100,
      type: 'number',
    },
    {
      hide: rowProp.IQCCheck == 0 ? true : false,
      field: 'CheckDate',
      headerName: 'CheckDate',
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      hide: rowProp.IQCCheck == 0 ? true : false,
      field: 'check-iqc',
      headerName: intl.formatMessage({ id: 'IQCReceiving.CheckIQC' }),
      width: 100,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="check form"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleOpenCheckIQCForm(params.row, true)}
              >
                <CheckBoxIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'LotStatusName',
      headerName: intl.formatMessage({ id: 'IQCReceiving.LotStatus' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? intl.formatMessage({ id: params?.value }) : null),
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
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="check form"
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
  ];

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, rowProp, searchData]);

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await IQCReceivingService.deleteLot(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await resetParent();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '60%', p: 0, ml: 0 }}>
        <MuiDataGrid
          showLoading={detailPanelState.isLoading}
          isPagingServer={true}
          headerHeight={35}
          columns={detailPanelColumns}
          rows={detailPanelState.data}
          page={detailPanelState.page - 1}
          pageSize={detailPanelState.pageSize}
          rowCount={detailPanelState.totalRow}
          onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
          getRowId={(rows) => rows.MaterialLotId}
          initialState={{ pinnedColumns: { left: [GRID_CHECKBOX_SELECTION_COL_DEF.field, 'id', 'MaterialLotCode'] } }}
          checkboxSelection
          disableRowSelectionOnClick
          onSelectionModelChange={(ids) => {
            setDataPrint(ids);
          }}
        />

        <IQCCheckFormMaterialSUS RowCheck={rowData} isOpen={isShowing2} onClose={handleCloseCheckFormSUS} />
        <IQCCheckDialog RowCheck={rowData} isOpen={isShowing} onClose={handleCloseCheckForm} />
      </Paper>
    </Stack>
  );
};

const DetailPanelContentBundle = ({ row: rowProp, intl, searchData, setDataPrint }) => {
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [openDetailIds, setOpenDetailIds] = useState([]);
  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    totalLot: 0,
  });

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.MaterialReceiveId) +
        1 +
        (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    { field: 'MaterialReceiveId', hide: true },
    { field: 'MaterialType', hide: true },
    { field: 'QCIQCMasterId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 160,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={5} container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={6} style={{ textAlign: 'center' }}>
                <Tooltip title="Print Material" placement="left-start">
                  <IconButton
                    aria-label="print"
                    color="secondary"
                    size="small"
                    onClick={() => handleAllPrintLot(params.row.MaterialReceiveId)}
                  >
                    <PrintIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'center' }}>
                <Tooltip title="Print Bundle" placement="left-start">
                  <IconButton
                    aria-label="print"
                    color="secondary"
                    size="small"
                    onClick={() => PrintBundle([params.row])}
                  >
                    <i className="fa fa-print" aria-hidden="true" fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item xs={7} container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <IconButton
                  aria-label="delete"
                  color="success"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid green' } }]}
                  onClick={() => handleAddDetail(params.row)}
                  disabled={params.row.IsConfirm ? true : false}
                >
                  <AddCircleOutlineOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <IconButton
                  aria-label="delete"
                  color="error"
                  size="small"
                  sx={[{ '&:hover': { border: '1px solid red' } }]}
                  onClick={() => handleDelete(params.row)}
                  disabled={params.row.LotCheckStatus ? true : false}
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
                  onClick={() => handleUpdate(params.row)}
                  disabled={params.row.IsConfirm ? true : false}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'BundleCode',
      headerName: intl.formatMessage({ id: 'IQCReceiving.BundleCode' }),
      width: 300,
    },
    {
      field: 'MaterialTypeName',
      headerName: intl.formatMessage({ id: 'material.MaterialType' }),
      valueFormatter: (params) => intl.formatMessage({ id: params?.value }),
      width: 150,
    },
    {
      field: 'BundleWidth',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Width' }),
      width: 150,
      type: 'number',
    },
    {
      field: 'BundleLength',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Length' }),
      width: 150,
      type: 'number',
    },
    {
      field: 'QuantityInBundle',
      headerName: intl.formatMessage({ id: 'IQCReceiving.QuantityInBundle' }),
      type: 'number',
      width: 150,
    },
    {
      field: 'TotalArea',
      headerName: intl.formatMessage({ id: 'IQCReceiving.TotalArea' }),
      type: 'number',
      width: 150,
    },
    {
      field: 'QCIQCMasterName',
      headerName: intl.formatMessage({ id: 'material.QCMasterId' }),
      width: 150,
    },
    {
      field: 'IQCCheckName',
      headerName: intl.formatMessage({ id: 'IQCReceiving.CheckIQC' }),
      width: 150,
    },
    {
      field: 'ManufactureDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ManufactureDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'ExportDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ExportDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'ExpirationDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ExpirationDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'CuttingDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.CuttingDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'general.description' }),
      width: 200,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.Description ?? ''} className="col-text-elip">
            <Typography sx={{ fontSize: 14 }}>{params.row.Description}</Typography>
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

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    setOpenDetailIds([]);
    const params = {
      ReceivedDate: rowProp.ReceivedDate,
      MaterialId: rowProp.MaterialId,
      LotNo: rowProp.LotNo,
      MaterialCode: rowProp.MaterialCode,
      StartDate: rowProp.StartDate,
      EndDate: rowProp.EndDate,
      isActived: rowProp.isActived,
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
    };

    const res = await IQCReceivingService.getMaterialReceivingList(params);

    if (res && res.Data) {
      let total = 0;

      res.Data.forEach((item) => {
        total += item.QuantityInBundle;
      });

      setDetailPanelState({
        ...detailPanelState,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
        totalLot: total,
      });
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
        let res = await IQCReceivingService.deleteRecevingMaterial(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchDetailData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdate = async (row) => {
    const diffMonths = Math.round(
      (new Date(row?.ExpirationDate) - new Date(row?.ReceivedDate)) / (1000 * 60 * 60 * 24 * 30.44)
    );

    setRowData({ ...row, Month: diffMonths });
    toggle();
  };

  const handleAddDetail = async (row) => {
    setRowData(row);
    toggle2();
  };

  const handleAllPrintLot = async (materialId) => {
    const res = await IQCReceivingService.getAllDetailId(materialId);
    const ids = await res?.Data.map((robot) => robot.MaterialLotId);
    const list = await IQCReceivingService.GetListPrintQR(ids);
    PrintMaterial(list.Data);
  };

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, rowProp, searchData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...detailPanelState.data];
      const index = _.findIndex(newArr, function (o) {
        return o.MaterialReceiveId == updateData.MaterialReceiveId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setDetailPanelState({ ...detailPanelState, data: [...newArr] });
    }
  }, [updateData]);

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} intl={intl} searchData={searchData} setDataPrint={setDataPrint} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 240, []);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <MuiDataGrid
          showLoading={detailPanelState.isLoading}
          isPagingServer={true}
          headerHeight={35}
          columns={detailPanelColumns}
          rows={detailPanelState.data}
          page={detailPanelState.page - 1}
          pageSize={detailPanelState.pageSize}
          rowCount={detailPanelState.totalRow}
          onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
          getRowId={(rows) => rows.MaterialReceiveId}
          initialState={{
            pinnedColumns: {
              left: [GRID_DETAIL_PANEL_TOGGLE_COL_DEF.field, 'id', 'BundleCode'],
              right: ['action'],
            },
          }}
          rowThreshold={0}
          getDetailPanelHeight={getDetailPanelHeight}
          getDetailPanelContent={getDetailPanelContent}
          detailPanelExpandedRowIds={openDetailIds}
          onDetailPanelExpandedRowIdsChange={(ids) => setOpenDetailIds(ids)}
          footerCustom={[
            `${intl.formatMessage({ id: 'IQCReceiving.TotalQuantityInBundle' })}: ${detailPanelState.totalLot}`,
          ]}
        />

        <IQCReceivingDialog
          fetchData={fetchDetailData}
          setUpdateData={setUpdateData}
          initModal={rowData}
          isOpen={isShowing}
          onClose={toggle}
          mode={UPDATE_ACTION}
        />

        <IQCAddDialog isOpen={isShowing2} onClose={toggle2} IQCModel={rowData} setUpdateData={setUpdateData} />
      </Paper>
    </Stack>
  );
};

const IQCReceiving = (props) => {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const [openDetailIds, setOpenDetailIds] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    totalLot: 0,
    searchData: {
      keyWord: '',
      LotNo: '',
      SupplierId: null,
      showDelete: true,
      StartDate: minusMonths(date, 1),
      EndDate: date,
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialReceiveId) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
      flex: 0.3,
    },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'material.MaterialCode' }),
      flex: 0.5,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      flex: 0.5,
    },
    {
      field: 'POOrderCode',
      headerName: intl.formatMessage({ id: 'PO.POOrderCode' }),
      flex: 0.5,
    },
    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'IQCReceiving.LotNo' }),
      flex: 0.4,
    },
    {
      field: 'MaterialUnit',
      headerName: intl.formatMessage({ id: 'material.Unit' }),
      flex: 0.2,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'IQCReceiving.Width' }),
      type: 'number',
      flex: 0.3,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'IQCReceiving.Length' }),
      type: 'number',
      flex: 0.3,
    },
    {
      field: 'TotalLength',
      headerName: intl.formatMessage({ id: 'IQCReceiving.TotalLength' }),
      type: 'number',
      flex: 0.3,
    },
    {
      field: 'QuantityInBundle',
      headerName: intl.formatMessage({ id: 'IQCReceiving.TotalItem' }),
      type: 'number',
      flex: 0.3,
    },
    {
      field: 'TotalArea',
      headerName: intl.formatMessage({ id: 'IQCReceiving.TotalArea' }),
      type: 'number',
      flex: 0.3,
    },
    {
      field: 'LotCheckStatus',
      headerName: intl.formatMessage({ id: 'qcIQC.IQCResult' }),
      valueFormatter: (params) =>
        intl.formatMessage({ id: params?.value ? 'IQCReceiving.Checked' : 'IQCReceiving.NotYet' }),
      flex: 0.3,
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
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <Tooltip title="Print Material" placement="top">
                <IconButton color="secondary" size="small" onClick={() => handleAllLot(params.row)}>
                  <PrintIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <Tooltip title="Print Bundle" placement="top">
                <IconButton color="secondary" size="small" onClick={() => handleAllBundle(params.row)}>
                  <i className="fa fa-print" aria-hidden="true" fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.searchData.showDelete]);

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

  const handlePrintLot = async (ids) => {
    const list = await IQCReceivingService.GetListPrintQR(ids);
    PrintMaterial(list.Data);
  };

  const handleAllBundle = async (row) => {
    const params = {
      ReceivedDate: row.ReceivedDate,
      MaterialId: row.MaterialId,
      LotNo: row.LotNo,
      StartDate: row.StartDate,
      EndDate: row.EndDate,
      page: 0,
      pageSize: 0,
    };

    const res = await IQCReceivingService.getMaterialReceivingList(params);
    PrintBundle(res.Data);
  };

  const handleAllLot = async (row) => {
    const params = {
      ReceivedDate: row.ReceivedDate,
      MaterialId: row.MaterialId,
      LotNo: row.LotNo,
      isActived: state.searchData.showDelete,
      page: 0,
      pageSize: 0,
    };

    const res = await IQCReceivingService.getMaterialLotPrint(params);
    PrintMaterial(res.Data);
  };

  async function fetchData() {
    setOpenDetailIds([]);
    setState({ ...state, isLoading: true });
    const params = {
      MaterialCode: state.searchData.keyWord,
      LotNo: state.searchData.LotNo,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
    };

    const res = await IQCReceivingService.getLotNoList(params);

    if (res && res.Data && isRendered) {
      let total = 0;

      res.Data.forEach((item) => {
        total += item.QuantityBundle;
      });

      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
        totalLot: total,
      });
    }
  }

  const getDetailPanelContent = React.useCallback(
    ({ row }) => (
      <DetailPanelContentBundle
        row={row}
        intl={intl}
        searchData={state.searchData}
        resetParent={fetchData}
        setDataPrint={setDataPrint}
      />
    ),
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 360, []);

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={3}>
          <MuiButton text="create" color="success" onClick={toggle} sx={{ mt: 1 }} />
          <Badge badgeContent={dataPrint.length} color="success">
            <Button
              variant="contained"
              color="secondary"
              disabled={!dataPrint.length > 0}
              sx={{ whiteSpace: 'nowrap', mt: '5px', ml: 2 }}
              onClick={() => handlePrintLot(dataPrint)}
            >
              {intl.formatMessage({ id: 'general.print' })}
            </Button>
          </Badge>
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                label="IQCReceiving.LotNo"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'LotNo')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="keyWord"
                label="IQCReceiving.MaterialCodeName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'keyWord')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.StartSearchingDate' })}
                value={state.searchData.StartDate}
                onChange={(e) => handleSearch(e, 'StartDate')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.EndSearchingDate' })}
                value={state.searchData.EndDate}
                onChange={(e) => handleSearch(e, 'EndDate')}
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
        getRowId={(rows) => rows.MaterialReceiveId}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        detailPanelExpandedRowIds={openDetailIds}
        onDetailPanelExpandedRowIdsChange={(ids) => setOpenDetailIds(ids)}
        //footerCustom={[`${intl.formatMessage({ id: 'IQCReceiving.TotalQuantityInBundle' })}: ${state.totalLot}`]}
      />

      <IQCReceivingDialog fetchData={fetchData} isOpen={isShowing} onClose={toggle} mode={CREATE_ACTION} />
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

export default connect(mapStateToProps, mapDispatchToProps)(IQCReceiving);
