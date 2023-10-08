import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';

import { debounce } from 'lodash';
import { OutlinedInput } from '@mui/material';

const MuiSearchInput = React.forwardRef((props, ref) => {
  const intl = useIntl();
  const { label, name, type, value, disabled, onClick, onChange, defaultValue } = props;

  let timer;

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      // console.log('value', e.target.value);
      onClick();
    }
  };

  const handleChange = () => {
    timer = setTimeout(() => onChange(), 200);
  };

  useEffect(() => {
    // if (inputRef) {
    //   timer = setTimeout(() => lotInputRef.current.focus(), 500);
    // }

    return () => {
      if (timer) {
        console.log('clear timer');
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <FormControl sx={{ mb: 0.5, width: '100%' }} variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        {intl.formatMessage({ id: label })}
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={type || 'text'}
        disabled={disabled}
        name={name}
        value={value}
        onKeyDown={keyPress}
        onChange={onChange}
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={intl.formatMessage({ id: 'general.search' })}
              onMouseDown={handleMouseDown}
              onClick={onClick}
              edge="end"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        label={intl.formatMessage({ id: label })}
      />
    </FormControl>
  );
});

export default MuiSearchInput;
