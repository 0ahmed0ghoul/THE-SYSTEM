// frontend/src/api/dashboard.api.ts
import apiClient from '../services/api.client';
import type { DashboardData, DashboardStats, PriorityDistributionComparison, PriorityDistributionFilters, PriorityDistributionInsights, PriorityDistributionItem, PriorityDistributionTrend } from '../types/dashboard';


export const dashboardApi = {
  getDashboardData: async (timeframe = 'week', limit = 8): Promise<DashboardData> => {
    const response = await apiClient.get<{ data: DashboardData }>('/dashboard', {
      params: { timeframe, limit }
    });
    return response.data.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<{ data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  },

  getRecentProjects: async (limit = 6, status = 'all'): Promise<any[]> => {
    const response = await apiClient.get('/dashboard/recent-projects', {
      params: { limit, status }
    });
    return response.data.data;
  },

  getUpcomingTasks: async (limit = 8): Promise<any[]> => {
    const response = await apiClient.get('/dashboard/upcoming-tasks', {
      params: { limit }
    });
    return response.data.data;
  },

  getActivityFeed: async (limit = 10): Promise<any[]> => {
    const response = await apiClient.get('/dashboard/activity', {
      params: { limit }
    });
    return response.data.data;
  },

  getPriorityDistribution: async (filters: PriorityDistributionFilters = {}): Promise<PriorityDistributionItem[]> => {
    const response = await apiClient.get('/dashboard/priority-distribution', {
      params: filters
    });
    return response.data.data;
  },

  getPriorityDistributionComparison: async (period1 = 'week', period2 = 'month'): Promise<PriorityDistributionComparison> => {
    const response = await apiClient.get('/dashboard/priority-distribution/compare', {
      params: { period1, period2 }
    });
    return response.data.data;
  },

  getPriorityDistributionTrends: async (timeframe = 'month', interval = 'day'): Promise<PriorityDistributionTrend> => {
    const response = await apiClient.get('/dashboard/priority-distribution/trends', {
      params: { timeframe, interval }
    });
    return response.data.data;
  },

  getPriorityDistributionInsights: async (timeframe = 'month'): Promise<PriorityDistributionInsights> => {
    const response = await apiClient.get('/dashboard/priority-distribution/insights', {
      params: { timeframe }
    });
    return response.data.data;
  }
};