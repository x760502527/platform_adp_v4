export interface UserRoleParams {
  roleId?: number;
  userCode?: string;
}

export interface RoleParams {
  entityid?: string
}

export interface TableListItem {
  id: number;
  entityname: string;
  usercode: string;
  realname: string;
  cellphone: number;
  userstatus: number;
  entityid: number;
  pwd?: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  id?: number;
  userstatus?: number;
  pageSize?: number;
  current?: number;
  usercode?: string;
  cellphone?: number;
  realname?: string;
  entityname?: string;
  entityid?: string;
  usertype?: number;
  pwd?: string;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
