import * as loginService from './Login/LoginService';
import * as menuService from './Standard/Configuration/MenuService';
import * as permissionService from './Standard/Configuration/PermissionService';
import * as userService from './Standard/Configuration/UserService';
import * as commonService from './Standard/Configuration/CommonService';
import * as roleService from './Standard/Configuration/RoleService';
import * as versionAppService from './Standard/Configuration/VersionAppService';
import * as documentService from './Standard/Configuration/DocumentService';
import * as staffService from './Standard/Information/StaffService';
import * as materialService from './Standard/Information/MaterialService';
import * as moldService from './Standard/Information/MoldService';
import * as buyerService from './Standard/Information/BuyerService';
import * as supplierService from './Standard/Information/SupplierService';
import * as lineService from './Standard/Information/LineService';
import * as bomService from './Standard/Information/BomService';
import * as productService from './Standard/Information/ProductService';
import * as ModelService from './Standard/Information/ModelService';
import * as BladeService from './Standard/Information/BladeService';
import * as IQCReceivingService from './WMS/Material/IQCReceivingService';
import * as locationService from './Standard/Information/LocationService';
import * as MaterialPutAwayService from './WMS/Material/MaterialPutAwayService';
import * as MaterialSOService from './WMS/Material/MaterialSOService';
import * as QCFrequencyService from './QMS/StandardQC/QCFrequencyService';
import * as QCItemService from './QMS/StandardQC/QCItemService';
import * as QCStandardService from './QMS/StandardQC/QCStandardService';
import * as QCToolService from './QMS/StandardQC/QCToolService';
import * as QCTypeService from './QMS/StandardQC/QCTypeService';
import * as qcAPPService from './QMS/QCSOP/QCAPPService';
import * as qcIQCService from './QMS/QCSOP/QCIQCService';
import * as qcOQCService from './QMS/QCSOP/QCOQCService';
import * as qcPQCService from './QMS/QCSOP/QCPQCService';
import * as MaterialStockService from './WMS/Material/MaterialStockService';
import * as MaterialReturnService from './WMS/Material/MaterialReturnService';
import * as SlitPutAwayService from './Slit/SlitPutAwayService';
import * as SelectOptionService from './System/SelectOptionService';
import * as SlitSOService from './Slit/SlitSOService';
import * as SlitStockService from './Slit/SlitStockService';
import * as ReturnMaterialService from './Slit/ReturnMaterialService';
import * as SplitSizeService from './Slit/SplitSizeService';
import * as SlitOrderService from './Slit/SlitOrderService';
import * as POService from './Standard/Information/POService';
import * as RoutingService from './Standard/Information/RoutingService';
import * as wipReceivingService from './WMS/WIP/WIPReceivingService';
import * as WIPStockService from './WMS/WIP/WIPStockService';
import * as WIPReturnService from './WMS/WIP/WIPReturnService';
import * as WOService from './MMS/WOService';
import * as qcMoldService from './QMS/QCSOP/QCMoldService';
import * as FQCRoutingService from './FQC/FQCRoutingService';
import * as LineStockService from './MMS/LineStockService';
import * as SplitMergeService from './WMS/Material/SplitMergeService';
import * as MMSReturnMaterialService from './MMS/MMSReturnMaterialService';
import * as QMSReportService from './QMS/QMSReport/QMSReportService';
import * as QCReportService from './QMS/QMSReport/QCReportService';
import * as QCFQCReportService from './QMS/QMSReport/QCFQCReportService';
import * as FQCReceivingService from './FQC/FQCReceivingService';
import * as FQCOQCService from './FQC/FQCOQCService';
import * as ActualService from './FQC/ActualService';
import * as Q2ManagementService from './KPI/Q2ManagementService';
import * as FQCStockService from './FQC/FQCStockService';
import * as FQCShippingService from './FQC/FQCShippingService';
import * as BuyerQRService from './FQC/BuyerQRService';
import * as BuyerMappingService from './FQC/BuyerMappingService';
import * as FGReceivingService from './WMS/FG/FGReceivingService';
import * as FGMappingService from './WMS/FG/FGMappingService';
import * as FGStockService from './WMS/FG/FGStockService';
import * as FGShippingOrderService from './WMS/FG/FGShippingOrderService';
import * as HoldRawMaterialService from './QMS/Holding/HoldRawMaterialService';
import * as HoldLogService from './QMS/Holding/HoldLogService';
import * as HoldMaterialService from './QMS/Holding/HoldMaterialService';
import * as HoldFinishGoodService from './QMS/Holding/HoldFinishGoodService';
import * as HoldSemiLotService from './QMS/Holding/HoldSemiLotService';
import * as HistoryStatusService from './History/StatusService';
import * as HistoryReplacementSemiLotService from './History/HistoryReplacementSemiLotService';
import * as LotTrackingService from './History/LotTrackingService';
import * as SlitReceivingService from './Slit/SlitReceivingService';
import * as KPIEffectiveService from './KPI/KPIEffectiveService';
import * as KIPQCIQCService from './KPI/KPIQCIQCService';
import * as KPIQCService from './KPI/KPIQCService';

export {
  SelectOptionService,
  loginService,
  menuService,
  permissionService,
  userService,
  commonService,
  roleService,
  versionAppService,
  documentService,
  staffService,
  materialService,
  moldService,
  buyerService,
  supplierService,
  lineService,
  bomService,
  productService,
  ModelService,
  RoutingService,
  BladeService,
  IQCReceivingService,
  locationService,
  MaterialPutAwayService,
  MaterialSOService,
  QCFrequencyService,
  QCItemService,
  QCStandardService,
  QCToolService,
  QCTypeService,
  qcAPPService,
  qcIQCService,
  qcOQCService,
  qcPQCService,
  MaterialStockService,
  MaterialReturnService,
  SlitPutAwayService,
  SlitSOService,
  SlitStockService,
  ReturnMaterialService,
  SlitOrderService,
  POService,
  wipReceivingService,
  WIPStockService,
  WIPReturnService,
  WOService,
  qcMoldService,
  FQCRoutingService,
  LineStockService,
  SplitMergeService,
  MMSReturnMaterialService,
  QMSReportService,
  QCReportService,
  QCFQCReportService,
  FQCReceivingService,
  ActualService,
  FQCOQCService,
  Q2ManagementService,
  FQCStockService,
  FQCShippingService,
  BuyerQRService,
  BuyerMappingService,
  FGReceivingService,
  FGMappingService,
  FGStockService,
  FGShippingOrderService,
  SlitReceivingService,
  KPIEffectiveService,
  KIPQCIQCService,
  SplitSizeService,
  KPIQCService,
  //QMS - HOLDING
  HoldRawMaterialService,
  HoldMaterialService,
  HoldFinishGoodService,
  HoldSemiLotService,
  HoldLogService,

  //History
  HistoryReplacementSemiLotService,
  LotTrackingService,
  HistoryStatusService,
};
