import React, { useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CropFreeIcon from '@mui/icons-material/CropFree';
import { styled } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Tooltip } from '@mui/material';
import { useIntl } from 'react-intl';

const MuiIconButton = React.forwardRef((props, ref) => {
  const { icon, text, variant, color, onClick, disabled, type, ...others } = props;
  const intl = useIntl();
  const str = `general.${text.toLowerCase()}`;
  const iconName = icon ?? text;

  const renderIcon = () => {
    switch (iconName.toLowerCase()) {
      case 'create':
        return <AddIcon fontSize="inherit" />;
      case 'add':
      case 'mapping':
        return <AddIcon fontSize="inherit" />;
      case 'modify':
      case 'update':
      case 'save':
        return <SaveIcon fontSize="inherit" />;
      case 'copy':
        return <ContentCopyIcon fontSize="inherit" />;
      case 'edit':
        return <EditIcon fontSize="inherit" />;
      case 'search':
        return <SearchIcon fontSize="inherit" />;
      case 'cancel':
        return <BlockIcon fontSize="inherit" />;
      case 'download':
        return <FileDownloadIcon fontSize="inherit" />;
      case 'excel':
        return <FileDownloadIcon fontSize="inherit" />;
      case 'print':
        return <LocalPrintshopIcon fontSize="inherit" />;
      case 'scan':
        return <CropFreeIcon fontSize="inherit" />;
      case 'upload':
        return <FileUploadIcon fontSize="inherit" />;
      case 'split':
        return <SplitscreenIcon fontSize="inherit" />;
      case 'view':
        return <VisibilityIcon fontSize="inherit" />;
      case 'undo':
        return <UndoIcon fontSize="inherit" />;
      case 'pass':
        return <CheckIcon fontSize="inherit" />;
      case 'pick':
        return <PlaylistAddIcon fontSize="inherit" />;
      case 'reset':
        return <AutorenewIcon fontSize="inherit" />;
      case 'checkqc':
        return <CheckBoxIcon fontSize="inherit" />;
      default:
        return <DeleteIcon fontSize="inherit" />;
    }
  };

  const renderColor = () => {
    switch (color) {
      case 'error':
        return 'red';
      case 'warning':
        return '#ed6c02';
      case 'primary':
        return '#1976d2';
      case 'secondary':
        return '#9c27b0';
      case 'success':
        return '#2e7d32';
      case 'action':
        return '#0000008a';
      default:
        return '#d32f2f';
    }
  };

  useImperativeHandle(ref, () => ({}));

  return (
    <IconButton
      color={color}
      size="small"
      sx={[{ '&:hover': { border: `1px solid ${renderColor()}` } }]}
      disabled={disabled}
      onClick={onClick}
      {...others}
    >
      <Tooltip title={intl.formatMessage({ id: str })} placement="top">
        {renderIcon()}
      </Tooltip>
    </IconButton>
  );
});

export default MuiIconButton;
