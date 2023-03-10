import puppeteer from "puppeteer";

export const craigslistSearch = async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // search and price will be fetched from front end
  const search = req.params.id;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  const price = 800; // temp

  // link to search results
  const url = `https://newyork.craigslist.org/search/sss?max_price=${price}&query=${searchQuery}#search=1~gallery~0~0`;

  await page.goto(url);

  // set viewport to load all content
  await page.setViewport({
    width: 5000,
    height: 5000,
  });

  // selector for search results list
  await page.waitForSelector(".cl-search-result.cl-search-view-mode-gallery");

  // add all results to properties object and return it
  const results = await page.$$eval(
    ".cl-search-result.cl-search-view-mode-gallery",
    (rows) => {
      return rows.map((row) => {
        const properties = {};
        const titleElement = row.querySelector(".titlestring");
        properties.title = titleElement.innerText;
        properties.url = titleElement.getAttribute("href");
        const priceElement = row.querySelector(".priceinfo");
        properties.price = priceElement ? priceElement.innerText : "";
        const imageElement = row.querySelector('.swipe [data-index="0"] img');
        properties.imageUrl = imageElement ? imageElement.src : "";
        const metaElement = row.querySelector(".meta");
        properties.dateAndLocation = metaElement.innerText;
        return properties;
      });
    }
  );

  // close browser
  await browser.close();

  // send results
  res.send(results);
};
