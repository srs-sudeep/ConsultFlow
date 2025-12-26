import OpenAI from 'openai';

/**
 * AI Service for generating Meeting Minutes of Meeting (MOM)
 * Supports both OpenAI and Azure OpenAI
 */
export class MOMGenerator {
  private client: OpenAI;

  constructor() {
    // Check if using Azure OpenAI or standard OpenAI
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (azureEndpoint && azureApiKey) {
      // Azure OpenAI
      this.client = new OpenAI({
        apiKey: azureApiKey,
        baseURL: `${azureEndpoint}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-35-turbo'}`,
        defaultQuery: { 'api-version': '2024-02-15-preview' },
        defaultHeaders: {
          'api-key': azureApiKey,
        },
      });
    } else if (openaiApiKey) {
      // Standard OpenAI
      this.client = new OpenAI({
        apiKey: openaiApiKey,
      });
    } else {
      throw new Error('Either OPENAI_API_KEY or AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_API_KEY must be set');
    }
  }

  /**
   * Generate structured Meeting Minutes from raw notes
   */
  async generateMOM(meetingNotes: string): Promise<string> {
    const systemPrompt = `You are a professional consulting assistant. Generate comprehensive Meeting Minutes of Meeting (MOM) from the provided meeting notes or transcript.

You MUST format the output EXACTLY as follows in Markdown:

# Meeting Minutes

## Date and Time
[Extract and insert date and time from the meeting notes. If not available, use "TBD"]

## Location
[Extract location if mentioned, otherwise use "Virtual" or "TBD"]

## Meeting Title
[Extract or create a descriptive meeting title]

## Attendees
(Random order, titles omitted)
[List all attendees mentioned in the notes. Format as bullet points with names only, no titles]

## Materials Used
[List any materials, documents, presentations, or tools mentioned during the meeting]

## Overview
[Read the transcript and summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. Avoid unnecessary details or tangential points. Limit the paragraph to 80 words.]

## Discussion Items
[Given the meeting transcript, create a list of key discussion items for each speaker in the following format:

**[Speaker 1 Name]:**
- [Point 1 discussed by Speaker 1]
- [Point 2 discussed by Speaker 1]
- [Point 3 discussed by Speaker 1]

**[Speaker 2 Name]:**
- [Point 1 discussed by Speaker 2]
- [Point 2 discussed by Speaker 2]
- [Point 3 discussed by Speaker 2]

[Add more speakers and their discussion points as needed. Identify all speakers from the transcript and list their key discussion points.]]

## Action Items
[Review the meeting transcript and identify any tasks, assignments, or actions that were agreed upon or mentioned as needing to be done. These could be tasks assigned to specific individuals, or general actions that the group has decided to take. List these action items clearly and concisely in a table format.

The table MUST have three columns:
1. **Action Item** - The task or action to be completed
2. **Assignee Name** - The person assigned to complete the task
3. **Due Date** - The due date in format: MM/DD & Day (e.g., "01/15 & Monday")

Format as a Markdown table:

| Action Item | Assignee Name | Due Date |
|------------|---------------|----------|
| [Task description] | [Assignee name] | [MM/DD & Day] |
| [Task description] | [Assignee name] | [MM/DD & Day] |

If no action items are found, create a table with a single row indicating "No action items identified."]

## Decisions
[Create a table or list of all decisions made during the meeting. Include:
- Decision description
- Decision maker/owner
- Date/Deadline if applicable]

## Detailed Minutes

### Project Progress Report
[Summarize project status, milestones, and progress updates mentioned]

### Confirmation of Issues/To Do Status
[Document any issues discussed and status of previous action items]

### Other Contact Items
[Any other important discussion points, concerns, or items that need attention]

## Next Meeting
- **Date and Time:** [Extract next meeting date/time if mentioned, otherwise "TBD"]
- **Location:** [Extract location if mentioned, otherwise "TBD"]
- **Attendees:** [List expected attendees for next meeting]

Use professional consulting language. Be comprehensive and extract all relevant information from the meeting notes. Identify all speakers and their contributions accurately.`;

    const userPrompt = `Generate Meeting Minutes from the following transcript:\n\n${meetingNotes}`;

    try {
      // Determine model name based on whether using Azure OpenAI or standard OpenAI
      const isAzureOpenAI = !!process.env.AZURE_OPENAI_ENDPOINT;
      const modelName = isAzureOpenAI
        ? (process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-35-turbo')
        : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo');

      const completion = await this.client.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from AI');
      }

      return content;
    } catch (error: any) {
      console.error('Error generating MOM:', error);
      throw new Error(`Failed to generate MOM: ${error.message}`);
    }
  }
}

