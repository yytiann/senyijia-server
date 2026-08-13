import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { BookingsModule } from '@/bookings/bookings.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [BookingsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
