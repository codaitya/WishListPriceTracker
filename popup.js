document.getElementById("check-prices").addEventListener("click", () => {
  console.log("Message received");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "parseWishlist" }, (response) => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";
      console.log(response);
      console.log("**");
      response.items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";
        itemDiv.innerHTML = `
          <h2><a href="${item.link}" class="item-link">${item.title}</a></h2>
          <p>Current Price: Rs${item.currentPrice.toFixed(2)}</p>
          <p>Price Drop: Rs${item.dropAmount.toFixed(2)} </p>
        `;
        resultsDiv.appendChild(itemDiv);
      });

      // Add event listeners to the links to open in a new tab
      document.querySelectorAll('.item-link').forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          chrome.runtime.sendMessage({ action: "openLink", url: link.href });
        });
      });
    });
  });
});