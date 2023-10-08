import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiDateField } from '@controls';
import { Grid } from '@mui/material';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { KPIQCService, bomService, QCReportService } from '@services';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDays } from '@utils';
import ColumnHighChart from '../ColumnHighChart';
import moment from 'moment';

const OQCGeneral = (props) => {
  let isRendered = useRef(true);
  const date = new Date();
  const handle = useFullScreenHandle();
  const intl = useIntl();
  const selectOption = [
    { Type: '1', TypeName: 'LOT' },
    { Type: '0', TypeName: 'QTY' },
  ];

  const [state, setState] = useState({
    data: [],
    chart: [],
    searchData: {
      ModelId: '',
      Products: '',
      StartDate: addDays(date, -30),
      EndDate: date,
      LotorQty: '1',
    },
  });

  const columns = [
    {
      field: 'ModelCode',
      headerName: intl.formatMessage({ id: 'product.Model' }),
      flex: 0.6,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'product.product_code' }),
      flex: 0.6,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
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
      ModelId: state.searchData.ModelId,
      Products: state.searchData.Products,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      LotorQty: Number(state.searchData.LotorQty),
    };
    const res = await QCReportService.getOQCGeneral(params);
    const resC = await QCReportService.getOQCGeneralChart(params);

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
        ModelId: state.searchData.ModelId,
        Products: state.searchData.Products,
        StartDate: moment(state.searchData.StartDate).format('YYYY-MM-DDTHH:mm:00'),
        EndDate: moment(state.searchData.EndDate).format('YYYY-MM-DDTHH:mm:00'),
        LotorQty: Number(state.searchData.LotorQty),
      };

      await QCReportService.downloadOQCGeneral(params);
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
              label={intl.formatMessage({ id: 'product.Model' })}
              fetchDataFunc={QCReportService.getModel}
              displayLabel="ModelCode"
              displayValue="ModelId"
              variant="standard"
              onChange={(e, value) => handleSearch(value?.ModelId ?? '', 'ModelId')}
            />
          </Grid>
          <Grid item>
            <MuiAutocomplete
              multiple={true}
              sx={{ width: 250 }}
              label={intl.formatMessage({ id: 'product.product_code' })}
              fetchDataFunc={QCReportService.getProduct}
              displayLabel="ProductLabel"
              displayValue="ProductId"
              variant="standard"
              onChange={(e, value) =>
                handleSearch(value ? value.map((item) => item.ProductId).join('|') : '', 'Products')
              }
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

export default OQCGeneral;
