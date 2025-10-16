import Vue from 'vue'
import App from './App.vue'

// 引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 全局配置elementui的dialog不能通过点击遮罩层关闭
// ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.use(ElementUI);

// 引入封装的router
import router from '@/router/index'

import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 1.3,
    attempt: 1,   // 尝试次数
    listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'],
    loading: 'https://image.szkdx.work/loading.gif',
})

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VeCharts from 've-charts'
Vue.use(VeCharts)

import '@/permission'
import {store} from '@/store/index'

Vue.config.productionTip = false

// 路由守卫
import Bus from '@/utils/bus.js'

Vue.use(Bus)

import '@/css/common.css'

import {auth} from '@/directive/auth'
// 按钮权限指令
auth(Vue)

// 组件懒加载
import VueLazyComponent from '@xunlei/vue-lazy-component'
Vue.use(VueLazyComponent)

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
