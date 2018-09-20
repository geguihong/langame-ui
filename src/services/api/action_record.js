import { stringify } from 'qs';
import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function getProjectActionRecords(projectId) {
    const params = {
        project_id: projectId,
        page_number: 1,
        page_size: 5
    };
    return request(ApiBase + `/api/action/getProjectActionRecords?${stringify(params)}`);
}