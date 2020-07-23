/* 创建表单组件的接口 */
/* ***************************************************************************** */
// 创建用户的组件接收的props接口
export interface CreateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  createModalVisible: boolean;
  allEntity: string[];
  isSuccess: (val:boolean) => void;
}
// 用户所填表单接口
// 兼创建成功后返回数据的接口
export interface FormValueType {
  userstatus?: number;
  realname?: string;
  usercode?: string;
  cellphone?: number;
  pwd?: string;
  id?: string;
  entityname?: string;
  entityid?: string;
}
/* ***************************************************************************** */

// 修改表单组件的接口
/* ***************************************************************************** */
// 接收的props接口
export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  allEntity: string[];
  isSuccess: (val:boolean) => void;
}

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}
/* ***************************************************************************** */

export interface UserRoleParams {
  roleId?: number;
  userCode?: string;
}
// 租户角色的接口
export interface TatentListItem {
  id: number;
  entityname: string;
  entityid: number;
}

// 重置密码的接口
export interface ResetParams {
  id?: number;
  usercode?: string;
  pwd?: string;
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
