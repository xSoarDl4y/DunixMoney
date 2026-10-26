import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

export type AuthRequest = Request & { user: { sub: string; email: string } };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new UnauthorizedException("Vui lòng đăng nhập.");
    try {
      req.user = await this.jwt.verifyAsync(header.slice(7));
      return Boolean(req.user?.sub);
    } catch {
      throw new UnauthorizedException("Phiên đăng nhập hết hạn hoặc không hợp lệ.");
    }
  }
}
