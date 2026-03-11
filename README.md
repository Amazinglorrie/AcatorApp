# AcatorApp
### Team Apex — Student Management App

---

## Table of Contents

- [Project Overview]
- [Architectural Decision Summary]
- [Development Framework]
- [Navigation Strategy]
- [Hardware Integration]
- [Database & Storage]
- [Project Structure]

---

## Project Overview

AcatorApp is a **Group Project Task Manager** designed specifically for student teams. It allows students to:

- Create a project and invite members
- Assign tasks and set deadlines
- Track progress on a **Kanban board**
- Communicate via a **built-in team chat**
- Share file links and receive **deadline notifications**

---

## Architectural Decision Summary

This document contains the Architecture Decision Records (ADRs) for the AcatorApp student management mobile app. The team has chosen a **cross-platform approach using React Native** to build for both Android and iOS while maintaining a single codebase.

| Concern | Decision |
|---|---|
| Framework | React Native |
| Navigation | Stack + Tab + Modal (Expo Router) |
| Hardware | Camera / QR Scanning + Push Notifications |
| Database | Supabase (PostgreSQL) + AsyncStorage |

---

## Development Framework

### Context

A mobile development framework was needed for a Student Management App targeting both Android and iOS, using a Bootstrap CSS framework.

### Options Considered

| Option | Type |
|---|---|
| React Native | Cross-platform JavaScript |
| Native iOS (Swift) | iOS only |
| Native Android (Java/Kotlin) | Android only |
| Ionic | Hybrid web-based |
| Flutter | Cross-platform (Dart) |

### Decision: **React Native**

React Native was selected for its cross-platform capabilities, large ecosystem, and JavaScript familiarity, allowing the team to ship for both platforms from a single codebase.

---

## Navigation Strategy

The app uses a **Hybrid Tab + Stack + Modal** structure implemented with **Expo Router**.

### Structure Overview

```
Root
├── Auth Stack                    ← Login, Register
└── Bottom Tab Navigator          ← Top-level sections
    ├── Dashboard (Tab)
    │   └── Stack Navigator       ← Project Detail, Task Detail, Members, Chat
    ├── Notifications (Tab)
    └── Profile (Tab)
                  └── Modal Navigator   ← Create Task, Invite Member, Add File Link
```

### Navigation Levels

**1. Root Level —> Auth Stack**
Handles authentication screens: Login and Register.

**2. Level 1 —> Bottom Tab Navigator**
Top-level sections users switch between frequently: Dashboard, Notifications, Profile.

**3. Level 2 —> Stack Navigator (per tab)**
Nested screens following a drill-down pattern: Project Detail, Task Detail, Members, Chat.

**4. Overlay —> Modal Navigator**
Short-lived actions that shouldn't disrupt the user's current context: Create Task, Invite Member, Add File Link.

### Why This Strategy

- High discoverability via bottom tabs
- State preservation (each tab keeps its own stack)
- Deep linking support through Expo Router
- Modals keep the user in context for quick actions

---

## Hardware Integration

The project includes two hardware integrations, chosen for being minimal, focused, and achievable within the course timeline.

### 1. Push Notifications

| | |
|---|---|
| **Module** | `expo-notifications` |
| **Purpose** | Deadline reminders, task assignment alerts, chat mention alerts |
| **Integration** | Supabase webhooks → Firebase Cloud Messaging |
| **Workflow** | Fully within Expo's managed workflow |

### 2. Camera / QR Code Scanning

| | |
|---|---|
| **Module** | `expo-camera` / `expo-barcode-scanner` |
| **Purpose** | Scan a QR code to join a project team; avoid typing long invite links |
| **Notes** | Requires runtime camera permission; zero native configuration required |

### Optional (Not Core)

**Fingerprint / Biometrics**
- Use case: Secure login
- Module: `expo-local-authentication`

---

## Database & Storage

The project uses a **remote, real-time PostgreSQL database via Supabase**, with AsyncStorage used only for session caching.

### Why Remote Storage is Required

The app is **collaborative**: multiple students work on shared projects, so data must be centralized. Local-only storage (AsyncStorage, SQLite) cannot support:

- Shared project/task data
- Real-time chat
- Multi-user access
- Push notification triggers
- Secure access control

### Why Supabase (Over Firebase)

**1. PostgreSQL + SQL**
Supabase uses relational tables, which fit the app's structured data model and are well-suited for task and project relationships.

**2. Row-Level Security (RLS)**
Built-in authorization ensures users can only read and write data belonging to projects they are members of.

**3. Realtime Subscriptions**
Live updates for chat messages, Kanban board changes, and task updates via WebSockets.

**4. First-Class Expo / React Native Support**
The official Supabase SDK integrates smoothly with Expo.

### Storage Strategy Summary

```
Supabase PostgreSQL (Realtime + Auth + RLS)   ← All shared app data
AsyncStorage                                   ← Session token cache only
```

---

## Project Structure

```
/group-task-manager
│
├── app/                            ← Expo Router screens (.tsx)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (app)/
│   │   ├── index.tsx               ← Dashboard / My Projects
│   │   ├── project/
│   │   │   ├── [id].tsx            ← Project detail + Kanban
│   │   │   ├── members.tsx
│   │   │   └── chat.tsx
│   │   ├── task/
│   │   │   └── [id].tsx            ← Task detail
│   │   ├── notifications.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
│
├── components/                     ← Reusable UI components (.tsx)
│   ├── KanbanBoard.tsx
│   ├── TaskCard.tsx
│   ├── ProjectCard.tsx
│   ├── ChatBubble.tsx
│   ├── MemberAvatar.tsx
│   └── ProgressBar.tsx
│
├── hooks/                          ← Custom React hooks (.ts)
│   ├── useProjects.ts
│   ├── useTasks.ts
│   ├── useChat.ts
│   └── useNotifications.ts
│
├── store/                          ← Zustand global state (.ts)
│   ├── authStore.ts
│   └── projectStore.ts
│
├── types/                          ← Shared TypeScript interfaces
│   ├── user.types.ts
│   ├── project.types.ts
│   ├── task.types.ts
│   ├── chat.types.ts
│   └── notification.types.ts
│
├── lib/                            ← External service clients (.ts)
│   └── supabase.ts
│
├── constants/                      ← Colors, fonts, enums, config
│   ├── theme.ts
│   └── enums.ts
│
└── assets/                         ← Images, icons, fonts
```
