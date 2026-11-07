# System Architecture & Technical Handoff Document

**Project:** RailFleet Express — High-Concurrency Train Ticket Reservation & Dynamic Fleet Management System  
**Date:** October 7, 2026  
**Status:** Operational (FastAPI Backend + React / TypeScript Frontend)  

---

## 1. Executive Summary & Architecture Overview

RailFleet Express is an enterprise railway booking platform designed with clean separation of concerns, ACID transactional consistency, real-time seat inventory mapping, and live GPS train tracking.

### High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER / CLIENT                                    |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        FRONTEND LAYER (React 19 + TypeScript + Vite)              |
|                                                                                   |
|  [Left Sidebar Navigation]                                                        |
|    ├── Corridors & Route Search (Tab 1)                                           |
|    ├── Satellite Live Radar GPS (Tab 2)                                           |
|    ├── Train Schedules & Matrix (Tab 3)                                           |
|    ├── Interactive Seat & Coach Selector (Tab 4)                                  |
|    ├── Atomic Checkout & PNR Booking (Tab 5)                                      |
|    ├── Traveler History & Boarding Pass (Tab 6)                                   |
|    ├── Fleet Operations Admin Console (Tab 7)                                     |
|    └── Concurrency Stress Testing Modal                                           |
+-----------------------------------------------------------------------------------+
                                         │
                           HTTP / REST API (JSON)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                         BACKEND LAYER (FastAPI + Pydantic v2)                     |
|                                                                                   |
|  [FastAPI Endpoints (backend/main.py)]                                            |
|    ├── GET  /api/v1/stations                                                      |
|    ├── GET  /api/v1/trains?source={src}&destination={dst}&date={date}             |
|    ├── GET  /api/v1/trains/{id}/coaches/{coach_id}/seats                          |
|    ├── POST /api/v1/bookings  (Atomic BEGIN EXCLUSIVE)                            |
|    ├── GET  /api/v1/bookings/{pnr}                                                |
|    ├── GET  /api/v1/bookings/user/{email}                                         |
|    ├── DEL  /api/v1/bookings/{pnr}                                                |
|    ├── GET  /api/v1/admin/metrics & audit-logs                                    |
|    └── POST /api/v1/test/concurrency (Race Condition Stress Lab)                  |
+-----------------------------------------------------------------------------------+
                                         │
                             Direct SQLite / Prisma ORM
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                           PERSISTENCE & CONCURRENCY ENGINE                        |
|                                                                                   |
|  SQLite (`railway.db`) with Foreign Keys Enabled                                  |
|  Concurrency Isolation: `BEGIN EXCLUSIVE` Lock                                    |
|  Atomic Seat Allocations & Conflict Detection without Overbooking                 |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Structure (Clean Tab & Feature Modular Mapping)

The codebase is organized with clear tab/feature modularity matching the project conventions:

```
project/
├── backend/                               # Python FastAPI Server
│   ├── main.py                            # FastAPI entry point, routers & middleware
│   ├── database.py                        # SQLite connection pool, schema, seed data
│   ├── crud.py                            # Business logic & atomic transaction execution
│   ├── models.py                          # Pydantic v2 models (DTOs & schemas)
│   ├── railway.db                         # SQLite relational database
│   │
│   ├── tab_search/                        # Tab 1: Train Search & Station Lookup
│   │   └── search_service.py              # Station lookup, route search, filters
│   │
│   ├── tab_radar/                         # Tab 2: Live GPS Tracking & Telemetry
│   │   └── radar_service.py               # Satellite coordinates, speed, ETA calculators
│   │
│   ├── tab_booking/                       # Tab 3: Reservations & Seat Grid
│   │   ├── reservation_manager.py         # Atomic BEGIN EXCLUSIVE locking manager
│   │   └── seat_inventory.py              # Coach layout & berth matrix
│   │
│   ├── tab_admin/                         # Tab 4: Fleet Console & Concurrency Lab
│   │   ├── admin_metrics.py               # Occupancy metrics, audit logs
│   │   └── stress_benchmark.py            # Multi-threaded race condition harness
│   │
├── src/ (frontend/)                       # React 19 + TypeScript + Tailwind
│   ├── main.tsx                           # React DOM mount point
│   ├── App.tsx                            # Primary application container & tab router
│   ├── index.css                          # Global styles & Tailwind CSS configuration
│   │
│   ├── components/
│   │   ├── SidebarNav.tsx                 # Left vertical sidebar navigation
│   │   ├── Footer.tsx                     # Enterprise footer
│   │   ├── AuthModal.tsx                  # Sign In & Registration modal
│   │   ├── BoardingPassModal.tsx          # Ticket boarding pass viewer & download
│   │   └── ConcurrencyLabModal.tsx        # In-browser multi-thread stress tester
│   │
│   ├── tabs/
│   │   ├── tab_search/                    # Tab 1: Corridors & Route Search
│   │   │   ├── SearchPage.tsx             # Interactive route picker & station filters
│   │   │   └── StationDepartureBoard.tsx  # Station display boards & amenities
│   │   │
│   │   ├── tab_radar/                     # Tab 2: Live GPS Radar & RTIS Tracking
│   │   │   └── LiveTrainMap.tsx           # Map visualizer with train speed & delays
│   │   │
│   │   ├── tab_booking/                   # Tab 3: Schedules, Seat Matrix & Checkout
│   │   │   ├── TrainsMatrixPage.tsx       # Available trains matrix & coach selection
│   │   │   ├── SeatSelectorPage.tsx       # Interactive coach seat diagram (1A, 2A, 3A, SL)
│   │   │   └── CheckoutPage.tsx           # Passenger forms, payment & PNR issuance
│   │   │
│   │   ├── tab_dashboard/                 # Tab 4: Traveler Portal & PNR Status
│   │   │   ├── DashboardPage.tsx          # Bookings history, cancellations & refunds
│   │   │   └── PnrStatusWidget.tsx        # Instant PNR lookup widget
│   │   │
│   │   ├── tab_admin/                     # Tab 5: Operations & Fleet Management
│   │   │   └── AdminConsolePage.tsx       # Fleet occupancy, revenue & conflict audits
│   │   │
│   │   └── tab_contact/                   # Tab 6: Rail Madad & 24/7 Helpline
│   │       └── ContactPage.tsx            # Emergency contact, 139 helpline & complaints
│   │
│   ├── services/
│   │   └── railwayService.ts              # Frontend client service (API / mock sync)
│   ├── types/
│   │   ├── railway.ts                     # TypeScript interfaces (Train, Coach, Seat, Booking)
│   │   └── user.ts                        # Traveler and Admin user types
│   └── assets/
│       └── images/                        # High-resolution railway imagery
```

