import { authApi } from './auth.api';
import { dashboardApi } from './dashboard.api';

// frontend/src/api/index.ts
export { loginRequest, registerRequest, logoutRequest } from './auth.api';

// Export all API handlers
export default {
  auth: authApi,
  dashboard: dashboardApi,
};