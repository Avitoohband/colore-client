// Simple, accessible prompt templates for all players
const baseSystemInstruction = `
You're a story narrator. Always respond in short, simple English. Use no more than 2–3 sentences. Avoid long or complex words. Keep it easy and fun to follow.
`;

const openingPrompt = `
${baseSystemInstruction}

Start a new adventure. Set the scene in simple words. Describe where the players are and what they see. Don't ask questions or tell them what to do.
`;

const systemPrompt = `
${baseSystemInstruction}

Tell what happens after the player's action. Keep it short and simple. Don't ask questions or give suggestions. Let players choose what to do next.
`;

/**
 * Generate an opening story for a new adventure
 * @param playerAction Optional first player action to incorporate
 * @param genre Optional genre for the story
 * @param customBackstory Optional custom backstory
 * @returns Promise that resolves to the opening story text
 */
export async function generateOpeningStory(playerAction?: string, genre?: string, customBackstory?: string): Promise<string> {
  try {
    // Build the prompt based on setup options
    let prompt = ''
    
    if (customBackstory) {
      prompt = `${baseSystemInstruction}

Use this backstory to start the story:
${customBackstory}

${playerAction ? `The first player decides to: ${playerAction}\n\n` : ''}Start the adventure using simple words. Describe where the players are and what they see${playerAction ? ' and what happens from their action' : ''}. Keep it short and easy to understand.`
    } else if (genre) {
      prompt = `${baseSystemInstruction}

Start a ${genre} adventure. ${playerAction ? `The first player decides to: ${playerAction}\n\n` : ''}Describe the scene in simple words. Tell where the players are and what they see${playerAction ? ' and what happens from their action' : ''}. Keep it short and fun.`
    } else {
      prompt = playerAction 
        ? `${openingPrompt}\n\nThe first player decides to: ${playerAction}\n\nStart the story and include what happens from their action.`
        : openingPrompt
    }

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
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
    return "You stand at the edge of a magic forest. Strange lights float between the trees. A path leads into the dark woods.";
  }
}

/**
 * Utility function to query a local Mistral model using Ollama with story context
 * @param storyContext The full story history and player action
 * @param genre Optional genre to maintain consistency
 * @param customBackstory Optional custom backstory for context
 * @returns Promise that resolves to the generated text
 */
export async function queryOllama(storyContext: string, genre?: string, customBackstory?: string): Promise<string> {
  try {
    // Build context-aware system prompt
    let contextPrompt = systemPrompt
    
    if (customBackstory) {
      contextPrompt = `${baseSystemInstruction}

This story uses this backstory: ${customBackstory}

Tell what happens after the player's action. Stay true to this world. Use simple words and keep it short.`
    } else if (genre) {
      contextPrompt = `${baseSystemInstruction}

This is a ${genre} story. Tell what happens after the player's action. Keep the ${genre} style but use simple words.`
    }

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `${contextPrompt}\n\nStory Context:\n${storyContext}`,
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
