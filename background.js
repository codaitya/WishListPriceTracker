chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openLink") {
      chrome.tabs.create({ url: message.url });
    }
  });