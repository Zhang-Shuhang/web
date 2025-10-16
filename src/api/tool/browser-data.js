import service from "@/utils/request";

export const updateLoginSetting = (data) => {
  return service({
    url: "/core/setting/update",
    method: "post",
    data,
  });
};

export const loadLoginSetting = (params) => {
  return service({
    url: "/core/setting/load",
    method: "get",
    params,
  });
};
