import { stringify } from 'qs';
import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function listSettings(projectId) {
    const params = {
        project_id: projectId
    };
    return request(ApiBase + `/api/export/listSettings?${stringify(params)}`);
}

export async function createSetting(exportSetting) {
    return request(ApiBase + '/api/export/createSetting', {
        method: 'POST',
        body: exportSetting
    });
}

export async function updateSetting(exportSetting) {
    return request(ApiBase + '/api/export/updateSetting', {
        method: 'POST',
        body: exportSetting
    });
}

export async function deleteSetting(exportSetting) {
    const params = {
        id: exportSetting.id
    };
    return request(ApiBase + `/api/export/deleteSetting?${stringify(params)}`);
}

export async function listTasks(projectId) {
    const params = {
        project_id: projectId
    };
    return request(ApiBase + `/api/export/listTasks?${stringify(params)}`);
}

export async function createTask(exportTask) {
    return request(ApiBase + '/api/export/createTask', {
        method: 'POST',
        body: exportTask
    });
}

export async function getExportResule(taskId) {
    const params = {
        task_id: taskId
    };
    return request(ApiBase + `/api/export/getExportResult?${stringify(params)}`);
}