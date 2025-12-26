import mongoose, { Document, Schema } from 'mongoose';

export type WorkflowAction = 
  | 'generate_mom'
  | 'send_email'
  | 'create_calendar'
  | 'teams_post'
  | 'create_ppt'
  | 'ai_process'
  | 'save_data'
  | 'api_call';

export interface IWorkflow extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  trigger: 'manual' | 'schedule' | 'webhook' | 'transcript';
  actions: WorkflowAction[];
  actionConfigs?: Record<string, any>; // Configuration for each action
  canvasData?: {
    nodes: any[];
    edges: any[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowSchema = new Schema<IWorkflow>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    trigger: {
      type: String,
      enum: ['manual', 'schedule', 'webhook', 'transcript'],
      default: 'manual',
    },
    actions: {
      type: [String],
      enum: ['generate_mom', 'send_email', 'create_calendar', 'teams_post', 'create_ppt', 'ai_process', 'save_data', 'api_call'],
      required: true,
    },
    actionConfigs: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    canvasData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Workflow = mongoose.model<IWorkflow>('Workflow', WorkflowSchema);

