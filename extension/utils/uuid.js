function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getOrCreateDeviceUUID() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['deviceUUID'], (result) => {
      if (result.deviceUUID) {
        resolve(result.deviceUUID);
      } else {
        const newUUID = generateUUID();
        chrome.storage.local.set({ deviceUUID: newUUID }, () => resolve(newUUID));
      }
    });
  });
}
