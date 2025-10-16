import axios from 'axios'; // 引入axios
import {Notification, Loading} from 'element-ui';
import {store} from '@/store/index'

const service = axios.create({baseURL: "", timeout: 99999})

let activeAxios = 0
let loadingInstance
let timer

const showLoading = (unloading) => {
    activeAxios++

    if (unloading) {
        return
    }

    if (timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => {
        if (activeAxios > 0) {
            loadingInstance = Loading.service({fullscreen: true, text: "loading"})
        }
    }, 200);
}

const closeLoading = () => {
    if (activeAxios > 0) {
        activeAxios--
    }

    if (activeAxios <= 0) {
        clearTimeout(timer)
        timer = undefined

        if (loadingInstance) {
            loadingInstance.close()
            loadingInstance = undefined
        }
    }
}
//http request 拦截器
service.interceptors.request.use(
    config => {
        showLoading(config.unloading)
        const token = store.getters['user/token']
        const user = store.getters['user/userInfo']
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/json',
            'x-token': token,
            'x-user-id': user.ID
        }

        return config;
    },
    error => {
        closeLoading()
        Notification({
            showClose: true,
            message: error,
            offset: 150,
            duration: 10000,
            type: 'error'
        })
        return Promise.reject(error);
    }
);


//http response 拦截器
service.interceptors.response.use(
    response => {
        closeLoading()
        if (response.headers["new-token"]) {
            store.commit('user/setToken', response.headers["new-token"])
        }
        if (response.data.code === 0 || response.headers.success === "true") {
            return response.data
        } else {
            Notification({
                showClose: true,
                message: response.data.msg || decodeURI(response.headers.msg),
                offset: 150,
                duration: 10000,
                type: 'error',
            })
            if (response.data.data && response.data.data.reload) {
                store.commit('user/LoginOut')
            }
            return Promise.reject(response.data.msg)
        }
    },
    error => {
        closeLoading()
        Notification({
            showClose: true,
            message: error,
            offset: 150,
            duration: 10000,
            type: 'error'
        })
        return Promise.reject(error)
    }
)

export default service