import request from 'umi-request';
import { message } from 'antd';
import { TableListItem, RoleParams, UserRoleParams, TableListParams } from './data.d';

// 获取默认用户角色
export async function getDefaultRole(userCode:string) {
  return request('/api/entityuser/queryUserRole', {
    method: 'POST',
    params: {
      userCode
    }
  })
}
// 查询单个用户信息
export async function querySingalUserInfo(id:number) {
  return request('/api/entityuser/queryEntityuser', {
    method: 'POST',
    params: {
      id
    }
  })
}
// 创建用户所属角色
export async function createUserRoles(params: UserRoleParams) {
  return request('/api/entityuser/entityuserRole', {
    method: 'POST',
    params: {
      roleId: params?.roleId,
      userCode: params?.userCode
    }
  })
}
// 查询用户所属角色菜单
export async function queryRoleName(params:RoleParams) {
  return request('/api/entityuser/queryRole', {
    method: 'POST',
    params: {
      entityid: params?.entityid
    }
  })
}
// 查询所有用户
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
  return {
    data: sourceData,
    total: msg.data.data.total,
    success: true
  }
}
// 添加用户
export async function addRule(params: TableListParams) {
  return request('/api/entityuser/updateEntityuser', {
    method: 'POST',
    params: {
      usercode: params.usercode,
      pwd: params.pwd,
      userstatus: params.userstatus,
      cellphone: params.cellphone,
      realname: params.realname,
      entityname: params.entityname,
      entityid: params.entityid
    }
  });
}
// 修改用户
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
