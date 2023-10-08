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

const LineHighChart = ({ data, yAxisTitle, OQCCheck }) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (data) {
      setOptions({
        chart: {
          type: 'line',
        },
        title: {
          text: 'Line Chart',
        },
        xAxis: {
          categories: data?.map((ele) => ele?.woCode),
        },
        yAxis: {
          title: {
            text: '',
          },
        },
        series: [
          {
            name: 'Plan',
            data: data?.map((ele) => ele?.target),
            lineWidth: 3,
            color: '#0DE0C8',
          },
          {
            name: 'OK',
            data: data?.map((ele) => ele?.okQty),
            lineWidth: 3,
            color: '#18ED02',
          },
          {
            name: 'NG',
            data: data?.map((ele) => ele?.ngQty),
            lineWidth: 3,
            color: '#F43AC8',
          },
        ],
        credits: { enabled: false },
        exporting: { enabled: true },
      });
    }
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineHighChart;
