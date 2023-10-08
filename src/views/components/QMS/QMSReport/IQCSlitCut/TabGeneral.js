import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField } from '@controls';
import { Grid } from '@mui/material';
import { QMSReportService } from '@services';
import { addDays } from '@utils';
import moment from 'moment';
import { useIntl } from 'react-intl';
import ColumnHighChart from '../ColumnHighChart';

const TabGeneral = (props) => {
  const intl = useIntl();
  const date = new Date();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
    searchData: {
      MaterialId: '',
      StartDate: addDays(date, -7),
      EndDate: date,
      Type: '',
    },
  });
  const [dataChart, setDataChart] = useState({
    data: [],
    searchData: {
      StartDate: addDays(date, -1),
      EndDate: date,
    },
  });

  useEffect(() => {
    fetchDataChart();
    fetchDataGrid();
  }, []);

  async function fetchDataChart() {
    const params = {
      MaterialId: state.searchData.MaterialId,
      StartDate: moment(state.searchData.StartDate).format('YYYY-MM-DD'),
      EndDate: moment(state.searchData.EndDate).format('YYYY-MM-DD'),
      Type: state.searchData.Type == '' ? 'LOT' : state.searchData.Type,
    };

    const res = await QMSReportService.getChartIQCSlitCutGeneral(params);

    if (res && res.Data) {
      setDataChart({
        ...dataChart,
        data: res.Data ?? [],
      });
    }
  }

  async function fetchDataGrid() {
    const params = {
      MaterialId: state.searchData.MaterialId,
      StartDate: moment(state.searchData.StartDate).format('YYYY-MM-DD'),
      EndDate: moment(state.searchData.EndDate).format('YYYY-MM-DD'),
      Type: state.searchData.Type == '' ? 'LOT' : state.searchData.Type,
    };
    const res = await QMSReportService.GetIQCSlitCutGeneral(params);

    if (res && res.Data) {
      setState({
        ...state,
        data: res.Data ?? [],
      });
    }
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setDataChart({ ...dataChart, searchData: { ...newSearchData } });
    setState({ ...state, searchData: { ...newSearchData } });
  };

  const handleDownload = async () => {
    try {
      const params = {
        MaterialId: state.searchData.MaterialId,
        StartDate: moment(state.searchData.StartDate).format('YYYY-MM-DD'),
        EndDate: moment(state.searchData.EndDate).format('YYYY-MM-DD'),
        Type: state.searchData.Type == '' ? 'LOT' : state.searchData.Type,
      };

      await QMSReportService.downloadIQCSlitCut(params);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  const columns = [
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'material.MaterialCode' }),
      width: 350,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      width: 350,
    },
    {
      field: 'Total',
      headerName: 'Total',
      width: 150,
      align: 'left',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'OK',
      headerName: 'Good',
      width: 150,
      align: 'center',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'OKRate',
      headerName: 'Good Rate',
      width: 150,
      align: 'center',
      valueFormatter: (params) => (params?.value ? Number(params?.value) + '%' : 0),
    },

    {
      field: 'NG',
      headerName: 'NG',
      width: 150,
      align: 'center',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'NGRate',
      headerName: 'NG Rate',
      width: 150,
      align: 'center',
      valueFormatter: (params) => (params?.value ? Number(params?.value) + '%' : 0),
    },
  ];

  const selectOption = () => {
    let value = {
      Data: [
        { Type: 'LOT', TypeName: 'LOT' },
        { Type: 'QTY', TypeName: 'QTY' },
      ],
    };
    return value;
  };

  return (
    <React.Fragment>
      <div className="p-2">
        <Grid container spacing={2} className="mb-2" justifyContent="start">
          <Grid item>
            <MuiAutocomplete
              sx={{ minWidth: '250px' }}
              label={intl.formatMessage({ id: 'material.MaterialCode' })}
              fetchDataFunc={QMSReportService.getMaterialList}
              displayLabel="MaterialCode"
              displayValue="MaterialId"
              onChange={(e, item) => handleSearch(item?.MaterialId ?? '', 'MaterialId')}
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item>
            <MuiDateField
              label={intl.formatMessage({ id: 'general.StartSearchingDate' })}
              value={state.searchData.StartDate}
              onChange={(e) => handleSearch(e, 'StartDate')}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <MuiDateField
              label={intl.formatMessage({ id: 'general.EndSearchingDate' })}
              value={state.searchData.EndDate}
              onChange={(e) => handleSearch(e, 'EndDate')}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <MuiAutocomplete
              sx={{ minWidth: '120px' }}
              label="LOT / QTY"
              defaultValue={{ Type: 'LOT', TypeName: 'LOT' }}
              fetchDataFunc={selectOption}
              displayLabel="TypeName"
              displayValue="Type"
              onChange={(e, item) => handleSearch(item ? item.Type ?? '' : '', 'Type')}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <MuiButton
              text="search"
              color="info"
              onClick={() => {
                fetchDataChart();
                fetchDataGrid();
              }}
            />
          </Grid>
          <Grid item sx={{ marginLeft: 'auto' }}>
            <MuiButton text="download" color="warning" onClick={handleDownload} />
          </Grid>
        </Grid>
        <MuiDataGrid
          disableVirtualization
          isPagingServer={true}
          showLoading={state.isLoading}
          headerHeight={45}
          columns={columns}
          rows={state.data}
          gridHeight={260}
          page={state.page - 1}
          pageSize={state.pageSize}
          rowCount={state?.totalRow}
          getRowId={(rows) => rows.MaterialId}
          hideFooter
          initialState={{ rowPinning: true, pinnedRows: { top: [state.data[0]], bottom: [state.data[0]] } }}
          getRowClassName={(params) => {
            if (params.row.MaterialId == 999999) return 'total-row-pin';
          }}
        />

        <ColumnHighChart data={dataChart?.data} yAxisTitle="%" />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TabGeneral);
