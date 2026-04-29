# Carebridge Project Structure - Setup Guide

## 🎯 Project Overview
Carebridge is a full-stack community help and resource platform built with React, Vite, and JavaScript. It connects people seeking help with volunteers willing to assist.

## 📦 Installation

### Install Dependencies
```bash
pnpm install
```

### Required Environment Variables
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Running the Project

### Development Server
```bash
pnpm dev
```
Visit `http://localhost:5173` in your browser

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## 📁 Project Structure

```
src/
├── api/                          # API integration layer
│   ├── axios.js                 # Axios instance with interceptors
│   ├── auth.api.js              # Authentication endpoints
│   └── request.api.js           # Request endpoints
│
├── pages/                        # Page components (route pages)
│   ├── auth/
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx         # Registration page
│   │   └── OAuthSuccess.jsx     # OAuth callback handler
│   ├── dashboard/
│   │   └── Dashboard.jsx        # Main dashboard
│   ├── requests/
│   │   ├── RequestList.jsx      # Browse all requests
│   │   ├── RequestDetails.jsx   # View single request
│   │   ├── CreateRequest.jsx    # Create new request
│   │   └── MyRequests.jsx       # User's own requests
│   ├── admin/
│   │   └── AdminDashboard.jsx   # Admin panel
│   └── NotFound.jsx             # 404 page
│
├── components/                   # Reusable components
│   ├── ui/                       # Generic UI components
│   │   ├── Button.jsx / .css    # Button component
│   │   ├── Input.jsx / .css     # Input component
│   │   ├── Card.jsx / .css      # Card component
│   │   ├── Modal.jsx / .css     # Modal component
│   │   └── Badge.jsx / .css     # Badge component
│   ├── layout/                   # Layout components
│   │   ├── Layout.jsx / .css    # Main layout wrapper
│   │   ├── Navbar.jsx / .css    # Navigation bar
│   │   └── Sidebar.jsx / .css   # Sidebar menu
│   └── request/                  # Request-specific components
│       ├── RequestCard.jsx / .css
│       └── RequestStatus.jsx / .css
│
├── routes/                       # Route configuration
│   ├── AppRoutes.jsx            # Route definitions
│   └── ProtectedRoute.jsx       # Route protection HOC
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.js               # Authentication hook
│   └── useRequests.js           # Request queries with TanStack Query
│
├── context/                      # React context providers
│   └── AuthContext.jsx          # Authentication context
│
├── utils/                        # Utility functions
│   ├── constants.js             # Constants (roles, statuses, etc.)
│   └── helpers.js               # Helper functions
│
├── styles/                       # Global styles
│   └── global.css               # CSS variables & global styles
│
├── App.jsx                       # Root component
└── main.jsx                      # Entry point

```

## 🔐 Authentication Features

### JWT Token Management
- Tokens stored in localStorage
- Automatic token refresh on 401 errors
- Axios interceptors for Authorization header

### User Roles
- **USER**: Can create requests and view available volunteers
- **VOLUNTEER**: Can view and accept requests to help
- **ADMIN**: Full system access and administration

### Protected Routes
- Routes require authentication
- Role-based access control
- Automatic redirect to login if not authenticated

## 🎨 UI Components

### Button
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```
**Variants**: primary, secondary, danger, outline, ghost  
**Sizes**: xs, sm, md, lg

### Input
```jsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error={error}
  required
/>
```

### Card
```jsx
<Card hoverable header="Title" footer={<Footer />}>
  Card content here
</Card>
```

### Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>
```

### Badge
```jsx
<Badge variant="success" size="md">
  Status
</Badge>
```
**Variants**: primary, secondary, danger, warning, success, info

## 📊 API Integration

### Request Handling
All API calls use Axios with automatic:
- JWT token injection in Authorization header
- Error handling with global 401 redirect
- Base URL configuration from env

### Available Hooks

**useAuth()**
```jsx
const { user, loading, isAuthenticated, login, register, logout } = useAuth();
```

**useRequests()**
```jsx
const { data, isLoading, error } = useRequests(params);
```

**useRequestById(id)**
```jsx
const { data, isLoading } = useRequestById(id);
```

**useCreateRequest()**
```jsx
const createRequest = useCreateRequest();
await createRequest.mutateAsync(data);
```

**useUpdateRequest()**
**useDeleteRequest()**
**useUpdateRequestStatus()**

## 🛠 Customization

### CSS Variables
All styling uses CSS custom properties (CSS variables) defined in `global.css`:
- Colors: `--color-primary`, `--color-secondary`, etc.
- Spacing: `--spacing-xs` through `--spacing-3xl`
- Typography: `--font-size-*`
- Shadows: `--shadow-*`
- Border radius: `--radius-*`

### Adding New Pages
1. Create page file in `src/pages/[category]/Page.jsx`
2. Add route to `src/routes/AppRoutes.jsx`
3. Create corresponding CSS file

### Adding New Components
1. Create component file in `src/components/[category]/Component.jsx`
2. Create corresponding CSS file
3. Export from component's parent (if needed)

## 📝 Constants

Located in `src/utils/constants.js`:
- `USER_ROLES`: USER, VOLUNTEER, ADMIN
- `REQUEST_STATUS`: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED
- `REQUEST_CATEGORIES`: Various request categories
- `ROUTES`: All application routes

## 🔧 Helper Functions

Located in `src/utils/helpers.js`:
- `formatDate()`: Format dates
- `formatDateTime()`: Format dates with time
- `truncateText()`: Truncate text to length
- `hasRole()`: Check user roles
- `getInitials()`: Get name initials
- `debounce()`: Debounce function
- `throttle()`: Throttle function
- `getErrorMessage()`: Extract error messages from responses

## 🚨 Common Tasks

### Add a New API Endpoint
1. Add method to appropriate file in `src/api/`
2. Create custom hook in `src/hooks/` if using TanStack Query
3. Use hook in components

### Add Role-Based UI
```jsx
import { hasRole } from '../utils/helpers';
import { USER_ROLES } from '../utils/constants';

{hasRole(userRole, USER_ROLES.ADMIN) && (
  <AdminPanel />
)}
```

### Handle Form Validation
```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!email) newErrors.email = 'Email is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## 📱 Responsive Design

- Mobile-first approach
- Sidebar toggles to drawer on mobile (<768px)
- Grid layouts use `repeat(auto-fit, minmax(...))`
- All components are fully responsive

## 🔄 State Management

- **Authentication**: React Context (AuthContext)
- **API State**: TanStack Query (React Query)
- **Local State**: useState in components

## 🐛 Debugging

### Check Authentication
```jsx
const { user, isAuthenticated, loading } = useAuth();
console.log({ user, isAuthenticated, loading });
```

### Check API Response
Add interceptors for logging in `src/api/axios.js`

### Check Routes
Verify routes in `src/routes/AppRoutes.jsx`

## 📚 Dependencies

- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **@tanstack/react-query**: Server state management
- **react-icons**: Icon library

## 🎓 Next Steps

1. **Backend Setup**: Set up your API server at `http://localhost:5000`
2. **Database**: Configure your database connection
3. **Authentication**: Implement JWT authentication on backend
4. **API Endpoints**: Implement all endpoints in `src/api/`
5. **Styling**: Customize colors in `src/styles/global.css`
6. **Testing**: Add tests as needed

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

Follow the project structure and conventions established in this template for consistency.

---

**Ready to develop!** Start with `pnpm dev` and begin building Carebridge! 🚀
