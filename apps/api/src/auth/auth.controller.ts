import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard, AuthRequest } from "./auth.guard";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post("register") register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
  @Post("login") login(@Body() dto: LoginDto) { return this.auth.login(dto); }
  @UseGuards(AuthGuard) @Get("me") me(@Req() req: AuthRequest) { return this.auth.me(req.user.sub); }
}
