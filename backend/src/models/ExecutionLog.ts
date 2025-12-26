import mongoose, { Document, Schema } from 'mongoose';

export interface IExecutionLog extends Document {
  userId: mongoose.Types.ObjectId;
  workflowId: mongoose.Types.ObjectId;
  status: 'success' | 'failed' | 'running';
  actionsExecuted: string[];
  error?: string;
  executedAt: Date;
}

const ExecutionLogSchema = new Schema<IExecutionLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workflowId: {
      type: Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'running'],
      required: true,
    },
    actionsExecuted: {
      type: [String],
      default: [],
    },
    error: {
      type: String,
    },
    executedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ExecutionLog = mongoose.model<IExecutionLog>('ExecutionLog', ExecutionLogSchema);

