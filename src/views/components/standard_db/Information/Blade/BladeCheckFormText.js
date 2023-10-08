import React from 'react';

import { MuiDataGrid } from '@controls';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { dateToTicks, ErrorAlert } from '@utils';
import { useIntl } from 'react-intl';

const BladeCheckFormText = (props) => {
  const {
    bladeCheckForm,
    setBladeCheckForm,
    pageText,
    setPageText,
    pageTextSize,
    setPageTextSize,
    disableText,
    setDisableText,
    tabCheckNo,
  } = props;
  const intl = useIntl();

  const columnsText = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.QCDetailTextId) + 1,
    },

    {
      field: 'QCTypeName',
      headerName: intl.formatMessage({ id: 'mold.QCTypeIdName' }),
      width: 300,
    },

    {
      field: 'QCItemName',
      headerName: intl.formatMessage({ id: 'mold.QCItemIdName' }),
      width: 300,
    },

    {
      field: 'QCStandardName',
      headerName: intl.formatMessage({ id: 'mold.QCStandardIdName' }),
      width: 300,
    },

    {
      field: 'QCToolName',
      headerName: intl.formatMessage({ id: 'mold.QCToolIdName' }),
      width: 300,
    },

    {
      field: 'TextValue',
      headerName: '',
      width: 120,
      // editable: tabCheckNo == 0,
      renderCell: (params) => {
        return (
          <FormControl fullWidth>
            <InputLabel id="check-result">Result</InputLabel>
            <Select
              labelId="check-result"
              id="check-result"
              value={params.row?.TextValue ?? ''}
              label="Result"
              onChange={(e, value) => {
                handleRowTextUpdate(params.row, value?.props);
              }}
            >
              <MenuItem value="OK">OK</MenuItem>
              <MenuItem value="NG">NG</MenuItem>
            </Select>
          </FormControl>
        );
      },
    },
  ];

  const handleRowTextUpdate = async (newRow, data) => {
    const index = bladeCheckForm.BladeCheckDetailTextDtos.findIndex(
      (item) => item.QCDetailTextId === newRow.QCDetailTextId
    );

    const updatedArray = [...bladeCheckForm.BladeCheckDetailTextDtos];

    if (index !== -1) {
      if (updatedArray[index].BladeCheckMasterId === 0 || !updatedArray[index].BladeCheckMasterId) {
        updatedArray[index] = {
          ...updatedArray[index],
          BladeCheckMasterId: bladeCheckForm.BladeCheckMasterId,
        };
      }

      if (updatedArray[index].BladeCheckDetailTextId === 0 || !updatedArray[index].BladeCheckDetailTextId) {
        updatedArray[index] = {
          ...updatedArray[index],
          BladeCheckDetailTextId: dateToTicks(new Date()),
        };
      }

      // updatedArray[index] = { ...updatedArray[index], TextValue: newRow.TextValue ? newRow.TextValue.trim() : null };
      updatedArray[index] = { ...updatedArray[index], TextValue: data.value ? data.value?.trim() : null };
      setBladeCheckForm({
        ...bladeCheckForm,
        BladeCheckDetailTextDtos: [...updatedArray],
      });
    }

    setDisableText(true);

    return newRow;
  };

  const handleProcessRowTextUpdateError = React.useCallback((error) => {
    console.log('update error', error);
    ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
  }, []);

  return (
    <Grid xs={12}>
      <MuiDataGrid
        // showLoading={false}
        headerHeight={45}
        // rowHeight={30}
        gridHeight={736}
        columns={columnsText}
        rows={bladeCheckForm.BladeCheckDetailTextDtos}
        page={pageText - 1}
        pageSize={pageTextSize}
        rowCount={bladeCheckForm.BladeCheckDetailTextDtos.length}
        onPageChange={(newPage) => {
          setPageText(newPage + 1);
        }}
        getRowId={(rows) => rows.QCDetailTextId}
        // onSelectionModelChange={(newSelectedRowId) => handleRowSelection(newSelectedRowId)}
        onPageSizeChange={(newPageSize) => {
          setPageTextSize(newPageSize);
          setPageText(1);
        }}
        rowsPerPageOptions={[5, 10, 15]}
        // processRowUpdate={handleRowTextUpdate}
        // //isCellEditable={(params) => params.row.Id}
        // onProcessRowUpdateError={handleProcessRowTextUpdateError}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Grid>
  );
};

export default BladeCheckFormText;
