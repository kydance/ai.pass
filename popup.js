const toggleProxyButton = document.getElementById('toggleProxy');
const openIncognitoWindowButton = document.getElementById('openIncognitoWindow');
const openChatGPTWindowButton0 = document.getElementById('openChatGPT0');
const openGoogleBardoWindowButton = document.getElementById('openGoogleBard');
const openClaudeButton = document.getElementById('openclaude');
const openPoeButton = document.getElementById('openPoe');

openClaudeButton.addEventListener('click', async () => {
  chrome.tabs.create({ url: 'https://claude.ai/chats' });
});

openChatGPTWindowButton0.addEventListener('click', async () => {
  chrome.tabs.create({ url: "https://chatgpt.com/" });
});


openGoogleBardoWindowButton.addEventListener('click', async () => {
  chrome.tabs.create({ url: 'https://gemini.google.com/' });
});

openPoeButton.addEventListener('click', async () => {
  chrome.tabs.create({ url: 'https://www.coze.com/' });
});

async function openIncognitoWindow() {
  chrome.extension.isAllowedIncognitoAccess((isAllowedAccess) => {
    if (isAllowedAccess) {
      console.log('Extension is allowed to access cookies in incognito mode.');
      chrome.windows.create({ 'url': 'https://chatgpt.com/', 'incognito': true }, async (window) => {});
    } else {
      const extensionId = chrome.runtime.id;
      const extensionSettingsLink = `chrome://extensions/?id=${extensionId}`;
      console.log('Extension is NOT allowed to access cookies in incognito mode.');

      // 创建模态弹窗
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.width = '300px';

      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.background = 'white';
      modal.style.border = '1px solid black';
      modal.style.padding = '20px';
      modal.style.zIndex = '10000';
      modal.innerHTML = `
        <p>请访问chrome://extensions/,在无痕模式下启用插件！</p>
        <button id="copyBtn" style="float: right;">复制链接</button>

      `;
      document.body.appendChild(modal);

      // 点击确定按钮复制URL并提示已成功复制
      document.getElementById('copyBtn').addEventListener('click', () => {
        const el = document.createElement('textarea');
        el.value = extensionSettingsLink;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        alert('链接已成功复制到剪贴板\n请粘贴到URL地址栏打开');
        document.body.removeChild(modal);
      });
    }
  });
}

openIncognitoWindowButton.addEventListener('click', openIncognitoWindow);