"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
let BookingsController = class BookingsController {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    getServices() {
        const services = this.bookingsService.getServiceItems();
        return { code: 200, msg: 'success', data: services };
    }
    updateService(id, body) {
        const service = this.bookingsService.updateServiceItem(id, body);
        if (!service) {
            return { code: 404, msg: '服务项目不存在', data: null };
        }
        return { code: 200, msg: '更新成功', data: service };
    }
    getSettings() {
        const settings = this.bookingsService.getSettings();
        return { code: 200, msg: 'success', data: settings };
    }
    updateSettings(body) {
        const settings = this.bookingsService.updateSettings(body);
        return { code: 200, msg: '设置已更新', data: settings };
    }
    getStatistics() {
        const stats = this.bookingsService.getStatistics();
        return { code: 200, msg: 'success', data: stats };
    }
    getSchedule(date, startDate, endDate) {
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
    create(body) {
        const booking = this.bookingsService.createBooking(body);
        return { code: 200, msg: '预约提交成功', data: booking };
    }
    findAll(userId, status, date, serviceType) {
        const bookings = this.bookingsService.getAllBookings({ userId, status, date, serviceType });
        return { code: 200, msg: 'success', data: bookings };
    }
    findOne(id) {
        const booking = this.bookingsService.getBookingById(Number(id));
        if (!booking) {
            return { code: 404, msg: '订单不存在', data: null };
        }
        return { code: 200, msg: 'success', data: booking };
    }
    confirm(id) {
        const booking = this.bookingsService.updateBookingStatus(Number(id), 'confirmed');
        if (!booking) {
            return { code: 404, msg: '订单不存在', data: null };
        }
        return { code: 200, msg: '已确认接单', data: booking };
    }
    schedule(id, body) {
        const booking = this.bookingsService.updateBookingDate(Number(id), body.bookingDate, body.timeSlot, body.scheduleStartTime, body.scheduleDuration);
        if (!booking) {
            return { code: 404, msg: '订单不存在', data: null };
        }
        this.bookingsService.updateBookingStatus(Number(id), 'scheduled');
        return { code: 200, msg: '已排期', data: booking };
    }
    complete(id) {
        const booking = this.bookingsService.updateBookingStatus(Number(id), 'completed');
        if (!booking) {
            return { code: 404, msg: '订单不存在', data: null };
        }
        return { code: 200, msg: '已完成', data: booking };
    }
    cancel(id) {
        const booking = this.bookingsService.updateBookingStatus(Number(id), 'cancelled');
        if (!booking) {
            return { code: 404, msg: '订单不存在', data: null };
        }
        return { code: 200, msg: '已取消预约', data: booking };
    }
    addRemark(id, body) {
        const booking = this.bookingsService.updateAdminRemark(Number(id), body.adminRemark);
        if (!booking) {
            return { code: 404, msg: '订单不存在', data: null };
        }
        return { code: 200, msg: '备注已更新', data: booking };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Get)('meta/services'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "getServices", null);
__decorate([
    (0, common_1.Post)('meta/services/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "updateService", null);
__decorate([
    (0, common_1.Get)('meta/settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)('meta/settings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)('meta/statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('meta/schedule'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('serviceType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/schedule'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "schedule", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/remark'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "addRemark", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map