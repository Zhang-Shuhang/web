import service from '@/utils/request'

export const diagramAuditList = (params) => {
    return service({
        url: "/sf-factory-v2/diagram/audit_list",
        method: 'get',
        params
    })
}

export const diagramTaskList = (params) => {
    return service({
        url: "/sf-factory-v2/diagram/task_list",
        method: 'get',
        params
    })
}

export const diagramCreate = (data) => {
    return service({
        url: "/sf-factory-v2/diagram/create",
        method: 'post',
        data
    })
}

export const diagramAudit = (data) => {
    return service({
        url: "/sf-factory-v2/diagram/audit",
        method: 'post',
        data
    })
}