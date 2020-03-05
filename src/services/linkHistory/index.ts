import LinkHistoryItem from '@/services/linkHistory/linkHistoryItem';

const LINK_HISTORY_STORE_KEY = 'ziplink_history';

export class LinkHistoryService {
  public loadHistory(): LinkHistoryItem[] {
    if (typeof (Storage) !== 'undefined') {
      const linkHistory = localStorage.getItem(LINK_HISTORY_STORE_KEY);
      if (linkHistory === null) {
        return this.storeHistory([]);
      }
      return JSON.parse(linkHistory);
    }

    // Sorry! No Web Storage support..
    return [];
  }

  public storeHistory(linkHistory: LinkHistoryItem[]): LinkHistoryItem[] {
    localStorage.setItem(LINK_HISTORY_STORE_KEY, JSON.stringify(linkHistory));
    return linkHistory;
  }

  public addItemToHistory(historyItem: LinkHistoryItem): LinkHistoryItem {
    const history = this.loadHistory();
    history.push(historyItem);
    this.storeHistory(history);

    return historyItem;
  }

  public deleteItemFromHistory(uuid: string) {
    const history = this.loadHistory();
    const newHistory = history.filter((item) => item.uuid !== uuid);
    this.storeHistory(newHistory);
  }
}

export default new LinkHistoryService();
