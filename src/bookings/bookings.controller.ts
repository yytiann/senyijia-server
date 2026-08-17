import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ===== 元数据接口（必须在 :id 之前声明） =====

  // 获取服务项目列表
  @Get('meta/services')
  getServices() {
    const services = this.bookingsService.getServiceItems();
    return { code: 200, msg: 'success', data: services };
  }

  // 更新服务项目
  @Post('meta/services/:id')
  @HttpCode(HttpStatus.OK)
  updateService(@Param('id') id: string, @Body() body: { name?: string; description?: string; enabled?: boolean }) {
    const service = this.bookingsService.updateServiceItem(id, body);
    if (!service) {
      return { code: 404, msg: '服务项目不存在', data: null };
    }
    return { code: 200, msg: '更新成功', data: service };
  }

  // 获取设置
  @Get('meta/settings')
  getSettings() {
    const settings = this.bookingsService.getSettings();
    return { code: 200, msg: 'success', data: settings };
  }

  // 更新设置
  @Post('meta/settings')
  @HttpCode(HttpStatus.OK)
  updateSettings(@Body() body: { availableTimeSlots?: string[]; holidayClosed?: boolean; holidayDates?: string[] }) {
    const settings = this.bookingsService.updateSettings(body);
    return { code: 200, msg: '设置已更新', data: settings };
  }

  // 数据统计
  @Get('meta/statistics')
  getStatistics() {
    const stats = this.bookingsService.getStatistics();
    return { code: 200, msg: 'success', data: stats };
  }

  // 日历排期 - 按日期
  @Get('meta/schedule')
  getSchedule(@Query('date') date: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (startDate && endDate) {
      const schedule = this.bookingsService.getScheduleRange(startDate, endDate);
      return { code: 200, msg: 'success', data: schedule };
    }
    if (date) {
      const bookings = this.bookingsService.getScheduleByDate(date);
      return { code: 200, msg: 'success', data: bookings };
    }
    return { code: 400, msg: '请提供date或startDate+endDate参数', data: null };
  }

  // ===== 预约 CRUD 接口 =====

  // 创建预约
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() body: {
    userId?: string;
    serviceType: string;
    venueType: string;
    area: number;
    houseStatus: string;
    bookingDate: string;
    timeSlot: string;
    contactName: string;
    contactPhone: string;
    address: string;
    remark: string;
  }) {
    const booking = this.bookingsService.createBooking(body);
    return { code: 200, msg: '预约提交成功', data: booking };
  }

  // 获取预约列表（支持按用户筛选）
  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('serviceType') serviceType?: string
  ) {
    // 如果传入了 userId，则只返回该用户的预约（用户端）
    // 如果没有传入 userId，则返回所有预约（商户端）
    const bookings = this.bookingsService.getAllBookings({ userId, status, date, serviceType });
    return { code: 200, msg: 'success', data: bookings };
  }

  // 获取预约详情
  @Get(':id')
  findOne(@Param('id') id: string) {
    const booking = this.bookingsService.getBookingById(Number(id));
    if (!booking) {
      return { code: 404, msg: '订单不存在', data: null };
    }
    return { code: 200, msg: 'success', data: booking };
  }

  // 确认接单
  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  confirm(@Param('id') id: string) {
    const booking = this.bookingsService.updateBookingStatus(Number(id), 'confirmed');
    if (!booking) {
      return { code: 404, msg: '订单不存在', data: null };
    }
    return { code: 200, msg: '已确认接单', data: booking };
  }

  // 排期
  @Post(':id/schedule')
  @HttpCode(HttpStatus.OK)
  schedule(@Param('id') id: string, @Body() body: { bookingDate: string; timeSlot: string; scheduleStartTime?: string; scheduleDuration?: number }) {
    const booking = this.bookingsService.updateBookingDate(
      Number(id),
      body.bookingDate,
      body.timeSlot,
      body.scheduleStartTime,
      body.scheduleDuration
    );
    if (!booking) {
      return { code: 404, msg: '订单不存在', data: null };
    }
    this.bookingsService.updateBookingStatus(Number(id), 'scheduled');
    return { code: 200, msg: '已排期', data: booking };
  }

  // 标记完成
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@Param('id') id: string) {
    const booking = this.bookingsService.updateBookingStatus(Number(id), 'completed');
    if (!booking) {
      return { code: 404, msg: '订单不存在', data: null };
    }
    return { code: 200, msg: '已完成', data: booking };
  }

  // 取消预约
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@Param('id') id: string) {
    const booking = this.bookingsService.updateBookingStatus(Number(id), 'cancelled');
    if (!booking) {
      return { code: 404, msg: '订单不存在', data: null };
    }
    return { code: 200, msg: '已取消预约', data: booking };
  }

  // 添加商家备注
  @Post(':id/remark')
  @HttpCode(HttpStatus.OK)
  addRemark(@Param('id') id: string, @Body() body: { adminRemark: string }) {
    const booking = this.bookingsService.updateAdminRemark(Number(id), body.adminRemark);
    if (!booking) {
      return { code: 404, msg: '订单不存在', data: null };
    }
    return { code: 200, msg: '备注已更新', data: booking };
  }
}
