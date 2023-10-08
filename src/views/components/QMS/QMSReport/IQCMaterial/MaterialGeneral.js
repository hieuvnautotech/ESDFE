import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField } from '@controls';
import { Grid } from '@mui/material';
import { QCReportService, QMSReportService } from '@services';
import { addDays } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useIntl } from 'react-intl';
import ColumnHighChart from '../ColumnHighChart';

const MaterialGeneral = (props) => {
  let isRendered = useRef(true);
  const date = new Date();
  const handle = useFullScreenHandle();
  const intl = useIntl();
  const selectOption = [
    { Type: '1', TypeName: 'LOT' },
    { Type: '0', TypeName: 'QTY' },
  ];
  const selectType = [
    { Type: '0', TypeName: 'All' },
    { Type: '1', TypeName: 'Roll' },
    { Type: '2', TypeName: 'EA' },
    { Type: '3', TypeName: 'SUS' },
  ];

  const [state, setState] = useState({
    data: [],
    chart: [],
    searchData: {
      MaterialId: '',
      StartDate: addDays(date, -30),
      EndDate: date,
      LotorQty: '1',
      Type: '0',
    },
  });

  const columns = [
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'material.MaterialCode' }),
      flex: 0.6,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      flex: 0.6,
    },
    {
      field: 'TotalQty',
      headerName: 'Total',
      flex: 0.4,
      type: 'number',
    },
    {
      field: 'OKQty',
      headerName: 'Good',
      flex: 0.4,
      type: 'number',
    },
    {
      field: 'OKRate',
      headerName: 'Good Rate',
      flex: 0.4,
      type: 'number',
      valueFormatter: (params) => params?.value + '%',
    },
    {
      field: 'NGQty',
      headerName: 'NG',
      flex: 0.4,
      type: 'number',
    },
    {
      field: 'NGRate',
      headerName: 'NG Rate',
      flex: 0.4,
      type: 'number',
      valueFormatter: (params) => params?.value + '%',
    },
  ];

  useEffect(() => {
    fetchData();
  }, [state.searchData]);

  async function fetchData() {
    const params = {
      MaterialId: state.searchData.MaterialId,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      LotorQty: Number(state.searchData.LotorQty),
      Type: Number(state.searchData.Type),
    };
    const res = await QCReportService.getMaterialGeneral(params);
    const resC = await QCReportService.getMaterialGeneralChart(params);

    if (res && isRendered) setState({ ...state, data: res.Data ?? [], chart: resC.Data ?? [] });
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };

  const handleDownload = async () => {
    try {
      const params = {
        MaterialId: state.searchData.MaterialId,
        StartDate: moment(state.searchData.StartDate).format('YYYY-MM-DDTHH:mm:00'),
        EndDate: moment(state.searchData.EndDate).format('YYYY-MM-DDTHH:mm:00'),
        LotorQty: Number(state.searchData.LotorQty),
        Type: Number(state.searchData.Type),
      };

      await QCReportService.downloadMaterialGeneral(params);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  return (
    <React.Fragment>
      <FullScreen handle={handle} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Grid container columnSpacing={2} direction="row" sx={{ mb: 1, mt: 1 }}>
          <Grid item>
            <MuiAutocomplete
              sx={{ width: 200 }}
              label={intl.formatMessage({ id: 'material.MaterialCode' })}
              fetchDataFunc={QMSReportService.getMaterialList}
              displayLabel="MaterialCode"
              displayValue="MaterialId"
              variant="standard"
              onChange={(e, value) => handleSearch(value?.MaterialId ?? '', 'MaterialId')}
            />
          </Grid>
          <Grid item>
            <MuiAutocomplete
              sx={{ width: 150 }}
              label="Type"
              defaultValue={selectType[0]}
              fetchDataFunc={() => {
                return { Data: selectType };
              }}
              displayLabel="TypeName"
              displayValue="Type"
              onChange={(e, item) => handleSearch(item ? item.Type : '', 'Type')}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <MuiDateField
              disabled={state.isLoading}
              sx={{ width: 200 }}
              label={intl.formatMessage({ id: 'general.StartSearchingDate' })}
              value={state.searchData.StartDate}
              onChange={(e) => handleSearch(e, 'StartDate')}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <MuiDateField
              disabled={state.isLoading}
              sx={{ width: 200 }}
              label={intl.formatMessage({ id: 'general.EndSearchingDate' })}
              value={state.searchData.EndDate}
              onChange={(e) => handleSearch(e, 'EndDate')}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <MuiAutocomplete
              sx={{ width: 150 }}
              label="LOT / QTY"
              defaultValue={selectOption[0]}
              fetchDataFunc={() => {
                return { Data: selectOption };
              }}
              displayLabel="TypeName"
              displayValue="Type"
              onChange={(e, item) => handleSearch(item ? item.Type : '', 'LotorQty')}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <MuiButton text="search" color="info" onClick={() => fetchData()} sx={{ mr: 2, mt: 1 }} />
          </Grid>
          <Grid item>
            <MuiButton text="download" color="warning" onClick={handleDownload} sx={{ mt: 1 }} />
          </Grid>
        </Grid>
        {state?.data?.length > 0 && (
          <MuiDataGrid
            disableVirtualization
            isPagingServer={true}
            headerHeight={35}
            gridHeight={260}
            columns={columns}
            rows={state.data}
            page={0}
            pageSize={8}
            getRowId={(rows) => rows.stt}
            initialState={{ rowPinning: true, pinnedRows: { top: [state.data[0]], bottom: [state.data[0]] } }}
            getRowClassName={(params) => {
              if (params.row.stt == 999999) return 'total-row-pin';
            }}
            hideFooter
          />
        )}
        <Grid
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
            border: '1px solid rgba(224, 224, 224, 1)',
            borderRadius: '4px',
            mt: 2,
            p: 1,
          }}
        >
          <ColumnHighChart data={state?.chart} yAxisTitle="%" />
        </Grid>
      </FullScreen>
    </React.Fragment>
  );
};

export default MaterialGeneral;
