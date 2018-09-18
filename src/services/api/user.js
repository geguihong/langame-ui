import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function signup(params) {
  return request(ApiBase + '/api/user/signup', {
    method: 'POST',
    body: params,
  });
}

export async function signin(params) {
  return request(ApiBase + '/api/user/signin', {
    method: 'POST',
    body: params,
  });
}

export async function getUser(token) {
  return request(ApiBase + '/api/user/getUser');
}