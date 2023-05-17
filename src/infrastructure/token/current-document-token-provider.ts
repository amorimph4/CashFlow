import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as Jwt from 'jsonwebtoken';

export const CurretDocument = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    const decoded = Jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    return decoded.document;
  },
);

function extractTokenFromHeader(req: Request): string | undefined {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
