import { Request, Response } from 'express';
import { MOMGenerator } from '../services/ai/momGenerator';

/**
 * Generate Meeting Minutes of Meeting
 */
export const generateMOM = async (req: Request, res: Response): Promise<void> => {
  try {
    const { meetingNotes } = req.body;

    if (!meetingNotes || typeof meetingNotes !== 'string' || meetingNotes.trim().length === 0) {
      res.status(400).json({ error: 'meetingNotes is required and must be a non-empty string' });
      return;
    }

    const momGenerator = new MOMGenerator();
    const momContent = await momGenerator.generateMOM(meetingNotes);

    // Parse MOM to extract structured data
    const parsedData = parseMOM(momContent);

    res.json({
      success: true,
      mom: momContent,
      structured: parsedData,
    });
  } catch (error: any) {
    console.error('Generate MOM error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate MOM',
    });
  }
};

/**
 * Parse MOM content to extract structured data
 */
function parseMOM(momContent: string): any {
  const data: any = {
    dateTime: extractSection(momContent, 'Date and Time'),
    location: extractSection(momContent, 'Location'),
    meetingTitle: extractSection(momContent, 'Meeting Title'),
    attendees: extractList(momContent, 'Attendees'),
    materialsUsed: extractList(momContent, 'Materials Used'),
    agenda: extractList(momContent, 'Agenda'),
    decisions: extractTableOrList(momContent, 'Decisions'),
    todos: extractTableOrList(momContent, 'ToDos'),
    nextMeeting: {
      dateTime: extractSection(momContent, 'Next Meeting', 'Date and Time'),
      location: extractSection(momContent, 'Next Meeting', 'Location'),
      attendees: extractList(momContent, 'Next Meeting', 'Attendees'),
    },
  };

  return data;
}

function extractSection(content: string, ...sectionNames: string[]): string {
  for (const sectionName of sectionNames) {
    const regex = new RegExp(`##?\\s*${sectionName}[\\s\\S]*?\\n([\\s\\S]*?)(?=##|$)`, 'i');
    const match = content.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function extractList(content: string, ...sectionNames: string[]): string[] {
  const section = extractSection(content, ...sectionNames);
  if (!section) return [];

  // Extract list items (bullet points, numbered lists, etc.)
  const items = section
    .split('\n')
    .map(line => line.replace(/^[\s\-\*\•\d+\.\)]+/, '').trim())
    .filter(item => item.length > 0);

  return items;
}

function extractTableOrList(content: string, ...sectionNames: string[]): any[] {
  const section = extractSection(content, ...sectionNames);
  if (!section) return [];

  // Try to extract table format first
  const tableRegex = /\|(.+)\|/g;
  const tableMatches = [...section.matchAll(tableRegex)];
  
  if (tableMatches.length > 1) {
    // It's a table, parse it
    const headers = tableMatches[0][1].split('|').map(h => h.trim()).filter(Boolean);
    const rows = tableMatches.slice(2).map(match => {
      const values = match[1].split('|').map(v => v.trim()).filter(Boolean);
      const row: any = {};
      headers.forEach((header, i) => {
        row[header.toLowerCase().replace(/\s+/g, '_')] = values[i] || '';
      });
      return row;
    });
    return rows;
  }

  // Fallback to list format
  return extractList(content, ...sectionNames).map(item => ({ description: item }));
}
