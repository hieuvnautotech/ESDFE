import moment from 'moment';
const ProductDto = {
  ProductId: 0,
  ProductCode: '',
  ProductName: '',
  Model: 0,
  ProjectName: '',
  SSVersion: '',
  ProductType: 0,
  Description: '',
  PackingAmount: 0,
  ExpiryMonth: 0,
  Temperature: '',
  Vendor: '',
  Stamps: '',
  Description: '',
  isActived: true,
  createdBy: null,
  modifiedBy: null,
  createdDate: moment(),
  modifiedDate: moment(),
  row_version: null,

  ModelId: '',
  ModelName: '',
};

export default ProductDto;
