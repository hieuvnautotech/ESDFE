import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grow,
  IconButton,
  Paper,
  Slide,
  Zoom,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import CloseIcon from '@mui/icons-material/Close';
import ReactToPrint from 'react-to-print';
import Draggable from 'react-draggable';
import ShortUniqueId from 'short-unique-id';
import PrintIcon from '@mui/icons-material/Print';

const Transition_Zoom = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const Transition_Fade = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

const Transition_Grow = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});
const Transition_Slide_Down = React.forwardRef(function Transition(props, ref) {
  return <Slide ref={ref} {...props} />;
});

const uid = new ShortUniqueId();

export const MuiDialog = ({
  isOpen,
  onClose,
  title,
  disable_animate,
  maxWidth,
  disabledCloseBtn,
  isShowButtonPrint,
  ...others
}) => {
  const { animate } = others;

  const [dialogId, setDialogId] = React.useState(uid());
  const [data, setData] = useState({});
  const componentPringtRef = React.useRef();
  const intl = useIntl();
  const PaperComponent = React.useCallback((props) => {
    return (
      <Draggable handle={`#draggable-dialog-${dialogId}`} cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  }, []);

  const handleClose = (event, reason) => {
    if (
      reason === 'backdropClick'
      // || reason === 'escapeKeyDown'
    ) {
      onClose();
      //console.log(reason);
      return;
    } else {
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      setData({});
    };
  }, [isOpen]);

  return (
    <Dialog
      TransitionComponent={
        animate === 'fade'
          ? Transition_Fade
          : animate === 'grow'
          ? Transition_Grow
          : animate === 'slide_down'
          ? Transition_Slide_Down
          : Transition_Zoom
      }
      transitionDuration={disable_animate || data[dialogId]?.disable_animate === true ? disable_animate : 250}
      PaperComponent={PaperComponent}
      aria-labelledby={`draggable-dialog-${dialogId}`}
      fullWidth
      maxWidth={maxWidth ?? 'md'}
      open={isOpen}
      onClose={handleClose}
      {...others}
    >
      <DialogTitle
        sx={{
          cursor: 'move',
          textTransform: 'uppercase',
          color: '#0071ba',
          // paddingBottom: '15px',
        }}
      >
        {title}
        {isShowButtonPrint && (
          <ReactToPrint
            trigger={() => {
              return (
                <Button variant="contained" color="primary" sx={{ float: 'right' }} startIcon={<PrintIcon />}>
                  {intl.formatMessage({ id: 'general.print' })}
                </Button>
              );
            }}
            content={() => componentPringtRef.current}
          />
        )}
        <IconButton
          disabled={disabledCloseBtn}
          sx={{
            top: '-12px',
            right: '-12px',
            color: 'cornflowerblue',
            borderRadius: '50%',
            position: 'absolute',
            backgroundColor: '#CCCCCC',
            width: '35px',
            height: '35px',
            '&:hover': {
              backgroundColor: 'aliceblue',
              color: 'red',
            },
            '&:disabled': {
              backgroundColor: 'aliceblue',
            },
          }}
          onClick={handleClose}
          color="primary"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent ref={componentPringtRef}>{others.children}</DialogContent>
    </Dialog>
  );
};

export default MuiDialog;
// const mapStateToProps = (state) => ({})

// const mapDispatchToProps = {}

// export default connect(mapStateToProps, mapDispatchToProps)(MuiDialog)
