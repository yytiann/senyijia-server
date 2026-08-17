import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    getServices(): {
        code: number;
        msg: string;
        data: import("./bookings.service").ServiceItem[];
    };
    updateService(id: string, body: {
        name?: string;
        description?: string;
        enabled?: boolean;
    }): {
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./bookings.service").ServiceItem;
    };
    getSettings(): {
        code: number;
        msg: string;
        data: import("./bookings.service").AppSettings;
    };
    updateSettings(body: {
        availableTimeSlots?: string[];
        holidayClosed?: boolean;
        holidayDates?: string[];
    }): {
        code: number;
        msg: string;
        data: import("./bookings.service").AppSettings;
    };
    getStatistics(): {
        code: number;
        msg: string;
        data: {
            total: number;
            byStatus: Record<string, number>;
            byService: Record<string, number>;
            todayCount: number;
        };
    };
    getSchedule(date: string, startDate?: string, endDate?: string): {
        code: number;
        msg: string;
        data: Record<string, import("./bookings.service").Booking[]>;
    } | {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking[];
    } | {
        code: number;
        msg: string;
        data: null;
    };
    create(body: {
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
    }): {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking;
    };
    findAll(userId?: string, status?: string, date?: string, serviceType?: string): {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking[];
    };
    findOne(id: string): {
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking;
    };
    confirm(id: string): {
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking;
    };
    schedule(id: string, body: {
        bookingDate: string;
        timeSlot: string;
        scheduleStartTime?: string;
        scheduleDuration?: number;
    }): {
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking;
    };
    complete(id: string): {
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking;
    };
    cancel(id: string): {
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking;
    };
    addRemark(id: string, body: {
        adminRemark: string;
    }): {
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./bookings.service").Booking;
    };
}
