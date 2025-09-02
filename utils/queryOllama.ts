// Prompt templates for different story phases
const openingPrompt = `
You're a narrator for a collaborative storytelling game. Start a new adventure with a magical, mysterious setting. 
Use vivid language but keep it short—no more than 4 sentences. End your description with a question that invites the player to act.
`;

const systemPrompt = `
You are a narrator in a collaborative fantasy game. 
Your role is to respond to player actions with vivid, concise story beats.
Keep your replies under 4–5 sentences. End with an open-ended question or invitation to act.
`;

/**
 * Generate an opening story for a new adventure
 * @param playerAction Optional first player action to incorporate
 * @returns Promise that resolves to the opening story text
 */
export async function generateOpeningStory(playerAction?: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: playerAction 
          ? `${openingPrompt}\n\nThe first player decides to: ${playerAction}\n\nNow create an opening that sets the scene and incorporates this action.`
          : openingPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.response) {
      return data.response.trim();
    } else {
      throw new Error('No response field in the result');
    }
  } catch (error) {
    console.error('Error generating opening story:', error);
    return "You find yourself standing at the edge of an enchanted forest, where ancient trees whisper secrets in the wind. Mysterious lights dance between the branches, and a winding path disappears into the shadows ahead. The air hums with magical energy, and you sense that great adventures await. What do you choose to do first?";
  }
}

/**
 * Utility function to query a local Mistral model using Ollama with story context
 * @param storyContext The full story history and player action
 * @returns Promise that resolves to the generated text
 */
export async function queryOllama(storyContext: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `${systemPrompt}\n\nStory Context:\n${storyContext}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response field and return it trimmed
    if (data && data.response) {
      return data.response.trim();
    } else {
      throw new Error('No response field in the result');
    }
  } catch (error) {
    console.error('Error querying Ollama:', error);
    // Return fallback response
    return "I'm not sure what happens next.";
  }
}
