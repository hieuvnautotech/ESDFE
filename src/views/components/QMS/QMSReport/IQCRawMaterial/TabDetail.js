import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiDateField } from '@controls';
import { Grid, Tooltip, Typography } from '@mui/material';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { KPIQCService, bomService, QCReportService, QMSReportService } from '@services';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDays } from '@utils';
import ColumnHighChart from '../ColumnHighChart';
import moment from 'moment';
import { forEach } from 'lodash';

const TabDetail = ({ QCStandard }) => {
  let isRendered = useRef(true);
  const date = new Date();
  const handle = useFullScreenHandle();
  const intl = useIntl();
  const [options, setOptions] = useState(null);
  const selectOption = () => {
    let value = {
      Data: [
        { Type: 'LOT', TypeName: 'LOT' },
        { Type: 'QTY', TypeName: 'QTY' },
      ],
    };
    return value;
  };
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

  const [gridCol, setGridCol] = useState([...columns]);

  useEffect(() => {
    fetchData();
  }, [state.searchData]);

  const getQCStandardName = (Id) => {
    const item = QCStandard.find((x) => x.QCItemId == Id);
    return item?.QCName ?? '';
  };

  async function fetchData() {
    const params = {
      MaterialId: state.searchData.MaterialId,
      StartDate: moment(state.searchData.StartDate).format('YYYY-MM-DD'),
      EndDate: moment(state.searchData.EndDate).format('YYYY-MM-DD'),
      Type: state.searchData.Type == '' ? 'LOT' : state.searchData.Type,
    };
    const res = await QMSReportService.GetIQCRawDetail(params);

    let col = [...columns];

    if (res.Data) {
      let top1 = res.Data[0];
      const total = calcTotal(res.Data);
      const totalChart = [];
      let stt = 0;

      for (const key in top1) {
        if (/^\d/.test(key) && key != 1) {
          stt++;
          col.push({
            field: key,
            headerName: `QC ${stt}`,
            width: 120,
            align: 'center',
            headerAlign: 'center',
            description: getQCStandardName(key),
            renderCell: (params) => {
              return (
                <Typography sx={{ fontSize: 14 }}>
                  {params.row.MaterialId == 999999
                    ? params.row[key] + '%'
                    : params.row[key] > 0 && params.row.NG > 0
                    ? Number(((params.row[key] * 100.0) / params.row.NG).toFixed(2)) + '%'
                    : ''}
                </Typography>
              );
            },
          });

          totalChart.push({ key: `QC ${stt}`, id: key, data: total[key] });
        }
      }

      setOptions({
        chart: {
          type: 'column',
        },
        title: {
          text: 'QC Detail',
        },
        xAxis: {
          categories: totalChart?.map((e) => e?.key),
        },
        yAxis: {
          title: {
            text: '%',
          },
          endOnTick: false,
          maxPadding: 0.05,
        },
        series: [
          {
            name: 'NG',
            data: totalChart?.map((e) => e?.data),
            lineWidth: 3,
            color: '#F31559',
          },
        ],
        credits: { enabled: false },
        exporting: { enabled: true },
      });

      if (res && isRendered) {
        setState({
          ...state,
          data: [...res.Data, total] ?? [],
        });
      }
    }
    setGridCol([...col]);
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };

  const calcTotal = (data) => {
    const top1 = data[0];

    let TotalRow = {
      MaterialId: 999999,
      MaterialCode: 'Total',
      MaterialName: '',
      Total: 0,
      OK: 0,
      NG: 0,
      NGRate: 0,
    };

    for (const key in top1) {
      if (/^\d/.test(key)) {
        TotalRow[key] = 0;
      }
    }

    data.forEach((e) => {
      TotalRow.Total += e.Total;
      TotalRow.OK += e.OK;
      TotalRow.NG += e.NG;
      TotalRow.NGRate += e.NGRate;

      for (const key in top1) {
        if (/^\d/.test(key)) {
          TotalRow[key] += e[key] != null ? e[key] : 0;
        }
      }
    });

    // TotalRow.NGRate = Number((TotalRow.NGRate / data.length).toFixed(2));
    // for (const key in top1) {
    //   if (/^\d/.test(key)) {
    //     TotalRow[key] = Number((TotalRow[key] / data.length).toFixed(2));
    //   }
    // }
    TotalRow.NGRate = Number(((TotalRow.NG * 100.0) / TotalRow.Total).toFixed(2));
    for (const key in top1) {
      if (/^\d/.test(key)) {
        TotalRow[key] = Number(((TotalRow[key] * 100.0) / TotalRow.NG).toFixed(2));
      }
    }

    return TotalRow;
  };

  const handleDownload = async () => {
    try {
      const params = {
        MaterialId: state.searchData.MaterialId,
        StartDate: moment(state.searchData.StartDate).format('YYYY-MM-DD'),
        EndDate: moment(state.searchData.EndDate).format('YYYY-MM-DD'),
        Type: state.searchData.Type == '' ? 'LOT' : state.searchData.Type,
      };

      await QMSReportService.downloadIQCRawDetail(params);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  return (
    <React.Fragment>
      <div className="p-2">
        <Grid container spacing={2} className="mb-2" justifyContent="start">
          <Grid item>
            <MuiAutocomplete
              sx={{ minWidth: '250px' }}
              label={intl.formatMessage({ id: 'material.MaterialCode' })}
              fetchDataFunc={QMSReportService?.getMaterialList}
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
                fetchData();
              }}
            />
          </Grid>
          <Grid item sx={{ marginLeft: 'auto' }}>
            <MuiButton text="download" color="warning" onClick={handleDownload} />
          </Grid>
        </Grid>
        {state?.data?.length > 0 && (
          <MuiDataGrid
            disableVirtualization
            isPagingServer={true}
            headerHeight={35}
            gridHeight={260}
            columns={gridCol}
            rows={state.data}
            page={0}
            pageSize={8}
            getRowId={(rows) => rows.MaterialId}
            getRowClassName={(params) => {
              if (params.row.MaterialId == 999999) return 'total-row-pin';
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
          <ColumnHighChart optionCustom={options} />
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default TabDetail;
