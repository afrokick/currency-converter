const KEY = '4cc2aae67c1ff738fd23f73b79111ed7';
const BASE_URL = 'http://data.fixer.io/api/';

type BaseResponse<TData> = ({ success: true } & TData) | { success: false; error: { code: number; info: string } };

type SymbolsResponse = BaseResponse<{
  symbols: Record<string, string>;
}>;

type LatestResponse = BaseResponse<{
  base: string;
  date: string;
  timestamp: number;
  rates: Record<string, number>;
}>;

export class API {
  private buildUrl(method: 'symbols' | 'latest', tail: string = '') {
    return BASE_URL + method + `?access_key=${KEY}` + tail;
  }

  async fetchSymbols(): Promise<SymbolsResponse> {
    const r = await fetch(this.buildUrl('symbols'));

    return r.json();
  }

  async getLatestRates(base: string): Promise<LatestResponse> {
    const r = await fetch(this.buildUrl('latest', `&base=` + base));

    return r.json();
  }
}
