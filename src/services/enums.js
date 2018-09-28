export const RangeTypes = {
    project: { text: '项目所有词条' },
    // tag: { text: '包含标签的词条' },
};

export const Languages = {
    'zh-CN': { key: 'zh-CN', name: '简体中文' },
    'en-US': { key: 'en-US', name: '英文' },
    'zh-TW': { key: 'zh-TW', name: '繁体中文' },
    'de-DE': { key: 'de-DE', name: '德语' },
    'ja-JP': { key: 'ja-JP', name: '日文' },
    'kr-KR': { key: 'kr-KR', name: '韩语' },
    'fr-FR': { key: 'fr-FR', name: '法语' },
};

export const ExportTaskStates = {
    wait: { text: '等待导出', color: 'blue' },
    running: { text: '导出中', color: 'orange' },
    success: { text: '成功', color: 'green' },
    fail: { text: '失败', color: 'red' },
};