type Message =
  | {
      name: "get-tab-pan-value";
      tabId: number;
    }
  | {
      name: "set-tab-pan-value";
      tabId: number;
      value: number;
    }
  | {
      name: "set-tab-pan-value-clear-badge";
      tabId: number;
      value: number;
    }
  | {
      name: "reset-tab";
      tabId: number;
    };

export default Message;
