import { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Send a successful API response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Request successful",
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

/**
 * Send a paginated successful response
 */
export const sendPaginatedSuccess = <T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  limit: number,
  message: string = "Request successful",
  statusCode: number = 200
): void => {
  const pages = Math.ceil(total / limit);
  const paginatedData: PaginatedResponse<T> = {
    items,
    total,
    page,
    limit,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };

  const response: ApiResponse<PaginatedResponse<T>> = {
    success: true,
    message,
    data: paginatedData,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

/**
 * Send an error API response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  error?: string,
  details?: Record<string, any>
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error: error || message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

/**
 * Send a validation error response
 */
export const sendValidationError = (
  res: Response,
  errors: Record<string, any>,
  message: string = "Validation failed"
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error: "VALIDATION_ERROR",
    details: errors,
    timestamp: new Date().toISOString(),
  };
  res.status(400).json(response);
};

/**
 * Helper to build pagination query
 */
export const getPaginationParams = (
  page?: string | number,
  limit?: string | number,
  maxLimit: number = 100
): { page: number; limit: number; skip: number } => {
  const p = Math.max(1, parseInt(String(page || 1)));
  const l = Math.min(maxLimit, Math.max(1, parseInt(String(limit || 20))));
  return {
    page: p,
    limit: l,
    skip: (p - 1) * l,
  };
};
