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



## Project Overview 

This is a project management mobile platform for students to be able to design and work together with their peers. Acator is a platform that will allow students to assign tasks, track timelines, communicate with teammates, get reminder notifications using various tools like Khanban board, Gantt charts and a safe space to collaborate. 

## Architectural Decision Summary 

This document contains the architecture decision records for the student management mobile app. Our team has chosen a cross-platform approach using React native to build for both maintaining a single codebase. 

## Key Decisions 

Framework : React Native  

Navigation : Stack + Tab navigation 

Hardware: Camera and Push notifications 

Database: Supabase + PostgreSQL 

 

## Development Framework 


Context 

We need to select a mobile development framework for our Student project management App targeting Android and IOS devices with Stylesheet CSS framework. 

Options Considered 

-React Native: Cross platform Javascript framework 

-Native iOS (Swift)- iOs only 

Native Android (Java/kotlin) - Android only 

Ionic – Hybrid web based 

Flutter – Cross platform – Dart language 

Decision 

React Native 

Rationale 

We wanted to expand our knowledge that we learnt throughout this course. With this project we will be able to push and hopefully exceed our limits on what we can achieve with the foundation provided to us.  

Navigation strategy 

The app navigation approach is a Hybrid Tab + Stack + Modal structure implemented with Expo Router. 

How the Navigation Is Structured 

1. Root Level — Auth Stack 

Handles authentication screens: 

Login 

Register 

2. Level 1 — Bottom Tab Navigator 

Top‑level sections that users switch between frequently: 

Home 

Communication 

Profile 

Notification 

3. Level 2 — Stack Navigator (per tab) 

Nested screens that follow a drill‑down pattern: 

Home Page: 

List view  

Add Project 

Project Detail 

Timeline 

Assign Roles 

Task Detail 

Members 

 

Profile: 

FirstName 

LastName 

Email 

PhoneNumber 

ActivityStatus 

Picture 

Github 

Other social medias 

 

Notifications 

List view of past notifications 

 

Communication 

Add/remove team member 

Start new chat 

Delete chat 

Block/Report user 

Ping members 

Send reminders 

 

 

4. Overlay — Modal Navigator 

Short‑lived actions that shouldn’t disrupt the user’s current context: 

Create Task 

Invite Member 

Add File Link 

Notification 

Reminders upcoming due date 

Why This Strategy Was Chosen 

High discoverability via bottom tabs 

State preservation (each tab keeps its own stack) 

Deep linking support through Expo Router 

Modals keep the user in context for quick actions 

Navigation Strategy = Tab Navigator + Stack Navigators + Modal Screens (via Expo Router) 

This structure balances discoverability, deep linking, state preservation, and alignment with the file‑based routing system. 

 

## Hardware Integration 

The project includes two suggested hardware integrations: 

1. Push Notifications 

Purpose: 

Deadline reminders 

Task assignment alerts 

Chat mention alerts 

Expo Module: expo-notifications 

Why it’s included: 

Deadline reminders are a core advertised feature… Task assignment notifications are essential. Chat mention notifications ensure team members are alerted. 

Uses Supabase webhooks to trigger notifications 

Works fully within Expo’s managed workflow 

Requires Firebase Cloud Messaging setup 

2. Camera / QR Code Scanning 

Purpose: 

Scan a QR code to join a project team 

Avoid typing long invite links 

Expo Module: expo-camera / expo-barcode-scanner 

Why it’s included: 

Project invite links can be encoded as QR codes. expo-camera is a first‑party Expo SDK module with zero native configuration required. 

Notes: 

Simple, bounded feature 

Requires runtime camera permission 

Optional (Not Core) 

Fingerprint / Biometrics 

Use Case: Secure login 

Module: expo-local-authentication 

The hardware strategy is intentionally minimal and focused, choosing only features that: 

Directly support the app’s core value (notifications, collaboration) 

Fit within Expo’s managed workflow 

Are achievable within a course timeline and strength of the team. 

 

Database Storage 

The project uses a remote, real‑time PostgreSQL database via Supabase, with AsyncStorage only for session caching. 

Supabase (hosted PostgreSQL with Realtime subscriptions) has been selected as the database storage solution. 

Local storage (AsyncStorage) will be used exclusively for caching the authenticated user session token. 

Why Remote Storage Is Required 

The app is collaborative : multiple students working on shared projects, so data must be centralized. 

The document emphasizes: 

The application's core purpose , group collaboration which cannot function with local-only storage. 

Remote storage is needed for: 

Shared project/task data 

Real-time chat 

Multi-user access 

Push notification triggers 

Secure access control 

Local-only storage (like AsyncStorage or SQLite) cannot support any of these. 

Why Supabase Was Chosen (Over Firebase) 

1. PostgreSQL + SQL 

Supabase uses relational tables, which fit the app’s structured data model. 

PostgreSQL is well-suited for the structured task and project relationships 

2. Row-Level Security (RLS) 

Built-in authorization ensures users only access their own project data. 

RLS policies enforce that users can only read and write data belonging to projects they are members of. 

3. Realtime Subscriptions 

Live updates for: 

Chat messages 

Kanban board changes 

Task updates 

Upcoming due dates 

Supabase Realtime uses WebSockets to deliver database change events. 

4. First-class Expo/React Native support 

The official SDK integrates smoothly with Expo. 

Database Strategy = Supabase PostgreSQL (Realtime + Auth + RLS) + AsyncStorage for session caching only 

Project Idea: 

- Group Project Task Manager 
Designed specifically for student teams that allow students to create a project, 
invite members,  
assign tasks,  
set deadlines, and  
track progress on a Kanban board. 

Add a built-in team chat, file link sharing, and deadline notifications. Very meta for this exact course. 

  

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
├── store/                          ← Global state (.ts) 
│   ├── authStore.ts 
│   └── projectStore.ts 
│ 
├── types/                          ← All shared TypeScript interfaces 
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
