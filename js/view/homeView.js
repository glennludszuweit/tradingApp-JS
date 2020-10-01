import stockController from '../controller/stocksController.js';
import LS from '../controller/lsController.js';
import chart from './chart.js';

class HomeView {
  async displayHomeView() {
    // display portfolio data
    this.displayMyData();
    // display trading history
    this.tradingHistory();
    // display to chart
    chart(
      [''],
      [(await stockController.calculateStocksValue()).toFixed(2)],
      [stockController.calculateInvestments().toFixed(2)]
    );
    this.clear();
  }

  async displayMyData() {
    basicInfo.innerHTML = `
    <div class="search-stock-info">
      <div>
        <small>Stocks Value</small>
        <div class="price-big stockValue">$ ${(
          await stockController.calculateStocksValue()
        ).toFixed(2)}</div>
      </div>
      <div>
        <small>Investments</small>
        <div class="price-big investmentsValue">$ ${stockController
          .calculateInvestments()
          .toFixed(2)}</div>
      </div>
      <div>
        <small>Earnings</small>
        <div class="price-big earnings">$ ${(
          (await stockController.calculateStocksValue()) -
          stockController.calculateInvestments()
        ).toFixed(2)}</div>
      </div>
    </div>
    `;

    const earnings = document.querySelector('.earnings');
    let x =
      (await stockController.calculateStocksValue()) -
      stockController.calculateInvestments();
    if (x == 0) {
      earnings.style.color = '#fff';
    } else if (x < 0) {
      earnings.style.color = '#fa4e3b';
    } else {
      earnings.style.color = '#46cf9a';
    }
  }

  tradingHistory() {
    const historyData = document.querySelector('.history-data');
    let stocks = LS.GET('stocks').sort((a, b) => b.date - a.date);
    let output = stocks.map((stock) => {
      if (stock.quantity < 0) {
        return `
          <tr>
            <td>${stock.symbol}</td>
            <td>$ ${stock.price.toFixed(2)}</td>
            <td>${stock.quantity}</td>
            <td>$ ${stock.value.toFixed(2)}</td>
            <td>${stock.date}</td>
            <td style="color: #fa4e3b">Sold</td>
          </tr>
      `;
      } else {
        return `
          <tr>
            <td>${stock.symbol}</td>
            <td>$ ${stock.price.toFixed(2)}</td>
            <td>${stock.quantity}</td>
            <td>$ ${stock.value.toFixed(2)}</td>
            <td>${stock.date}</td>
            <td style="color: #46cf9a">Bought</td>
          </tr>
      `;
      }
    });

    historyData.innerHTML = output.join('');
  }

  clear() {
    buyStocks.style.display = 'none';
    sellStocks.style.display = 'none';
    quantityInput.style.display = 'none';
    displayTradingHistory.style.display = '';
  }
}

export default new HomeView();
