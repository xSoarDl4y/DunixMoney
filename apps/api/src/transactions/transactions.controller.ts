import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard, AuthRequest } from "../auth/auth.guard";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { TransactionsService } from "./transactions.service";

@UseGuards(AuthGuard)
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactions: TransactionsService) {}
  @Get() list(@Req() req: AuthRequest) { return this.transactions.list(req.user.sub); }
  @Post() create(@Req() req: AuthRequest, @Body() dto: CreateTransactionDto) { return this.transactions.create(req.user.sub, dto); }
  @Patch(":id") update(@Req() req: AuthRequest, @Param("id") id: string, @Body() dto: UpdateTransactionDto) { return this.transactions.update(req.user.sub, id, dto); }
  @Delete(":id") remove(@Req() req: AuthRequest, @Param("id") id: string) { return this.transactions.remove(req.user.sub, id); }
}
