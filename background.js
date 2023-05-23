browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'export') {
    exportStorage(request.storageType);
  } else if (request.action === 'import') {
    importStorage(request.storageType, request.data);
  }
});

async function importStorage(storageType, data) {
  const code = Object.keys(data).map(key => {
    return `window.${storageType}Storage.setItem("${key}", ${JSON.stringify(data[key])});`;
  }).join('\n');

  await browser.tabs.executeScript({
    code
  });
}

  
async function exportStorage(storageType) {
  const data = await browser.tabs.executeScript({
    code: `
      (() => {
        const storage = window.${storageType}Storage;
        const result = {};

        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          result[key] = storage.getItem(key);
        }

        return JSON.stringify(result);
      })()
    `
  });

  const blob = new Blob([data[0]], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const filename = await generateDefaultFilename(storageType);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

async function generateDefaultFilename(storageType) {
  const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
  const url = new URL(activeTab[0].url);
  const siteName = url.hostname.replace('www.', '');

  const currentDate = new Date();
  const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
  const timeString = currentDate.toISOString().slice(11, 19).replace(/:/g, '');

  return `${siteName}_${dateString}_${storageType}_backup.json`;
}


  
  