import Joi from 'joi';

export const dashboardQuerySchema = Joi.object({
  timeframe: Joi.string().valid('week', 'month').default('week'),
  limit: Joi.number().integer().min(1).max(100).default(8)
});

export const recentProjectsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(6),
  status: Joi.string().valid('all', 'active', 'planning', 'completed', 'onHold', 'archived').default('all')
});

export const prpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63 = Joi.object({
  timeframe: Joi.string().valid('day', 'week', 'month', 'year', 'all').default('all'),
  includeDetails: Joi.boolean().default(false),
  entityType: Joi.string().valid('projects', 'tasks', 'both').default('both')
});

export const priorityDistributionComparisonSchema = Joi.object({
  period1: Joi.string().valid('day', 'week', 'month', 'year').default('week'),
  period2: Joi.string().valid('day', 'week', 'month', 'year').default('month')
});

export const priorityDirstributionTrendsSchema  = Joi.object({
  timeframe: Joi.string().valid('week', 'month', 'quarter', 'year').default('month'),
  interval: Joi.string().valid('day', 'week').default('day')
});

export const priorityDistributionInsightsSchema = Joi.object({
  timeframe: Joi.string().valid('day', 'week', 'month', 'year', 'all').default('month')
});

export const activityFeedQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(10)
});

export const upcomingTasksQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(8)
});

export const chartDataQuerySchema = Joi.object({
  type: Joi.string().valid('status', 'priority', 'weekly', 'trend').optional(),
  timeframe: Joi.string().valid('week', 'month').default('week')
});

export default {
  dashboardQuerySchema,
  recentProjectsQuerySchema,
  priorityDistributionComparisonSchema,
    priorityDirstributionTrendsSchema,
  priorityDistributionInsightsSchema,
  activityFeedQuerySchema,
  upcomingTasksQuerySchema,
  chartDataQuerySchema
};