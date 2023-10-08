import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField, MuiAutocomplete, MuiIconButton } from '@controls';
import { FormControlLabel, Paper, Stack, Switch, Typography, Badge, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { HoldSemiLotService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import HoldSemiFQCDialog from './HoldSemiFQCDialog';
import { useModal, useModal2, useModal3 } from '@basesShared';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { BASE_URL } from '@constants/ConfigConstants';
import HoldSemiActionDialog from './HoldSemiActionDialog';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid-pro';
import { ErrorAlert, SuccessAlert, PrintSemiFQC } from '@utils';

const TabSemiFQC = (props) => {
  const intl = useIntl();
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const { isShowing3, toggle3 } = useModal3();
  const [DataSelect, setDataSelect] = useState([]);
  let isRendered = useRef(true);
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 18,
    searchData: {
      WorkOrder: '',
      FQCSOName: '',
      Model: null,
      ProductId: null,
      SemiLotCode: '',
      ReceivedDate: null,
      showDelete: true,
    },
  });
  const [rowData, setRowData] = useState({});

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
      WorkOrder: State.searchData.WorkOrder,
      LotStatus: State.searchData.FQCSOName,
      page: State.page,
      pageSize: State.pageSize,
      isActived: State.searchData.showDelete,
    };

    const res = await HoldSemiLotService.getAllSemiFQC(params);
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

  const handleScrap = async () => {
    if (window.confirm(intl.formatMessage({ id: 'Holding.confirm_scrap' }))) {
      try {
        const res = await HoldSemiLotService.scrapFQC({ ListId: DataSelect });
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

  const handlePrint = async () => {
    const res = await HoldSemiLotService.getPrintFQC(DataSelect);
    PrintSemiFQC(res.Data);
  };

  const handleCellClick = (param, event) => {
    event.defaultMuiPrevented = param.field === 'ReCheck' || param.field === 'IQCResult';
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotFQCId) + 1 + (State.page - 1) * State.pageSize,
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      width: 150,
    },
    { field: 'SemiLotCode', headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }), width: 400 },
    // {
    //   field: 'FQCSOName',
    //   headerName: intl.formatMessage({ id: 'FQCSO.FQCSOName' }),
    //   width: 150,
    // },
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
              <PhotoView src={`${BASE_URL}/Image/HoldSemiFQC/${params.row.FileName}`}>
                <img src={`${BASE_URL}/Image/HoldSemiFQC/${params.row.FileName}`} style={{ height: 50 }} />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <MuiIconButton
                  color="success"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `${BASE_URL}/Image/HoldSemiFQC/${params.row.FileName}`;
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
      field: 'ActualQty',
      headerName: 'Qty (Roll/EA)',
      width: 160,
      align: 'right',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : null),
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
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 160,
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
                  sx={{ mt: 1, ml: 1 }}
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
            <Grid item style={{ width: '18%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.WOCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WorkOrder')}
              />
            </Grid>
            {/* <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                label="FQCSO.FQCSOName"
                disabled={State.isLoading}
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'FQCSOName')}
              />
            </Grid> */}
            {/* <Grid item style={{ width: '15%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.Model' })}
                fetchDataFunc={FQCStock.getModel}
                displayLabel="ModelCode"
                displayValue="ModelId"
                onChange={(e, item) => handleSearch(item ? item.ModelId ?? null : null, 'Model')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'bom.ProductId' })}
                fetchDataFunc={FQCStock.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
                variant="standard"
                fullWidth
              />
            </Grid> */}
            <Grid item style={{ width: '25%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            {/* <Grid item style={{ width: '15%' }}>
              <MuiDateField
                disabled={State.isLoading}
                label={intl.formatMessage({ id: 'materialLot.ReceivedDate' })}
                value={State.searchData.ReceivedDate}
                onChange={(e) => handleSearch(e, 'ReceivedDate')}
                variant="standard"
              />
            </Grid> */}

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
        getRowId={(rows) => rows.WOSemiLotFQCId}
        rowThreshold={0}
        initialState={{
          pinnedColumns: { left: ['id', GRID_CHECKBOX_SELECTION_COL_DEF.field, 'Holding', 'ReCheck', 'IQCResult'] },
        }}
        onCellClick={handleCellClick}
        onSelectionModelChange={(ids) => setDataSelect(ids)}
        checkboxSelection
      />
      <HoldSemiFQCDialog
        isOpen={isShowing}
        onClose={toggle}
        initModal={rowData}
        resetList={fetchData}
        DataSelect={DataSelect}
        unHold={!State.searchData.showDelete}
      />
    </React.Fragment>
  );
};

export default TabSemiFQC;
