import { BASE_URL } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiIconButton } from '@controls';
import { Button, Grid } from '@mui/material';
import { HoldLogService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const TabHoldLogFG = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 18,
    searchData: {
      BuyerQR: '',
      LotNo: '',
      FQCSOName: '',
      HoldStatus: '',
      showDelete: true,
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.HoldLogId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'HoldLogId', hide: true },
    { field: 'MaterialLotId', hide: true },
    { field: 'row_version', hide: true },
    { field: 'IQCType', hide: true },
    // {
    //   field: 'IQCResult',
    //   headerName: intl.formatMessage({ id: 'Holding.IQCResult' }),
    //   width: 100,
    //   align: 'center',
    //   renderCell: (params) => {
    //     return (
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         size="small"
    //         onClick={() => handleDetail(params.row)}
    //         sx={{ paddingTop: '1px', paddingBottom: '1px' }}
    //       >
    //         {intl.formatMessage({ id: 'Holding.ShowIQC' })}
    //       </Button>
    //     );
    //   },
    // },
    {
      field: 'BuyerQR',
      headerName: intl.formatMessage({ id: 'BuyerQR.BuyerQR' }),
      width: 350,
    },
    {
      field: 'FQCSOName',
      headerName: intl.formatMessage({ id: 'FQCSO.FQCSOName' }),
      width: 150,
    },
    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'materialLot.LotNo' }),
      width: 150,
    },
    {
      field: 'FileName',
      align: 'center',
      headerName: intl.formatMessage({ id: 'Holding.File' }),
      width: 150,
      renderCell: (params) => {
        return (
          params.row.FileName != null &&
          (params.row.IsPicture ? (
            <PhotoProvider>
              <PhotoView src={`${BASE_URL}/QMS/FinishGood/${params.row.FileName}`}>
                <img src={`${BASE_URL}/QMS/FinishGood/${params.row.FileName}`} style={{ height: 50 }} />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <MuiIconButton
                  color="success"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `${BASE_URL}/QMS/FinishGood/${params.row.FileName}`;
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
      headerName: intl.formatMessage({ id: 'Holding.Reason' }),
      width: 150,
    },
    {
      field: 'HoldStatusName',
      headerName: intl.formatMessage({ id: 'general.status' }),
      width: 150,
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
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete]);

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

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      BuyerQR: state.searchData.BuyerQR,
      LotNo: state.searchData.LotNo,
      FQCSOName: state.searchData.FQCSOName,
      HoldStatus: state.searchData.HoldStatus,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await HoldLogService.GetFGLog(params);

    if (res && isRendered)
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
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="BuyerQR"
                label="BuyerQR.BuyerQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="LotNo"
                label="Holding.LotNo"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'LotNo')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                label="FQCSO.FQCSOName"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'FQCSOName')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'general.status' })}
                fetchDataFunc={HoldLogService.getStatus}
                displayLabel="commonDetailName"
                displayValue="commonDetailCode"
                onChange={(e, item) => handleSearch(item ? item.commonDetailCode ?? null : null, 'HoldStatus')}
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
        getRowId={(rows) => rows.HoldLogId}
        initialState={{ pinnedColumns: { left: ['id', 'Holding', 'IQCResult'] } }}
      />
    </React.Fragment>
  );
};

export default TabHoldLogFG;
