export class Elements {
  fromCurrencyTitleElement = document.querySelector<HTMLElement>('.from .currency')!;
  fromCurrencyAmountElement = document.querySelector<HTMLElement>('.from .amount')!;

  toCurrencyTitleElement = document.querySelector<HTMLElement>('.to .currency')!;

  toCurrencyAmountElement = document.querySelector<HTMLElement>('.to .amount')!;

  fromInputElement = document.querySelector<HTMLInputElement>('.from-input-container input')!;
  toInputElement = document.querySelector<HTMLInputElement>('.to-input-container input')!;

  fromSelectElement = document.querySelector<HTMLSelectElement>('.from-input-container select')!;
  toSelectElement = document.querySelector<HTMLSelectElement>('.to-input-container select')!;

  dateElement = document.querySelector<HTMLElement>('.date')!;

  errorElement = document.querySelector<HTMLElement>('.error')!;
  errorTextElement = document.querySelector<HTMLElement>('.error-text')!;
}
