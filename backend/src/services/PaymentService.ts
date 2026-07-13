import PaymentModel from "../models/Payment";
import BookingModel from "../models/Booking";
import crypto from "crypto";
import { Types } from "mongoose";

export class PaymentService {
  /**
   * Create payment order with Razorpay
   */
  async createPayment(
    bookingId: string,
    customerId: string,
    amount: number,
    method: string
  ) {
    // Verify booking
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.customerId.toString() !== customerId) {
      throw new Error("Unauthorized: Only booking customer can pay");
    }

    // Verify amount matches
    if (Math.abs(amount - booking.totalAmount) > 0.01) {
      throw new Error("Payment amount does not match booking total");
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const payment = await PaymentModel.create({
      bookingId: new Types.ObjectId(bookingId),
      customerId: new Types.ObjectId(customerId),
      workerId: booking.workerId,
      status: "pending",
      method,
      amount,
      currency: "INR",
      transactionId,
      description: `Payment for booking: ${booking.serviceTitle}`,
      workerAmount: Math.round(amount * 0.8), // 80% to worker, 20% platform fee
      platformFee: Math.round(amount * 0.2),
      receipt: `RECEIPT-${Date.now()}`,
      metadata: {
        paymentGateway: "razorpay",
      },
    });

    // In production, this would call Razorpay API to create order
    // For now, return payment object
    return {
      paymentId: payment._id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
      // Razorpay specific fields would go here
      razorpayOrderId: `order_${Date.now()}`, // Placeholder
    };
  }

  /**
   * Verify payment signature from Razorpay webhook
   */
  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    // Verify Razorpay signature
    // In production, this would validate against Razorpay's public key
    const isSignatureValid = this.validateRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      throw new Error("Invalid payment signature");
    }

    // Find payment by razorpayOrderId (should match via booking relationship)
    const payment = await PaymentModel.findOne({
      razorpayOrderId,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Update payment status
    payment.status = "completed";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // Update booking status
    const booking = await BookingModel.findById(payment.bookingId);
    if (booking) {
      booking.paymentId = payment._id;
      booking.status = "accepted"; // Auto-accept after payment
      await booking.save();
    }

    return {
      success: true,
      paymentId: payment._id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      status: payment.status,
    };
  }

  /**
   * Validate Razorpay webhook signature
   * In production, use Razorpay's public key from environment
   */
  private validateRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    // Placeholder validation
    // In production:
    // const expectedSignature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    //   .update(`${orderId}|${paymentId}`)
    //   .digest("hex");
    // return expectedSignature === signature;

    return signature.length > 0; // Placeholder
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, refundAmount: number) {
    const payment = await PaymentModel.findById(paymentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "completed") {
      throw new Error("Can only refund completed payments");
    }

    if (refundAmount > payment.amount) {
      throw new Error("Refund amount exceeds payment amount");
    }

    payment.status = "refunded";
    payment.refundAmount = refundAmount;
    payment.refundedAt = new Date();
    await payment.save();

    return payment;
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentId: string) {
    const payment = await PaymentModel.findById(paymentId)
      .populate("bookingId", "serviceTitle totalAmount")
      .populate("customerId", "email phone")
      .populate("workerId", "email phone");

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }
}

export default new PaymentService();
