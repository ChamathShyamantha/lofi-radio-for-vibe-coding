# 📻 Drift FM

A highly interactive, aesthetically-driven Lofi Radio built for the perfect "Vibe Coding" session. Drift FM isn't just a static player—it's a living, breathing workspace featuring zero-gravity physics, a fully functional terminal centerpiece, and authentic CRT monitor effects.

## ✨ Features

- **Zero-G Physics Sandbox**: Background items (cassettes, mugs, gameboys) float seamlessly across your screen, gently bouncing off the edges. They even react to the bass drops of the music!
- **Interactive Terminal**: Control the entire app via a retro terminal. Type commands like `play`, `theme vaporwave`, or `timer 25` to manage your environment.
- **Draggable Everything**: The audio player, terminal, ambient mixer, pomodoro timer, and sticky notes can all be freely dragged and arranged to build your perfect workspace.
- **Ambient Noise Mixer**: Mix in high-quality background sounds (Rain, Fireplace, Vinyl Crackle, Cafe) with dedicated volume sliders to create your perfect acoustic environment.
- **Dynamic Themes**: Instantly switch between custom curated color palettes (`lamplight`, `vaporwave`, `matrix`, `dawn`).
- **Productivity Tools**: Built-in draggable Pomodoro Focus Timer and a persistent Sticky Notes to-do list that saves your tasks across sessions.
- **Authentic Aesthetics**: Custom CSS gradients, subtle monitor flicker, curvature vignette, and scanlines give the app an authentic 90s CRT feel.

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion) + Native CSS Keyframes
- **Physics**: Matter.js (Zero-gravity 2D engine)
- **Audio**: Howler.js (Crossfading streams + local ambient loops)

## 🚀 Getting Started

To run Drift FM locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/IlangkoonIMCSB/lofi-radio-for-vibe-coding.git
   cd lofi-radio-for-vibe-coding
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`. 

## 🎮 Terminal Commands

Click the center terminal to type these commands:
- `play` / `pause`: Toggle the music stream.
- `next` / `prev`: Cycle through curated Lofi stations.
- `theme <name>`: Change colors (e.g., `theme vaporwave`).
- `timer <minutes>`: Start the Pomodoro timer (e.g., `timer 25`).
- `sticky`: Toggle the Sticky Notes to-do list.

---

*“The goal is a radio that feels alive even when you do nothing, and delightful the moment you touch it.”*
