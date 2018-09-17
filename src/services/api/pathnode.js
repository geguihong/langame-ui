import { stringify } from 'qs';
import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function listChildren(node, page_number, page_size) {
  const params = { id: node.id, page_number, page_size };
  return request(ApiBase + `/api/node/listChildren?${stringify(params)}`);
}

export async function queryPathNode(condition, page_number, page_size) {
  const params = { ...condition, page_number, page_size };
  return request(ApiBase + `/api/node/query?${stringify(params)}`);
}

export async function getNode(id) {
  const params = { id };
  return request(ApiBase + `/api/node/getNode?${stringify(params)}`);
}

export async function createNode(params) {
  const method = params.type === 'path' ? 'createDir' : 'createEntry';
  return request(ApiBase + '/api/node/' + method, {
    method: 'POST',
    body: params,
  });
}

export async function updateNode(params) {
  return request(ApiBase + '/api/node/update', {
    method: 'POST',
    body: params,
  });
}

export async function deleteNode(ids) {
  const params = { ids };
  return request(ApiBase + '/api/node/delete', {
    method: 'POST',
    body: params,
  });
}