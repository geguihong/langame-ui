import { stringify } from 'qs';
import request from '@/utils/request';
import { ApiBase } from '@/services/api/config'

export async function getNodeEntries(nodes, language) {
    const params = {
        nodes: nodes.map(o => o.id),
        language
    };
    return request(ApiBase + '/api/entry/getNodeEntries', {
        method: 'POST',
        body: params,
        expirys: false
    });
}

export async function updateNodeEntries(entries) {
    const params = {
        entries: entries.map(o => {
            const { node, language, content } = o;
            return { node, language, content };
        })
    };
    return request(ApiBase + '/api/entry/update', {
        method: 'POST',
        body: params
    });
}