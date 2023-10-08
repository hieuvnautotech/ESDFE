import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField, MuiDateField } from '@controls';
import { Grid, Tooltip, Typography } from '@mui/material';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { KPIQCService, bomService, QCReportService, QCFQCReportService } from '@services';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDays } from '@utils';
import ColumnHighChart from '../ColumnHighChart';
import moment from 'moment';

const FQCDetail = ({ QCStandard }) => {
  let isRendered = useRef(true);
  const date = new Date();
  const handle = useFullScreenHandle();
  const intl = useIntl();
  const [options, setOptions] = useState(null);

  const [state, setState] = useState({
    data: [],
    chart: [],
    searchData: {
      ProjectId: '',
      ModelId: '',
      Products: '',
      StartDate: addDays(date, -7),
      EndDate: date,
    },
  });

  const columns = [
    {
      field: 'ModelCode',
      headerName: intl.formatMessage({ id: 'product.Model' }),
      width: 130,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'product.product_code' }),
      width: 130,
    },
    {
      field: 'TotalQty',
      headerName: 'Total',
      width: 90,
      type: 'number',
    },
    {
      field: 'OKQty',
      headerName: 'Good',
      width: 90,
      type: 'number',
    },
    {
      field: 'NGQty',
      headerName: 'NG',
      width: 90,
      type: 'number',
    },
    {
      field: 'NGRate',
      headerName: 'NG Rate',
      width: 90,
      type: 'number',
      valueFormatter: (params) => params?.value + '%',
    },
  ];

  const [gridCol, setGridCol] = useState([...columns]);

  useEffect(() => {
    fetchData();
  }, [state.searchData]);

  const getQCStandardName = (Id) => {
    const item = QCStandard.find((x) => x.QCStandardId == Id);
    return item?.QCName ?? '';
  };

  async function fetchData() {
    const params = {
      ModelId: state.searchData.ModelId,
      Products: state.searchData.Products,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
    };
    const res = await QCFQCReportService.getFQCDetail(params);

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
            headerName: getQCStandardName(key),
            width: 120,
            align: 'center',
            headerAlign: 'center',
            description: getQCStandardName(key),
            renderCell: (params) => {
              return (
                <Typography sx={{ fontSize: 14 }}>
                  {params.row.stt == 999999
                    ? params.row[key] + '%'
                    : params.row[key] > 0 && params.row.TotalDetail > 0
                    ? Number(((params.row[key] * 100.0) / params.row.TotalDetail).toFixed(2)) + '%'
                    : ''}
                </Typography>
              );
            },
          });

          totalChart.push({ key: getQCStandardName(key), id: key, data: total[key] });
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
      stt: 999999,
      ModelCode: 'Total & Average',
      ProductCode: '',
      TotalQty: 0,
      OKQty: 0,
      NGQty: 0,
      NGRate: 0,
    };

    if (data.length > 0) {
      for (const key in top1) {
        if (/^\d/.test(key)) {
          TotalRow[key] = 0;
        }
      }

      data.forEach((e) => {
        TotalRow.TotalQty += e.TotalQty;
        TotalRow.OKQty += e.OKQty;
        TotalRow.NGQty += e.NGQty;

        for (const key in top1) {
          if (/^\d/.test(key)) {
            TotalRow[key] += e[key] != null ? e[key] : 0;
          }
        }
      });

      TotalRow.NGRate = Number(((TotalRow.NGQty * 100.0) / TotalRow.TotalQty).toFixed(2));
      for (const key in top1) {
        if (/^\d/.test(key)) {
          TotalRow[key] = Number(((TotalRow[key] * 100.0) / TotalRow.NGQty).toFixed(2));
        }
      }
    }
    return TotalRow;
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

      await QCFQCReportService.downloadAPPDetail(params);
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
              displayLabel="ProductCode"
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
            <MuiButton text="search" color="info" onClick={() => fetchData()} sx={{ mt: 1 }} />
          </Grid>
          <Grid item sx={{ marginLeft: 'auto' }}>
            <MuiButton text="download" color="warning" onClick={handleDownload} sx={{ mt: 1 }} />
          </Grid>
        </Grid>
        {state?.data?.length > 0 && (
          <MuiDataGrid
            isPagingServer={true}
            headerHeight={35}
            gridHeight={260}
            columns={gridCol}
            rows={state.data}
            page={0}
            pageSize={8}
            getRowId={(rows) => rows.stt}
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
          <ColumnHighChart optionCustom={options} />
        </Grid>
      </FullScreen>
    </React.Fragment>
  );
};

export default FQCDetail;
