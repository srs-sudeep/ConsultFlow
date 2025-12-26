import { GraphClient } from '../graph/graphClient';
import { MOMGenerator } from '../ai/momGenerator';
import { IWorkflow } from '../../models/Workflow';
import { IUser } from '../../models/User';

export interface WorkflowExecutionContext {
  workflow: IWorkflow;
  user: IUser;
  accessToken: string;
  momContent?: string;
  emailTo?: string;
  emailSubject?: string;
  emailBody?: string;
  calendarTitle?: string;
  calendarBody?: string;
  calendarStart?: string;
  calendarEnd?: string;
  calendarAttendees?: string[];
  teamsTeamId?: string;
  teamsChannelId?: string;
  teamsMessage?: string;
}

/**
 * Workflow Execution Engine
 * Executes workflow actions sequentially
 */
export class WorkflowExecutor {
  private graphClient: GraphClient;
  private momGenerator: MOMGenerator;

  constructor(accessToken: string) {
    this.graphClient = new GraphClient(accessToken);
    this.momGenerator = new MOMGenerator();
  }

  /**
   * Execute a workflow with the given context
   */
  async execute(context: WorkflowExecutionContext): Promise<{
    success: boolean;
    actionsExecuted: string[];
    error?: string;
  }> {
    const actionsExecuted: string[] = [];
    let lastError: string | undefined;

    try {
      // Generate MOM first if needed (other actions may depend on it)
      let generatedMOM: string | undefined;
      if (context.workflow.actions.includes('generate_mom')) {
        if (!context.momContent) {
          throw new Error('Meeting notes are required for generate_mom action');
        }
        try {
          generatedMOM = await this.momGenerator.generateMOM(context.momContent);
          actionsExecuted.push('generate_mom');
        } catch (error: any) {
          throw new Error(`Failed to generate MOM: ${error.message}`);
        }
      }

      // Use generated MOM if available, otherwise use provided content
      const momContentToUse = generatedMOM || context.momContent;

      // Execute actions sequentially
      for (const action of context.workflow.actions) {
        try {
          switch (action) {
            case 'generate_mom':
              // Already executed above, skip
              continue;

            case 'send_email':
              // Use emailBody if provided, otherwise use generated MOM
              // If emailBody is empty string, treat it as "use MOM"
              const emailBody = (context.emailBody && context.emailBody.trim()) 
                ? context.emailBody 
                : (momContentToUse || '');
              
              if (!emailBody || emailBody.trim().length === 0) {
                throw new Error('Email body is required. Please generate MOM first or provide email body content.');
              }
              if (!context.emailTo || !context.emailSubject) {
                throw new Error('Email recipient and subject are required');
              }
              await this.graphClient.sendEmail(
                context.emailTo,
                context.emailSubject,
                emailBody
              );
              actionsExecuted.push('send_email');
              break;

            case 'create_calendar':
              if (!context.calendarTitle || !context.calendarStart || !context.calendarEnd) {
                throw new Error('Calendar title, start, and end times are required');
              }
              await this.graphClient.createCalendarEvent(
                context.calendarTitle,
                context.calendarBody || momContentToUse || '',
                context.calendarStart,
                context.calendarEnd,
                context.calendarAttendees
              );
              actionsExecuted.push('create_calendar');
              break;

            case 'teams_post':
              if (!context.teamsTeamId || !context.teamsChannelId || !context.teamsMessage) {
                throw new Error('Teams team ID, channel ID, and message are required');
              }
              await this.graphClient.postTeamsMessage(
                context.teamsTeamId,
                context.teamsChannelId,
                context.teamsMessage
              );
              actionsExecuted.push('teams_post');
              break;

            default:
              console.warn(`Unknown action: ${action}`);
          }
        } catch (error: any) {
          lastError = error.message;
          console.error(`Error executing action ${action}:`, error);
          // Continue with next action even if one fails
        }
      }

      return {
        success: actionsExecuted.length > 0 && lastError === undefined,
        actionsExecuted,
        error: lastError,
      };
    } catch (error: any) {
      return {
        success: false,
        actionsExecuted,
        error: error.message || 'Unknown error',
      };
    }
  }
}

