# Carebridge - Quick Start Guide

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set environment variables:**
   Create `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Open in browser:**
   http://localhost:5173

## 🔑 Key Features Implemented

✅ **Authentication System**
- Login/Register pages
- JWT token storage in localStorage
- Axios interceptors for automatic token injection
- Protected routes with role-based access
- Automatic redirect to login on 401 errors

✅ **Role-Based Access Control**
- **USER**: Create requests, manage own requests
- **VOLUNTEER**: View and accept requests
- **ADMIN**: System administration

✅ **Request Management**
- List all requests
- Create new requests
- View request details
- Update request status
- Filter and search requests

✅ **Dashboard**
- Statistics overview
- User welcome section
- Quick navigation

✅ **UI Components**
- Button (multiple variants and sizes)
- Input with validation
- Card with hover effects
- Modal dialogs
- Badge for status indicators

✅ **State Management**
- AuthContext for authentication
- TanStack Query for API state
- React Router for navigation

## 📂 Important Files

### Entry Points
- `src/main.jsx` - App initialization with providers
- `src/App.jsx` - Root component with routes

### Authentication
- `src/context/AuthContext.jsx` - Auth provider and state
- `src/hooks/useAuth.js` - Auth hook
- `src/api/auth.api.js` - Auth endpoints

### API
- `src/api/axios.js` - Axios config with interceptors
- `src/api/request.api.js` - Request endpoints
- `src/hooks/useRequests.js` - React Query hooks

### Routes
- `src/routes/AppRoutes.jsx` - Route definitions
- `src/routes/ProtectedRoute.jsx` - Protected route wrapper

### Styles
- `src/styles/global.css` - CSS variables and global styles
- Component-specific `.css` files for each component

## 🔄 Common Workflows

### Login Flow
1. User enters credentials
2. Axios POST to `/auth/login`
3. Backend returns token + user data
4. Token stored in localStorage
5. User redirected to dashboard
6. Protected routes now accessible

### Create Request Flow
1. User fills form
2. Submit to `/requests` endpoint
3. Request created on backend
4. React Query invalidates cache
5. Redirect to my-requests page

### Role-Based Rendering
```jsx
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';

export default function Component() {
  const { userRole } = useAuth();
  
  return (
    <>
      {userRole === USER_ROLES.ADMIN && <AdminPanel />}
      {userRole === USER_ROLES.VOLUNTEER && <VolunteerPanel />}
      {userRole === USER_ROLES.USER && <UserPanel />}
    </>
  );
}
```

## 🛠 API Endpoints Expected

Your backend should implement these endpoints:

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

### Requests
- `GET /requests` - Get all requests
- `GET /requests/:id` - Get single request
- `POST /requests` - Create request
- `PUT /requests/:id` - Update request
- `DELETE /requests/:id` - Delete request
- `GET /requests/my-requests` - Get user's requests
- `PATCH /requests/:id/status` - Update request status

### Response Format
Expected format for API responses:
```json
{
  "data": { /* ... */ },
  "message": "Success message",
  "status": 200
}
```

## 🎯 Next Steps

1. **Backend Development**
   - Set up Express/Node server
   - Implement JWT authentication
   - Create database models
   - Implement API endpoints

2. **Environment Setup**
   - Configure `.env` with API URL
   - Set up CORS if needed
   - Configure JWT secret

3. **Testing**
   - Test login/register flow
   - Test API endpoints
   - Test protected routes
   - Test role-based access

4. **Customization**
   - Modify colors in `global.css`
   - Add additional pages as needed
   - Customize components
   - Add more features

## 📝 Notes

- All routes outside `/login`, `/register`, `/oauth-success` require authentication
- 401 errors automatically redirect to login
- All API requests include Bearer token in Authorization header
- Component styling uses CSS variables for consistency

## 🆘 Troubleshooting

**Issue: Routes not working**
- Check that BrowserRouter wraps App in main.jsx ✓

**Issue: Authentication not persisting**
- Verify localStorage has 'token' key
- Check Axios interceptors in `src/api/axios.js`

**Issue: API calls failing**
- Verify VITE_API_BASE_URL in `.env`
- Check backend is running on correct port
- Verify CORS settings on backend

**Issue: Components not updating**
- Check React Query invalidation after mutations
- Verify hooks are used correctly
- Check context provider wraps components

---

📚 For detailed documentation, see `PROJECT_SETUP.md`
