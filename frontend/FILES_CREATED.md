# Carebridge Project - Complete File Structure

## 📋 Project Files Created

### 📁 API Integration (`src/api/`)

| File | Purpose |
|------|---------|
| `axios.js` | Axios instance with JWT interceptors & 401 handling |
| `auth.api.js` | Authentication API calls (login, register, logout, etc.) |
| `request.api.js` | Request management API calls (CRUD operations) |

### 📁 Context & State (`src/context/`)

| File | Purpose |
|------|---------|
| `AuthContext.jsx` | Authentication context provider with login/register/logout logic |

### 📁 Custom Hooks (`src/hooks/`)

| File | Purpose |
|------|---------|
| `useAuth.js` | Hook to access authentication context |
| `useRequests.js` | Multiple React Query hooks for request management |
| | - `useRequests()` - Get all requests |
| | - `useRequestById()` - Get single request |
| | - `useMyRequests()` - Get user's requests |
| | - `useCreateRequest()` - Mutation to create |
| | - `useUpdateRequest()` - Mutation to update |
| | - `useDeleteRequest()` - Mutation to delete |
| | - `useUpdateRequestStatus()` - Mutation for status |

### 📁 UI Components (`src/components/ui/`)

| Component | Files | Variants |
|-----------|-------|----------|
| **Button** | `Button.jsx`, `Button.css` | primary, secondary, danger, outline, ghost |
| **Input** | `Input.jsx`, `Input.css` | Text input with error states |
| **Card** | `Card.jsx`, `Card.css` | Container with header/footer support |
| **Modal** | `Modal.jsx`, `Modal.css` | Dialog component with sizes |
| **Badge** | `Badge.jsx`, `Badge.css` | Status badges with variants |

### 📁 Layout Components (`src/components/layout/`)

| Component | Files | Features |
|-----------|-------|----------|
| **Layout** | `Layout.jsx`, `Layout.css` | Main app wrapper with sidebar toggle |
| **Navbar** | `Navbar.jsx`, `Navbar.css` | Top navigation with user info & logout |
| **Sidebar** | `Sidebar.jsx`, `Sidebar.css` | Navigation menu with role-based items |

### 📁 Request Components (`src/components/request/`)

| Component | Files | Purpose |
|-----------|-------|---------|
| **RequestCard** | `RequestCard.jsx`, `RequestCard.css` | Displays request summary |
| **RequestStatus** | `RequestStatus.jsx`, `RequestStatus.css` | Status badge for requests |

### 📁 Pages - Authentication (`src/pages/auth/`)

| Page | Files | Purpose |
|------|-------|---------|
| **Login** | `Login.jsx` | User login page |
| **Register** | `Register.jsx` | User registration page |
| **OAuth Success** | `OAuthSuccess.jsx` | OAuth callback handler |
| **Styles** | `Auth.css` | Shared authentication styles |

### 📁 Pages - Dashboard (`src/pages/dashboard/`)

| Page | Files | Purpose |
|------|-------|---------|
| **Dashboard** | `Dashboard.jsx`, `Dashboard.css` | Main dashboard with stats |

### 📁 Pages - Requests (`src/pages/requests/`)

| Page | Files | Purpose |
|------|-------|---------|
| **RequestList** | `RequestList.jsx`, `RequestList.css` | Browse all requests |
| **RequestDetails** | `RequestDetails.jsx`, `RequestDetails.css` | View single request details |
| **CreateRequest** | `CreateRequest.jsx`, `CreateRequest.css` | Create new request form |
| **MyRequests** | `MyRequests.jsx`, `MyRequests.css` | User's own requests |

### 📁 Pages - Admin (`src/pages/admin/`)

| Page | Files | Purpose |
|------|-------|---------|
| **AdminDashboard** | `AdminDashboard.jsx`, `AdminDashboard.css` | Admin system overview |

### 📁 Pages - Error (`src/pages/`)

| Page | Files | Purpose |
|------|-------|---------|
| **NotFound** | `NotFound.jsx`, `NotFound.css` | 404 page |

### 📁 Routing (`src/routes/`)

| File | Purpose |
|------|---------|
| `AppRoutes.jsx` | Main route definitions for entire app |
| `ProtectedRoute.jsx` | HOC for protected routes with auth & role check |

### 📁 Utilities (`src/utils/`)

| File | Contents |
|------|----------|
| `constants.js` | User roles, statuses, categories, routes |
| `helpers.js` | Date formatting, text utilities, error handling |

### 📁 Global Styles (`src/styles/`)

| File | Contents |
|------|----------|
| `global.css` | CSS variables, typography, form defaults |

### 📄 Root Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root app component using AppRoutes |
| `src/main.jsx` | Entry point with providers (BrowserRouter, QueryClient, AuthProvider) |
| `package.json` | Dependencies: react-router-dom, axios, @tanstack/react-query |
| `PROJECT_SETUP.md` | Comprehensive setup and architecture documentation |
| `QUICK_START.md` | Quick reference guide |

## 📊 File Count Summary

- **Total Components**: 13 (5 UI + 3 Layout + 2 Request + 3 Page types)
- **Total Pages**: 8 pages
- **Total CSS Files**: 13 CSS files
- **API Files**: 3
- **Context Files**: 1
- **Hook Files**: 2
- **Route Files**: 2
- **Utility Files**: 2
- **Style Files**: 1
- **Documentation Files**: 2

**Total: 45+ Files Created**

## 🎯 Architecture Overview

```
Request Flow:
User Input → Component → Hook (useAuth/useRequests) 
→ API Call (axios.js with interceptors) 
→ Backend Endpoint → Response → React Query Cache 
→ Component Update

Authentication Flow:
Login Page → authApi.login() → Store Token → Redirect 
→ Protected Routes → Navbar shows user → Logout 
→ Clear Token & Redirect
```

## 🔐 Security Features

✅ **JWT Token Management**
- Stored in localStorage
- Injected via Axios interceptors
- Automatic 401 redirect

✅ **Protected Routes**
- Role-based access control
- Route guards with ProtectedRoute
- Redirect unauthorized users

✅ **Error Handling**
- Global Axios error handling
- Component-level error states
- User-friendly error messages

## 🎨 Styling System

**CSS Variables Implemented:**
- 11 color variables
- 8 spacing variables  
- 6 border radius variables
- 4 shadow variables
- 7 font size variables
- Font families and transitions

**All components use these variables for consistency**

## ✨ Key Features

✅ Responsive design (mobile-first)
✅ Dark mode ready (CSS variables)
✅ Form validation
✅ Loading states
✅ Error handling
✅ Debounce/throttle utilities
✅ Date formatting
✅ Text truncation
✅ Role-based UI rendering

## 🚀 Ready To Use

Everything is set up and ready to go! The project structure follows industry best practices:

- **Separation of Concerns**: Components, hooks, utilities are separated
- **DRY Principle**: Reusable components and utilities
- **Scalability**: Easy to add new pages/components
- **Maintainability**: Clear folder structure and naming conventions
- **Performance**: React Query caching, code splitting ready
- **Security**: JWT authentication, protected routes

---

**Start development with:** `pnpm install && pnpm dev`
