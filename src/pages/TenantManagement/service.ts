import request from '@/utils/request';

export async function queryEntityinfoList(params?:any ) {
  return request('/api/entityinfo/listEntityinfos', {
    params,
  });
}

export async function queryEntityinfo(params?:any ) {
  return request('/api/entityinfo/queryEntityinfo', {
    params,
  });
}

export async function removeEntityinfo(params:any) {
  return request('/api/entityinfo/deleteEntity', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addEntityinfo(params: any) {
  return request('/api/entityinfo/createEntity', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateEntityinfo(params: any) {
  return request('/api/entityinfo/updateEntity', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
