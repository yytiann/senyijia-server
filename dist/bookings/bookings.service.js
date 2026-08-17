"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
let BookingsService = class BookingsService {
    constructor() {
        this.bookings = [];
        this.nextId = 1;
        this.serviceItems = [
            { id: 'formaldehyde', name: '除甲醛治理', description: '新房/二手房专业除醛', enabled: true },
            { id: 'disinfection', name: '全屋消杀消毒', description: '深度杀菌·安全无害', enabled: true },
            { id: 'comprehensive', name: '环境综合治理', description: 'TVOC/苯系物/异味全面治理', enabled: true },
            { id: 'detection', name: '环境检测服务', description: 'CMA标准专业检测', enabled: true },
        ];
        this.settings = {
            availableTimeSlots: ['morning', 'afternoon', 'allday'],
            holidayClosed: false,
            holidayDates: [],
        };
    }
    createBooking(data) {
        const now = new Date().toISOString();
        const booking = {
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
    getAllBookings(filters) {
        let result = [...this.bookings];
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
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return result;
    }
    getBookingById(id) {
        return this.bookings.find((b) => b.id === id) || null;
    }
    updateBookingStatus(id, status) {
        const booking = this.bookings.find((b) => b.id === id);
        if (!booking)
            return null;
        booking.status = status;
        booking.updatedAt = new Date().toISOString();
        return booking;
    }
    updateAdminRemark(id, adminRemark) {
        const booking = this.bookings.find((b) => b.id === id);
        if (!booking)
            return null;
        booking.adminRemark = adminRemark;
        booking.updatedAt = new Date().toISOString();
        return booking;
    }
    updateBookingDate(id, bookingDate, timeSlot, scheduleStartTime, scheduleDuration) {
        const booking = this.bookings.find((b) => b.id === id);
        if (!booking)
            return null;
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
    getServiceItems() {
        return this.serviceItems;
    }
    updateServiceItem(id, data) {
        const item = this.serviceItems.find((s) => s.id === id);
        if (!item)
            return null;
        if (data.name !== undefined)
            item.name = data.name;
        if (data.description !== undefined)
            item.description = data.description;
        if (data.enabled !== undefined)
            item.enabled = data.enabled;
        return item;
    }
    getSettings() {
        return this.settings;
    }
    updateSettings(data) {
        if (data.availableTimeSlots !== undefined)
            this.settings.availableTimeSlots = data.availableTimeSlots;
        if (data.holidayClosed !== undefined)
            this.settings.holidayClosed = data.holidayClosed;
        if (data.holidayDates !== undefined)
            this.settings.holidayDates = data.holidayDates;
        return this.settings;
    }
    getStatistics() {
        const today = new Date().toISOString().split('T')[0];
        const byStatus = {};
        const byService = {};
        let todayCount = 0;
        for (const b of this.bookings) {
            byStatus[b.status] = (byStatus[b.status] || 0) + 1;
            byService[b.serviceType] = (byService[b.serviceType] || 0) + 1;
            if (b.createdAt.startsWith(today))
                todayCount++;
        }
        return {
            total: this.bookings.length,
            byStatus,
            byService,
            todayCount,
        };
    }
    getScheduleByDate(date) {
        return this.bookings.filter((b) => b.bookingDate === date && b.status !== 'cancelled');
    }
    getScheduleRange(startDate, endDate) {
        const result = {};
        const filtered = this.bookings.filter((b) => b.bookingDate >= startDate && b.bookingDate <= endDate && b.status !== 'cancelled');
        for (const b of filtered) {
            if (!result[b.bookingDate]) {
                result[b.bookingDate] = [];
            }
            result[b.bookingDate].push(b);
        }
        return result;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)()
], BookingsService);
//# sourceMappingURL=bookings.service.js.map