import request from 'umi-request';
import { message } from 'antd';
import { TableListParams } from './data.d';
import { TableListItem } from './data.d';

export async function queryRule(params?: TableListParams) {
  let msg:any;
  await request('/api/entityuser/selectPage', {
    method: 'POST',
    params: {
      pageNum: params?.current,
      pageSize: params?.pageSize,
      usercode: params?.usercode,
      userstatus: params?.userstatus,
      cellphone: params?.cellphone
    }
  }).then(res => {
    msg = res;
  }).catch(err => {
    message.error('数据请求出错，请刷新页面后重试！')
  });
  let sourceData:TableListItem[] = msg.data.data.list;
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
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
