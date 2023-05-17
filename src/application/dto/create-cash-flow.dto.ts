export class CreateCashFlowDto {
  constructor(
    public readonly document: string,
    public readonly password: string,
    public readonly name: string,
    public readonly balance: number,
  ) {}
}
