/**
 * AI Proxy Extension Background Service
 * 负责管理代理设置和请求转发
 */

// 代理状态和配置
let proxyEnabled = true;
const proxyServer = {
  scheme: 'http',
  host: '9.135.153.55',
  port: 10800
};

// 需要代理的AI网站列表
const AI_SITES = [
  "https://*.openai.com/*",
  "https://chatgpt.com/*",
  "https://*.coze.com/*",
  "https://gemini.google.com/*",
  "https://claude.ai/*",
  "https://anthropic.com/*",
  "https://*.oaistatic.com",
  "https://*.oaiusercontent.com",
  "https://grok.com/*"
];

/**
 * 生成PAC脚本内容
 * @returns {string} PAC脚本内容
 */
function generatePacScript() {
  return `function FindProxyForURL(url, host) {
    var sites = ${JSON.stringify(AI_SITES)};
    for(var site of sites) {
      if(shExpMatch(url, site)) {
        return "PROXY ${proxyServer.host}:${proxyServer.port}";
      }
    }
    return "DIRECT";
  }`;
}

/**
 * 更新代理设置
 * 使用PAC脚本实现按域名分流
 */
function updateProxySettings() {
  const config = {
    value: {
      mode: 'pac_script',
      pacScript: {
        data: generatePacScript()
      }
    }
  };

  try {
    chrome.proxy.settings.set(config, () => {
      if (chrome.runtime.lastError) {
        console.error('代理设置更新失败:', chrome.runtime.lastError);
        console.error('代理配置:', JSON.stringify(config));
      } else {
        console.log('代理设置更新成功');
        console.log('当前代理配置:', {
          enabled: proxyEnabled,
          server: proxyServer,
          sites: AI_SITES
        });
      }
    });
  } catch (error) {
    console.error('代理设置更新出错:', error);
  }
}

/**
 * 切换代理状态
 * @param {boolean} enabled - 是否启用代理
 */
function toggleProxy(enabled) {
  proxyEnabled = enabled;
  if (enabled) {
    updateProxySettings();
  } else {
    chrome.proxy.settings.clear({ scope: 'regular' });
  }
  console.log(`代理状态: ${enabled ? '已启用' : '已禁用'}`);
}

// 监听扩展安装或更新事件
chrome.runtime.onInstalled.addListener(() => {
  updateProxySettings();
  console.log('扩展已安装/更新，初始化代理设置');
});

// 监听扩展启动事件
chrome.runtime.onStartup.addListener(() => {
  updateProxySettings();
  console.log('扩展已启动，初始化代理设置');
});

// 初始化代理设置
updateProxySettings();
