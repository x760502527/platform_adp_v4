import request from 'umi-request';
import { TableListParams, TableListItem, ApiListItem, RequestData} from './data.d';

// 添加行业版本
export async function addRule(params: TableListItem) {
  const msg:any = await request('/api/entityrole/updateEntityrole', {
    method: 'POST',
    params: {
      rolename: params.industyVersionName,
      memo: params.note
    }
  });
  return msg;
}

// 查询菜单树
export async function queryMenu() {
  const res:any = await request('/api/entityrole/queryEntityrolemenuByEntityrole', {
    method: 'POST'
  });
  return res;
}

// 获取行业版本
export async function getRule(params?: TableListParams) {
  let msg:any;
  await request<RequestData>('/api/entityrole/listEntityroles', {
    method: 'POST',
    params: {
      pageNum: params?.current,
      pageSize: params?.pageSize,
      roleflag: params?.roleflag,
      rolename:params?.industyVersionName
    },
  }).then(res => {
    msg = res;
  }).catch(err => {
    console.log(err)
  });
  // 获取原始数据并处理
  let sourceData:TableListItem[] = [];
  let list = msg.data.list;
  list.forEach((item:ApiListItem) => {
    let listItem:TableListItem = {key:1, industyTableid: 1, industyVersionName: '', roleProps: ''};
    listItem.key = item.id;
    listItem.industyTableid = item.id;
    listItem.industyVersionName = item.rolename;
    listItem.note = item.memo
    if(item.roleflag == 0) {
      listItem.roleProps = '行业版本'
    } else {
      listItem.roleProps = '用户角色'
    }
    sourceData.push(listItem);
  })
  return {
    data: sourceData,
    total: msg.data.total,
    success: true
  }
}

// 删除行业版本
export async function removeRule(id?: number) {
  return request('/api/entityrole/delEntityrole', {
    method: 'POST',
    params: {
      ids: id
    },
  });
}

// 编辑行业版本
export async function updateRule(params: TableListItem) {
  return request('/api/entityrole/updateEntityrole', {
    method: 'POST',
    params: {
      id: params.key,
      memo: params.note,
      rolename: params.industyVersionName
    },
  });
}
