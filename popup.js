// 🎯 BET-STUDIO CHROME EXTENSION - AI CONTEST VERSION

const cardsEl = document.getElementById("cards");
const allBtn = document.getElementById("all-btn");

// ✅ DEMO DATA (fallback for testing)
const DEMO_MATCHES = [
  {
    id: "M001",
    league: "UEFA Champions League",
    kickoff: "20:45",
    date: "Oct 28",
    teams: "Arsenal vs Bayern",
    aiConfidence: 82,
    badges: [
      { text: "SHOTS 18-12", type: "positive" },
      { text: "POSS 68%", type: "positive" },
      { text: "BIG CH 8", type: "warning" }
    ],
    aiInsight: "⚡ Arsenal dominating with 68% possession and 8 big chances created. Live odds dropping fast. High-value window detected.",
    aiSource: "Local AI",
    deeplink: "https://www.bet-studio.com/the-game/?m=M001&utm_source=extension"
  },
  {
    id: "M002",
    league: "Premier League",
    kickoff: "21:00",
    date: "Oct 28",
    teams: "Liverpool vs Chelsea",
    aiConfidence: 75,
    badges: [
      { text: "SHOTS 16-14", type: "neutral" },
      { text: "POSS 55%", type: "neutral" },
      { text: "CORNERS 7-3", type: "positive" }
    ],
    aiInsight: "🔥 Tight match with momentum shifting. Corner advantage suggests attacking pressure. Market alignment detected.",
    aiSource: "Local AI",
    deeplink: "https://www.bet-studio.com/the-game/?m=M002&utm_source=extension"
  },
  {
    id: "M003",
    league: "Serie A",
    kickoff: "18:30",
    date: "Oct 28",
    teams: "Milan vs Inter",
    aiConfidence: 71,
    badges: [
      { text: "SHOTS 14-16", type: "negative" },
      { text: "POSS 48%", type: "neutral" },
      { text: "BIG CH 5", type: "neutral" }
    ],
    aiInsight: "⚽ Derby match with high intensity. Shot quality favors Inter despite possession. Value opportunity identified.",
    aiSource: "Local AI",
    deeplink: "https://www.bet-studio.com/the-game/?m=M003&utm_source=extension"
  }
];

// 🔄 FETCH MATCHES FROM SERVICE WORKER
async function fetchMatches() {
  try {
    const response = await chrome.runtime.sendMessage({ type: "GET_MATCHES" });
    if (response && response.matches && response.matches.length > 0) {
      return response.matches;
    }
  } catch (error) {
    console.log("⚠️ Service worker error, using demo data:", error);
  }
  return DEMO_MATCHES;
}

// 🎨 RENDER MATCHES WITH FLIP CARDS
function renderMatches(matches) {
  cardsEl.innerHTML = "";
  
  matches.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    
    // Build badges HTML
    const badgesHTML = (m.badges || []).map(b => 
      `<span class="badge ${b.type}">${b.text}</span>`
    ).join('');
    
    // Default insight if missing
    const insight = m.aiInsight || `High-confidence opportunity detected. AI analysis shows ${m.aiConfidence}% confidence for this match.`;
    const source = m.aiSource || 'Server AI';
    
    card.innerHTML = `
      <div class="card-inner">
        <!-- FRONT SIDE -->
        <div class="card-front">
          <div class="flip-hint">💡 AI Insight</div>
          <div class="row">
            <span class="league">${m.league}</span>
            <span class="kick">${m.kickoff}</span>
          </div>
          <div class="teams">${m.teams}</div>
          <div class="ai-confidence">
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${m.aiConfidence}%"></div>
            </div>
            <span class="confidence-text">${m.aiConfidence}%</span>
          </div>
          <div class="badges">
            ${badgesHTML}
          </div>
		<div class="cta-row" style="margin-top: auto;">
		  <div class="ai-cta-hint" style="text-align: center; padding: 12px; background: rgba(103, 126, 234, 0.15); border-radius: 8px; cursor: pointer; border: 1px dashed rgba(103, 126, 234, 0.4);">
			<div style="font-size: 13px; font-weight: 700; color: #667eea; margin-bottom: 4px;">
			  💡 AI-Powered Insight Available
			</div>
			<div style="font-size: 11px; color: rgba(255,255,255,0.7);">
			  👆 Click card to reveal analysis
			</div>
		  </div>
		  <a href="${m.deeplink}" class="btn pick" target="_blank" rel="noopener" style="margin-top: 8px; font-size: 11px; padding: 8px;">View Full Match</a>
		</div>
        </div>
        
        <!-- BACK SIDE (AI Insight) -->
        <div class="card-back">
          <div class="insight-header">
            💡 AI INSIGHT
          </div>
          <div class="insight-text">
            ${insight}
          </div>
          <div class="insight-footer">
            <span>🤖 ${source}</span>
            <span>👆 Click to flip back</span>
          </div>
        </div>
      </div>
    `;
    
    // ✨ ADD FLIP HANDLER
    card.addEventListener('click', (e) => {
      // Don't flip if clicking a link
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        return;
      }
      card.classList.toggle('flipped');
    });
    
    cardsEl.appendChild(card);
  });
  
  layoutMasonry();
}

// 📐 MASONRY LAYOUT
function layoutMasonry() {
  const cards = Array.from(cardsEl.querySelectorAll(".card"));
  cards.forEach((card, i) => {
    card.style.gridRowEnd = `span ${Math.ceil(card.offsetHeight / 10) + 1}`;
  });
}

// 🔄 VIEW ALL MATCHES BUTTON
if (allBtn) {
  allBtn.addEventListener("click", () => {
    window.open("https://www.bet-studio.com/the-game/?utm_source=extension", "_blank");
  });
}

// 🚀 INIT
(async () => {
  const matches = await fetchMatches();
  renderMatches(matches);
  
  // Re-layout after images/fonts load
  setTimeout(layoutMasonry, 100);
  window.addEventListener('load', layoutMasonry);
})();
