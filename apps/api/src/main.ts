import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.setGlobalPrefix("api/v1");
  await app.listen(process.env.PORT || 4000);
  console.log(`MONEYFLOW API running on http://localhost:${process.env.PORT || 4000}/api/v1`);
}
bootstrap();
