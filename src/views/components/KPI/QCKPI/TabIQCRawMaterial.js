import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Typography } from '@mui/material';
import moment from 'moment';
import { KIPQCIQCService } from '@services';
import { useIntl } from 'react-intl';
import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import LineHighChart from './Chart/LineHighChart';
import ColumnHighChart from './Chart/ColumnHighChart';

const TabIQCRawMaterial = (props) => {
  const intl = useIntl();
  const [sum, setSum] = useState({ sumOK: 0, sumNG: 0, sumTotal: 0 });
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
    searchData: {
      MaterialCode: '',
      LotNo: '',
    },
  });
  const [dataChart, setDataChart] = useState({
    data: [],
    searchData: {
      MaterialCode: '',
      LotNo: '',
    },
  });

  useEffect(() => {
    fetchDataChart();
    fetchDataGrid();
  }, []);

  async function fetchDataChart() {
    const params = {
      MaterialCode: dataChart.searchData.MaterialCode,
      LotNo: dataChart.searchData.LotNo,
    };

    const res = await KIPQCIQCService.getDataChart(params);
    if (res && res.Data) {
      setDataChart({
        ...dataChart,
        data: res.Data ?? [],
      });
    }
  }

  async function fetchDataGrid() {
    const params = {
      MaterialCode: state.searchData.MaterialCode,
      LotNo: state.searchData.LotNo,
    };

    const res = await KIPQCIQCService.getDataGrid(params);

    const sumOK = await res.Data.reduce((accumulator, object) => {
      return accumulator + object.TotalOK;
    }, 0);

    const sumNG = await res.Data.reduce((accumulator, object) => {
      return accumulator + object.TotalNG;
    }, 0);

    const sumTotal = await res.Data.reduce((accumulator, object) => {
      return accumulator + (object.TotalOK + object.TotalNG);
    }, 0);

    setSum({ ...sum, sumOK: sumOK, sumNG: sumNG, sumTotal: sumTotal });

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
        MaterialCode: dataChart.searchData.MaterialCode,
        LotNo: dataChart.searchData.LotNo,
      };

      await KIPQCIQCService.downloadIQCRaw(params);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      width: 70,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialReceiveId) + 1 + (state.page - 1),
    },

    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'general.Date' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'material.MaterialCode' }),
      width: 250,
    },
    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'IQCReceiving.LotNo' }),
      width: 250,
    },
    {
      field: 'Total',
      headerName: 'Total',
      width: 150,
      align: 'left',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'MaterialUnit',
      headerName: intl.formatMessage({ id: 'material.Unit' }),
      width: 150,
    },
    {
      field: 'TotalOK',
      headerName: 'OK',
      width: 150,
    },
    {
      field: 'TotalNG',
      headerName: 'NG',
      width: 150,
    },
  ];

  const styles = {
    item: {
      width: '22%',
      height: '110px',
      fontSize: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderRadius: '10px',
      textAlign: 'center',
      color: '#ffffff',
      fontWeight: 600,
    },
    parentItem: {
      paddingBottom: '10px',
    },
    chart: {
      width: '48%',
    },
  };

  return (
    <React.Fragment>
      <div className="p-2">
        <Grid container spacing={2} className="mb-2" justifyContent="flex-end">
          <Grid item>
            <MuiSearchField
              variant="keyWord"
              label="material.MaterialCode"
              onClick={() => {
                fetchDataChart();
                fetchDataGrid();
              }}
              onChange={(e) => handleSearch(e.target.value, 'MaterialCode')}
            />
          </Grid>
          <Grid item>
            <MuiSearchField
              label="IQCReceiving.LotNo"
              onClick={() => {
                fetchDataChart();
                fetchDataGrid();
              }}
              onChange={(e) => handleSearch(e.target.value, 'LotNo')}
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
        </Grid>

        <div style={{ display: 'flex', justifyContent: 'space-between', ...styles.parentItem }}>
          <div style={{ ...styles.item, backgroundColor: '#02A5F7' }}>
            <span>{sum?.sumTotal?.toLocaleString()}</span>
            <span>Total</span>
          </div>
          <div style={{ ...styles.item, backgroundColor: '#18ED02' }}>
            <span>{sum?.sumOK?.toLocaleString()}</span>
            <span>Total OK</span>
          </div>
          <div style={{ ...styles.item, backgroundColor: '#F43AC8' }}>
            <span>{sum?.sumNG?.toLocaleString()}</span>
            <span>Total NG</span>
          </div>
        </div>
        <div style={{ ...styles.parentItem }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={styles.chart}>
              <LineHighChart data={dataChart?.data} yAxisTitle="Roll/Box" />
            </div>
            <div style={styles.chart}>
              <ColumnHighChart data={dataChart?.data} yAxisTitle="Roll/Box" />
            </div>
          </div>
        </div>
        <Typography variant="h5" component="h4" sx={{ mb: 1, display: 'flow-root' }}>
          Current Date
          <MuiButton text="download" color="warning" onClick={handleDownload} sx={{ float: 'right' }} />
        </Typography>
        <MuiDataGrid
          showLoading={state.isLoading}
          headerHeight={45}
          columns={columns}
          rows={state.data}
          gridHeight={260}
          page={state.page - 1}
          pageSize={state.pageSize}
          rowCount={state?.totalRow}
          getRowId={(rows) => rows.MaterialReceiveId}
          hideFooter
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(TabIQCRawMaterial);
