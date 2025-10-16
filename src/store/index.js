import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import {user} from "@/store/module/user"
import {router} from "@/store/module/router"
import {misc} from "@/store/module/misc"

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['user', 'misc']
})
export const store = new Vuex.Store({
    modules: {
        user,
        router,
        misc,
    },
    plugins: [vuexLocal.plugin]
})