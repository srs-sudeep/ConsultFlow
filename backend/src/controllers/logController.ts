import { Request, Response } from 'express';
import { ExecutionLog } from '../models/ExecutionLog';

/**
 * Get execution logs for current user
 */
export const getLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const logs = await ExecutionLog.find({ userId: req.user!._id })
      .populate('workflowId', 'name actions')
      .sort({ executedAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await ExecutionLog.countDocuments({ userId: req.user!._id });

    res.json({
      logs,
      total,
      limit,
      skip,
    });
  } catch (error: any) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
};

/**
 * Get a single execution log
 */
export const getLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const log = await ExecutionLog.findOne({
      _id: id,
      userId: req.user!._id,
    }).populate('workflowId', 'name actions');

    if (!log) {
      res.status(404).json({ error: 'Log not found' });
      return;
    }

    res.json(log);
  } catch (error: any) {
    console.error('Get log error:', error);
    res.status(500).json({ error: 'Failed to get log' });
  }
};

