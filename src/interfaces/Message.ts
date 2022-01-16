type Message = {
  name: 'get-tab-pan-value',
  tabId: number
} | {
  name: 'set-tab-pan-value',
  tabId: number,
  value: number
}

export default Message
