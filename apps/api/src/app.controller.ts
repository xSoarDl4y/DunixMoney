import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  // Kiểm tra API có hoạt động hay không
  @Get("health")
  health() {
    return {
      service: "MONEYFLOW API",
      status: "ok",
      version: "0.2.0",
      timestamp: new Date().toISOString(),
    };
  }

  // Kiểm tra kết nối cơ sở dữ liệu
  @Get("ready")
  async ready() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: "ready",
      database: "connected",
    };
  }
}