---

## 3. Left Sidebar Navigation (Layout Specification)

In accordance with user preferences, the top header navigation has been replaced with a **dedicated Left Sidebar Navigation (`SidebarNav.tsx`)**:

- **Location:** Anchored to the left viewport (`fixed top-0 left-0 bottom-0 z-40`).
- **Collapsible Mode:** Can be expanded (width: `16rem` / `w-64`) or collapsed to compact icon view (`5rem` / `w-20`) via a toggle button.
- **Visual Style:** Sleek dark glass aesthetic (`bg-slate-950/95 backdrop-blur-xl border-r border-rose-600/20`), matching RailFleet's gold and rose accents.
- **Navigation Items:**
  1. **Corridors & Search:** Route selector, quick corridors, station weather.
  2. **Live Radar (GPS):** Live satellite map with pulsing beacon indicator.
  3. **Train Schedules:** Full timetable matrix across express lines.
  4. **My Bookings & PNR:** User booking cards, ticket cancellation, PNR lookup.
  5. **Fleet Operations:** Fleet occupancy metrics, revenue, audit logs.
  6. **Rail Madad & 139:** Official Indian Railways 24/7 support & emergency portal.
  7. **Concurrency Lab:** High-stress multi-thread ACID race condition benchmark tool.
- **Account Card & Profile:** Floating profile widget at the bottom of the sidebar with wallet balance and sign-in/sign-out actions.

---

## 4. Backend Architecture (FastAPI)

### Key Architectural Tenets
1. **Concurrency Protection via SQLite `BEGIN EXCLUSIVE`:**
   - Every ticket booking operation executes inside an exclusive database lock.
   - When multiple concurrent requests attempt to reserve the same seat, exactly one transaction succeeds while conflicting transactions are cleanly caught, rolled back, and logged in the `concurrency_audit` table.
2. **RESTful Service Contracts:**
   - Standardized JSON responses validated through Pydantic v2 DTOs (`StationDTO`, `TrainSearchItemDTO`, `BookingRequestDTO`, `BookingDetailDTO`).
3. **Database Schema:**
   - `stations`: Terminal codes, names, city, state, platform counts.
   - `trains`: Train number, name, source/dest, departure/arrival schedules, running days.
   - `coaches`: Class codes (`1A`, `2A`, `3A`, `SL`, `CC`, `EC`), capacity, fares.
   - `seats`: Seat numbers, berth types (`LOWER`, `MIDDLE`, `UPPER`, `SIDE_LOWER`, `SIDE_UPPER`), booked status.
   - `bookings`: Unique 10-digit PNR, journey date, contact details, total fare, booking status (`CONFIRMED`, `CANCELLED`).
   - `passengers`: Passenger details tied to seat allocations and PNRs.
   - `concurrency_audit`: Real-time transaction audit logs for lock monitoring.

---

## 5. Frontend Architecture (React + Vite)

1. **State Management:**
   - Active Tab routing dynamically driven by `activeTab` state.
   - Reactive synchronization between local state and `railwayService`.
2. **Design Language:**
   - Tailwind CSS with rich gradients, dark glassmorphism, gold accents, and Fraktur/Inter typography.
   - Fluid responsive layout adjusting main view dynamically to left sidebar width.
3. **Interactive Modals:**
   - `AuthModal`: Toggle between traveler login and admin credentials.
   - `BoardingPassModal`: Printable SVG-styled Indian Railways boarding pass with QR code and PNR barcode.
   - `ConcurrencyLabModal`: Visual stress tester demonstrating 10 to 50 concurrent seat-booking threads simultaneously.

---

## 6. How to Run & Verify

### Starting Backend (FastAPI)
```powershell
# From project root:
.\.venv\Scripts\python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/`

### Starting Frontend (React + Vite)
```powershell
# From project root:
npm run dev
```
- Client runs at: `http://localhost:3000`

### Running Production Build
```powershell
npm run build
```
*(Verified: builds successfully with zero errors into `/dist`).*

---

## 7. Next Steps & Recommended Roadmap

1. **Backend Integration Hook:** Connect `src/services/railwayService.ts` to fetch directly from `http://localhost:8000/api/v1/*` when the FastAPI server is active, with fallback to local state.
2. **WebSocket Live Telemetry:** Integrate WebSocket feeds for real-time train movement updates on the Live Radar map.
3. **Payment Gateway Mocking:** Add Razorpay / UPI sandbox flows during checkout.
