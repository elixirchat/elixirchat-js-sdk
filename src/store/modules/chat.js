import * as types from '../mutation-types';

const state = {
    active: false
};

const getters = {
    active: state => state.active
};

const actions = {
    toggle({ commit, getters }) {
        commit(types.CHAT_TOGGLE, { active: !getters.active });
    },
};

const mutations = {
    [types.CHAT_TOGGLE](state, { active }) {
        state.active = active;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
