import { stringify } from 'qs';
import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function listUserProjects() {
  return request(ApiBase + '/api/project/listUserProjects');
}

export async function createProject(project) {
  return request(ApiBase + '/api/project/create', {
    method: 'POST',
    body: project
  });
}