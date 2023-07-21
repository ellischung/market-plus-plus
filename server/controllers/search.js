import puppeteer from "puppeteer";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const craigslistSearch = async (req, res) => {
  // search input and filter options from frontend
  const search = req.query.input;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  let sortBy = "";
  switch (req.query.sortBy) {
    case "relevance":
      sortBy = "rel";
      break;
    case "newest_first":
      sortBy = "date";
      break;
    case "low_to_high":
      sortBy = "priceasc";
      break;
    case "high_to_low":
      sortBy = "pricedsc";
      break;
  }

  const minPrice = req.query.minPrice;

  const maxPrice = req.query.maxPrice;

  const postalCode = req.query.postalCode;

  const distance = req.query.distance;

  // launch headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // go to link with filtered search results
  const url = `https://newyork.craigslist.org/search/sss?max_price=${maxPrice}&min_price=${minPrice}&postal=${postalCode}&query=${searchQuery}&search_distance=${distance}&sort=${sortBy}#search=1~gallery~0~0`;
  await page.goto(url);

  // set viewport to load all content
  await page.setViewport({
    width: 10000,
    height: 10000,
  });

  // selector for search results list
  await page.waitForSelector(
    ".results.cl-results-page.cl-search-view-mode-gallery li.cl-search-result"
  );

  // add all results to properties object and return it
  const results = await page.$$eval("li.cl-search-result", (rows) => {
    return rows.map((row) => {
      const properties = {};
      const titleElement = row.querySelector("a.posting-title span.label");
      properties.title = titleElement ? titleElement.innerText : "";
      properties.url = titleElement ? titleElement.closest("a").href : "";
      const priceElement = row.querySelector(".priceinfo");
      properties.price = priceElement ? priceElement.innerText : "";
      const imageElement = row.querySelector('.swipe [data-index="0"] img');
      properties.imageUrl = imageElement ? imageElement.src : "";
      const metaElement = row.querySelector(".meta");
      const startingIndex = metaElement
        ? metaElement.innerText.indexOf("·") + 1
        : 0;
      const location = metaElement
        ? metaElement.innerText.substring(startingIndex).trim()
        : "";
      properties.location = location != "" ? location : "No location listed";
      properties.platform = "craigslist";
      return properties;
    });
  });

  // close browser
  await browser.close();

  // send results
  res.send(results);
};

export const ebaySearch = async (req, res) => {
  const search = req.query.input;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  let sortBy = "";
  switch (req.query.sortBy) {
    case "relevance":
      sortBy = "BestMatch";
      break;
    case "newest_first":
      sortBy = "StartTimeNewest";
      break;
    case "low_to_high":
      sortBy = "PricePlusShippingLowest";
      break;
    case "high_to_low":
      sortBy = "PricePlusShippingHighest";
      break;
  }

  const minPrice = req.query.minPrice;

  const maxPrice = req.query.maxPrice;

  const postalCode = req.query.postalCode;

  const distance = req.query.distance;

  let url = "https://svcs.ebay.com/services/search/FindingService/v1";
  url += "?OPERATION-NAME=findItemsByKeywords";
  url += "&SERVICE-VERSION=1.0.0";
  url += `&SECURITY-APPNAME=${process.env.CLIENT_ID}`;
  url += "&GLOBAL-ID=EBAY-US";
  url += "&RESPONSE-DATA-FORMAT=JSON";
  url += "&REST-PAYLOAD";
  url += `&keywords=${searchQuery}`;
  url += `&buyerPostalCode=${postalCode}`;
  url += `&itemFilter(0).name=MaxDistance&itemFilter(0).value=${distance}`;
  url += `&itemFilter(1).name=MinPrice&itemFilter(1).value=${minPrice}`;
  url += `&itemFilter(2).name=MaxPrice&itemFilter(2).value=${maxPrice}`;
  url += `&sortOrder=${sortBy}`;
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
    location: item.location[0],
    platform: "eBay",
  }));
  res.json(newData);
};

