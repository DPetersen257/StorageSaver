document.getElementById('export-local').addEventListener('click', () => {
  browser.runtime.sendMessage({ action: 'export', storageType: 'local' });
});

document.getElementById('import-local').addEventListener('click', () => {
  importStorage('local');
});

document.getElementById('export-session').addEventListener('click', () => {
  browser.runtime.sendMessage({ action: 'export', storageType: 'session' });
});

document.getElementById('import-session').addEventListener('click', () => {
  importStorage('session');
});

function importStorage(storageType) {
  const dataElement = document.getElementById('import-data');
  const data = dataElement.value;

  if (!data) {
    alert('Please paste the JSON data into the text area before importing.');
    return;
  }

  try {
    const parsedData = JSON.parse(data);
    browser.runtime.sendMessage({ action: 'import', storageType, data: parsedData });
    alert('Import successful!');
  } catch (error) {
    alert('Invalid JSON data. Please try again with valid JSON data.');
  }
}
