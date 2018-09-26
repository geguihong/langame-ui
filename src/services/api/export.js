import { stringify } from 'qs';
import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function listSettings(projectId) {
    const params = {
        project_id: projectId
    };
    return request(ApiBase + `/api/export/listSettings?${stringify(params)}`);
}