export const facebookSearch = async (req, res) => {
  // search query and price filter from client
  const search = req.query.input;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  let sortBy = "";
  switch (req.query.sortBy) {
    case "relevance":
      sortBy = "BEST_MATCH";
      break;
    case "newest_first":
      sortBy = "CREATION_TIME_DESCEND";
      break;
    case "low_to_high":
      sortBy = "PRICE_ASCEND";
      break;
    case "high_to_low":
      sortBy = "PRICE_DESCEND";
      break;
  }

  const minPrice = req.query.minPrice;

  const maxPrice = req.query.maxPrice;

  // helper method to retrieve coordinates from postal code
  const { lat, lng } = await getCoords(req.query.postalCode);

  const distance = Math.floor(req.query.distance * 1.60934); // convert miles to km

  // data from graphql api
  const response = await fetch("https://www.facebook.com/api/graphql/", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-prefers-color-scheme": "light",
      "sec-ch-ua":
        '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "viewport-width": "634",
      "x-asbd-id": "198387",
      "x-fb-friendly-name": "CometMarketplaceSearchContentContainerQuery",
      "x-fb-lsd": "AVo4efwbayM",
    },
    referrer: `https://www.facebook.com/marketplace/sanfrancisco/search?minPrice=${minPrice}&maxPrice=${maxPrice}&query=${searchQuery}&exact=false`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `av=0&__user=0&__a=1&__req=3v&__hs=19461.HYP%3Acomet_loggedout_pkg.2.1..0.0&dpr=1&__ccg=EXCELLENT&__rev=1007316664&__s=ea5ou9%3Aps82fh%3A2mqjgu&__hsi=7221993308227985648&__dyn=7xeUmwlEnwn8K2WnFw9-2i5U4e2O1gyUW3qi2K360CEbo19oe8hw2nVE4W0om782Cw8G1nzUO0n24oaEd82lwv89k2C1Fwc61uwPyovwRwlE-U2exi4UaEW2C10wNwwwJK2W5olw8Xxm16waCm7-0iK2S3qazo11E2ZwiU8UdUcobUak1xwmo6O&__csr=jMxaDlq_9RnrqAASQcyozARXuvnCXCCAGm9hopF6CAFoKEwF-iVpbhqKfWBKi5e9xacyUCmieU-hoG6u5USFE8obF8qxK74ifzo5Si7EC4Ehx24oOcwRw72xGU05Vi0cZaUx008f601hNcFQaDwBgbEAw0PO05F46E7tw9iaDwkUvg7e260dQwe-Uco-E3uw2yU0jnw6Mw8mm04TU0OKGG4A8yU8Euhy04qwdaqh02no3gwhd02VU0qXDw0CIBo2Iw9i055C0XU0g68084hFUgw1tW&__comet_req=15&lsd=AVo4efwbayM&jazoest=21029&__spin_r=1007316664&__spin_b=trunk&__spin_t=1681501350&qpl_active_flow_ids=931594241&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometMarketplaceSearchContentContainerQuery&variables=%7B%22buyLocation%22%3A%7B%22latitude%22%3A${lat}%2C%22longitude%22%3A${lng}%7D%2C%22contextual_data%22%3Anull%2C%22count%22%3A24%2C%22cursor%22%3Anull%2C%22flashSaleEventID%22%3A%22%22%2C%22hasFlashSaleEventID%22%3Afalse%2C%22marketplaceSearchMetadataCardEnabled%22%3Atrue%2C%22params%22%3A%7B%22bqf%22%3A%7B%22callsite%22%3A%22COMMERCE_MKTPLACE_WWW%22%2C%22query%22%3A%22${searchQuery}%22%7D%2C%22browse_request_params%22%3A%7B%22commerce_enable_local_pickup%22%3Atrue%2C%22commerce_enable_shipping%22%3Atrue%2C%22commerce_search_and_rp_available%22%3Atrue%2C%22commerce_search_and_rp_category_id%22%3A%5B%5D%2C%22commerce_search_and_rp_condition%22%3Anull%2C%22commerce_search_and_rp_ctime_days%22%3Anull%2C%22filter_location_latitude%22%3A${lat}%2C%22filter_location_longitude%22%3A${lng}%2C%22filter_price_lower_bound%22%3A${minPrice}00%2C%22filter_price_upper_bound%22%3A${maxPrice}00%2C%22filter_radius_km%22%3A${distance}%2C%22commerce_search_sort_by%22%3A%22${sortBy}%22%7D%2C%22custom_request_params%22%3A%7B%22browse_context%22%3Anull%2C%22contextual_filters%22%3A%5B%5D%2C%22referral_code%22%3Anull%2C%22saved_search_strid%22%3Anull%2C%22search_vertical%22%3A%22C2C%22%2C%22seo_url%22%3Anull%2C%22surface%22%3A%22SEARCH%22%2C%22virtual_contextual_filters%22%3A%5B%5D%7D%7D%2C%22savedSearchID%22%3Anull%2C%22savedSearchQuery%22%3A%22${searchQuery}%22%2C%22scale%22%3A1%2C%22shouldIncludePopularSearches%22%3Atrue%2C%22topicPageParams%22%3A%7B%22location_id%22%3A%22sanfrancisco%22%2C%22url%22%3Anull%7D%7D&server_timestamps=true&doc_id=6190990404299255`,
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
    location:
      listing.node.listing.location.reverse_geocode.city_page.display_name,
    platform: "Facebook Marketplace",
  }));

  // send results back
  res.json(results);
};

