import { MuiDataGrid, MuiDialog } from '@controls';
import { Grid } from '@mui/material';
import { QCReportService } from '@services';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const ProductDialog = ({ search, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [DataList, setDataList] = useState([]);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.SemiLotCode) + 1,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.7,
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      flex: 0.5,
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      flex: 0.4,
    },
    {
      field: 'Check',
      headerName: intl.formatMessage({ id: 'general.checkqc' }),
      flex: 0.4,
    },
  ];

  //useEffect
  useEffect(() => {
    if (isOpen) fetchData();
    return () => {
      isRendered = false;
    };
  }, [isOpen]);

  async function fetchData() {
    const res = await QCReportService.getPQCGeneralView(search);

    if (res && isRendered) setDataList(res.Data);
  }

  return (
    <MuiDialog
      maxWidth="lg"
      title={intl.formatMessage({ id: 'general.view' })}
      isOpen={isOpen}
      disable_animate={300}
      onClose={onClose}
    >
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <MuiDataGrid
            isPagingServer={true}
            headerHeight={45}
            columns={columns}
            rows={DataList}
            page={1}
            pageSize={10}
            getRowId={(rows) => rows.SemiLotCode}
            hideFooter
          />
        </Grid>
      </Grid>
    </MuiDialog>
  );
};

export default ProductDialog;
