import service from '@/utils/request'

export const chatgptChat = (data) => {
    return service({
        url: "/chat/api/chat",
        method: 'post',
        data
    })
}

export const chatgptChatV2 = (data) => {
    return service({
        url: "/chat/api/chat_v2",
        method: 'post',
        data
    })
}
