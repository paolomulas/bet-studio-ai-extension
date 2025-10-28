# 🎯 Bet-Studio AI Match Insights - Chrome Extension

> **Real-time AI-powered football match analysis using Chrome's built-in Gemini Nano**

Chrome Extension that provides instant, privacy-first match insights using **Prompt API** and **Summarizer API** to help users identify high-value opportunities in real-time.

---

## 🏆 Contest Submission - Google Chrome Built-in AI Challenge 2025

**Track**: Chrome Extensions  
**Category**: Best Hybrid AI Application

---

## 🚀 What It Does

Bet-Studio AI Match Insights is a Chrome Extension that:

1. **Fetches live match data** from bet-studio.com API (hot matches in profitability windows)
2. **Analyzes each match locally** using Chrome's Prompt API (Gemini Nano)
3. **Generates human-readable insights** using Chrome's Summarizer API
4. **Displays results in interactive flip cards** with smooth animations
5. **Falls back to server AI** when Chrome AI is unavailable (hybrid architecture)

### Key Features

- 💡 **AI-Powered Insights**: Each match gets a "Why NOW?" explanation
- 🔒 **Privacy-First**: Data analyzed on-device, nothing sent to servers
- ⚡ **Ultra-Fast**: ~200ms analysis vs 2-3s server calls
- 🎴 **Interactive UI**: Flip cards reveal AI insights on click
- 🌐 **Hybrid Fallback**: Works everywhere, optimized for Chrome AI

---

## 🤖 Chrome AI APIs Used

### 1. **Prompt API (Gemini Nano)**
- **Purpose**: Analyze match data and generate predictions
- **Input**: Match metrics (possession, shots, corners, etc.)
- **Output**: Confidence score + brief analysis
- **Benefit**: 100% local processing, zero API costs

### 2. **Summarizer API**
- **Purpose**: Generate concise "Why this matters NOW" explanations
- **Input**: Match data + AI analysis + market context
- **Output**: 1-2 sentence human-readable insight
- **Benefit**: Perfect for glanceable mobile/extension UI

---

## 📁 Project Structure

bet-studio-extension-gemini-nano/
├── manifest.json # Extension config with AI permissions
├── popup.html # Extension popup UI
├── popup.js # UI logic + flip card rendering
├── service-worker.js # Background logic + AI processing
├── styles.css # Styling + flip animations
├── options.html # Settings page
├── options.js # Settings logic
├── logo-*.png # Extension icons
└── README.md # This file


---

## 🔧 Installation & Testing

### Prerequisites

- **Chrome Dev/Canary** (version 127+)
- **Chrome AI Origin Trial** enabled
- **Windows 10+** / **macOS 13+** / **Linux** (with Gemini Nano support)

### Enable Chrome AI

1. Open `chrome://flags`
2. Enable: **"Prompt API for Gemini Nano"**
3. Enable: **"Summarization API for Gemini Nano"**
4. Restart Chrome
5. Wait for Gemini Nano to download (~1.7GB, one-time)

### Load Extension

1. Clone/download this repository
2. Open Chrome → `chrome://extensions`
3. Enable **"Developer mode"**
4. Click **"Load unpacked"**
5. Select the `bet-studio-extension-gemini-nano` folder
6. Click the extension icon in toolbar

### Testing

- **With Chrome AI**: See "🤖 Local AI" badge on cards
- **Without Chrome AI**: See "🌐 Server" badge (fallback mode)
- **Click any card**: Flip animation reveals AI insight
- **Check console**: See AI processing logs

---

## 🎨 UI/UX Highlights

### Interactive Flip Cards

- **Front**: Match info, confidence score, key metrics
- **Back**: AI-generated insight explaining "why NOW"
- **Smooth 3D rotation** on click
- **Hint badge** pulses to invite interaction

### Smart Layout

- **Masonry grid** adapts to content height
- **Responsive** to different screen sizes
- **Accessible** keyboard navigation support

---

## 🏗️ Architecture

USER OPENS EXTENSION
↓
SERVICE WORKER
├─ Fetch hot matches from API
├─ Check Chrome AI availability
│
├─ FOR EACH MATCH:
│ ├─ PROMPT API → Analyze match data
│ └─ SUMMARIZER API → Generate insight
│
└─ Return processed matches to popup
↓
POPUP
├─ Render flip cards
├─ Add click handlers
└─ Display AI insights on flip


### Hybrid AI Strategy

| Scenario | Prompt API | Summarizer | Source | Latency |
|----------|------------|------------|--------|---------|
| **Best Case** | ✅ Local | ✅ Local | Local AI | ~200ms |
| **Partial** | ✅ Local | ❌ Fallback | Local AI | ~150ms |
| **Fallback** | ❌ Server | ❌ Server | Server | ~50ms |

---

## 🎯 Why This Matters

### Problem Solved

Traditional sports analytics require:
- ❌ Manual data review
- ❌ Slow server processing
- ❌ Privacy concerns (data sent to cloud)
- ❌ High API costs

### Our Solution

- ✅ **Instant insights** using on-device AI
- ✅ **100% private** - data never leaves browser
- ✅ **Zero cost** - no server compute needed
- ✅ **Always available** - works offline with demo data

---

## 🔐 Privacy & Security

- **No tracking**: Extension doesn't collect user data
- **Local-first**: AI analysis happens on-device
- **Minimal permissions**: Only API access for match data
- **Open source**: Full code transparency

---

## 📊 Performance Metrics

| Metric | Chrome AI | Server Fallback |
|--------|-----------|-----------------|
| **Latency** | 150-250ms | 50ms (pre-computed) |
| **Privacy** | 100% local | Server-side |
| **Cost** | $0 | $0.002/request |
| **Offline** | ✅ Yes (demo) | ❌ No |

---

## 🚀 Future Enhancements

- [ ] Voice input for match queries (Speech API)
- [ ] Multi-language support (Translator API)
- [ ] Historical analysis comparison
- [ ] Browser notifications for hot opportunities
- [ ] Chrome Side Panel integration

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Authors

**Paolo Mulas**  
- GitHub: [@paolomulas](https://github.com/paolomulas)
- Email: paolomulas@gmail.com

---

## 🙏 Acknowledgments

- Google Chrome AI Team for built-in AI APIs
- Bet-Studio.com for match data API
- Chrome Extension community for inspiration

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/paolomulas/bet-studio-extension-gemini-nano/issues)
- **Email**: paolomulas@gmail.com
- **Website**: [bet-studio.com](https://bet-studio.com)

---

**Built for Google Chrome Built-in AI Challenge 2025** 🏆
