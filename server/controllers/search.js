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

  // data from graphql api
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
    dateAndLocation:
      listing.node.listing.location.reverse_geocode.city_page.display_name,
  }));

  // send results back
  res.json(results);
};

export const offerupSearch = async (req, res) => {
  // search query and price filter from client
  const search = req.params.id;
  const splitSearch = search.split(" ");
  let searchQuery = "";
  for (let i = 0; i < splitSearch.length - 1; i++) {
    searchQuery += splitSearch[i] + "%20";
  }
  searchQuery += splitSearch[splitSearch.length - 1];

  // data from graphql api
  const response = await fetch("https://offerup.com/api/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "ou-browser-user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36",
      "ou-experiment-data": '{"datamodel_id":"experimentmodel24"}',
      "ou-session-id":
        "web-17d01ffadc2fb235ab5afd03917e608cf8c710a004c4bed9acaa1f01@1680840882318",
      "sec-ch-ua":
        '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      userdata:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbiI6eyJjaXR5IjoiU3RhdGVuIElzbGFuZCIsInN0YXRlIjoiTlkiLCJ6aXBDb2RlIjoiMTAzMDEiLCJsb25naXR1ZGUiOi03NC4wOTM4LCJsYXRpdHVkZSI6NDAuNjI5NSwic291cmNlIjoiaXAifX0.9SWbIvzVS6sWsdoiyf8B9vs-Zw0D_kBRAaElnPK9kIs",
      "x-ou-d-token":
        "web-17d01ffadc2fb235ab5afd03917e608cf8c710a004c4bed9acaa1f01",
      "x-ou-f-token": "b00f0ffe9dc757a0dc1de9e825718cd4",
      "x-ou-usercontext":
        '{"device_id":"web-17d01ffadc2fb235ab5afd03917e608cf8c710a004c4bed9acaa1f01","user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36","device_platform":"web","device.last_known_location.dma_id":"501","device.last_known_location.dma_name":"New York, NY"}',
      "x-request-id": "0d7b28a3-d4ad-4184-9142-8879a2933e1d",
    },
    referrer: `https://offerup.com/search?q=${searchQuery}`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `{"operationName":"GetModularFeed","variables":{"debug":false,"searchParams":[{"key":"q","value":"${search}"},{"key":"platform","value":"web"},{"key":"lon","value":"-74.0938"},{"key":"lat","value":"40.6295"},{"key":"experiment_id","value":"experimentmodel24"},{"key":"limit","value":"50"},{"key":"searchSessionId","value":"936fc86e-afb3-4b8b-8d05-dc4d48bd4209"}]},"query":"query GetModularFeed($searchParams: [SearchParam], $debug: Boolean = false) {\\n  modularFeed(params: $searchParams, debug: $debug) {\\n    analyticsData {\\n      requestId\\n      searchPerformedEventUniqueId\\n      searchSessionId\\n      __typename\\n    }\\n    categoryInfo {\\n      categoryId\\n      isForcedCategory\\n      __typename\\n    }\\n    feedAdditions\\n    filters {\\n      ...modularFilterNumericRange\\n      ...modularFilterSelectionList\\n      __typename\\n    }\\n    legacyFeedOptions {\\n      ...legacyFeedOptionListSelection\\n      ...legacyFeedOptionNumericRange\\n      __typename\\n    }\\n    looseTiles {\\n      ...modularTileBanner\\n      ...modularTileBingAd\\n      ...modularTileGoogleDisplayAd\\n      ...modularTileJob\\n      ...modularTileEmptyState\\n      ...modularTileListing\\n      ...modularTileLocalDisplayAd\\n      ...modularTileSearchAlert\\n      ...modularTileSellerAd\\n      __typename\\n    }\\n    modules {\\n      ...modularGridModule\\n      __typename\\n    }\\n    pageCursor\\n    query {\\n      ...modularQueryInfo\\n      __typename\\n    }\\n    requestTimeMetadata {\\n      resolverComputationTimeSeconds\\n      serviceRequestTimeSeconds\\n      totalResolverTimeSeconds\\n      __typename\\n    }\\n    searchAlert {\\n      alertId\\n      alertStatus\\n      __typename\\n    }\\n    debugInformation @include(if: $debug) {\\n      rankedListings {\\n        listingId\\n        attributes {\\n          key\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      lastViewedItems {\\n        listingId\\n        attributes {\\n          key\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      categoryAffinities {\\n        affinity\\n        count\\n        decay\\n        affinityOwner\\n        __typename\\n      }\\n      rankingStats {\\n        key\\n        value\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment modularFilterNumericRange on ModularFeedNumericRangeFilter {\\n  isExpandedHighlight\\n  lowerBound {\\n    ...modularFilterNumericRangeBound\\n    __typename\\n  }\\n  shortcutLabel\\n  shortcutRank\\n  subTitle\\n  targetName\\n  title\\n  type\\n  upperBound {\\n    ...modularFilterNumericRangeBound\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment modularFilterNumericRangeBound on ModularFeedNumericRangeFilterNumericRangeBound {\\n  label\\n  limit\\n  placeholderText\\n  targetName\\n  value\\n  __typename\\n}\\n\\nfragment modularFilterSelectionList on ModularFeedSelectionListFilter {\\n  targetName\\n  title\\n  subTitle\\n  shortcutLabel\\n  shortcutRank\\n  type\\n  isExpandedHighlight\\n  options {\\n    ...modularFilterSelectionListOption\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment modularFilterSelectionListOption on ModularFeedSelectionListFilterOption {\\n  isDefault\\n  isSelected\\n  label\\n  subLabel\\n  value\\n  __typename\\n}\\n\\nfragment legacyFeedOptionListSelection on FeedOptionListSelection {\\n  label\\n  labelShort\\n  name\\n  options {\\n    default\\n    label\\n    labelShort\\n    selected\\n    subLabel\\n    value\\n    __typename\\n  }\\n  position\\n  queryParam\\n  type\\n  __typename\\n}\\n\\nfragment legacyFeedOptionNumericRange on FeedOptionNumericRange {\\n  label\\n  labelShort\\n  leftQueryParam\\n  lowerBound\\n  name\\n  options {\\n    currentValue\\n    label\\n    textHint\\n    __typename\\n  }\\n  position\\n  rightQueryParam\\n  type\\n  units\\n  upperBound\\n  __typename\\n}\\n\\nfragment modularTileBanner on ModularFeedTileBanner {\\n  tileId\\n  tileType\\n  title\\n  __typename\\n}\\n\\nfragment modularTileBingAd on ModularFeedTileBingAd {\\n  tileId\\n  bingAd {\\n    ouAdId\\n    adExperimentId\\n    adNetwork\\n    adRequestId\\n    adTileType\\n    clickFeedbackUrl\\n    clickReturnUrl\\n    contentUrl\\n    experimentDataHash\\n    image {\\n      height\\n      url\\n      width\\n      __typename\\n    }\\n    impressionFeedbackUrl\\n    installmentInfo {\\n      amount\\n      description\\n      downPayment\\n      __typename\\n    }\\n    itemName\\n    lowPrice\\n    price\\n    searchId\\n    sellerName\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularTileGoogleDisplayAd on ModularFeedTileGoogleDisplayAd {\\n  tileId\\n  googleDisplayAd {\\n    ouAdId\\n    additionalSizes\\n    adExperimentId\\n    adHeight\\n    adNetwork\\n    adPage\\n    adRequestId\\n    adTileType\\n    adWidth\\n    adaptive\\n    channel\\n    clickFeedbackUrl\\n    clientId\\n    contentUrl\\n    customTargeting {\\n      key\\n      values\\n      __typename\\n    }\\n    displayAdType\\n    errorDrawable {\\n      actionPath\\n      listImage {\\n        height\\n        url\\n        width\\n        __typename\\n      }\\n      __typename\\n    }\\n    experimentDataHash\\n    formatIds\\n    impressionFeedbackUrl\\n    personalizationProperties {\\n      key\\n      values\\n      __typename\\n    }\\n    prebidConfigs {\\n      key\\n      values {\\n        timeout\\n        __typename\\n      }\\n      __typename\\n    }\\n    renderLocation\\n    searchId\\n    searchQuery\\n    templateId\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularTileJob on ModularFeedTileJob {\\n  tileId\\n  tileType\\n  job {\\n    address {\\n      city\\n      state\\n      zipcode\\n      __typename\\n    }\\n    companyName\\n    datePosted\\n    image {\\n      height\\n      url\\n      width\\n      __typename\\n    }\\n    industry\\n    jobId\\n    jobListingUrl\\n    pills {\\n      text\\n      type\\n      __typename\\n    }\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment modularTileEmptyState on ModularFeedTileEmptyState {\\n  tileId\\n  tileType\\n  title\\n  description\\n  iconType\\n  __typename\\n}\\n\\nfragment modularTileListing on ModularFeedTileListing {\\n  tileId\\n  listing {\\n    ...modularListing\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularListing on ModularFeedListing {\\n  listingId\\n  conditionText\\n  flags\\n  image {\\n    height\\n    url\\n    width\\n    __typename\\n  }\\n  isFirmPrice\\n  locationName\\n  price\\n  title\\n  vehicleMiles\\n  __typename\\n}\\n\\nfragment modularTileLocalDisplayAd on ModularFeedTileLocalDisplayAd {\\n  tileId\\n  localDisplayAd {\\n    ouAdId\\n    adExperimentId\\n    adNetwork\\n    adRequestId\\n    adTileType\\n    advertiserId\\n    businessName\\n    callToAction\\n    callToActionType\\n    clickFeedbackUrl\\n    contentUrl\\n    experimentDataHash\\n    headline\\n    image {\\n      height\\n      url\\n      width\\n      __typename\\n    }\\n    impressionFeedbackUrl\\n    searchId\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularTileSearchAlert on ModularFeedTileSearchAlert {\\n  tileId\\n  tileType\\n  title\\n  __typename\\n}\\n\\nfragment modularTileSellerAd on ModularFeedTileSellerAd {\\n  tileId\\n  listing {\\n    ...modularListing\\n    __typename\\n  }\\n  sellerAd {\\n    ouAdId\\n    adId\\n    adExperimentId\\n    adNetwork\\n    adRequestId\\n    adTileType\\n    clickFeedbackUrl\\n    experimentDataHash\\n    impressionFeedbackUrl\\n    searchId\\n    __typename\\n  }\\n  tileType\\n  __typename\\n}\\n\\nfragment modularGridModule on ModularFeedModuleGrid {\\n  moduleId\\n  collection\\n  formFactor\\n  grid {\\n    actionPath\\n    tiles {\\n      ...modularModuleTileBingAd\\n      ...modularModuleTileGoogleDisplayAd\\n      ...modularModuleTileListing\\n      ...modularModuleTileLocalDisplayAd\\n      ...modularModuleTileSellerAd\\n      __typename\\n    }\\n    __typename\\n  }\\n  moduleType\\n  rank\\n  rowIndex\\n  searchId\\n  subTitle\\n  title\\n  infoActionPath\\n  __typename\\n}\\n\\nfragment modularModuleTileBingAd on ModularFeedTileBingAd {\\n  ...modularTileBingAd\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularModuleTileGoogleDisplayAd on ModularFeedTileGoogleDisplayAd {\\n  ...modularTileGoogleDisplayAd\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularModuleTileListing on ModularFeedTileListing {\\n  ...modularTileListing\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularModuleTileLocalDisplayAd on ModularFeedTileLocalDisplayAd {\\n  ...modularTileLocalDisplayAd\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularModuleTileSellerAd on ModularFeedTileSellerAd {\\n  ...modularTileSellerAd\\n  moduleId\\n  moduleRank\\n  moduleType\\n  __typename\\n}\\n\\nfragment modularQueryInfo on ModularFeedQueryInfo {\\n  appliedQuery\\n  decisionType\\n  originalQuery\\n  suggestedQuery\\n  __typename\\n}\\n"}`,
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
    dateAndLocation: listing.listing.locationName,
  }));

  // send results back
  res.json(results);
};
