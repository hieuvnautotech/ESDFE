import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { IconButton } from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const CheckboxPrint = React.forwardRef(({ ...props }, ref) => {
  return (
    <Checkbox
      icon={
        <IconButton
          aria-label="print"
          size="small"
          sx={[{ '&:hover': { border: '1px solid #9c27b0' }, color: '#000000' }]}
          onClick={() => handlePrint(params.row)}
        >
          <LocalPrintshopIcon fontSize="inherit" />
        </IconButton>
      }
      checkedIcon={
        <IconButton
          aria-label="print"
          size="small"
          sx={[{ '&:hover': { border: '1px solid #9c27b0' }, color: '#da00ff' }]}
        >
          <LocalPrintshopIcon fontSize="inherit" />
        </IconButton>
      }
      {...props}
    />
  );
});

export default CheckboxPrint;
