import { Worker, IWorker } from "../models/Worker";
import { Types } from "mongoose";

export class WorkerService {
  /**
   * Get all workers with pagination
   */
  async getAllWorkers(
    page: number = 1,
    limit: number = 20,
    isActive: boolean = true
  ) {
    const skip = (page - 1) * limit;

    const query = isActive ? { verificationStatus: "verified" } : {};

    const [workers, total] = await Promise.all([
      Worker.find(query)
        .populate("userId", "email phone firstName lastName profileImage")
        .select("-documents")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Worker.countDocuments(query),
    ]);

    return {
      workers,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get worker by ID with full details
   */
  async getWorkerById(workerId: string) {
    const worker = await Worker.findById(workerId)
      .populate("userId", "email phone firstName lastName profileImage averageRating")
      .populate("categories", "name baseRate description");

    if (!worker) {
      throw new Error("Worker not found");
    }

    return worker;
  }

  /**
   * Search workers by name or category
   */
  async searchWorkers(
    query: string,
    page: number = 1,
    limit: number = 20,
    latitude?: number,
    longitude?: number,
    radius: number = 10
  ) {
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery: any = {
      verificationStatus: "verified",
    };

    // Search by categories or user name
    const categoryRegex = new RegExp(query, "i");
    const workersWithCategory = await Worker.find({
      ...searchQuery,
      categories: { $in: query },
    })
      .populate("userId", "email phone firstName lastName profileImage")
      .select("-documents");

    // Also search by worker name via userId
    const usersWithName = await Worker.find(searchQuery)
      .populate({
        path: "userId",
        match: {
          $or: [
            { firstName: categoryRegex },
            { lastName: categoryRegex },
            { email: categoryRegex },
          ],
        },
        select: "email phone firstName lastName profileImage",
      })
      .select("-documents");

    // Combine and deduplicate
    const allWorkers = [...workersWithCategory, ...usersWithName];
    const uniqueWorkers = Array.from(
      new Map(allWorkers.map((w) => [w._id.toString(), w])).values()
    );

    // Apply geospatial filtering if coordinates provided
    let filteredWorkers = uniqueWorkers;
    if (latitude && longitude) {
      filteredWorkers = uniqueWorkers.filter((worker: IWorker) => {
        if (!worker.location?.latitude || !worker.location?.longitude) {
          return true; // Include workers without location data
        }
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          worker.location.latitude,
          worker.location.longitude
        );
        return distance <= radius;
      });
    }

    const total = filteredWorkers.length;
    const paginatedWorkers = filteredWorkers.slice(skip, skip + limit);

    return {
      workers: paginatedWorkers,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Filter workers by category, rating, price, location
   */
  async filterWorkers(
    categoryId?: string,
    minRating: number = 0,
    maxPrice?: number,
    minPrice?: number,
    isVerified: boolean = true,
    page: number = 1,
    limit: number = 20,
    latitude?: number,
    longitude?: number,
    radius: number = 10
  ) {
    const skip = (page - 1) * limit;

    const query: any = {
      isActive: true,
    };

    if (isVerified) {
      query.verificationStatus = "verified";
    }

    if (categoryId) {
      query.categories = new Types.ObjectId(categoryId);
    }

    if (minRating > 0) {
      query.averageRating = { $gte: minRating };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.hourlyRate = {};
      if (minPrice !== undefined) query.hourlyRate.$gte = minPrice;
      if (maxPrice !== undefined) query.hourlyRate.$lte = maxPrice;
    }

    let [workers, total] = await Promise.all([
      Worker.find(query)
        .populate("userId", "email phone firstName lastName profileImage averageRating")
        .populate("categories", "name baseRate")
        .select("-documents")
        .skip(skip)
        .limit(limit)
        .sort({ averageRating: -1, createdAt: -1 }),
      Worker.countDocuments(query),
    ]);

    // Apply geospatial filtering if coordinates provided
    if (latitude && longitude) {
      workers = workers.filter((worker: IWorker) => {
        if (!worker.location?.latitude || !worker.location?.longitude) {
          return true; // Include workers without location data
        }
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          worker.location.latitude,
          worker.location.longitude
        );
        return distance <= radius;
      });
      total = workers.length; // Recalculate total after geospatial filter
    }

    return {
      workers: workers.slice(0, limit),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get worker statistics/analytics
   */
  async getWorkerStats(workerId: string) {
    const worker = await Worker.findById(workerId);

    if (!worker) {
      throw new Error("Worker not found");
    }

    return {
      totalBookings: worker.totalBookings || 0,
      averageRating: worker.averageRating || 0,
      totalReviews: worker.totalReviews || 0,
      cancellationRate: worker.cancellationRate || 0,
      verificationStatus: worker.verificationStatus,
      isVerified: worker.verificationStatus === "verified",
    };
  }
}

/**
 * Haversine formula to calculate distance between two coordinates
 */
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default new WorkerService();
