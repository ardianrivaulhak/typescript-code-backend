export type TDataTableParam = {
  search?: string;
  page?: number;
  limit?: number;
  filter?: string;
};

export type TDataTableParamFilterDate = {
  search?: string;
  page?: number;
  limit?: number;
  filterDate?: string;
};

export type TDataAssignRoleAccess = {
  accessId: string;
  permissionsId: string;
  status: boolean;
};

export type TDataTableParamFilter = {
  search?: string;
  page?: number;
  limit?: number;
  filterDate?: string;
  sort?: string;
  sort_line?: string;
};

export type TDataTableSession = {
  userId: string;
  machineId: string;
  shiftId?: string;
};

export type TPaginationParam = {
  search?: string;
  page?: number;
  limit?: number;
};

export type TPagination = {
  search?: string;
  page?: number;
  limit?: number;
  line?: string[];
  method?: string[];
  machine?: string[];
  position?: string[];
  filter?:{
    orderBy?: string;
    sortBy?: "asc" | "desc";
  };
}
