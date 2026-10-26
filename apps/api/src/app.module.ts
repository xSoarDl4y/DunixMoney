import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AuthGuard } from "./auth/auth.guard";
import { TransactionsController } from "./transactions/transactions.controller";
import { TransactionsService } from "./transactions/transactions.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>("JWT_SECRET");
        if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
          throw new Error("JWT_SECRET must be configured with at least 32 characters in production.");
        }
        return { global: true, secret: secret || "local-dev-only-change-this-secret-before-deploying", signOptions: { expiresIn: "7d" } };
      },
    }),
  ],
  controllers: [AppController, AuthController, TransactionsController],
  providers: [PrismaService, AuthService, AuthGuard, TransactionsService],
})
export class AppModule {}
