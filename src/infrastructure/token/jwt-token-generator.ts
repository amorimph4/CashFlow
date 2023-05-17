import { Injectable } from '@nestjs/common';
import { CashFlow } from '@domain/cash-flow';
import { TokenGeneratorInterface } from '@domain/interfaces/token-generator.interface';
import { Token } from '@domain/token';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class JwtTokenGenerator implements TokenGeneratorInterface {
  generate(cashFlow: CashFlow): Token {
    const jwtToken = Jwt.sign(
      {
        document: cashFlow.getDocument(),
        name: cashFlow.getName(),
      },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: '1h',
      },
    );

    return new Token(jwtToken);
  }
}
