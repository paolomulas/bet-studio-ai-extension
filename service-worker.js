// 🚀 BET-STUDIO EXTENSION SERVICE WORKER - CHROME AI CONTEST VERSION

console.log("🚀 Bet-Studio AI Service Worker Starting...");

const API_BASE = 'https://bet-studio.com/api';

// 🤖 CHECK CHROME AI AVAILABILITY
async function checkAIAvailability() {
  const capabilities = {
    promptAPI: false,
    summarizerAPI: false
  };

  try {
    if ('ai' in self) {
      // Check Prompt API
      if ('languageModel' in self.ai) {
        const status = await self.ai.languageModel.capabilities();
        capabilities.promptAPI = status.available === 'readily';
      }
      
      // Check Summarizer API
      if ('summarizer' in self.ai) {
        const status = await self.ai.summarizer.capabilities();
        capabilities.summarizerAPI = status.available === 'readily';
      }
    }
  } catch (error) {
    console.log('⚠️ Chrome AI APIs not available:', error);
  }

  console.log('🤖 AI Capabilities:', capabilities);
  return capabilities;
}

// 🔄 FETCH HOT MATCHES FROM API
// 🔄 FETCH HOT MATCHES FROM API
async function getHotMatches() {
  console.log("🔄 Fetching hot matches from API...");
  
  try {
    const response = await fetch(`${API_BASE}/getMatches.php?today=1&limit=6&source=extension`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Bet-Studio-Extension/2.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    console.log(`📡 API Response Status: ${response.status}`);

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API Response Data:", data);
    
    // ✅ FLEXIBLE FORMAT HANDLING
    let matches = [];
    
    if (data.matches && Array.isArray(data.matches)) {
      // Format 1: { matches: [...] }
      matches = data.matches;
    } else if (Array.isArray(data)) {
      // Format 2: Direct array
      matches = data;
    } else if (data.success && data.data && Array.isArray(data.data)) {
      // Format 3: { success: true, data: [...] }
      matches = data.data;
    } else {
      console.warn("⚠️ Unexpected API format, using demo matches");
      throw new Error('Unexpected API response format');
    }
    
    if (matches.length === 0) {
      console.log("ℹ️ No matches from API, using demo");
      throw new Error('No matches available');
    }
    
    console.log(`✅ Parsed ${matches.length} matches from API`);
    return matches.map(transformExtensionMatch);
    
  } catch (error) {
    console.error("❌ API Error:", error.message);
    console.log("📦 Falling back to demo matches");
    return getDemoMatches();
  }
}


// 🔨 TRANSFORM MATCH DATA
function transformExtensionMatch(m) {
  return {
    id: m.id || `M${Date.now()}`,
    league: m.league || 'League',
    kickoff: m.kickoff || '20:00',
    date: m.date || 'Today',
    teams: m.teams || 'Team A vs Team B',
    aiConfidence: m.aiConfidence || 65,
    badges: m.badges || [],
    deeplink: m.deeplink || `https://www.bet-studio.com/the-game/?m=${m.id}`,
    aiInsight: '',  // Will be filled by AI
    aiSource: ''    // Will be filled by AI
  };
}

// 🤖 ANALYZE MATCH WITH PROMPT API (Gemini Nano)
async function analyzeMatchWithAI(matchData) {
  try {
    if ('ai' in self && 'languageModel' in self.ai) {
      console.log(`🤖 Analyzing match with Gemini Nano: ${matchData.teams}`);
      
      const session = await self.ai.languageModel.create({
        systemPrompt: `You are a football analytics AI. Analyze match data and provide a brief insight about why this match is important NOW. Focus on: momentum, key metrics, and opportunity timing. Keep response under 100 characters.`
      });

      const badges = matchData.badges.map(b => b.text).join(', ');
      const prompt = `Match: ${matchData.teams}. Metrics: ${badges}. Confidence: ${matchData.aiConfidence}%. Why is this match important now?`;
      
      const result = await session.prompt(prompt);
      session.destroy();
      
      return {
        source: 'Local AI',
        confidence: matchData.aiConfidence,
        insight: result.substring(0, 150) // Limit length
      };
    }
  } catch (error) {
    console.log('⚠️ Prompt API failed:', error);
  }
  
  // Fallback
  return {
    source: 'Server',
    confidence: matchData.aiConfidence || 65,
    insight: `High-confidence opportunity detected. AI analysis shows ${matchData.aiConfidence}% confidence.`
  };
}

// 💡 GENERATE INSIGHT WITH SUMMARIZER API
async function generateMatchInsight(match, analysis) {
  try {
    if ('ai' in self && 'summarizer' in self.ai) {
      console.log(`💡 Generating insight with Summarizer for: ${match.teams}`);
      
      const summarizer = await self.ai.summarizer.create({
        type: 'key-points',
        format: 'plain-text',
        length: 'short'
      });

      const badges = match.badges.map(b => b.text).join(', ');
      const contextText = `Football Match: ${match.teams} (${match.league}). 
Key Metrics: ${badges}. 
AI Confidence: ${analysis.confidence}%. 
This match is flagged as a high-opportunity window based on real-time metrics and market alignment. 
Explain in 1-2 sentences why this match matters RIGHT NOW for making informed decisions.`;
      
      const summary = await summarizer.summarize(contextText);
      summarizer.destroy();
      
      return summary || analysis.insight;
    }
  } catch (error) {
    console.log('⚠️ Summarizer API failed:', error);
  }
  
  // Fallback: use Prompt API insight or default
  return analysis.insight || `${match.teams}: High-confidence opportunity with ${analysis.confidence}% AI confidence.`;
}

// 🎯 PROCESS MATCHES WITH AI
async function processMatchesWithAI(matches) {
  const aiCapabilities = await checkAIAvailability();
  const processedMatches = [];

  for (const match of matches) {
    try {
      // Step 1: Analyze with Prompt API
      const analysis = await analyzeMatchWithAI(match);
      
      // Step 2: Generate insight with Summarizer API
      const insight = await generateMatchInsight(match, analysis);

      processedMatches.push({
        ...match,
        aiInsight: insight,
        aiSource: analysis.source,
        aiConfidence: analysis.confidence
      });
      
      console.log(`✅ Processed: ${match.teams} (${analysis.source})`);
    } catch (error) {
      console.error(`❌ Error processing match ${match.teams}:`, error);
      // Add match with fallback data
      processedMatches.push({
        ...match,
        aiSource: 'Fallback',
        aiInsight: `Match analysis: ${match.aiConfidence}% confidence opportunity detected.`
      });
    }
  }

  return processedMatches;
}

// 🔄 DEMO MATCHES FALLBACK
function getDemoMatches() {
  console.log("📦 Using demo matches (fallback)");
  return [
    {
      id: "DEMO001",
      league: "Premier League",
      kickoff: "20:45",
      date: "Today",
      teams: "Arsenal vs Chelsea",
      aiConfidence: 82,
      badges: [
        { text: "SHOTS 18-12", type: "positive" },
        { text: "POSS 68%", type: "positive" },
        { text: "BIG CH 8", type: "warning" }
      ],
      deeplink: "https://www.bet-studio.com/the-game/?m=DEMO001&utm_source=extension"
    },
    {
      id: "DEMO002",
      league: "La Liga",
      kickoff: "21:00",
      date: "Today",
      teams: "Barcelona vs Real Madrid",
      aiConfidence: 75,
      badges: [
        { text: "SHOTS 16-14", type: "neutral" },
        { text: "POSS 55%", type: "neutral" },
        { text: "CORNERS 7-3", type: "positive" }
      ],
      deeplink: "https://www.bet-studio.com/the-game/?m=DEMO002&utm_source=extension"
    },
    {
      id: "DEMO003",
      league: "Serie A",
      kickoff: "18:30",
      date: "Today",
      teams: "Milan vs Inter",
      aiConfidence: 71,
      badges: [
        { text: "SHOTS 14-16", type: "negative" },
        { text: "POSS 48%", type: "neutral" }
      ],
      deeplink: "https://www.bet-studio.com/the-game/?m=DEMO003&utm_source=extension"
    }
  ];
}

// 📡 MESSAGE HANDLER
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_MATCHES") {
    (async () => {
      try {
        console.log("📬 Received GET_MATCHES request");
        const matches = await getHotMatches();
        const processedMatches = await processMatchesWithAI(matches);
        console.log(`✅ Returning ${processedMatches.length} processed matches`);
        sendResponse({ matches: processedMatches });
      } catch (error) {
        console.error("❌ Error in message handler:", error);
        sendResponse({ matches: getDemoMatches() });
      }
    })();
    return true; // Keep channel open for async
  }
  
  if (request.type === "CHECK_AI") {
    (async () => {
      const capabilities = await checkAIAvailability();
      sendResponse({ success: true, capabilities });
    })();
    return true;
  }
});

console.log("✅ Service Worker Ready - Chrome AI Contest Version 2.0");
