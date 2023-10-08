import moment from 'moment';

const SupplierDto = {
  SupplierId: 0,
  SupplierCode: '',
  SupplierName: '',
  Address: '',
  Tax: '',
  Fax: '',
  Email: '',
  PhoneNumber: '',
  Website: '',
  Description: '',
  SupplierType: '',
  DateSignContract: null,
  DebtDate: null,
  isActived: true,
  createdDate: moment.utc(),
  createdBy: 0,
  modifiedDate: moment.utc(),
  modifiedBy: 0,
  row_version: null,
};

export default SupplierDto;
