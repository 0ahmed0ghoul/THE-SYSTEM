import { Request, Response } from 'express';
import { ProjectsService } from '../services/projects.service.js';
import { ActivityLogsService } from '../services/activity-logs.service.js';

export class ProjectsController {
  private projectsService: ProjectsService;
  private activityLogsService: ActivityLogsService;

  constructor() {
    this.projectsService = new ProjectsService();
    this.activityLogsService = new ActivityLogsService();
  }

  // Get all projects for a user
  getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const projects = await this.projectsService.getAllProjects(userId);
      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('Error getting projects:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Get project by ID
  getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const project = await this.projectsService.getProjectById(parseInt(id), userId);
      
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Create new project
  createProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name;
      
      const projectData = {
        ...req.body,
        user_id: userId
      };
      
      const projectId = await this.projectsService.createProject(projectData);
      
      // Log activity
      await this.activityLogsService.createLog({
        type: 'project',
        action: 'creation',
        description: `New gate registered: ${req.body.name}`,
        user_id: userId,
        user_name: userName,
        metadata: { project_id: projectId }
      });
      
      const newProject = await this.projectsService.getProjectById(projectId, userId);
      
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: newProject
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Update project
  updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name;
      
      // Get old project data for status change tracking
      const oldProject = await this.projectsService.getProjectById(parseInt(id), userId);
      
      const updated = await this.projectsService.updateProject(parseInt(id), req.body, userId);
      
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Project not found or unauthorized'
        });
        return;
      }
      
      // Log status change if status was updated
      if (oldProject && req.body.status && oldProject.status !== req.body.status) {
        await this.activityLogsService.createLog({
          type: 'project',
          action: 'status_update',
          description: `${oldProject.name} status changed from ${oldProject.status} to ${req.body.status}`,
          user_id: userId,
          user_name: userName,
          metadata: { 
            project_id: parseInt(id),
            old_status: oldProject.status,
            new_status: req.body.status
          }
        });
      }
      
      const updatedProject = await this.projectsService.getProjectById(parseInt(id), userId);
      
      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: updatedProject
      });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Delete project
  deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      const deleted = await this.projectsService.deleteProject(parseInt(id), userId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Project not found or unauthorized'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Get project statistics
  getProjectStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const stats = await this.projectsService.getProjectStats(userId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting project stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}