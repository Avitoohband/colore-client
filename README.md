# 🎭 CoLore - Collaborative Storytelling Game

A local-only, browser-based storytelling game built with Next.js, Tailwind CSS, and Zustand. Players take turns creating stories together with AI assistance.

## ✨ Features

- **Local Multiplayer**: Multiple players on the same device
- **Turn-Based Gameplay**: Players take turns describing actions
- **AI Story Generation**: AI narrator continues the story (currently simulated)
- **Private Player Chat**: Side conversations between players (not seen by AI)
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **No Backend Required**: Runs entirely in the browser

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Play

1. **Setup**: Add 2 or more players to start the game
2. **Take Turns**: Each player describes what their character does
3. **AI Response**: The AI narrator continues the story based on player actions
4. **Chat**: Use private chat to discuss strategy without the AI seeing
5. **Collaborate**: Work together to create an amazing story!

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main game page
│   └── globals.css        # Global styles
├── components/
│   ├── TurnIndicator.tsx  # Shows current player
│   ├── StoryLog.tsx       # Displays story messages
│   ├── PlayerInput.tsx    # Input for current player
│   └── PlayerChat.tsx     # Private player chat
└── store/
    └── gameStore.ts       # Zustand state management
```

## 🔧 Technical Details

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **TypeScript**: Full type safety
- **No External APIs**: Currently uses simulated AI responses

## 🚀 AI Integration

To integrate with a real AI service (like Hugging Face), replace the simulated AI response in `components/PlayerInput.tsx`:

```typescript
// Replace the setTimeout simulation with actual API call
const response = await fetch('your-ai-endpoint', {
  method: 'POST',
  body: JSON.stringify({ prompt: input }),
  headers: { 'Content-Type': 'application/json' }
})
const aiResponse = await response.json()
addStoryMessage('AI Narrator', aiResponse.text)
```

## 📦 Build for Production

```bash
npm run build
npm run start
```

## 🤝 Contributing

Feel free to contribute by:
- Adding new AI integrations
- Improving the UI/UX
- Adding new game features
- Fixing bugs

## 📄 License

This project is open source and available under the MIT License.
