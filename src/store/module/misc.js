const defaultState = {
    printer: {
        p75: "7x5",
        p86: "8x6",
        p1010: "10x10",
        p1015: "10x15",
    },
}

export const misc = {
    namespaced: true,
    state: {
        printer: {
            p75: undefined,
            p86: undefined,
            p1010: undefined,
            p1015: undefined,
        },
    },
    mutations: {
        setPrinter(state, data) {
            Object.assign(state.printer, data)
        },
        setPrinter1010(state, data) {
            Object.assign(state.printer.p1010, data)
        },
        resetPrinter(state) {
            Object.assign(state, defaultState)
        },
    },
    actions: {
        updatePrinter({commit}, data) {
            commit('setPrinter', data)
        },
        updatePrinter1010({commit}, data) {
            commit('setPrinter1010', data)
        },
    },
    getters: {
        printer(state) {
            return state.printer
        },
    }
}
