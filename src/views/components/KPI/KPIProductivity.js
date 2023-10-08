import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { MuiDataGrid, MuiButton } from '@controls';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box, Button, Grid } from '@mui/material';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useIntl } from 'react-intl';
import BarChart from './Chart/BarChart';
import LineChart from './Chart/LineChart';
Chart.register(CategoryScale);
import { GetLocalStorage } from '@utils';
import { HubConnectionBuilder, LogLevel, HttpTransportType, HubConnectionState } from '@microsoft/signalr';
import { BASE_URL, TOKEN_ACCESS } from '@constants/ConfigConstants';
import { KIPQCIQCService } from '@services';

const KPIProductivity = (props) => {
  let isRendered = useRef(true);
  const handle = useFullScreenHandle();
  const intl = useIntl();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const isFullScreen = handle.active;
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
    searchData: {
      MaterialLotCode: '',
    },
  });
  const [data, setData] = useState({ data: [] });

  const initConnection = new HubConnectionBuilder()
    .withUrl(`${BASE_URL}/signalr`, {
      accessTokenFactory: () => GetLocalStorage(TOKEN_ACCESS),
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .configureLogging(LogLevel.None)
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        //reconnect after 5-20s
        return 5000 + Math.random() * 15000;
      },
    })
    .build();

  const [connection, setConnection] = useState(initConnection);

  const startConnection = async () => {
    try {
      if (connection) {
        connection.on('WorkOrderGetDisplay', (res) => {
          if (res && isRendered) {
            console.log(res);
            setData(res);
          }
        });
        connection.onclose(async (e) => {
          if (isRendered) setConnection(null);
        });
      }

      if (connection.state === HubConnectionState.Disconnected) {
        await connection.start();
        console.log('websocket connect success');
        await connection.invoke('GetDisplayWO');
      } else if (connection.state === HubConnectionState.Connected) {
        await connection.invoke('GetDisplayWO');
      }
    } catch (error) {
      console.log('websocket connect error: ', error);
    }
  };

  const closeConnection = async () => {
    try {
      if (connection && connection.state === HubConnectionState.Connected) await connection.stop();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isRendered) {
      startConnection();
    }

    return () => {
      closeConnection();
      isRendered = false;
    };
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      width: 70,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.woId) + 1 + (state.page - 1),
    },

    {
      field: 'modelName',
      headerName: 'Model',
      width: 200,
    },
    {
      field: 'productCode',
      headerName: 'Product',
      width: 250,
    },
    {
      field: 'woCode',
      headerName: 'WO',
      description: intl.formatMessage({ id: 'materialSO.OrderQty_tip' }),
      width: 250,
    },
    {
      field: 'target',
      headerName: 'Target',
      width: 150,
      align: 'left',
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'efficiency',
      headerName: 'Efficiency',
      width: 250,
    },
    {
      field: 'okQty',
      headerName: 'OK MMS',
      width: 150,
    },
    {
      field: 'ngQty',
      headerName: 'NG MMS',
      width: 150,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    data ? setState({ ...state, data: data?.data }) : '';
  }, [data]);

  const handleDownload = async () => {
    try {
      const params = {
        MaterialLotCode: state.searchData.MaterialLotCode,
      };

      await KIPQCIQCService.downloadProductivity(params);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  const styles = {
    item: {
      width: '22%',
      height: '130px',
      fontSize: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 0 0 10px',
      borderRadius: '10px',
      textAlign: 'center',
      color: '#ffffff',
      fontWeight: 600,
    },
    parentItem: {
      paddingBottom: '40px',
    },
    chart: {
      width: '48%',
    },
  };

  return (
    <React.Fragment>
      <Grid item xs={4} sx={{ mb: 1 }}>
        <Button variant="contained" startIcon={<FullscreenIcon />} onClick={handle.enter}>
          Full Screen
        </Button>
      </Grid>
      <FullScreen
        handle={handle}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ backgroundColor: 'white', padding: '30px', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...styles.parentItem }}>
            <div style={{ ...styles.item, backgroundColor: '#02A5F7' }}>
              <span>{data?.totalWO}</span>
              <span>Total WO</span>
            </div>
            <div style={{ ...styles.item, backgroundColor: '#0DE0C8' }}>
              <span>{data?.totalTarget?.toLocaleString()}</span>
              <span>Total target</span>
            </div>
            <div style={{ ...styles.item, backgroundColor: '#18ED02' }}>
              <span>{data?.totalOK?.toLocaleString()}</span>
              <span>Total OK MMS</span>
            </div>
            <div style={{ ...styles.item, backgroundColor: '#F43AC8' }}>
              <span>{data?.totalNG}</span>
              <span>Total NG MMS</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '20px' }}>Status Today</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={styles.chart}>
                <LineChart data={data?.data} />
              </div>
              <div style={styles.chart}>
                <BarChart data={data?.data} />
              </div>
            </div>
          </div>
          {state?.data?.length > 0 && (
            <Box sx={{ display: 'flow-root' }}>
              <MuiButton text="download" color="warning" onClick={handleDownload} sx={{ float: 'right' }} />
            </Box>
          )}
          {state?.data?.length > 0 && (
            <MuiDataGrid
              showLoading={state.isLoading}
              headerHeight={35}
              columns={columns}
              rows={state.data}
              page={state.page - 1}
              pageSize={state.pageSize}
              rowCount={data?.totalWO}
              disableRowSelectionOnClick
              onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
              onPageSizeChange={(newPageSize) => setState({ ...state, page: 1, pageSize: newPageSize })}
              getRowId={(rows) => rows.woId}
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

export default connect(mapStateToProps, mapDispatchToProps)(KPIProductivity);
