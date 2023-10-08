import { Chip } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useIntl } from 'react-intl';

// const MuiDataGrid = React.forwardRef((props, ref) => {
const MuiAutocomplete = React.forwardRef(({ ...props }, ref) => {
  const {
    value,
    fetchDataFunc,
    displayLabel,
    displayValue,
    displayGroup,
    onChange,
    defaultValue,
    sx,
    margin,
    disabled,
    label,
    error,
    helperText,
    variant,
    required,
    multiple,
    translationLabel,
  } = props;

  let isRendered = React.useRef(true);
  const intl = useIntl();
  let labelFomart = label;
  if (required) labelFomart += ' *';

  const [open, setOpen] = React.useState(false);
  const [isFetchData, setIsFetchData] = React.useState(true);

  const [options, setOptions] = React.useState([]);

  const loading = open && isFetchData && options.length === 0;

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    (async () => {
      const res = await fetchDataFunc();

      if (res && isRendered) {
        setIsFetchData(false);
        if (res.Data) {
          setOptions([...res.Data]);
        } else {
          setOptions([]);
        }
      }
    })();

    return () => {
      isRendered = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      setIsFetchData(true);
    }
  }, [open]);

  return (
    <React.Fragment>
      {!displayGroup ? (
        <Autocomplete
          multiple={multiple}
          disableCloseOnSelect={multiple}
          fullWidth
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          disabled={disabled}
          size="small"
          margin={margin}
          options={options}
          value={value}
          autoHighlight
          openOnFocus
          getOptionLabel={(option) => option[displayLabel]}
          renderOption={(props, option) => (
            <li {...props}>
              {translationLabel ? intl.formatMessage({ id: option[displayLabel] }) : option[displayLabel]}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                label={translationLabel ? intl.formatMessage({ id: option[displayLabel] }) : option[displayLabel]}
              />
            ))
          }
          isOptionEqualToValue={(option, value) => option[displayValue] === value[displayValue]}
          defaultValue={defaultValue ?? (multiple ? [] : null)}
          onChange={onChange}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                sx={sx ?? { mb: 0.5 }}
                variant={variant}
                label={labelFomart}
                error={error}
                helperText={helperText}
                inputProps={{
                  ...params.inputProps,
                  value: params.inputProps.value
                    ? translationLabel
                      ? intl.formatMessage({ id: params.inputProps.value })
                      : params.inputProps.value
                    : '',
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            );
          }}
          ref={ref}
        />
      ) : (
        <Autocomplete
          multiple={multiple}
          disableCloseOnSelect={multiple}
          fullWidth
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          disabled={disabled}
          size="small"
          margin={margin}
          options={options}
          value={value}
          autoHighlight
          openOnFocus
          groupBy={(option) => option[displayGroup]}
          getOptionLabel={(option) => option[displayLabel]}
          isOptionEqualToValue={(option, value) => option[displayValue] === value[displayValue]}
          defaultValue={defaultValue ?? (multiple ? [] : null)}
          onChange={onChange}
          renderOption={(props, option) => (
            <li {...props}>
              {translationLabel ? intl.formatMessage({ id: option[displayLabel] }) : option[displayLabel]}
            </li>
          )}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                sx={sx ?? { mb: 0.5 }}
                variant={variant}
                label={labelFomart}
                error={error}
                helperText={helperText}
                inputProps={{
                  ...params.inputProps,
                  value: params.inputProps.value
                    ? translationLabel
                      ? intl.formatMessage({ id: params.inputProps.value })
                      : params.inputProps.value
                    : '',
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            );
          }}
          renderGroup={(params) => {
            return (
              <div key={'group' + params.key}>
                <div
                  style={{
                    textIndent: '10px',
                    marginBottom: 10,
                    background: '#0288d1',
                  }}
                >
                  <span style={{ fontSize: 14, color: 'white' }}>{params.group}</span>
                </div>
                <div style={{ textIndent: '15px', marginBottom: 10 }}>{params.children}</div>
              </div>
            );
          }}
          ref={ref}
        />
      )}
    </React.Fragment>
  );
});

export default MuiAutocomplete;
