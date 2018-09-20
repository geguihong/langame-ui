import { stringify } from 'qs';
import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function getMembers(projectId) {
    const params = {
        project_id: projectId
    };
    return request(ApiBase + `/api/member/getMembers?${stringify(params)}`);
}

export async function addMember(projectId, username) {
    const params = {
        project_id: projectId,
        username
    };
    return request(ApiBase + '/api/member/addMember', {
        method: 'POST',
        body: params
    });
}