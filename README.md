# 🚀 Protrack

A modern full-stack project management platform designed specifically for colleges and organizations. Protrack streamlines project tracking, team collaboration, and supervisor involvement through an intuitive and feature-rich interface.

[![Production](https://img.shields.io/badge/Production-Live-success)](https://protrack-eta.vercel.app/)

## ✨ Features

### Project Management
- ✅ **Project Dashboard**
  - Interactive project overview
  - Real-time progress tracking
  - Project status indicators (active, in-progress, completed, on-hold)
  - Project statistics and metrics
  - Resource allocation and monitoring
    - On mock data

- 🅿️ **Project Creation & Setup** [BE]
  - Customizable project templates
  - Multi-domain support (Web, Mobile, Data Science, Healthcare, etc.)
  - Project code & visibility settings
  - Tech stack declaration
  - Team size configuration
  - Timeline and deadline management
  - 🅿️ Backend API Pending

### Team Collaboration
- ✅ **Team Management**
  - Role-based team structure (lead, member, supervisor, reviewer)
  - Member invitations and role assignment
  - Team member activity tracking
  - Collaboration permissions
  - 🅿️ Backend API Pending
    - On mock data


- ✅ **Task Management**
  - Task creation and assignment
  - Priority levels and due dates
  - Task status tracking (pending, in-progress, completed, on-hold)
  - Task filtering and organization
  - Important and planned task views
  - 🅿️ In queue after project creation.

### Timeline & Reviews
- ✅ **Project Timeline**
  - Phase-based project progression
  - Review cycle management
  - Progress indicators per phase
  - Documentation tracking
  - Timeline visualization
  - 🅿️ In queue after project creation.
    -  On mock data

### Communication
- 🅿️ **Real-time Chat**
  - Project-specific group chats
  - Team member direct messaging
  - File sharing and collaboration
  - Chat notifications
  - ⏸️ Paused for later 
      -  On mock data

- ✅ **User Inbox**
  - Centralized notification system
  - Project updates and alerts
  - Task assignments and reminders
  - Review notifications
  - ✔️ Implemented

### Planning & Scheduling
- ✅ **Activity Calendar**
  - Event scheduling and management
  - Deadline tracking
  - Review date planning
  - Calendar integrations
  - Meeting coordination
  - 🅿️ In queue after project creation.
      -  On mock data

### Administration
- ✅ **Role-based Access Control**
  - Admin dashboard
  - User permission management
  - Organization management
  - Access level configuration
  - Security and privacy settings
  - ✔️ Implemented 




## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Calendar**: [FullCalendar.js](https://fullcalendar.io/)

### Backend
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://drizzle.team/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Real-time**: [getstream.io](https://getstream.io/) (pending..)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/varunchowdary0/protrack.git
```

2. Install dependencies:
```bash
cd protrack
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
# Configure your environment variables
```

4. Start the development server:
```bash
npm run dev
```

## 💡 Upcoming Features
- Ticket system.
- 


git clone https://github.com/varunchowdary0/protrack.git
npm install
npm run dev
