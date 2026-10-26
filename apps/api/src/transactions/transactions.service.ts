import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TransactionType } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  list(userId: string) {
    return this.prisma.transaction.findMany({ where: { userId }, orderBy: [{ date: "desc" }, { createdAt: "desc" }] });
  }
  create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({ data: {
      userId, title: dto.title.trim(), amount: new Prisma.Decimal(dto.amount), type: dto.type as TransactionType,
      category: dto.category.trim(), date: new Date(`${dto.date.slice(0, 10)}T00:00:00.000Z`), note: dto.note?.trim() || null,
    } });
  }
  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException("Không tìm thấy giao dịch.");
    return this.prisma.transaction.update({ where: { id }, data: {
      ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
      ...(dto.amount !== undefined ? { amount: new Prisma.Decimal(dto.amount) } : {}),
      ...(dto.type !== undefined ? { type: dto.type as TransactionType } : {}),
      ...(dto.category !== undefined ? { category: dto.category.trim() } : {}),
      ...(dto.date !== undefined ? { date: new Date(`${dto.date.slice(0, 10)}T00:00:00.000Z`) } : {}),
      ...(dto.note !== undefined ? { note: dto.note.trim() || null } : {}),
    } });
  }
  async remove(userId: string, id: string) {
    const result = await this.prisma.transaction.deleteMany({ where: { id, userId } });
    if (!result.count) throw new NotFoundException("Không tìm thấy giao dịch.");
    return { deleted: true };
  }
}
