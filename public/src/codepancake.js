// DOCUMENT
$(document).ready(function() {
  getLqxInfo();
});

// ===========================================================================
// Retrieve Information from Cointrade API
// ===========================================================================
function getLqxInfo() {
  
  var url = 'https://api.pancakeswap.finance/api/v1/price';
  var priceusd;

  $.getJSON(url)
  .done(function(json) {
    console.log(json)
    priceusd = json.prices.WLQX;
    console.log(priceusd);
  })

  var url1 = `https://economia.awesomeapi.com.br/all/USD-BRL,EUR-BRL,BTC-BRL`;

  $.getJSON(url1)
    .done(function(json) {
      var usd = json.USD.ask;
      var eur = json.EUR.ask;
      var btc = json.BTC.ask;

      var lqxusd = Intl.NumberFormat('pt-br', {style: 'currency', currency: 'USD', minimumFractionDigits: 6}).format(priceusd)
          $("#price-usd").text(`${lqxusd}`).css({ "color": "#8BC34A" });

      var lqxbrl = Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 6}).format(priceusd*usd)
          $("#price-brl").text(`${lqxbrl}`).css({ "color": "#8BC34A" });

      var lqxeur = Intl.NumberFormat('pt-br', {style: 'currency', currency: 'EUR', minimumFractionDigits: 6}).format(priceusd*usd/eur)
          $("#price-eur").text(`${lqxeur}`).css({ "color": "#8BC34A" });
    })

    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      alert("Request failed: " + err);
      console.log("Request failed: " + err);
    });
}