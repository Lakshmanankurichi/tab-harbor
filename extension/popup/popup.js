const DASHBOARD_URL = 'https://tab-harbor-two.vercel.app';
// const DASHBOARD_URL = 'http://localhost:3002'; // dev
const API_BASE = `${DASHBOARD_URL}/api`;

document.addEventListener('DOMContentLoaded', async () => {
  const harborBtn   = document.getElementById('harbor-btn');
  const btnText     = document.getElementById('btn-text');
  const btnIcon     = document.getElementById('btn-icon');
  const tabCountEl  = document.getElementById('tab-count');
  const statusEl    = document.getElementById('status');
  const dashLink    = document.getElementById('dashboard-link');
  const nameInput   = document.getElementById('session-name');

  const deviceUUID = await getOrCreateDeviceUUID();
  dashLink.href = `${DASHBOARD_URL}?deviceUUID=${deviceUUID}`;

  const allTabs = await chrome.tabs.query({ currentWindow: true });
  const validTabs = allTabs.filter(
    (t) => t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://')
  );

  tabCountEl.textContent = validTabs.length;
  harborBtn.disabled = validTabs.length === 0;

  harborBtn.addEventListener('click', async () => {
    const customName = nameInput.value.trim();
    harborBtn.disabled = true;
    harborBtn.classList.add('loading');
    btnText.textContent = 'Harboring…';
    showStatus('Saving your tabs…', 'loading');

    try {
      const tabData = validTabs.map((t, i) => ({
        title:       t.title || 'Untitled',
        url:         t.url,
        favicon_url: t.favIconUrl || null,
        position:    i,
      }));

      const body = { deviceUUID, tabs: tabData };
      if (customName) body.customName = customName;

      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const session = await res.json();

      harborBtn.classList.remove('loading');
      showStatus(`⚓  Harbored as "${session.title}"`, 'success');
      setTimeout(() => {
        chrome.tabs.create({ url: `${DASHBOARD_URL}?deviceUUID=${deviceUUID}` });
      }, 1800);
    } catch (err) {
      harborBtn.classList.remove('loading');
      harborBtn.disabled = false;
      btnText.textContent = 'Harbor All Tabs';
      showStatus(`Failed: ${err.message}`, 'error');
    }
  });

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
  }
});
