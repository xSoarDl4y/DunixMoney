import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("health")
  health() {
    return {
      service: "MONEYFLOW API",
      status: "ok",
      stage: "scaffold",
      message: "API đang hoạt động. Chưa kết nối database hoặc xác thực production."
    };
  }

  @Get("features")
  features() {
    return {
      coreModules: ["dashboard", "transactions", "reports", "debts", "budgets", "wallets"],
      implemented: false,
      note: "Đây là danh sách module định hướng, không phải các API nghiệp vụ đã hoàn thiện."
    };
  }
}
