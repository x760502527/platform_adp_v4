import request from 'umi-request';
import { TableListParams, TableListItem, ApiListItem, RequestData} from './data.d';

// 添加行业版本
export async function addRule(params: TableListItem) {
  const msg:any = await request('/api/entityrole/updateEntityrole', {
    method: 'POST',
    params: {
      rolename: params.industyVersionName
    }
  });
  return msg;
}

// 获取行业版本
export async function getRule(params?: TableListParams) {
  console.log(params)
  const mag:any = await request<RequestData>('/api/entityrole/listEntityroles', {
    method: 'POST',
    params: {
      pageNum: params?.current,
      pageSize: params?.pageSize,
      roleflag: params?.roleflag,
      rolename:params?.industyVersionName
    },
  });

  let sourceData:TableListItem[] = [];
  const list = mag.data.data.list;
  list.forEach((item:ApiListItem) => {
    let listItem:TableListItem = {key:1, industyTableid: 1, industyVersionName: '', roleProps: 1};
    listItem.key = item.id;
    listItem.industyTableid = item.id;
    listItem.industyVersionName = item.rolename;
    listItem.roleProps = item.roleflag;
    sourceData.push(listItem);
  })

  return {
    data: sourceData,
    total: mag.data.data.total,
    success: true
  }
}

// 查询行业版本
export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}

// 删除行业版本
export async function removeRule(id: number) {
  return request('/api/entityrole/delEntityrole', {
    method: 'POST',
    params: {
      ids: id
    },
  });
}

// 编辑行业版本
export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
