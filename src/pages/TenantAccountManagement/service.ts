import request from 'umi-request';
import { message } from 'antd';
import { TableListItem, RoleParams, UserRoleParams, TableListParams } from './data.d';

export async function createUserRoles(params: UserRoleParams) {
  return request('/api/entityuser/entityuserRole', {
    method: 'POST',
    params: {
      roleId: params?.roleId,
      userCode: params?.userCode
    }
  })
}

export async function queryRoleName(params:RoleParams) {
  return request('/api/entityuser/queryRole', {
    method: 'POST',
    params: {
      entityid: params?.entityid
    }
  })
}

export async function queryRule(params?: TableListParams) {
  let msg:any;
  let sourceData:TableListItem[] = [];
  let total:number;
  await request('/api/entityuser/selectPage', {
    method: 'POST',
    params: {
      pageNum: params?.current,
      pageSize: params?.pageSize,
      usercode: params?.usercode,
      userstatus: params?.userstatus,
      cellphone: params?.cellphone,
      realname: params?.realname,
      entityname: params?.entityname,
      entityid: params?.entityid,
      usertype: params?.usertype
    }
  }).then(res => {
    msg = res;
    sourceData = msg.data.data.list;
    total = msg.data.data.total;
  }).catch(err => {
    message.error('数据请求出错，请刷新页面后重试！');
  });
  // let sourceData:TableListItem[] = msg.data.data.list;
  return {
    data: sourceData,
    total: msg.data.data.total,
    success: true
  }
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/entityuser/updateEntityuser', {
    method: 'POST',
    params: {
      usercode: params?.usercode,
      pwd: params?.pwd,
      userstatus: params?.userstatus,
      cellphone: params?.cellphone,
      realname: params?.realname,
      entityname: params?.entityname,
      entityid: params?.entityid
    }
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/entityuser/updateEntityuser', {
    method: 'POST',
    params: {
      id: params.id,
      usercode: params?.usercode,
      pwd: params?.pwd,
      userstatus: params?.userstatus,
      cellphone: params?.cellphone,
      realname: params?.realname,
      entityname: params?.entityname,
      entityid: params?.entityid
    }
  });
}
