import { useModal, useModal2, useModal3 } from '@basesShared';
import { BASE_URL } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiIconButton, MuiSearchField } from '@controls';
import { Badge, Button, FormControlLabel, Grid, Switch } from '@mui/material';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid-pro';
import { HoldRawMaterialService, MMSReturnMaterialService } from '@services';
import { ErrorAlert, SuccessAlert, PrintMaterial } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import HoldDialog from './HoldDialog';
import IQCCheckDialog from './IQCCheckDialog';

const HoldRawMaterial = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const { isShowing3, toggle3 } = useModal3();
  const [DataSelect, setDataSelect] = useState([]);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      MaterialLotCode: '',
      LotNo: '',
      showDelete: true,
    },
  });
  const [MaterialLot, setMaterialLot] = useState({});

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'MaterialLotId', hide: true },
    { field: 'row_version', hide: true },
    { field: 'IQCType', hide: true },
    {
      field: 'ReCheck',
      hide: state.searchData.showDelete,
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
      headerName: intl.formatMessage({ id: 'Holding.IQCResult' }),
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
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'Holding.RawMaterialLotCode' }),
      width: 350,
    },
    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'materialLot.LotNo' }),
      width: 150,
    },
    {
      field: 'FileName',
      align: 'center',
      hide: state.searchData.showDelete,
      headerName: intl.formatMessage({ id: 'Holding.File' }),
      width: 150,
      renderCell: (params) => {
        return (
          params.row.FileName != null &&
          (params.row.IsPicture ? (
            <PhotoProvider>
              <PhotoView src={`${BASE_URL}/QMS/RawMaterial/${params.row.FileName}`}>
                <img src={`${BASE_URL}/QMS/RawMaterial/${params.row.FileName}`} style={{ height: 50 }} />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <MuiIconButton
                  color="success"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `${BASE_URL}/QMS/RawMaterial/${params.row.FileName}`;
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
      hide: state.searchData.showDelete,
      headerName: intl.formatMessage({ id: 'Holding.Reason' }),
      width: 150,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'Holding.Width' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'Holding.Length' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
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
  }, [state.page, state.searchData.showDelete]);

  //handle
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
      MaterialLotCode: state.searchData.MaterialLotCode,
      LotNo: state.searchData.LotNo,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await HoldRawMaterialService.getRawMaterialList(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleScrap = async () => {
    if (window.confirm(intl.formatMessage({ id: 'Holding.confirm_scrap' }))) {
      try {
        const res = await HoldRawMaterialService.scrap({ ListId: DataSelect });
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
    // const res = await SplitMergeService.GetListPrintQR(DataSelect);
    // PrintMaterial(res.Data);

    const list = await MMSReturnMaterialService.GetListPrintQR(DataSelect);
    PrintMaterial(list.Data);
  };

  const handleCellClick = (param, event) => {
    event.defaultMuiPrevented = param.field === 'ReCheck' || param.field === 'IQCResult';
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={3}>
          {state.searchData.showDelete ? (
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
            <Grid item style={{ width: '28%' }}>
              <MuiSearchField
                variant="MaterialLotCode"
                label="Holding.RawMaterialLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialLotCode')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="Explain"
                label="Holding.LotNo"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'LotNo')}
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
              id: state.searchData.showDelete ? 'Holding.UnHoldList' : 'Holding.HoldList',
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
        getRowId={(rows) => rows.MaterialLotId}
        initialState={{
          pinnedColumns: { left: ['id', GRID_CHECKBOX_SELECTION_COL_DEF.field, 'Holding', 'ReCheck', 'IQCResult'] },
        }}
        onCellClick={handleCellClick}
        onSelectionModelChange={(ids) => setDataSelect(ids)}
        checkboxSelection
      />
      <HoldDialog
        isOpen={isShowing}
        onClose={toggle}
        MaterialLot={MaterialLot}
        resetList={fetchData}
        DataSelect={DataSelect}
        unHold={!state.searchData.showDelete}
      />
      <IQCCheckDialog RowCheck={MaterialLot} isOpen={isShowing2} onClose={handleCloseRecheck} />

      <IQCCheckDialog RowCheck={MaterialLot} isOpen={isShowing3} onClose={toggle3} view={true} reCheck={true} />
    </React.Fragment>
  );
};

export default HoldRawMaterial;
