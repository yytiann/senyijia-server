import { Injectable } from '@nestjs/common';

export interface Booking {
  id: number;
  userId: string; // 用户标识（openid 或自定义 userId）
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
  status: 'pending' | 'confirmed' | 'scheduled' | 'in_service' | 'completed' | 'cancelled';
  adminRemark: string;
  scheduleStartTime?: string; // 排期开始时间
  scheduleDuration?: number; // 服务时长（小时）
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AppSettings {
  availableTimeSlots: string[];
  holidayClosed: boolean;
  holidayDates: string[];
}

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private nextId = 1;

  private serviceItems: ServiceItem[] = [
    { id: 'formaldehyde', name: '除甲醛治理', description: '新房/二手房专业除醛', enabled: true },
    { id: 'disinfection', name: '全屋消杀消毒', description: '深度杀菌·安全无害', enabled: true },
    { id: 'comprehensive', name: '环境综合治理', description: 'TVOC/苯系物/异味全面治理', enabled: true },
    { id: 'detection', name: '环境检测服务', description: 'CMA标准专业检测', enabled: true },
  ];

  private settings: AppSettings = {
    availableTimeSlots: ['morning', 'afternoon', 'allday'],
    holidayClosed: false,
    holidayDates: [],
  };

  // 创建预约
  createBooking(data: Partial<Booking>): Booking {
    const now = new Date().toISOString();
    const booking: Booking = {
      id: this.nextId++,
      userId: data.userId || 'anonymous',
      serviceType: data.serviceType || '',
      venueType: data.venueType || '',
      area: data.area || 0,
      houseStatus: data.houseStatus || '',
      bookingDate: data.bookingDate || '',
      timeSlot: data.timeSlot || '',
      contactName: data.contactName || '',
      contactPhone: data.contactPhone || '',
      address: data.address || '',
      remark: data.remark || '',
      status: 'pending',
      adminRemark: '',
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.push(booking);
    return booking;
  }

  // 获取所有预约（支持筛选）- 商户端使用，查看所有预约
  getAllBookings(filters?: { status?: string; date?: string; serviceType?: string; userId?: string }): Booking[] {
    let result = [...this.bookings];
    // 如果指定了 userId，则只返回该用户的预约（用户端使用）
    if (filters?.userId) {
      result = result.filter((b) => b.userId === filters.userId);
    }
    if (filters?.status) {
      result = result.filter((b) => b.status === filters.status);
    }
    if (filters?.date) {
      result = result.filter((b) => b.bookingDate === filters.date);
    }
    if (filters?.serviceType) {
      result = result.filter((b) => b.serviceType === filters.serviceType);
    }
    // 按创建时间倒序
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }

  // 获取单个预约
  getBookingById(id: number): Booking | null {
    return this.bookings.find((b) => b.id === id) || null;
  }

  // 更新预约状态
  updateBookingStatus(id: number, status: Booking['status']): Booking | null {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    return booking;
  }

  // 更新商家备注
  updateAdminRemark(id: number, adminRemark: string): Booking | null {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.adminRemark = adminRemark;
    booking.updatedAt = new Date().toISOString();
    return booking;
  }

  // 修改预约时间/排期
  updateBookingDate(id: number, bookingDate: string, timeSlot: string, scheduleStartTime?: string, scheduleDuration?: number): Booking | null {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.bookingDate = bookingDate;
    booking.timeSlot = timeSlot;
    if (scheduleStartTime !== undefined) {
      booking.scheduleStartTime = scheduleStartTime;
    }
    if (scheduleDuration !== undefined) {
      booking.scheduleDuration = scheduleDuration;
    }
    booking.updatedAt = new Date().toISOString();
    return booking;
  }

  // 获取服务项目列表
  getServiceItems(): ServiceItem[] {
    return this.serviceItems;
  }

  // 更新服务项目
  updateServiceItem(id: string, data: Partial<ServiceItem>): ServiceItem | null {
    const item = this.serviceItems.find((s) => s.id === id);
    if (!item) return null;
    if (data.name !== undefined) item.name = data.name;
    if (data.description !== undefined) item.description = data.description;
    if (data.enabled !== undefined) item.enabled = data.enabled;
    return item;
  }

  // 获取设置
  getSettings(): AppSettings {
    return this.settings;
  }

  // 更新设置
  updateSettings(data: Partial<AppSettings>): AppSettings {
    if (data.availableTimeSlots !== undefined) this.settings.availableTimeSlots = data.availableTimeSlots;
    if (data.holidayClosed !== undefined) this.settings.holidayClosed = data.holidayClosed;
    if (data.holidayDates !== undefined) this.settings.holidayDates = data.holidayDates;
    return this.settings;
  }

  // 数据统计
  getStatistics(): {
    total: number;
    byStatus: Record<string, number>;
    byService: Record<string, number>;
    todayCount: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const byStatus: Record<string, number> = {};
    const byService: Record<string, number> = {};
    let todayCount = 0;

    for (const b of this.bookings) {
      byStatus[b.status] = (byStatus[b.status] || 0) + 1;
      byService[b.serviceType] = (byService[b.serviceType] || 0) + 1;
      if (b.createdAt.startsWith(today)) todayCount++;
    }

    return {
      total: this.bookings.length,
      byStatus,
      byService,
      todayCount,
    };
  }

  // 日历排期视图
  getScheduleByDate(date: string): Booking[] {
    return this.bookings.filter(
      (b) => b.bookingDate === date && b.status !== 'cancelled'
    );
  }

  // 获取日期范围的排期
  getScheduleRange(startDate: string, endDate: string): Record<string, Booking[]> {
    const result: Record<string, Booking[]> = {};
    const filtered = this.bookings.filter(
      (b) => b.bookingDate >= startDate && b.bookingDate <= endDate && b.status !== 'cancelled'
    );
    for (const b of filtered) {
      if (!result[b.bookingDate]) {
        result[b.bookingDate] = [];
      }
      result[b.bookingDate].push(b);
    }
    return result;
  }
}
