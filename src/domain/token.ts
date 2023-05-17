import { DomainException } from '@domain/exception/domain.exception';

export class Token {
  constructor(public readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (this.value.length <= 0) {
      throw new DomainException('Token value should not be empty.');
    }
  }
}
