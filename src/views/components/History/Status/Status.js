import { MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import { Grid } from '@mui/material';
import { HistoryStatusService } from '@services';
import { addDays, minusMonths } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export default function Status() {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    data: [],
    searchData: {
      BuyerQR: '',
      SemiLotCode: '',
      MaterialLotCode: '',
    },
  });
  const [SemiLotCode, setSemiLotCode] = useState(null);

  //useEffect
  // useEffect(() => {
  //   fetchData();
  //   return () => {
  //     isRendered = false;
  //   };
  // }, [state.page, state.pageSize]);

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
    setSemiLotCode(null);
    const params = {
      BuyerQR: state.searchData.BuyerQR,
      SemiLotCode: state.searchData.SemiLotCode,
      MaterialLotCode: state.searchData.MaterialLotCode,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await HistoryStatusService.getMaterialLotCode(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
      });
  }

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs sx={{ mb: 1 }}>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                label="BuyerQR.BuyerQR"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item style={{ width: '15%' }}>
              <MuiSearchField
                label="WO.MaterialLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialLotCode')}
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <h5>Thông tin</h5>
      <table
        style={{
          width: '100%',
          display: 'block',
          overflowY: 'auto',
          overflowY: 'auto',
          height: '335px',
          marginTop: '25px',
        }}
      >
        <tbody style={{ width: '100%', display: 'table' }}>
          <tr>
            <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'work_order.WoCode' })}</th>
            <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'WO.ProductCode' })}</th>
            <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'bom.ProcessId' })}</th>
            <th style={{ ...style.th }}>{intl.formatMessage({ id: 'actual.LotStatus' })}</th>
            <th style={{ ...style.th }}>{intl.formatMessage({ id: 'materialSO.LocationId' })}</th>
            <th style={{ ...style.th }}>{intl.formatMessage({ id: 'WO.ActualQty' })}</th>
            <th style={{ ...style.th }}>{intl.formatMessage({ id: 'WO.SemiLotCode' })}</th>
            <th style={{ ...style.th }}>{intl.formatMessage({ id: 'WO.timeMapping' })}</th>
          </tr>
          {state.data &&
            state.data.map((item, index) => {
              return (
                <tr key={index}>
                  <td style={{ ...style.td, minWidth: '150px' }}>{item.WOCode}</td>
                  <td style={{ ...style.td, minWidth: '150px' }}>{item.ProductCode}</td>
                  <td style={{ ...style.td, minWidth: '150px' }}>{item.ProcessCode}</td>
                  <td style={{ ...style.td, minWidth: '150px' }}>{item.LotStatusName}</td>
                  <td style={{ ...style.td, minWidth: '150px' }}>{item.AreaCode}</td>
                  <td style={{ ...style.td, minWidth: '150px' }}>{item.Length}</td>
                  <td style={{ ...style.td, minWidth: '150px' }}>
                    <p>{item.SemiLotCode}</p>
                  </td>
                  <td style={{ ...style.td, minWidth: '150px' }}>{item.CreateDateMapping}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </React.Fragment>
  );
}
const style = {
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    background: '#000',
    color: '#fff',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    background: '#000',
    color: '#fff',
    fontSize: '14px',
  },
};
