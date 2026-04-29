// User roles
export const USER_ROLES = {
  USER: 'USER',
  VOLUNTEER: 'VOLUNTEER',
  ADMIN: 'ADMIN',
};

// Request status
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Request categories
export const REQUEST_CATEGORIES = [
  'Medical Assistance',
  'Financial Help',
  'Grocery & Food',
  'Transportation',
  'Home Maintenance',
  'Childcare',
  'Pet Care',
  'Tech Support',
  'Other',
];

// API error messages
export const API_ERRORS = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error occurred',
  NETWORK_ERROR: 'Network error occurred',
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  REQUESTS: '/requests',
  REQUEST_DETAILS: '/requests/:id',
  CREATE_REQUEST: '/requests/create',
  MY_REQUESTS: '/my-requests',
  ADMIN: '/admin',
  OAUTH_SUCCESS: '/oauth-success',
  NOT_FOUND: '*',
};
