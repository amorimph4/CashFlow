export class CashFlow {
  constructor(
    private document: string,
    private password: string,
    private name: string,
    private balance?: number,
  ) {
    if (!this.balance) {
      this.balance = 0;
    }
  }

  public getDocument(): string {
    return this.document;
  }

  public getPassword(): string {
    return this.password;
  }

  public getName(): string {
    return this.name;
  }

  public getBalance(): number {
    return this.balance;
  }

  public passwordIsValid(password: string): boolean {
    return password === this.password;
  }

  public creditValue(value: number): void {
    this.balance = this.balance + value;
  }

  public debitValue(value: number): void {
    this.balance = this.balance - value;
  }
}
