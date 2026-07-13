# KARIGAR - Project Specification

Version: 1.0

Project Type: Full Stack Web Application

---

# 1. Project Overview

Karigar is an India-first platform that connects customers with verified local skilled workers such as electricians, plumbers, carpenters, painters, mechanics, AC technicians, cleaners, tailors, beauticians, masons, and other service professionals.

The goal is to make booking a trusted local worker as simple as booking a cab.

The platform should provide a seamless experience for customers while helping skilled workers receive more job opportunities and build trust through verified profiles and ratings.

---

# 2. Objectives

* Connect customers with nearby skilled workers.
* Increase employment opportunities for local workers.
* Provide transparent pricing.
* Enable secure online payments.
* Offer live booking and tracking.
* Build trust through worker verification.
* Support multiple Indian languages.
* Be scalable and production-ready.

---

# 3. User Roles

## Customer

Can:

* Register/Login
* Search workers
* Book services
* Track worker
* Chat with worker
* Make payments
* Rate workers
* Save favourite workers
* View booking history

---

## Worker

Can:

* Register
* Complete profile
* Upload verification documents
* Accept/Reject bookings
* Manage schedule
* Track earnings
* Chat with customers
* Receive payments
* View analytics

---

## Admin

Can:

* Manage users
* Verify workers
* View analytics
* Resolve complaints
* Manage categories
* Manage bookings
* Manage offers
* Block fraudulent users

---

# 4. Technology Stack

Frontend

* Next.js 15 (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* React Query

Backend

* Node.js
* Express.js

Database

* MongoDB Atlas
* Mongoose

Authentication

* JWT
* Google OAuth
* Phone OTP

Storage

* Cloudinary

Realtime

* Socket.io

Payments

* Razorpay

Maps

* Google Maps API
* Google Places API

Deployment

* Vercel
* Render

Version Control

* Git
* GitHub

---

# 5. Design Guidelines

Theme

* Premium
* Minimal
* Elegant
* Modern
* Indian

Color Palette

Primary
#F6F3EE

Secondary
#E8D8C4

Accent
#C97C5D

Dark
#2D2D2D

Success
#4CAF50

Warning
#F4B400

Error
#E53935

Typography

* Poppins
* Inter

Design Rules

* Rounded corners
* Soft shadows
* Spacious layouts
* Smooth animations
* Responsive design
* Accessible UI
* Mobile-first approach
* Minimal earthy colors
* Indian-inspired illustrations and subtle patterns

---

# 6. Application Features

## Authentication

* Register
* Login
* Google Login
* OTP Login
* Forgot Password
* Role-based Authentication
* Email Verification

---

## Customer Features

* Home Dashboard
* Location Detection
* Search Workers
* Voice Search
* Nearby Workers
* Category Browsing
* Worker Profiles
* Booking
* Live Tracking
* Payments
* Booking History
* Favourite Workers
* Notifications
* Reviews
* Profile Management

---

## Worker Features

* Worker Dashboard
* Job Requests
* Earnings Dashboard
* Calendar
* Portfolio
* Skills
* Pricing
* Availability
* Verification Upload
* Wallet
* Reviews
* Performance Analytics

---

## Admin Features

* Dashboard
* User Management
* Worker Verification
* Complaint Resolution
* Booking Management
* Revenue Analytics
* Coupons
* Categories
* Notifications

---

# 7. Service Categories

* Electrician
* Plumber
* Carpenter
* Painter
* Mechanic
* AC Repair
* RO Repair
* House Cleaning
* Tailor
* Beautician
* Mason
* Welder
* Cook
* Driver
* Gardener
* Tutor
* Babysitter

---

# 8. Main Screens

Public

* Landing Page
* Login
* Register
* About
* Contact
* FAQ

Customer

* Dashboard
* Search
* Worker Details
* Booking
* Payment
* Live Tracking
* Chat
* Notifications
* Booking History
* Settings

Worker

* Dashboard
* Profile
* Jobs
* Earnings
* Analytics
* Wallet
* Calendar
* Notifications

Admin

* Dashboard
* Users
* Workers
* Bookings
* Complaints
* Analytics
* Reports

---

# 9. Database Collections

Users

Workers

Bookings

Payments

Reviews

Chats

Messages

Notifications

Categories

Coupons

Complaints

Transactions

Analytics

Locations

---

# 10. API Modules

Authentication

Users

Workers

Bookings

Payments

Reviews

Notifications

Chats

Messages

Analytics

Admin

---

# 11. Folder Structure

frontend/

components/

features/

hooks/

lib/

services/

styles/

types/

app/

backend/

controllers/

routes/

models/

middleware/

services/

utils/

config/

socket/

uploads/

docs/

README.md

.env.example

---

# 12. Security Requirements

* JWT Authentication
* Role-based Authorization
* Password Hashing
* Input Validation
* Rate Limiting
* Helmet Security
* Secure File Uploads
* Protected APIs
* Environment Variables
* Secure Payment Flow

---

# 13. Performance Requirements

* Lazy Loading
* Image Optimization
* Pagination
* Debounced Search
* Caching
* Skeleton Loaders
* Code Splitting
* Responsive Images

---

# 14. Future Enhancements

* AI Worker Recommendation
* Voice Booking
* AI Price Estimator
* Offline Booking Support
* Regional Language Support
* Trust Score
* Emergency SOS Booking
* Government Skill Certificate Verification
* Predictive Worker Availability
* Referral Program
* Subscription Plans
* Worker Insurance
* AI Customer Support Chatbot

---

# 15. Development Rules for AI

When generating code:

* Always use TypeScript.
* Follow Clean Architecture.
* Build reusable components.
* Keep business logic separated from UI.
* Write modular code.
* Use meaningful variable names.
* Add comments where appropriate.
* Handle loading, success, and error states.
* Follow responsive design principles.
* Maintain accessibility standards.
* Do not generate placeholder code if a complete implementation is feasible.
* After completing each feature, stop and wait for approval before proceeding.

---

# 16. Development Order

Phase 1

* Project Setup
* Folder Structure
* Dependencies
* Configuration

Phase 2

* Authentication

Phase 3

* Database Models

Phase 4

* Landing Page

Phase 5

* Customer Dashboard

Phase 6

* Worker Dashboard

Phase 7

* Booking System

Phase 8

* Live Tracking

Phase 9

* Real-time Chat

Phase 10

* Payment Integration

Phase 11

* Notifications

Phase 12

* Admin Dashboard

Phase 13

* Testing

Phase 14

* Deployment

---

# 17. Final Goal

Build a professional, scalable, responsive, secure, production-ready application that showcases excellent UI/UX, clean architecture, and real-world engineering practices. The project should be suitable for hackathons, portfolio demonstrations, and future commercial development.
