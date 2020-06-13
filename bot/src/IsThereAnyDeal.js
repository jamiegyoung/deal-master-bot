const { apiKey } = require('../configs/isthereanydeal.json');
const fetch = require('node-fetch');
// const db = require('../src/db');
const currencies = require('../configs/currency.json');

const deal = module.exports;

// .toFixed is weird - https://stackoverflow.com/a/18358056
const roundToTwo = num => Number(`${Math.round(`${num}e+2`)}e-2`);

deal.getPlainGameName = async roughGameName => {
  if (!roughGameName) return false;
  const titleRes = await fetch(`https://api.isthereanydeal.com/v02/game/plain/?key=${apiKey}&title=${roughGameName}`)
    .then(res => res.json());
  if (!titleRes.data.plain) return false;
  return titleRes.data.plain;
};

deal.getDeal = async (gameName, country) => {
  const res = await fetch(`https://api.isthereanydeal.com/v01/game/prices/?key=${apiKey}&plains=${gameName}&country=${country}`)
    .then(res => res.json());
  // Remove deals that have no discounts
  try {
    const filteredDealList = res.data[gameName].list.filter(deal => (deal.price_cut));
    // Limit the number of deals to 5
    const dealList = filteredDealList.length > 5 ? filteredDealList.slice(0, 5) : filteredDealList;

    const currencyChar = currencies[country];
    if (!currencyChar) return {
      err: 'No country set, use the $setcountry command to set one! For more information use $help setcountry.'
    };

    if (!dealList.length) return {
      err: 'No deals found!'
    };

    return dealList.map(deal => ({
      name: deal.shop.name,
      url: deal.url,
      value: `**Price: **${currencyChar}${roundToTwo(deal.price_new)} ~~${currencyChar}${roundToTwo(deal.price_old)}~~\n**${Math.round(deal.price_cut)}% Off**\n**[Link](${deal.url})**`,
    }));

  } catch (error) {
    console.error('Something went wrong mapping dealList');
    return {
      err: 'No deals found!'
    };
  }
};
