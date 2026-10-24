# BusGo Database Setup

BusGo uses MySQL 8.x for persistent storage of bus schedules, routes, seats, bookings, and users.

## Quick Setup

### Option 1: Automatic Table Creation & Seeding (Recommended)
Spring Boot will automatically create all tables and seed realistic bus data, schedules, routes, and default users when you start the backend!

1. Create the database in MySQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS busgo;
   ```
2. Configure credentials in `backend/src/main/resources/application.properties` (or via environment variables).
3. Start the backend (`mvn spring-boot:run`). The seed data will be automatically populated!

### Option 2: Restore from SQL Backup
If you want to restore the pre-populated database with existing sample bookings:
```bash
mysql -u root -p busgo < database/busgo_backup.sql
```

## Default Accounts
- **Administrator**:
  - Email: `admin@busgo.com`
  - Password: `admin123`
- **Customer User**:
  - Email: `user@busgo.com`
  - Password: `user123`
