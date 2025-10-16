import {login} from '@/api/user'
import {jsonInBlacklist} from '@/api/jwt'
import router from '@/router/index'

export const user = {
    namespaced: true,
    state: {
        userInfo: {
            uuid: "",
            nickName: "",
            headerImg: "",
            authority: "",
            temu_upload_barcode_url: false,
            group_id: 0,
        },
        token: "",
    },
    mutations: {
        setUserInfo(state, userInfo) {
            // 这里的 `state` 对象是模块的局部状态
            state.userInfo = userInfo
        },
        setToken(state, token) {
            // 这里的 `state` 对象是模块的局部状态
            state.token = token
        },
        LoginOut(state) {
            state.userInfo = {}
            state.token = ""
            router.push({name: 'login', replace: true})
            sessionStorage.clear()
            window.location.reload()
        },
        ResetUserInfo(state, userInfo = {}) {
            state.userInfo = {
                ...state.userInfo,
                ...userInfo
            }
        }
    },
    actions: {
        async LoginIn({commit}, loginInfo) {
            const res = await login(loginInfo)
            if (res.code === 0) {
                commit('setUserInfo', res.data.user)
                commit('setToken', res.data.token)
                let redirect = router.history.current.query.redirect
                if (redirect) {
                    router.push({path: redirect.replaceAll("#", "")})
                } else {
                    router.push({path: '/layout/dashboard'})
                }
            }
        },
        async LoginOut({commit}) {
            const res = await jsonInBlacklist()
            if (res.code === 0) {
                commit("LoginOut")
            }
        }
    },
    getters: {
        userInfo(state) {
            return state.userInfo
        },
        token(state) {
            return state.token
        },
        groupId(state) {
            return state.userInfo.group_id
        },
        canUpload(state) {
            return state.userInfo.permission && state.userInfo.permission.can_upload
        },
        canUpdateProductCategoryPrice(state) {
            return state.userInfo.permission && state.userInfo.permission.update_product_category_price
        },
        canSetProductOk(state) {
            return state.userInfo.permission && state.userInfo.permission.can_set_product_ok
        },
        canNotSeePrice(state) {
            return state.userInfo.permission && state.userInfo.permission.can_not_see_price
        },
        canSeeMessage(state) {
            return state.userInfo.permission && state.userInfo.permission.can_see_message
        },
        canCopyTitle(state) {
            // return state.userInfo.permission && state.userInfo.permission.can_copy_title
            return true
        },
        canReLogin(state) {
            return state.userInfo.permission && state.userInfo.permission.can_re_login
        },
        allowBack(state) {
            return state.userInfo.permission && state.userInfo.permission.allow_back
        },
        allowFactoryPlanItem(state) {
            return state.userInfo.permission && state.userInfo.permission.allow_factory_plan_item
        },
        allowCategoryTransport(state) {
            return state.userInfo.permission && state.userInfo.permission.allow_category_transport
        },
        canSeeSemiOrderProfit(state) {
            return state.userInfo.permission && state.userInfo.permission.can_see_semi_order_profit
        },
        v2PermissionList(state) {
            if(!state.userInfo.permission) return [];
            else return Object.keys(state.userInfo.permission).filter((item) => item.startsWith("v2_") && state.userInfo.permission[item])
        },
        webV2Url(state) {
            return state.userInfo.permission && state.userInfo.permission.web_v2_url
        }
    }
}