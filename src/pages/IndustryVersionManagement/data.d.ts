// 请求返回数据的接口
interface RequestData {
  data: Datum[];
  success: boolean;
  total: number;
}

// 调用后台接口的前台接口
interface ApiListItem {
  id: number,
  rolename: string,
  roleflag: number,
  memo: string,
}
// 表格中列表项接口
export interface TableListItem {
  key?: number;
  industyTableid?:number;
  roleProps?:string;
  tenant?:string;
  industyVersionName?:string;
  menuCodes?: string;
  note?:string;
  option?:number;
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
  navigatePages?: number;
  navigatepageNums?: number;
  navigatepageNums?: number;
  pageNum?: number;  
  pageSize?: number;
  current?: number;
  roleflag?: number;
  industyVersionName?:string;
  roleProps?: number;
  prePage?:number;
}
// 更新表格所需参数
export interface UpdateTableParams {
  key?: number;
  industyVersionName?: string;
  note?: string;
}