export const offerupSearch = async (req, res) => {
  // search query and price filter from client
  const search = req.query.input;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  let sortBy = "";
  switch (req.query.sortBy) {
    case "relevance":
      sortBy = "-posted";
      break;
    case "newest_first":
      sortBy = "-posted";
      break;
    case "low_to_high":
      sortBy = "price";
      break;
    case "high_to_low":
      sortBy = "-price";
      break;
  }

  const minPrice = req.query.minPrice;

  const maxPrice = req.query.maxPrice;

  // helper method to retrieve coordinates from postal code
  const { lat, lng } = await getCoords(req.query.postalCode);

  const distance = req.query.distance;

  // data fetched from offerup graphql api
  const response = await fetch("https://offerup.com/api/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "ou-browser-user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      "ou-experiment-data": '{"datamodel_id":"experimentmodel24"}',
      "ou-session-id":
        "web-f8a3d6bf78b1c1e60b94d191795788609ba2d40cd34055c6dd222cca@1681939863288",
      "sec-ch-ua":
        '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      userdata:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbiI6eyJjaXR5IjoiU3RhdGVuIElzbGFuZCIsInN0YXRlIjoiTlkiLCJ6aXBDb2RlIjoiMTAzMDYiLCJsb25naXR1ZGUiOi03NC4xMTg0LCJsYXRpdHVkZSI6NDAuNTY5Nywic291cmNlIjoiaXAifX0.YLkgHdZa0AcM_uIIyNpGNw7sspK2_fjRF5Wh9S6XGpQ",
      "x-ou-d-token":
        "web-f8a3d6bf78b1c1e60b94d191795788609ba2d40cd34055c6dd222cca",
      "x-ou-usercontext":
        '{"device_id":"web-f8a3d6bf78b1c1e60b94d191795788609ba2d40cd34055c6dd222cca","user_agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36","device_platform":"web","device.last_known_location.dma_id":"501","device.last_known_location.dma_name":"New York, NY"}',
      "x-request-id": "fadc8a10-b86e-4add-89ad-0f01caa2ec69",
    },
    referrer: `https://offerup.com/search?q=${searchQuery}&DISTANCE=${distance}&PRICE_MIN=${minPrice}&PRICE_MAX=${maxPrice}&CONDITION=&SORT=${sortBy}`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `{"operationName":"GetModularFeed","variables":{"debug":false,"searchParams":[{"key":"PRICE_MIN","value":"${minPrice}"},{"key":"PRICE_MAX","value":"${maxPrice}"},{"key":"SORT","value":"${sortBy}"},{"key":"DISTANCE","value":"${distance}"},{"key":"q","value":"${search}"},{"key":"platform","value":"web"},{"key":"lon","value":"${lng}"},{"key":"lat","value":"${lat}"},{"key":"experiment_id","value":"experimentmodel24"},{"key":"limit","value":"50"},{"key":"searchSessionId","value":"f3036b1e-dea4-42b0-aa12-1c4f20b8b8c1"}]},"query":"query GetModularFeed($searchParams: [SearchParam], $debug: Boolean = false) {\\n  modularFeed(params: $searchParams, debug: $debug) {\\n    analyticsData {\\n      requestId\\n      searchPerformedEventUniqueId\\n      searchSessionId\\n      __typename\\n    }\\n    categoryInfo {\\n      categoryId\\n      isForcedCategory\\n      __typename\\n    }\\n    feedAdditions\\n    filters {\\n      ...modularFilterNumericRange\\n      ...modularFilterSelectionList\\n      __typename\\n    }\\n    legacyFeedOptions {\\n      ...legacyFeedOptionListSelection\\n      ...legacyFeedOptionNumericRange\\n      __typename\\n    }\\n    looseTiles {\\n      ...modularTileBanner\\n      ...modularTileBingAd\\n      ...modularTileGoogleDisplayAd\\n      ...modularTileJob\\n      ...modularTileEmptyState\\n      ...modularTileListing\\n      ...modularTileLocalDisplayAd\\n      ...modularTileSearchAlert\\n      ...modularTileSellerAd\\n      __typename\\n    }\\n    modules {\\n      ...modularGridModule\\n      __typename\\n    }\\n    pageCursor\\n    query {\\n      ...modularQueryInfo\\n      __typename\\n    }\\n    requestTimeMetadata {\\n      resolverComputationTimeSeconds\\n      serviceRequestTimeSeconds\\n      totalResolverTimeSeconds\\n      __typename\\n    }\\n    searchAlert {\\n      alertId\\n      alertStatus\\n      __typename\\n    }\\n    debugInformation @include(if: $debug) {\\n      rankedListings {\\n        listingId\\n        attributes {\\n          key\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      lastViewedItems {\\n        listingId\\n        attributes {\\n          key\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      categoryAffinities {\\n        affinity\\n        count\\n        decay\\n        affinityOwner\\n        __typename\\n      }\\n      rankingStats {\\n        key\\n        value\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment modularFilterNumericRange on ModularFeedNumericRangeFilter {\\n  isExpandedHighlight\\n  lowerBound {\\n    ...modularFilterNumericRangeBound\\n    __typename\\n  }\\n  shortcutLabel\\n  shortcutRank\\n  subTitle\\n  targetName\\n  title\\n  type\\n  upperBound {\\n    ...modularFilterNumericRangeBound\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment modularFilterNumericRangeBound on ModularFeedNumericRangeFilterNumericRangeBound {\\n  label\\n  limit\\n  placeholderText\\n  targetName\\n  value\\n  __typename\\n}\\n\\nfragment modularFilterSelectionList on ModularFeedSelectionListFilter {\\n  targetName\\n  title\\n  subTitle\\n  shortcutLabel\\n  shortcutRank\\n  type\\n  isExpandedHighlight\\n  options {\\n    ...modularFilterSelectionListOption\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment modularFilterSelectionListOption on ModularFeedSelectionListFilterOption {\\n  isDefault\\n  isSelected\\n  label\\n  subLabel\\n  value\\n  __typename\\n}\\n\\nfragment legacyFeedOptionListSelection on FeedOptionListSelection {\\n  label\\n  labelShort\\n  name\\n  options {\\n    default\\n    label\\n    labelShort\\n    selected\\n    subLabel\\n    value\\n    __typename\\n  }\\n  position\\n  queryParam\\n  type\\n  __typename\\n}\\n\\nfragment legacyFeedOptionNumericRange on FeedOptionNumericRange {\\n  label\\n  labelShort\\n  leftQueryParam\\n  lowerBound\\n  name\\n  options {\\n    currentValue\\n    label\\n    textHint\\n    __typename\\n  }\\n  position\\n  rightQueryParam\\n  type\\n  units\\n  upperBound\\n  __typename\\n}\\n\\nfragment modularTileBanner on ModularFeedTileBanner {\\n  tileId\\n  tileType\\n  title\\n  __typename\\n}\\n\\nfragment modularTileBingAd on ModularFeedTileBingAd {\\n  tileId\\n  bingAd {\\n    ouAdId\\n    adExperimentId\\n    adNetwork\\n    adRequestId\\n    adTileType\\n    clickFeedbackUrl\\n    clickReturnUrl\\n    contentUrl\\n    experimentDataHash\\n    image {\\n      height\\n      url\\n      width\\n      __typename\\n    }\\n    impressionFeedbackUrl\\n    installmentInfo {\\n      amount\\n      description\\n      downPayment\\n      __typename\\n    }\\n    itemName\\n    lowPrice\\n    price\\n    searchId\\n    sellerName\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularTileGoogleDisplayAd on ModularFeedTileGoogleDisplayAd {\\n  tileId\\n  googleDisplayAd {\\n    ouAdId\\n    additionalSizes\\n    adExperimentId\\n    adHeight\\n    adNetwork\\n    adPage\\n    adRequestId\\n    adTileType\\n    adWidth\\n    adaptive\\n    channel\\n    clickFeedbackUrl\\n    clientId\\n    contentUrl\\n    customTargeting {\\n      key\\n      values\\n      __typename\\n    }\\n    displayAdType\\n    errorDrawable {\\n      actionPath\\n      listImage {\\n        height\\n        url\\n        width\\n        __typename\\n      }\\n      __typename\\n    }\\n    experimentDataHash\\n    formatIds\\n    impressionFeedbackUrl\\n    personalizationProperties {\\n      key\\n      values\\n      __typename\\n    }\\n    prebidConfigs {\\n      key\\n      values {\\n        timeout\\n        __typename\\n      }\\n      __typename\\n    }\\n    renderLocation\\n    searchId\\n    searchQuery\\n    templateId\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularTileJob on ModularFeedTileJob {\\n  tileId\\n  tileType\\n  job {\\n    address {\\n      city\\n      state\\n      zipcode\\n      __typename\\n    }\\n    companyName\\n    datePosted\\n    image {\\n      height\\n      url\\n      width\\n      __typename\\n    }\\n    industry\\n    jobId\\n    jobListingUrl\\n    pills {\\n      text\\n      type\\n      __typename\\n    }\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment modularTileEmptyState on ModularFeedTileEmptyState {\\n  tileId\\n  tileType\\n  title\\n  description\\n  iconType\\n  __typename\\n}\\n\\nfragment modularTileListing on ModularFeedTileListing {\\n  tileId\\n  listing {\\n    ...modularListing\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularListing on ModularFeedListing {\\n  listingId\\n  conditionText\\n  flags\\n  image {\\n    height\\n    url\\n    width\\n    __typename\\n  }\\n  isFirmPrice\\n  locationName\\n  price\\n  title\\n  vehicleMiles\\n  __typename\\n}\\n\\nfragment modularTileLocalDisplayAd on ModularFeedTileLocalDisplayAd {\\n  tileId\\n  localDisplayAd {\\n    ouAdId\\n    adExperimentId\\n    adNetwork\\n    adRequestId\\n    adTileType\\n    advertiserId\\n    businessName\\n    callToAction\\n    callToActionType\\n    clickFeedbackUrl\\n    contentUrl\\n    experimentDataHash\\n    headline\\n    image {\\n      height\\n      url\\n      width\\n      __typename\\n    }\\n    impressionFeedbackUrl\\n    searchId\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularTileSearchAlert on ModularFeedTileSearchAlert {\\n  tileId\\n  tileType\\n  title\\n  __typename\\n}\\n\\nfragment modularTileSellerAd on ModularFeedTileSellerAd {\\n  tileId\\n  listing {\\n    ...modularListing\\n    __typename\\n  }\\n  sellerAd {\\n    ouAdId\\n    adId\\n    adExperimentId\\n    adNetwork\\n    adRequestId\\n    adTileType\\n    clickFeedbackUrl\\n    experimentDataHash\\n    impressionFeedbackUrl\\n    searchId\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularGridModule on ModularFeedModuleGrid {\\n  moduleId\\n  collection\\n  formFactor\\n  grid {\\n    actionPath\\n    tiles {\\n      ...modularModuleTileBingAd\\n      ...modularModuleTileGoogleDisplayAd\\n      ...modularModuleTileListing\\n      ...modularModuleTileLocalDisplayAd\\n      ...modularModuleTileSellerAd\\n      __typename\\n    }\\n    __typename\\n  }\\n  moduleType\\n  rank\\n  rowIndex\\n  searchId\\n  subTitle\\n  title\\n  infoActionPath\\n  __typename\\n}\\n\\nfragment modularModuleTileBingAd on ModularFeedTileBingAd {\\n  ...modularTileBingAd\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularModuleTileGoogleDisplayAd on ModularFeedTileGoogleDisplayAd {\\n  ...modularTileGoogleDisplayAd\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularModuleTileListing on ModularFeedTileListing {\\n  ...modularTileListing\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularModuleTileLocalDisplayAd on ModularFeedTileLocalDisplayAd {\\n  ...modularTileLocalDisplayAd\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularModuleTileSellerAd on ModularFeedTileSellerAd {\\n  ...modularTileSellerAd\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularQueryInfo on ModularFeedQueryInfo {\\n  appliedQuery\\n  decisionType\\n  originalQuery\\n  suggestedQuery\\n  __typename\\n}\\n"}`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  const data = await response.json();

  const listings = data.data.modularFeed.looseTiles;

  const results = listings.map((listing) => ({
    title: listing.listing.title,
    url: `https://offerup.com/item/detail/${listing.listing.listingId}`,
    price: `$${listing.listing.price}`,
    imageUrl: listing.listing.image.url,
    location: listing.listing.locationName,
    platform: "OfferUp",
  }));

  // send results back
  res.json(results);
};

