import { Request, Response } from 'express';
import { Workflow } from '../models/Workflow';
import { ExecutionLog } from '../models/ExecutionLog';
import { WorkflowExecutor, WorkflowExecutionContext } from '../services/workflow/workflowExecutor';
import { User } from '../models/User';
import { AuthService } from '../auth/authService';

/**
 * Create a new workflow
 */
export const createWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, actions, actionConfigs } = req.body;

    if (!name || !actions || !Array.isArray(actions) || actions.length === 0) {
      res.status(400).json({ error: 'Name and actions are required' });
      return;
    }

    const workflow = await Workflow.create({
      userId: req.user!._id,
      name,
      trigger: 'manual',
      actions,
      actionConfigs: actionConfigs || {},
    });

    res.status(201).json(workflow);
  } catch (error: any) {
    console.error('Create workflow error:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
};

/**
 * Get all workflows for current user
 */
export const getWorkflows = async (req: Request, res: Response): Promise<void> => {
  try {
    const workflows = await Workflow.find({ userId: req.user!._id }).sort({ createdAt: -1 });

    res.json(workflows);
  } catch (error: any) {
    console.error('Get workflows error:', error);
    res.status(500).json({ error: 'Failed to get workflows' });
  }
};

/**
 * Get a single workflow
 */
export const getWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const workflow = await Workflow.findOne({
      _id: id,
      userId: req.user!._id,
    });

    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }

    res.json(workflow);
  } catch (error: any) {
    console.error('Get workflow error:', error);
    res.status(500).json({ error: 'Failed to get workflow' });
  }
};

/**
 * Execute a workflow
 */
export const runWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      momContent,
      emailTo,
      emailSubject,
      emailBody,
      calendarTitle,
      calendarBody,
      calendarStart,
      calendarEnd,
      calendarAttendees,
      teamsTeamId,
      teamsChannelId,
      teamsMessage,
    } = req.body;

    // Find workflow
    const workflow = await Workflow.findOne({
      _id: id,
      userId: req.user!._id,
    });

    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }

    // Get user with access token
    const user = await User.findById(req.user!._id).select('+accessToken +refreshToken');

    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'User access token not found. Please login again.' });
      return;
    }

    // Check if token is expired and refresh if needed
    let accessToken = user.accessToken;
    if (user.tokenExpiresAt && user.tokenExpiresAt < new Date() && user.refreshToken) {
      try {
        const authService = new AuthService();
        const newTokenResponse = await authService.acquireTokenByRefreshToken(user.refreshToken);

        if (newTokenResponse) {
          user.accessToken = newTokenResponse.accessToken;
          user.refreshToken = newTokenResponse.refreshToken || user.refreshToken;
          user.tokenExpiresAt = newTokenResponse.expiresOn || undefined;
          await user.save();
          accessToken = newTokenResponse.accessToken;
        } else {
          res.status(401).json({ error: 'Token expired. Please login again.' });
          return;
        }
      } catch (error: any) {
        console.error('Token refresh error:', error);
        res.status(401).json({ error: 'Failed to refresh token. Please login again.' });
        return;
      }
    }

    // Create execution log
    const log = await ExecutionLog.create({
      userId: req.user!._id,
      workflowId: workflow._id,
      status: 'running',
      actionsExecuted: [],
    });

    try {
      // Log token info before execution
      console.log('Executing workflow with token:', {
        tokenLength: accessToken.length,
        tokenPreview: accessToken.substring(0, 20) + '...',
        tokenExpiresAt: user.tokenExpiresAt,
        isExpired: user.tokenExpiresAt ? user.tokenExpiresAt < new Date() : null,
      });
      
      // Execute workflow with refreshed token
      const executor = new WorkflowExecutor(accessToken);

      const context: WorkflowExecutionContext = {
        workflow,
        user,
        accessToken: accessToken, // Use the refreshed token
        momContent,
        emailTo,
        emailSubject,
        emailBody,
        calendarTitle,
        calendarBody,
        calendarStart,
        calendarEnd,
        calendarAttendees,
        teamsTeamId,
        teamsChannelId,
        teamsMessage,
      };

      const result = await executor.execute(context);

      // Update log
      log.status = result.success ? 'success' : 'failed';
      log.actionsExecuted = result.actionsExecuted;
      log.error = result.error;
      await log.save();

      res.json({
        success: result.success,
        logId: log._id,
        actionsExecuted: result.actionsExecuted,
        error: result.error,
      });
    } catch (error: any) {
      // Update log with error
      log.status = 'failed';
      log.error = error.message;
      await log.save();

      res.status(500).json({
        success: false,
        logId: log._id,
        error: error.message,
      });
    }
  } catch (error: any) {
    console.error('Run workflow error:', error);
    res.status(500).json({ error: 'Failed to run workflow' });
  }
};

/**
 * Delete a workflow
 */
export const deleteWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const workflow = await Workflow.findOneAndDelete({
      _id: id,
      userId: req.user!._id,
    });

    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }

    res.json({ message: 'Workflow deleted successfully' });
  } catch (error: any) {
    console.error('Delete workflow error:', error);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
};

