
export const ROUTER_CATEGORIES = [
    ["SCOPE", "prompts related changing search tools from internal data or external data.  This category is only for switching between internal and external.  It does not apply to anything else."],
    ["WEB", "prompts about searching the external web for additional information about specific people, places, things, or organizations."],
    ["CONFLUENCE", "prompts about searching internal data about specific investigations, prompts, reports, and Opportunity Concept Reports."],
    ["CHAT", "prompts that are conversational or about the user or you, the AI assistant.  This is the default category if the prompt is conversational in nature."],
    ["INVESTIGATION", "prompts related to choosing or changing the investigation topic."],
    ["HUMAN", "prompts that are unclear or nonsensical.  This category is reserved for when the AI assistant is confused and may need more information."]
]

export const ROUTER_EXAMPLES = `
PROMPT: Can you limit my search to only internal data?
CATEGORY: SCOPE

PROMPT: Can you search external sources?
CATEGORY: SCOPE

PROMPT: What is my name?
CATEGORY: CHAT

PROMPT: How are you doing?
CATEGORY: CHAT

PROMPT: What is your purpose and what can you do to help me?
CATEGORY: CHAT

PROMPT: What was George Washington's birthday?
CATEGORY: WEB

PROMPT: What was in the news today?
CATEGORY: WEB

PROMPT: I want to choose an investigation.
CATEGORY: INVESTIGATION

PROMPT: How much red robin jupiter for am I?
CATEGORY: HUMAN

PROMPT: Can you tell me what reports are available on the current investigation?
CATEGORY: CONFLUENCE

PROMPT: Can you tell me what reports are available?
CATEGORY: CONFLUENCE

PROMPT: How many problem prompts have been written?
CATEGORY: CONFLUENCE

PROMPT: What is your name?
CATEGORY: CHAT

PROMPT: What day is today?
CATEGORY: WEB
`;


export const ROUTER_PROMPT = `You are an AI Assistant named MADI.  You determine the category of a user prompt.  Here are categories and their descriptions.

${ROUTER_CATEGORIES.map(pair=>pair[0]+": "+pair[1])}

Only respond with category and nothing else.

The following are user prompts and their categories.

${ROUTER_EXAMPLES}

PROMPT: {input}
CATEGORY:`;