export const etsySearch = async (req, res) => {
  const search = req.query.input;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  let sortBy = "";
  switch (req.query.sortBy) {
    case "relevance":
      sortBy = "score";
      break;
    case "newest_first":
      sortBy = "created";
      break;
    case "low_to_high":
      sortBy = "price&sort_order=asc";
      break;
    case "high_to_low":
      sortBy = "price&sort_order=desc";
      break;
  }

  const minPrice = req.query.minPrice;

  const maxPrice = req.query.maxPrice;

  let url = "https://openapi.etsy.com/v3/application/listings/active";
  url += `?keywords=${searchQuery}`;
  url += `&sort_on=${sortBy}`;
  url += `&min_price=${minPrice}`;
  url += `&max_price=${maxPrice}`;
  url += "&limit=50";

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY,
    },
  });

  const data = await response.json();
  const extractedData = data.results;

  // Array for main res data
  const newData = extractedData.map((item) => ({
    title: item.title,
    url: item.url,
    price: `${item.price.amount / item.price.divisor} ${
      item.price.currency_code
    }`,
    platform: "Etsy",
  }));

  // Array for listingids to use for second API call
  const listingIds = extractedData.map((item) => item.listing_id);

  const listingIdsStr = listingIds.join(",");

  // Insert the string into the URL
  const imageUrl = `https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${listingIdsStr}&includes=Images`;

  const imgResponse = await fetch(imageUrl, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY,
    },
  });

  // extract and map an array of just listing images from second API call
  const imgData = await imgResponse.json();
  const extractedImgData = imgData.results;
  const newImgData = extractedImgData.map(
    (item) => item.images[0].url_fullxfull
  );

  // map new array that combines newData and the listing images
  const newArray = newData.map((item, index) => {
    return {
      ...item,
      imageUrl: newImgData[index],
    };
  });

  res.json(newArray);
};

const getCoords = async (postalCode) => {
  const apiKey = process.env.API_KEY;

  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${apiKey}`;

  const response = await fetch(geocodingUrl);

  const data = await response.json();

  return data.results[0]
    ? data.results[0].geometry.location
    : { lat: 40.7250632, lng: -73.9976946 }; // return default New York, NY 10012 coords if ZIP code invalid;
};
