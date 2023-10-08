import React from 'react';

import { MuiDataGrid } from '@controls';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';

import { dateToTicks, ErrorAlert } from '@utils';
import { useIntl } from 'react-intl';

const MoldCheckFormText = (props) => {
  const {
    moldCheckForm,
    setMoldCheckForm,
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
      headerName: intl.formatMessage({ id: 'mold.QCId_TypeName' }),
      width: 300,
    },

    {
      field: 'QCItemName',
      headerName: intl.formatMessage({ id: 'mold.QCId_ItemName' }),
      width: 300,
    },

    {
      field: 'QCStandardName',
      headerName: intl.formatMessage({ id: 'mold.QCId_StandardName' }),
      width: 300,
    },

    {
      field: 'QCToolName',
      headerName: intl.formatMessage({ id: 'mold.QCId_ToolName' }),
      width: 300,
    },

    {
      field: 'TextValue',
      headerName: '',
      width: 300,
      editable: tabCheckNo == 0,
      renderCell: (params) => {
        return (
          <TextField
            variant="standard"
            fullWidth
            disabled={disableText}
            value={params.row.TextValue ?? ''}
            inputProps={{
              onDoubleClick: () => {
                setDisableText(false);
              },
            }}
          />
        );
      },
    },
  ];

  const handleRowTextUpdate = async (newRow) => {
    const index = moldCheckForm.MoldCheckDetailTextDtos.findIndex(
      (item) => item.QCDetailTextId === newRow.QCDetailTextId
    );

    const updatedArray = [...moldCheckForm.MoldCheckDetailTextDtos];

    if (index !== -1) {
      if (updatedArray[index].MoldCheckMasterId === 0 || !updatedArray[index].MoldCheckMasterId) {
        updatedArray[index] = {
          ...updatedArray[index],
          MoldCheckMasterId: moldCheckForm.MoldCheckMasterId,
        };
      }

      if (updatedArray[index].MoldCheckDetailTextId === 0 || !updatedArray[index].MoldCheckDetailTextId) {
        updatedArray[index] = {
          ...updatedArray[index],
          MoldCheckDetailTextId: dateToTicks(new Date()),
        };
      }

      updatedArray[index] = { ...updatedArray[index], TextValue: newRow.TextValue ? newRow.TextValue.trim() : null };

      setMoldCheckForm({
        ...moldCheckForm,
        MoldCheckDetailTextDtos: [...updatedArray],
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
        rows={moldCheckForm.MoldCheckDetailTextDtos}
        page={pageText - 1}
        pageSize={pageTextSize}
        rowCount={moldCheckForm.MoldCheckDetailTextDtos.length}
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
        processRowUpdate={handleRowTextUpdate}
        //isCellEditable={(params) => params.row.Id}
        onProcessRowUpdateError={handleProcessRowTextUpdateError}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Grid>
  );
};

export default MoldCheckFormText;
