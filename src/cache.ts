export class Cache {
  private _cacheByCurrency = new Map<string, Map<string, number>>();

  getRate(from: string, to: string): number | undefined {
    return this._cacheByCurrency.get(from)?.get(to);
  }

  setRate(from: string, to: string, rate: number): void {
    this._setRate(from, to, rate);
    this._setRate(to, from, 1 / rate);
  }

  private _setRate(from: string, to: string, rate: number) {
    const base = this._cacheByCurrency.get(from);

    if (!base) {
      this._cacheByCurrency.set(from, new Map([[to, rate]]));
    } else {
      base.set(to, rate);
    }
  }
}
