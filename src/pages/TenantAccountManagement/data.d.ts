export interface TableListItem {
  id: number;
  entityname: string;
  usercode: string;
  realname: string;
  cellphone: number;
  userstatus: number;
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
  userstatus?: number;
  pageSize?: number;
  current?: number;
  usercode?: string;
  cellphone?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
