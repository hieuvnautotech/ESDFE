import { MuiButton, MuiDialog, MuiResetButton } from '@controls';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { roleService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { styled } from '@mui/material/styles';

const RoleSettingDialog = ({ roleId, isOpen, onClose }) => {
  const intl = useIntl();
  const [MenuList, setMenuList] = useState([]);
  const [MenuTree, setMenuTree] = useState([]);
  const [expanded, setExpanded] = useState('');
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const handleCloseDialog = () => {
    setMenuList([]);
    setMenuTree([]);
    setExpanded('');
    onClose();
  };

  const getMenus = async () => {
    const res = await roleService.getAllTreeMenu(roleId);

    if (res.HttpResponseCode === 200 && res.Data) {
      setMenuList(res.Data ?? []);
    }
  };

  const handleSaveMenu = async () => {
    const ListCheck = [];
    MenuList?.filter((x) => x.Checked == true).map((e) => {
      if (e.parentId == null && e.menuLevel == 1) {
        const index = _.findIndex(MenuList, function (o) {
          return o.parentId == e.menuId && o.Checked == true;
        });
        if (index !== -1)
          ListCheck.push({
            menuId: e.menuId,
            menuName: e.menuName,
            isPermission: e.isPermission,
          });
      } else {
        ListCheck.push({
          menuId: e.menuId,
          menuName: e.menuName,
          isPermission: e.isPermission,
        });
      }
    });
    const res = await roleService.addMenuPermission(roleId, ListCheck);

    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  useEffect(() => {
    if (isOpen) getMenus();
  }, [isOpen]);

  useEffect(() => {
    if (MenuList.length > 0) handleRenderTreeMenu();
  }, [MenuList]);

  const handleCheck = (e, menuId) => {
    const checkValue = e.target.checked;
    if (menuId != null) {
      let newArr = [...MenuList];
      const index = _.findIndex(newArr, function (o) {
        return o.menuId == menuId;
      });
      if (index !== -1) {
        //setCheck Parent
        if (checkValue) {
          handleCheckParent(index, newArr, checkValue);
        }

        handleCheckSubMenus(index, newArr, checkValue);
      }

      setMenuList(newArr);
    }
  };

  const handleCheckParent = (index, newArr, checkValue) => {
    if (newArr[index].parentId != null) {
      const indexPr = _.findIndex(newArr, function (o) {
        return o.menuId == newArr[index].parentId;
      });
      if (indexPr !== -1) {
        newArr[indexPr] = { ...newArr[indexPr], Checked: checkValue };
      }
      handleCheckParent(indexPr, newArr, checkValue);
    }
  };

  const handleCheckSubMenus = (index, newArr, checkValue) => {
    newArr[index] = { ...newArr[index], Checked: checkValue };

    newArr.forEach((item) => {
      if (item.parentId == newArr[index].menuId) {
        const indexC = _.findIndex(newArr, function (o) {
          return o.menuId == item.menuId;
        });
        handleCheckSubMenus(indexC, newArr, checkValue);
      }
    });
  };

  const handleRenderTreeMenu = () => {
    let treeMenu = [];
    let Menulv1 = MenuList.filter((x) => x.parentId == null && x.menuLevel == 1);
    for (let i = 0; i < Menulv1.length; i++) {
      let item = Menulv1[i];
      let node = createTreeMenuNode(MenuList, item);
      treeMenu.push(node);
    }
    setMenuTree(treeMenu);
  };

  function createTreeMenuNode(list, menu) {
    let treeNode = {
      menuId: menu.menuId,
      parentId: menu.parentId,
      menuName: menu.menuName,
      menuIcon: menu.menuIcon,
      isTab: menu.isTab,
      isPermission: menu.isPermission,
      Checked: menu.Checked,
      subMenus: [],
    };

    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      if (item.parentId === menu.menuId) {
        let subChild = createTreeMenuNode(list, item);
        treeNode.subMenus.push(subChild);
      }
    }

    return treeNode;
  }

  const RenderMenu = ({ nodeMenu, key }) => {
    return (
      <div style={{ marginLeft: 50 }} key={key}>
        <FormControlLabel
          control={
            <Checkbox
              checked={nodeMenu.Checked}
              onChange={(e) => handleCheck(e, nodeMenu.menuId)}
              color={nodeMenu.isTab ? 'success' : nodeMenu.isPermission ? 'warning' : 'info'}
            />
          }
          label={
            <span
              style={{
                fontWeight: '600',
                color: nodeMenu.isTab ? '#2e7d32' : nodeMenu.isPermission ? '#ed6c02' : '#1976d2',
              }}
            >
              <i class={nodeMenu.menuIcon} aria-hidden="true" style={{ marginRight: 5 }} /> {nodeMenu.menuName}
            </span>
          }
          sx={{ m: 0, height: '30px' }}
        />
        {nodeMenu.subMenus.map((child, index) => {
          return <RenderMenu nodeMenu={child} key={index} />;
        })}
      </div>
    );
  };

  const handleChange = (panel) => {
    setExpanded(expanded == panel ? '' : panel);
  };

  return (
    <MuiDialog
      maxWidth="lg"
      title={intl.formatMessage({ id: 'role.addMenu' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <div item style={{ overflowY: 'auto', maxHeight: 750, marginBottom: 20 }}>
        {MenuTree.map((item, index) => {
          return (
            <MuiAccordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={() => handleChange(`panel${index}`)}
            >
              <MuiAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ color: '#1976d2' }}>
                  <i class={item.menuIcon} aria-hidden="true" style={{ marginRight: 20 }} />
                  {item.menuName}
                </Typography>
              </MuiAccordionSummary>
              <MuiAccordionDetails sx={{ p: 0 }}>
                <FormGroup sx={{ p: 0 }}>
                  {item.subMenus.map((child, index) => {
                    return <RenderMenu nodeMenu={child} key={index} />;
                  })}
                </FormGroup>
              </MuiAccordionDetails>
            </MuiAccordion>
          );
        })}
      </div>

      <Grid item xs={12} container rowSpacing={2.5}>
        <Grid item xs={6}>
          <Stack direction="row" spacing={1}>
            <Chip label="Menu" color="primary" />
            <Chip label="Tab" color="success" />
            <Chip label="Permission" color="warning" />
          </Stack>
        </Grid>
        <Grid item xs={6} container direction="row-reverse">
          <MuiButton onClick={handleSaveMenu} text="save" color="info" loading={dialogState.isSubmit} />
          <MuiResetButton onClick={getMenus} disabled={dialogState.isSubmit} />
        </Grid>
      </Grid>
    </MuiDialog>
  );
};

const MuiAccordion = styled(Accordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  margin: '0 !important',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
  '.Mui-expanded': {
    margin: '0 !important',
  },
}));

const MuiAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
    margin: 0,
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const MuiAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default RoleSettingDialog;
