import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface TabInput {
  title: string;
  url: string;
}

interface AISessionMeta {
  title: string;
  tags: string[];
}

export async function generateSessionMeta(tabs: TabInput[]): Promise<AISessionMeta> {
  const tabList = tabs
    .slice(0, 30)
    .map((t, i) => `${i + 1}. [${t.title}] ${t.url}`)
    .join('\n');

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 150,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a browser session organizer. Given a list of open browser tabs, return a JSON object with:
- "title": a concise session name (3-6 words, title case) capturing the overall theme
- "tags": an array of 2-5 lowercase keyword tags (use hyphens instead of spaces)

Examples: title "React Authentication Deep Dive", tags ["react", "auth", "frontend"]
Return only valid JSON.`,
        },
        {
          role: 'user',
          content: `Open tabs:\n\n${tabList}`,
        },
      ],
    });

    const raw = response.choices[0].message.content ?? '{}';
    const parsed = JSON.parse(raw);

    return {
      title: typeof parsed.title === 'string' ? parsed.title : 'Untitled Session',
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
    };
  } catch {
    return { title: 'Untitled Session', tags: [] };
  }
}
