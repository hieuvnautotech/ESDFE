import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import { Grid, Typography } from '@mui/material';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { KPIQCService, bomService, RoutingService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ColumnHighChart from './Chart/ColumnHighChart';
import LineHighChart from './Chart/LineHighChart';

const TabOQC = (props) => {
  let isRendered = useRef(true);
  const handle = useFullScreenHandle();
  const intl = useIntl();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const [state, setState] = useState({
    data: [],
    searchData: {
      ProductCode: '',
      WOCode: '',
      ProcessCode: '',
    },
  });
  const [Current, setCurrent] = useState({ data: [], totalTarget: 0, totalOK: 0, totalNG: 0 });

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOId) + 1,
    },
    {
      field: 'ModelCode',
      headerName: 'Model',
      width: 200,
    },
    {
      field: 'ProductCode',
      headerName: 'Product',
      width: 250,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      width: 300,
    },
    {
      field: 'WOCode',
      headerName: 'WO',
      description: intl.formatMessage({ id: 'materialSO.OrderQty_tip' }),
      width: 250,
    },
    {
      field: 'Target',
      headerName: 'Target',
      width: 150,
      type: 'number',
    },
    {
      field: 'OKQty1',
      headerName: 'OK After OQC',
      width: 160,
      type: 'number',
    },
    {
      field: 'NGQty1',
      headerName: 'NG After OQC',
      width: 160,
      type: 'number',
    },
    {
      field: 'TotalQty1',
      headerName: 'Total After OQC',
      width: 160,
      type: 'number',
    },
    {
      field: 'OKQty2',
      headerName: 'OK After Packing',
      width: 160,
      type: 'number',
    },
    {
      field: 'NGQty2',
      headerName: 'NG After Packing',
      width: 160,
      type: 'number',
    },
    {
      field: 'TotalQty2',
      headerName: 'Total After Packing',
      width: 160,
      type: 'number',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    fetchData();
    fetchDataCurrent();
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [state.searchData]);

  async function fetchData() {
    const params = {
      ProductCode: state.searchData.ProductCode,
      WOCode: state.searchData.WOCode,
      ProcessCode: state.searchData.ProcessCode,
    };
    const res = await KPIQCService.getOQC6Days(params);

    if (res && isRendered) setState({ ...state, data: res.Data ?? [] });
  }

  const handleDownload = async () => {
    try {
      const params = {
        ProductCode: state.searchData.ProductCode,
        WOCode: state.searchData.WOCode,
        ProcessCode: state.searchData.ProcessCode,
      };

      await KPIQCService.downloadOQC(params);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  async function fetchDataCurrent() {
    const params = {
      ProductCode: state.searchData.ProductCode,
      WOCode: state.searchData.WOCode,
      ProcessCode: state.searchData.ProcessCode,
    };

    const res = await KPIQCService.getOQCCurrentDate(params);

    if (res && isRendered) {
      var OK = 0;
      var NG = 0;
      var Total = 0;
      res.Data.map((item) => {
        OK += item.OKQty1 + item.OKQty2;
        NG += item.NGQty1 + item.NGQty2;
        Total += item.TotalQty1 + item.TotalQty2;
      });
      setCurrent({ data: res.Data ?? [], totalTarget: Total, totalOK: OK, totalNG: NG });
    }
  }

  // useEffect(() => {
  //   data ? setState({ ...state, data: data?.data }) : '';
  // }, [data]);

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
      paddingBottom: '20px',
    },
    chart: {
      width: '48%',
    },
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };

  return (
    <React.Fragment>
      {/* <Grid item xs={4} sx={{ mb: 1 }}>
        <Button variant="contained" startIcon={<FullscreenIcon />} onClick={handle.enter}>
          Full Screen
        </Button>
      </Grid> */}
      <FullScreen handle={handle} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
          <Grid item xs={3}></Grid>
          <Grid item xs>
            <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
              <Grid item style={{ width: '21%' }}>
                <MuiSearchField
                  variant="standard"
                  label="WO.WOCode"
                  onClick={fetchData}
                  onChange={(e) => handleSearch(e.target.value, 'WOCode')}
                />
              </Grid>
              <Grid item style={{ width: '21%' }}>
                <MuiAutocomplete
                  label={intl.formatMessage({ id: 'product.product_code' })}
                  fetchDataFunc={bomService.getProductAll}
                  displayLabel="ProductLabel"
                  displayValue="ProductId"
                  variant="standard"
                  onChange={(e, value) => handleSearch(value?.ProductCode ?? '', 'ProductCode')}
                />
              </Grid>
              <Grid item>
                <MuiButton
                  text="search"
                  color="info"
                  onClick={() => {
                    fetchData();
                    fetchDataCurrent();
                  }}
                  sx={{ mr: 3, mt: 1 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div style={{ backgroundColor: 'white', padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...styles.parentItem }}>
            <div style={{ ...styles.item, backgroundColor: '#02A5F7' }}>
              <span>{Current?.totalTarget?.toLocaleString()}</span>
              <span>Total</span>
            </div>
            <div style={{ ...styles.item, backgroundColor: '#18ED02' }}>
              <span>{Current?.totalOK?.toLocaleString()}</span>
              <span>Total OK</span>
            </div>
            <div style={{ ...styles.item, backgroundColor: '#F43AC8' }}>
              <span>{Current?.totalNG}</span>
              <span>Total NG</span>
            </div>
          </div>
          <div style={{ ...styles.parentItem }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={styles.chart}>
                <LineHighChart data={state?.data} OQCCheck={true} />
              </div>
              <div style={styles.chart}>
                <ColumnHighChart data={state?.data} OQCCheck={true} />
              </div>
            </div>
          </div>
          <Typography variant="h5" component="h4" sx={{ mb: 1, display: 'flow-root' }}>
            Current Date
            <MuiButton text="download" color="warning" onClick={handleDownload} sx={{ float: 'right' }} />
          </Typography>
          {state?.data?.length > 0 && (
            <MuiDataGrid
              isPagingServer={true}
              headerHeight={35}
              gridHeight={260}
              columns={columns}
              rows={Current.data}
              page={0}
              pageSize={5}
              getRowId={(rows) => rows.WOId}
              hideFooter
            />
          )}
        </div>
      </FullScreen>
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

  const {
    Display_Reducer: { totalOrderQty, totalActualQty, totalNGQty, totalEfficiency, data, deliveryOrder },
  } = CombineStateToProps(state.AppReducer, [[Store.Display_Reducer]]);

  return { language, totalOrderQty, totalActualQty, totalNGQty, totalEfficiency, data, deliveryOrder };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabOQC);
