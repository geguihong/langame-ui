import { stringify } from 'qs';
import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function listTags(projectId) {
    const params = {
        project_id: projectId
    };
    return request(ApiBase + `/api/tag/listTags?${stringify(params)}`);
}

export async function createTag(projectId, tag) {
    const params = {
        project_id: projectId,
        ...tag
    };
    return request(ApiBase + '/api/tag/createTag', {
        method: 'POST',
        body: params
    });
}

export async function updateTag(tag) {
    return request(ApiBase + '/api/tag/updateTag', {
        method: 'POST',
        body: tag
    });
}

export async function deleteTag(tag) {
    return request(ApiBase + '/api/tag/deleteTag', {
        method: 'POST',
        body: tag
    });
}