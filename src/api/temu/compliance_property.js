import service from "@/utils/request";

// 批量更新
export const updateCompliancePropertyForBatch = (data) => {
  return service({
    url: "/temu/compliance_property/batch",
    method: "post",
    data,
  });
};

// 获取合规属性列表
export const getCompliancePropertyList = (params) => {
  return service({
    url: "/temu/compliance_property/list",
    method: "get",
    params,
  });
};

// 同步
export const syncCompliancePropertyData = (data) => {
  return service({
    url: "/temu/compliance_property/sync",
    method: "post",
    data,
  });
};

// 获取类型列表
export const getCompliancePropertyTypeList = () => {
  return service({
    url: "/temu/compliance_property/task_type_list",
    method: "get",
  });
};
