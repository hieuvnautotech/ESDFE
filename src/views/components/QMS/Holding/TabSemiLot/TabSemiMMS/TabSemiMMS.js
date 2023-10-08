import { useModal, useModal2, useModal3 } from '@basesShared';
import { BASE_URL } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiIconButton, MuiSearchField } from '@controls';
import { Badge, Button, FormControlLabel, Switch } from '@mui/material';
import Grid from '@mui/material/Grid';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid-pro';
import { HoldSemiLotService, WIPStockService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import HoldSemiMMSDialog from './HoldSemiMMSDialog';
import WOSemiCheckPQCSLDialog from './WOSemiCheckPQCSLDialog';
import { ErrorAlert, SuccessAlert, PrintSemiMMS } from '@utils';

const TabSemiMMS = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const { isShowing3, toggle3 } = useModal3();
  const [MaterialLot, setMaterialLot] = useState({});
  const [DataSelect, setDataSelect] = useState([]);
  const [rowData, setRowData] = useState({});
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 18,
    searchData: {
      SemiLotCode: '',
      WorkOrder: '',
      ReceivedDate: null,
      showDelete: true,
    },
  });

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [State.page, State.pageSize, State.searchData.showDelete]);

  async function fetchData() {
    setState({ ...State, isLoading: true });

    const params = {
      isActived: true,
      SemiLotCode: State.searchData.SemiLotCode,
      ReceivedDate: State.searchData.ReceivedDate,
      WorkOrder: State.searchData.WorkOrder,
      page: State.page,
      pageSize: State.pageSize,
      isActived: State.searchData.showDelete,
    };

    const res = await HoldSemiLotService.getAllSemiMMS(params);
    if (res && isRendered)
      setState({
        ...State,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...State.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...State, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...State, searchData: { ...newSearchData } });
    }
  };

  const handleViewCheckQC = async (row) => {
    setMaterialLot(row);
    toggle3();
  };

  const handleReCheckQC = async (row) => {
    setMaterialLot(row);
    toggle2();
  };

  const handleCloseRecheck = async (row) => {
    await fetchData();
    toggle2();
  };

  const handleScrap = async () => {
    if (window.confirm(intl.formatMessage({ id: 'Holding.confirm_scrap' }))) {
      try {
        const res = await HoldSemiLotService.scrapMMS({ ListId: DataSelect });
        if (res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          fetchData();
          setDialogState({ ...dialogState, isSubmit: false });
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
          setDialogState({ ...dialogState, isSubmit: false });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCellClick = (param, event) => {
    event.defaultMuiPrevented = param.field === 'ReCheck' || param.field === 'IQCResult';
  };

  const handlePrint = async () => {
    const res = await WIPStockService.GetListPrintQR(DataSelect);
    PrintSemiMMS(res.Data);
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotMMSId) + 1 + (State.page - 1) * State.pageSize,
    },
    {
      field: 'ReCheck',
      hide: State.searchData.showDelete,
      headerName: intl.formatMessage({ id: 'Holding.ReCheck' }),
      width: 100,
      align: 'center',
      renderCell: (params) => {
        return (
          !params.row.IsHandCheck && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={() => handleReCheckQC(params.row)}
              sx={{ paddingTop: '1px', paddingBottom: '1px' }}
            >
              {intl.formatMessage({ id: 'Holding.ReCheck' })}
            </Button>
          )
        );
      },
    },
    {
      field: 'IQCResult',
      headerName: intl.formatMessage({ id: 'Holding.PQCResult' }),
      width: 100,
      align: 'center',
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleViewCheckQC(params.row)}
            sx={{ paddingTop: '1px', paddingBottom: '1px' }}
          >
            {intl.formatMessage({ id: 'Holding.ShowIQC' })}
          </Button>
        );
      },
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      flex: 0.3,
    },
    { field: 'SemiLotCode', headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }), flex: 0.5 },
    {
      field: 'FileName',
      align: 'center',
      hide: State.searchData.showDelete,
      headerName: intl.formatMessage({ id: 'Holding.File' }),
      width: 150,
      renderCell: (params) => {
        return (
          params.row.FileName != null &&
          (params.row.IsPicture ? (
            <PhotoProvider>
              <PhotoView src={`${BASE_URL}/Image/HoldSemiMMS/${params.row.FileName}`}>
                <img src={`${BASE_URL}/Image/HoldSemiMMS/${params.row.FileName}`} style={{ height: 50 }} />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <MuiIconButton
                  color="success"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `${BASE_URL}/Image/HoldSemiMMS/${params.row.FileName}`;
                  }}
                  text="download"
                />
              </Grid>
            </Grid>
          ))
        );
      },
    },
    {
      field: 'Reason',
      hide: State.searchData.showDelete,
      headerName: intl.formatMessage({ id: 'Holding.Reason' }),
      width: 150,
    },
    {
      field: 'LotStatusName',
      headerName: intl.formatMessage({ id: 'materialLot.LotStatus' }),
      width: 200,
      valueFormatter: (params) => (params?.value ? intl.formatMessage({ id: params?.value }) : null),
    },
    {
      field: 'AreaCode',
      headerName: intl.formatMessage({ id: 'location.AreaCode' }),
      width: 150,
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      flex: 0.25,
      valueFormatter: (params) => (params?.value ? params?.value.toLocaleString() : null),
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      flex: 0.25,
      valueFormatter: (params) => (params?.value ? params?.value.toLocaleString() : null),
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.2,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid item xs={3}>
          {State.searchData.showDelete ? (
            <Badge badgeContent={DataSelect.length} color="warning">
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                color="error"
                onClick={toggle}
                disabled={DataSelect.length > 0 ? false : true}
              >
                {intl.formatMessage({ id: 'Holding.Hold' })}
              </Button>
            </Badge>
          ) : (
            <>
              <Badge badgeContent={DataSelect.length} color="warning">
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  color="success"
                  onClick={toggle}
                  disabled={DataSelect.length > 0 ? false : true}
                >
                  {intl.formatMessage({ id: 'Holding.Release' })}
                </Button>
              </Badge>
              <Badge badgeContent={DataSelect.length} color="warning">
                <Button
                  variant="contained"
                  sx={{ mt: 1, ml: 2 }}
                  color="error"
                  onClick={handleScrap}
                  disabled={DataSelect.length > 0 ? false : true}
                >
                  {intl.formatMessage({ id: 'Holding.Scrap' })}
                </Button>
              </Badge>
            </>
          )}
          <Badge badgeContent={DataSelect.length} color="warning">
            <MuiButton
              text="print"
              color="secondary"
              sx={{ margin: 0, mt: 1, ml: 2 }}
              onClick={handlePrint}
              disabled={DataSelect.length > 0 ? false : true}
            />
          </Badge>
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '20%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.WOCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WorkOrder')}
              />
            </Grid>
            <Grid item style={{ width: '20%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 0 }} />
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
                  id: State.searchData.showDelete ? 'Holding.UnHoldList' : 'Holding.HoldList',
                })}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MuiDataGrid
        showLoading={State.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        gridHeight={736}
        rows={State.data}
        page={State.page - 1}
        pageSize={State.pageSize}
        rowCount={State.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setState({ ...State, page: newPage + 1 })}
        getRowId={(rows) => rows.WOSemiLotMMSId}
        rowThreshold={0}
        initialState={{
          pinnedColumns: { left: ['id', GRID_CHECKBOX_SELECTION_COL_DEF.field, 'Holding', 'ReCheck', 'IQCResult'] },
        }}
        onCellClick={handleCellClick}
        onSelectionModelChange={(ids) => setDataSelect(ids)}
        checkboxSelection
      />
      <HoldSemiMMSDialog
        isOpen={isShowing}
        onClose={toggle}
        initModal={rowData}
        resetList={fetchData}
        DataSelect={DataSelect}
        unHold={!State.searchData.showDelete}
      />
      <WOSemiCheckPQCSLDialog isOpen={isShowing2} onClose={handleCloseRecheck} RowCheck={MaterialLot} />
      <WOSemiCheckPQCSLDialog isOpen={isShowing3} onClose={toggle3} RowCheck={MaterialLot} view={true} reCheck={true} />
    </React.Fragment>
  );
};

export default TabSemiMMS;
