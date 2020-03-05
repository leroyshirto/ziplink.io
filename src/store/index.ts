import Vue from 'vue';
import Vuex from 'vuex';
import linkHistoryService from '@/services/linkHistory';
import LinkHistoryItem from '@/services/linkHistory/linkHistoryItem';

Vue.use(Vuex);

const linkHistory: LinkHistoryItem[] = [];

export default new Vuex.Store({
  state: {
    linkHistory,
  },
  mutations: {
    setLinkHistory(state, newLinkHistory: LinkHistoryItem[]) {
      state.linkHistory = newLinkHistory;
    },
    addItemToHistory(state, historyItem: LinkHistoryItem) {
      const existingEntry = state.linkHistory.find((item) => item.skylink === historyItem.skylink);
      if (existingEntry !== null) {
        return;
      }

      state.linkHistory.push(historyItem);
    },
    deleteItemFromHistory(state, uuid: string) {
      state.linkHistory = state.linkHistory.filter((item) => item.uuid !== uuid);
    },
  },
  actions: {
    async loadLinkHistory(context) {
      const savedLinkHistory = linkHistoryService.loadHistory();
      context.commit('setLinkHistory', savedLinkHistory);
    },
    deleteLinkHistoryItem(context, uuid) {
      linkHistoryService.deleteItemFromHistory(uuid);
      context.commit('deleteItemFromHistory', uuid);
    },
    addItemToHistory(context, linkHistoryItem: LinkHistoryItem) {
      const savedItem = linkHistoryService.addItemToHistory(linkHistoryItem);
      context.commit('addItemToHistory', savedItem);
    },
  },
  modules: {
  },
});
