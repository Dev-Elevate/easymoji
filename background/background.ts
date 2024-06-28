chrome.webNavigation.onCompleted.addListener(
  function (details) {
    // You can customize the URL pattern as needed

    chrome.scripting.executeScript(
      {
        target: { tabId: details.tabId },
        files: ["content.js"],
      },
      () => {
        console.log("Content script injected into", details.url);
      }
    );
  },
  { url: [{ urlMatches: "https://*/*" }, { urlMatches: "http://*/*" }] }
);
