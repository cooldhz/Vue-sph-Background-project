import mockRequest from '@/utils/mockRequest'
const state = {
    data: {}
}

const mutations = {
    GETDATA(state, data) {
        state.data = data
    }
}

const actions = {
    async getData({ commit }) {
        const result = await mockRequest.get('/home/list')
        if (result.code == 20000) {
            commit('GETDATA', result.data)
        }
    }
}
const getters = {
    salesTotal(state) {
        return state.data.salesTotal
    },
    salesToday(state) {
        return state.data.salesToday
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

