const DASHBOARD_URL = 'https://tab-harbor-two.vercel.app';
// const DASHBOARD_URL = 'http://localhost:3002'; // dev
const API_BASE = `${DASHBOARD_URL}/api`;

document.addEventListener('DOMContentLoaded', async () => {
  const harborBtn   = document.getElementById('harbor-btn');
  const tabCountEl  = document.getElementById('tab-count');
  const statusEl    = document.getElementById('status');
  const dashLink    = document.getElementById('dashboard-link');

  const deviceUUID = await getOrCreateDeviceUUID();
  dashLink.href = `${DASHBOARD_URL}?deviceUUID=${deviceUUID}`;

  const allTabs = await chrome.tabs.query({ currentWindow: true });
  const validTabs = allTabs.filter(
    (t) => t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://')
  );

  const count = validTabs.length;
  tabCountEl.innerHTML = `<strong>${count}</strong>${count === 1 ? 'tab' : 'tabs'} ready to harbor`;
  harborBtn.disabled = count === 0;

  harborBtn.addEventListener('click', async () => {
    harborBtn.disabled = true;
    showStatus('Harboring tabs...', 'loading');

    try {
      const tabData = validTabs.map((t, i) => ({
        title:       t.title || 'Untitled',
        url:         t.url,
        favicon_url: t.favIconUrl || null,
        position:    i,
      }));

      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceUUID, tabs: tabData }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const session = await res.json();

      showStatus(`✓ Harbored as "${session.title}"`, 'success');
      setTimeout(() => {
        chrome.tabs.create({ url: `${DASHBOARD_URL}?deviceUUID=${deviceUUID}` });
      }, 1500);
    } catch (err) {
      showStatus(`Error: ${err.message}`, 'error');
      harborBtn.disabled = false;
    }
  });

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
  }
});
