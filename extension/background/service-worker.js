chrome.runtime.onInstalled.addListener(async () => {
  const { deviceUUID } = await chrome.storage.local.get(['deviceUUID']);
  if (!deviceUUID) {
    const newUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    await chrome.storage.local.set({ deviceUUID: newUUID });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_DEVICE_UUID') {
    chrome.storage.local.get(['deviceUUID'], (result) => {
      sendResponse({ deviceUUID: result.deviceUUID });
    });
    return true;
  }
});
