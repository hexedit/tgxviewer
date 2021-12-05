import { Chat, Session } from '@/tgxviewer/types';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface ITgxState {
    path: string | null;
    userId: number | null;
    userName: string | null;
    fullName: string | null;
    profilePicture: string | null;
    chats: Chat[];
    sessions: Session[];
}

export default new Vuex.Store<ITgxState>({
    state: {
        path: null,
        userId: null,
        userName: null,
        fullName: null,
        profilePicture: null,
        chats: [],
        sessions: [],
    },
    mutations: {
        setPath(state, path: string) {
            state.path = path;
        },
        setUserId(state, userId: number) {
            state.userId = userId;
        },
        setUserName(state, userName: string) {
            state.userName = userName;
        },
        setFullName(state, fullName: string) {
            state.fullName = fullName;
        },
        setProfilePicture(state, profilePicture: string) {
            state.profilePicture = profilePicture;
        },
        setChats(state, chats: Chat[]) {
            state.chats = chats;
        },
        setSessions(state, sessions: Session[]) {
            state.sessions = sessions;
        }
    },
    actions: {
        async openFolder(ctx) {
            const result = await window.api.openFolder();
            if (!result) return;
            ctx.commit('setPath', result.path);
            ctx.commit('setUserId', result.userId);
            ctx.commit('setUserName', result.userName);
            ctx.commit('setFullName', result.fullName);
            ctx.commit('setProfilePicture', result.profilePicture);
            ctx.commit('setChats', result.chats);
            ctx.commit('setSessions', result.sessions);
        }
    },
    modules: {
    }
});
