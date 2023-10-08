import moment from 'moment';

const MoldDto = {
  MoldId: 0,
  MoldCode: '',
  MoldName: '',
  MoldSerial: '',
  ProductCode: '',
  LineType: '',
  MoldStatus: '',
  CurrentNumber: 0,
  MaxNumber: 0,
  PeriodNumber: 0,
  ProductionDate: moment(),
  Remark: '',
  SupplierId: 0,
  QCMasterId: 0,
  CheckNo: 0,
  QCMasterId: 0,
  MoldType: 0,
  MoldTypeName: '',

  isActived: true,
  createdDate: moment(),
  createdBy: 0,
  modifiedDate: null,
  modifiedBy: null,
  row_version: null,
  MoldVersion: '',
  //additional props,
  ProductId: 0,
  MoldStatusName: '',
  SupplierName: '',
  QCMasterName: '',
  Products: [],
  LineTypes: [],
};

export default MoldDto;
