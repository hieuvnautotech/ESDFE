import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exportData from 'highcharts/modules/export-data';
import exporting from 'highcharts/modules/exporting';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
Chart.register(CategoryScale);
exporting(Highcharts);
exportData(Highcharts);

const ColumnHighChart = ({ data, yAxisTitle, OQCCheck, optionCustom }) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (data) {
      if (OQCCheck) {
        setOptions({
          chart: {
            type: 'column',
          },
          title: {
            text: 'Column 6 Days',
          },
          xAxis: {
            categories: data?.map((e) => moment(e?.Date).format('YYYY-MM-DD')),
          },
          yAxis: {
            title: {
              text: yAxisTitle ?? 'EA',
            },
          },
          series: [
            {
              name: 'Total OQC',
              data: data?.map((e) => e?.TotalQty1),
              lineWidth: 3,
              color: '#0DE0C8',
            },
            {
              name: 'OK OQC',
              data: data?.map((e) => e?.OKQty1),
              lineWidth: 3,
              color: '#18ED02',
            },
            {
              name: 'NG OQC',
              data: data?.map((e) => e?.NGQty1),
              lineWidth: 3,
              color: '#F43AC8',
            },
            {
              name: 'Total Packing',
              data: data?.map((e) => e?.TotalQty2),
              lineWidth: 3,
              color: '#0B666A',
            },
            {
              name: 'OK Packing',
              data: data?.map((e) => e?.OKQty2),
              lineWidth: 3,
              color: '#F1C93B',
            },
            {
              name: 'NG Packing',
              data: data?.map((e) => e?.NGQty2),
              lineWidth: 3,
              color: '#FF6666',
            },
          ],
          credits: { enabled: false },
          exporting: { enabled: true },
        });
      } else {
        setOptions({
          chart: {
            type: 'column',
          },
          title: {
            text: 'Status (Day)',
          },
          xAxis: {
            categories: data?.map((e) => moment(e?.Date).format('MM.DD')),
          },
          yAxis: {
            title: {
              text: yAxisTitle ?? 'EA',
            },
            endOnTick: false,
            maxPadding: 0.05,
          },
          series: [
            {
              name: 'GOOD',
              data: data?.map((e) => e?.OKQty),
              lineWidth: 3,
              color: '#82CD47',
            },
            {
              name: 'NG',
              data: data?.map((e) => e?.NGQty),
              lineWidth: 3,
              color: '#F31559',
            },
          ],
          credits: { enabled: false },
          exporting: { enabled: true },
        });
      }
    }
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={optionCustom ?? options} />;
};

export default ColumnHighChart;
