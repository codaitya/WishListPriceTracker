function parseWishlist() {

    
    // Select the <ul> element with id="g-items"
    const ulElement = document.querySelector('#g-items');
    const itemsData = [];

    // Check if the <ul> element exists
    if (ulElement) {
    // Get all child <li> elements of the <ul>
    const liElements = ulElement.querySelectorAll('li');

    // Print the size of liElements
    console.log(`Total number of <li> elements: ${liElements.length}`);
    

    // Filter the <li> elements that have a data-id attribute
    const filteredItems = Array.from(liElements).filter(li => li.querySelector('.a-row.itemPriceDrop'));

    // Iterate over the filtered <li> elements and log them
    filteredItems.forEach(item => {
        const priceElement = item.querySelector('.a-price .a-offscreen');
        if (priceElement) {
          let price = priceElement.textContent.trim();
          price = parseInt(price.replace(/[^0-9.-]+/g, ""), 10);
          console.log('Current Price:', price);

          const priceDropDiv = item.querySelector('.a-row.itemPriceDrop');
          if (priceDropDiv) {
              // Extract percentage drop
              const priceText = priceDropDiv.textContent;
              const percentageMatch = priceText.match(/Price dropped (\d+)%/);
              if (percentageMatch) {
                  const percentageDrop = parseInt(percentageMatch[1], 10);
                  console.log('Percentage Drop:', percentageDrop);
                  const originalPrice = (price * 100.0) / (100.0 - percentageDrop);
                  const dropAmount = originalPrice - price;
                  console.log('Drop Amount:', dropAmount);

                  const linkElement = Array.from(item.querySelectorAll('a.a-link-normal')).find(link => link.hasAttribute('title'));
                  if (linkElement) {
                    const hyperlink = linkElement.href;
                    console.log('Hyperlink:', hyperlink);
        
                    // Collect data in a JSON array
                    itemsData.push({
                      link: hyperlink,
                      currentPrice: price,
                      percentageDrop: percentageDrop,
                      dropAmount: dropAmount
                    });
                  } else {
                    console.log('Hyperlink not found for this item');
                  }


              } else {
                  console.log('Percentage drop not found for this item');
              }
          } else {
              console.log('Price drop element not found for this item');
          }
  
        }
        else {
            console.log('Price element not found for this item');
        }
      });
    }else {
        console.log('No <ul> element with id="g-items" found.');
    }

    itemsData.sort((a, b) => b.dropAmount - a.dropAmount);
    return itemsData;
  }

  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "parseWishlist") {
      const parsedItemss = parseWishlist();
      console.log(parsedItemss)
      sendResponse({ items: parsedItemss });
    }
  });
  