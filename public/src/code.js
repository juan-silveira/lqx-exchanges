// DOCUMENT
$(document).ready(function() {
  getLqxInfo("lqx_brl", "sell", 20);
  getLqxInfo("lqx_brl", "buy", 50);
});

// ===========================================================================
// Retrieve Information from Cointrade API
// ===========================================================================
function getLqxInfo(coinPair, operation, quantity) {
  var url = `https://api.cointradecx.com/public/orderbook?market=${coinPair}&type=${operation}&depth=${quantity}`;
  var type = operation;
  var priceFound;

  $.getJSON(url)
    .done(function(json) {
      var data = json.result[operation];

      // 1. Filter data
      // - remove orders with price of R$0,00
      // - concatenate orders with same price
      var i = 0;
      while (i < (data.length - 1)) {
        // order[i]
        var order = data[i];
        var quantity = Number(order.quantity);
        var price = Number(order.price);
        // order[i+1]
        var nextOrder = data[i + 1];
        var nextQuantity = Number(nextOrder.quantity);
        var nextPrice = Number(nextOrder.price);

        if (!quantity) {
          // remove item
          data.splice(i, 1);
          console.log(`REMOVED ${operation} order with price of ${price}: zero quantity`);
          continue;
        }

        if (price == nextPrice) {
          // accumulate values
          data[i + 1].quantity = (quantity + nextQuantity).toFixed(8);
          // remove item
          data.splice(i, 1);
          console.log(`REMOVED ${operation} order with price of ${price}: same price`);
          continue;
        }

        // next iteration
        i++;
      }

      // check last item
      var order = data[i];
      var quantity = Number(order.quantity);
      var price = Number(order.price);

      if (!quantity) {
        // remove item
        data.splice(i, 1);
        console.log(`REMOVED ${operation} order with price of ${price}: zero quantity`);
      }

      // resize selling array to 10 items
      if (operation == "sell") {
        var size = data.length;
        var excess = size - 10;
        if (excess > 0) {
          data.splice((size - excess), excess);
        }
      }

      // 2. Process data
      // - format values
      // - show itens on a list
      // - add color to highest buy and lowest sell
      var counter = 1;
      for (var i = 0; i < data.length; i++) {
        if (counter > 10) break;

        var order = type == "buy" ? data[i] : data[(data.length - 1) - i];
        var top = type == "sell" ? data[i] : data[(data.length - 1) - i];
        var quantity = Number(order.quantity);
        var value = Number(order.quantity) * Number(order.price);
        var price = Number(order.price);

        var formattedQuantity = numeral(quantity).format('0,0.00');
        var formattedPrice = numeral(price).format('0,0.000');
        var formattedValue = numeral(value).format('$0,0.00');

        $(`#${type}-table > tbody:last-child`).append(`
          <tr><td>${formattedQuantity}</td><td>${formattedPrice}</td><td>${formattedValue}</td></tr>
        `);
        counter++;

        // Show top selling price
        if (type == "sell" && !priceFound) {
          var topPrice = Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 3}).format(top.price)
          $("#price-show").text(`${topPrice}`).css({ "color": "#8BC34A" });
          priceFound = true;
        }
      }

      // Indicate highest buy and lowest sell
      $(`#buy-table tr:eq(1) td:eq(1)`).css({ "color": "#8BC34A", "font-weight": "bold" });
      $(`#sell-table tr:last-child td:eq(1)`).css({ "color": "#FFA000", "font-weight": "bold" });
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      alert("Request failed: " + err);
      console.log("Request failed: " + err);
    });
}