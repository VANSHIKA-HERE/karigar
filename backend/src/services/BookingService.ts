import BookingModel from "../models/Booking";
import { IBooking, BookingStatus } from "../models/Booking";
import PaymentModel from "../models/Payment";
import ServiceCategory from "../models/ServiceCategory";
import { Types } from "mongoose";

export class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(
    customerId: string,
    workerId: string,
    categoryId: string,
    serviceTitle: string,
    serviceDescription: string,
    scheduledDate: string,
    duration: number,
    location: any,
    notes?: string
  ) {
    // Verify category exists
    const category = await ServiceCategory.findById(categoryId);
    if (!category) {
      throw new Error("Service category not found");
    }

    // Calculate pricing
    const basePrice = (duration / 60) * category.baseRate;
    const taxAmount = Math.round(basePrice * 0.05); // 5% tax
    const totalAmount = basePrice + taxAmount;

    const booking = await BookingModel.create({
      customerId: new Types.ObjectId(customerId),
      workerId: new Types.ObjectId(workerId),
      categoryId: new Types.ObjectId(categoryId),
      status: "pending",
      serviceTitle,
      serviceDescription,
      scheduledDate: new Date(scheduledDate),
      duration,
      basePrice,
      taxAmount,
      totalAmount,
      location,
      notes,
    });

    return booking.populate([
      { path: "customerId", select: "email phone" },
      { path: "workerId", select: "email phone" },
      { path: "categoryId", select: "name icon" },
    ]);
  }

  /**
   * Update booking details (before acceptance)
   */
  async updateBooking(
    bookingId: string,
    customerId: string,
    updates: Partial<IBooking>
  ) {
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.customerId.toString() !== customerId) {
      throw new Error("Unauthorized: Only booking customer can update");
    }

    if (booking.status !== "pending") {
      throw new Error("Cannot update booking that is not pending");
    }

    // Recalculate pricing if duration changes
    if (updates.duration) {
      const category = await ServiceCategory.findById(booking.categoryId);
      if (category) {
        const basePrice = (updates.duration / 60) * category.baseRate;
        updates.basePrice = basePrice;
        updates.taxAmount = Math.round(basePrice * 0.05);
        updates.totalAmount = basePrice + updates.taxAmount;
      }
    }

    Object.assign(booking, updates);
    await booking.save();

    return booking.populate([
      { path: "customerId", select: "email phone" },
      { path: "workerId", select: "email phone" },
      { path: "categoryId", select: "name" },
    ]);
  }

  /**
   * Cancel booking
   */
  async cancelBooking(
    bookingId: string,
    userId: string,
    reason: string,
    userRole: "customer" | "worker"
  ) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    const isCustomer = userRole === "customer";
    const isOwner = isCustomer
      ? booking.customerId.toString() === userId
      : booking.workerId.toString() === userId;

    if (!isOwner) {
      throw new Error("Unauthorized: Cannot cancel this booking");
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new Error(`Cannot cancel booking with status: ${booking.status}`);
    }

    booking.status = "cancelled";
    if (isCustomer) {
      booking.customerCancellationReason = reason;
    } else {
      booking.workerCancellationReason = reason;
    }

    await booking.save();
    return booking;
  }

  /**
   * Get booking history for customer or worker
   */
  async getBookingHistory(
    userId: string,
    userRole: "customer" | "worker",
    status?: BookingStatus,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const query: any = {
      isDeleted: false,
    };

    if (userRole === "customer") {
      query.customerId = new Types.ObjectId(userId);
    } else {
      query.workerId = new Types.ObjectId(userId);
    }

    if (status) {
      query.status = status;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("customerId", "email phone firstName lastName")
        .populate("workerId", "email phone firstName lastName")
        .populate("categoryId", "name icon")
        .populate("paymentId", "status method amount")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query),
    ]);

    return {
      bookings,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get booking details
   */
  async getBookingDetails(bookingId: string) {
    const booking = await Booking.findById(bookingId)
      .populate("customerId", "email phone firstName lastName")
      .populate("workerId", "email phone firstName lastName")
      .populate("categoryId", "name baseRate icon")
      .populate("paymentId")
      .populate("workerReviewId");

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  }

  /**
   * Accept booking (worker action)
   */
  async acceptBooking(bookingId: string, workerId: string) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.workerId.toString() !== workerId) {
      throw new Error("Unauthorized: Only assigned worker can accept");
    }

    if (booking.status !== "pending") {
      throw new Error("Booking is not pending");
    }

    booking.status = "accepted";
    await booking.save();
    return booking;
  }

  /**
   * Complete booking (worker/admin action)
   */
  async completeBooking(bookingId: string, workerId: string) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.workerId.toString() !== workerId) {
      throw new Error("Unauthorized");
    }

    if (booking.status !== "in_progress") {
      throw new Error("Booking is not in progress");
    }

    booking.status = "completed";
    booking.completionDate = new Date();
    await booking.save();
    return booking;
  }
}

export default new BookingService();
