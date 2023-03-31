import puppeteer from "puppeteer";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

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

export const ebaySearch = async (req, res) => {
  const search = req.params.id;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  let url = "http://svcs.ebay.com/services/search/FindingService/v1";
  url += "?OPERATION-NAME=findItemsByKeywords";
  url += "&SERVICE-VERSION=1.0.0";
  url += `&SECURITY-APPNAME=${process.env.CLIENT_ID}`;
  url += "&GLOBAL-ID=EBAY-US";
  url += "&RESPONSE-DATA-FORMAT=JSON";
  url += "&REST-PAYLOAD";
  url += `&keywords=${searchQuery}`;
  // url += "&paginationInput.entriesPerPage=3";

  const response = await fetch(url);
  const data = await response.json();
  const extractedData =
    data.findItemsByKeywordsResponse[0].searchResult[0].item;

  const newData = extractedData.map((item) => ({
    title: item.title[0],
    url: item.viewItemURL[0],
    price: `$${item.sellingStatus[0].currentPrice[0].__value__}`,
    imageUrl: item.galleryURL[0],
    dateAndLocation: item.location[0],
  }));

  res.json(newData);
};

export const facebookSearch = async (req, res) => {
  // search query and price filter from client
  const search = req.params.id;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  const response = await fetch("https://www.facebook.com/api/graphql/", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-prefers-color-scheme": "light",
      "sec-ch-ua":
        '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "viewport-width": "716",
      "x-asbd-id": "198387",
      "x-fb-friendly-name": "CometMarketplaceSearchContentContainerQuery",
      "x-fb-lsd": "AVrod7bIY4Y",
    },
    referrer: "https://www.facebook.com/marketplace",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `av=0&__user=0&__a=1&__dyn=7xeUmwlE7ibwKBWo2vwAxu13wvoKewSwMwNw9G2S0im3y4o0B-q1ew65xO0FE2awt81s8hwGwQw9m1YwBgao6C0Mo5W3S7Udo5q4U2exi4UaEW2C10wNwwwJK2W5olw8Xxm16waCm7-0iK2S3qazo11E2ZwiU8UdUcobUak1xwmo6O&__csr=hO5lbO9OkK8lVSLiGjCiEwytpXjiLUSJfmdCxaHCGXyq-hd8yIzwyAK2bGfgB3UWump5DK9UgBwWG3Ccxm1chHx24U8E-5bzUborU5K6k0aagjw0mxo0RMU03nag6G7tw5xebwCga80ofiwRxGaw5gDDwIw4jwblw50w_xuaDwko0Gq0sy0aawiQ091w7owjoO0ccw4Kg0S63-0wo6W8W80kq0SE2lw2c80Md3E0C15m04lo0smwTw2zE0Yvg6S1Uwq606PUVw1Gm&__req=q&__hs=19446.HYP%3Acomet_loggedout_pkg.2.1..0.0&dpr=2&__ccg=EXCELLENT&__rev=1007215734&__s=xvvawy%3Asim6l5%3A9or5rf&__hsi=7216459443920331969&__comet_req=15&lsd=AVrod7bIY4Y&jazoest=2932&__spin_r=1007215734&__spin_b=trunk&__spin_t=1680212897&qpl_active_flow_ids=931594241&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometMarketplaceSearchContentContainerQuery&variables=%7B%22buyLocation%22%3A%7B%22latitude%22%3A37.7793%2C%22longitude%22%3A-122.419%7D%2C%22contextual_data%22%3Anull%2C%22count%22%3A24%2C%22cursor%22%3Anull%2C%22flashSaleEventID%22%3A%22%22%2C%22hasFlashSaleEventID%22%3Afalse%2C%22marketplaceSearchMetadataCardEnabled%22%3Atrue%2C%22params%22%3A%7B%22bqf%22%3A%7B%22callsite%22%3A%22COMMERCE_MKTPLACE_WWW%22%2C%22query%22%3A%22${searchQuery}%22%7D%2C%22browse_request_params%22%3A%7B%22commerce_enable_local_pickup%22%3Atrue%2C%22commerce_enable_shipping%22%3Atrue%2C%22commerce_search_and_rp_available%22%3Atrue%2C%22commerce_search_and_rp_category_id%22%3A%5B%5D%2C%22commerce_search_and_rp_condition%22%3Anull%2C%22commerce_search_and_rp_ctime_days%22%3Anull%2C%22filter_location_latitude%22%3A37.7793%2C%22filter_location_longitude%22%3A-122.419%2C%22filter_price_lower_bound%22%3A0%2C%22filter_price_upper_bound%22%3A214748364700%2C%22filter_radius_km%22%3A65%7D%2C%22custom_request_params%22%3A%7B%22browse_context%22%3Anull%2C%22contextual_filters%22%3A%5B%5D%2C%22referral_code%22%3Anull%2C%22saved_search_strid%22%3Anull%2C%22search_vertical%22%3A%22C2C%22%2C%22seo_url%22%3Anull%2C%22surface%22%3A%22SEARCH%22%2C%22virtual_contextual_filters%22%3A%5B%5D%7D%7D%2C%22savedSearchID%22%3Anull%2C%22savedSearchQuery%22%3A%22${searchQuery}%22%2C%22scale%22%3A2%2C%22shouldIncludePopularSearches%22%3Atrue%2C%22topicPageParams%22%3A%7B%22location_id%22%3A%22sanfrancisco%22%2C%22url%22%3Anull%7D%2C%22vehicleParams%22%3A%22%22%7D&server_timestamps=true&doc_id=5240929566007459`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  const data = await response.json();

  const listings = data.data.marketplace_search.feed_units.edges;

  const results = listings.map((listing) => ({
    title: listing.node.listing.marketplace_listing_title,
    url: `https://www.facebook.com/marketplace/item/${listing.node.listing.id}`,
    price: listing.node.listing.listing_price.formatted_amount,
    imageUrl: listing.node.listing.primary_listing_photo.image.uri,
    dateAndLocation: listing.node.listing.location.reverse_geocode.city,
  }));

  // send results back
  res.json(results);
};
