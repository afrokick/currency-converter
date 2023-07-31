import { API } from './api';
import { Cache } from './cache';
import { Elements } from './elements';
import { formatDate, formatNumber } from './utils';

let symbols: Record<string, string> = {};

const getSymbolTitle = (symbol: string) => symbols[symbol] ?? symbol;

(async () => {
  const api = new API();
  const cache = new Cache();
  const {
    dateElement,
    fromCurrencyAmountElement,
    fromCurrencyTitleElement,
    fromInputElement,
    toInputElement,
    toCurrencyTitleElement,
    toCurrencyAmountElement,
    fromSelectElement,
    toSelectElement,
    errorElement,
    errorTextElement,
  } = new Elements();

  const Alerts = {
    timeoutId: null,
    showError(text: string, duration = 3000) {
      errorTextElement.innerText = text;
      errorElement.classList.add('visible');

      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.hideError();
      }, duration);
    },
    hideError() {
      errorElement.classList.remove('visible');
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    },
  } as const;

  let fromSymbol = 'EUR';
  let toSymbol = 'USD';

  let fromAmount = 1;
  let toAmount = 1.1;

  try {
    const symbolsResponse = await api.fetchSymbols();
    if (symbolsResponse.success) {
      symbols = symbolsResponse.symbols;
    } else {
      throw new Error('No currencies');
    }
  } catch (e) {
    updateStatusText('Failed to load currencies. Try to refresh the page!');
    return;
  }

  const optionsHTML = Object.entries(symbols)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([symbol, title]) => {
      return `<option value="${symbol}">${title}</option>`;
    })
    .join('');
  fromSelectElement.innerHTML = optionsHTML;
  toSelectElement.innerHTML = optionsHTML;

  fromSelectElement.value = fromSymbol;
  toSelectElement.value = toSymbol;

  fromSelectElement.addEventListener('change', () => {
    fromSymbol = fromSelectElement.value;
    recalculate(fromAmount, null);
  });

  toSelectElement.addEventListener('change', () => {
    toSymbol = toSelectElement.value;
    recalculate(fromAmount, null);
  });

  fromInputElement.value = fromAmount.toString();
  fromInputElement.addEventListener('blur', () => {
    fromAmount = fromInputElement.valueAsNumber;
    recalculate(fromAmount, null);
  });

  toInputElement.value = toAmount.toString();
  toInputElement.addEventListener('blur', () => {
    toAmount = toInputElement.valueAsNumber;
    recalculate(null, toAmount);
  });

  function updateStatusText(text: string = '') {
    if (text) {
      dateElement.textContent = text;
    } else {
      const date = new Date();
      dateElement.textContent = formatDate(date) + ' · Disclaimer';
    }
  }

  async function recalculate(from: number | null, to: number | null) {
    updateStatusText('Updating...');

    let rate = cache.getRate(fromSymbol, toSymbol);
    if (rate == null) {
      try {
        const r = await api.getLatestRates(fromSymbol);
        if (r.success) {
          const rates = r.rates;
          Object.entries(rates).forEach(([to, rate]) => {
            cache.setRate(fromSymbol, to, rate);
          });
        }

        rate = cache.getRate(fromSymbol, toSymbol);
      } catch (e) {
        console.error(e);
      }
    }

    if (rate == null) {
      Alerts.showError(
        `Sorry, we can't receive an exchange rate for ${fromSymbol} -> ${toSymbol}. Try again a little bit later.`
      );
      updateStatusText('Failed to update the rate.');
      return;
    }

    console.log({ rate, fromSymbol, toSymbol });

    if (from != null) {
      fromAmount = from;
      toAmount = from * rate;
    } else if (to != null) {
      fromAmount = to / rate;
      toAmount = to;
    }

    updateStatusText();
    updateUI();
  }

  function updateUI() {
    const fromSymbolTitle = getSymbolTitle(fromSymbol);
    const toSymbolTitle = getSymbolTitle(toSymbol);

    fromCurrencyTitleElement.innerText = fromSymbolTitle;
    fromCurrencyAmountElement.innerText = formatNumber(fromAmount);

    toCurrencyTitleElement.innerText = toSymbolTitle;
    toCurrencyAmountElement.innerText = formatNumber(toAmount);

    fromInputElement.value = fromAmount.toString();
    toInputElement.value = toAmount.toString();
  }

  recalculate(fromAmount, null);
})();
