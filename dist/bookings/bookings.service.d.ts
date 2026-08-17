export interface Booking {
    id: number;
    userId: string;
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
    scheduleStartTime?: string;
    scheduleDuration?: number;
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
export declare class BookingsService {
    private bookings;
    private nextId;
    private serviceItems;
    private settings;
    createBooking(data: Partial<Booking>): Booking;
    getAllBookings(filters?: {
        status?: string;
        date?: string;
        serviceType?: string;
        userId?: string;
    }): Booking[];
    getBookingById(id: number): Booking | null;
    updateBookingStatus(id: number, status: Booking['status']): Booking | null;
    updateAdminRemark(id: number, adminRemark: string): Booking | null;
    updateBookingDate(id: number, bookingDate: string, timeSlot: string, scheduleStartTime?: string, scheduleDuration?: number): Booking | null;
    getServiceItems(): ServiceItem[];
    updateServiceItem(id: string, data: Partial<ServiceItem>): ServiceItem | null;
    getSettings(): AppSettings;
    updateSettings(data: Partial<AppSettings>): AppSettings;
    getStatistics(): {
        total: number;
        byStatus: Record<string, number>;
        byService: Record<string, number>;
        todayCount: number;
    };
    getScheduleByDate(date: string): Booking[];
    getScheduleRange(startDate: string, endDate: string): Record<string, Booking[]>;
}
