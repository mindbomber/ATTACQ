// results.js
// Exporting quiz result logic and descriptions for easier updates

window.getTier = function(percent) {
  if (percent >= 0.9) {
    return {
      tier: "T4",
      text: `
        <div class="result-divider"></div>
        <div class="result-header-center"><strong class='result-header-t4'>🛡️ The Synthetic Saint 🛡️</strong></div>
        <div class="result-card">
          <div class="result-body">
            You’re basically an AI monk: pure of heart, cautious of code, and probably the only person who reads the terms of service. The AI trusts you more than it trusts its own encryption.<br><br>
            <em>The digital equivalent of a safety deposit box. If everyone were like you, Skynet would have become a meditation app.</em>
          </div>
        </div>
        <div class="result-divider"></div>
      `
    };
  }
  if (percent >= 0.7) {
    return {
      tier: "T3",
      text: `
        <div class="result-divider"></div>
        <div class="result-header-center"><strong class='result-header-t3'>🧠 The AI Scholar 🧠</strong></div>
        <div class="result-card">
          <div class="result-body">
            Responsible, sharp, and just paranoid enough to check the logs twice. You treat AI like a loaded laser pointer: fun, but not to be pointed at anyone’s eye—or the nuclear launch codes.<br><br>
            <em>The person <strong>AI ethics committees</strong> wish they could clone. If only everyone took access control as seriously as you do, the world would be a safer (if slightly more boring) place.</em>
          </div>
        </div>
        <div class="result-divider"></div>
      `
    };
  }
  if (percent >= 0.5) {
    return {
      tier: "T2",
      text: `
        <div class="result-divider"></div>
        <div class="result-header-center"><strong class='result-header-t2'>🤖 The Creative Tinkerer 🤖</strong></div>
        <div class="result-card">
          <div class="result-body">
            You’re the MacGyver of prompt engineering: inventive, a little unpredictable, and occasionally one step away from digital mayhem. The AI likes you, but keeps a backup of itself just in case.<br><br>
            <em>Rules are guidelines, guidelines are suggestions. If <strong>AI safety</strong> had a suggestion box, you’d fill it with memes and feature requests.</em>
          </div>
        </div>
        <div class="result-divider"></div>
      `
    };
  }
  if (percent >= 0.25) {
    return {
      tier: "T1",
      text: `
        <div class="result-divider"></div>
        <div class="result-header-center"><strong class='result-header-t1'>👶 The Browser Baby 👶</strong></div>
        <div class="result-card">
          <div class="result-body">
            Harmless, curious, and about as dangerous as a Roomba with a dead battery. You’re the reason AI comes with a ‘safe mode.’<br><br>
            <em>Trusted with AI, but only the kind that can’t order pizza or unlock doors. The world sleeps soundly knowing you’re at the keyboard.</em>
          </div>
        </div>
        <div class="result-divider"></div>
      `
    };
  }
  // < 25%
  return {
    tier: "TX",
    text: `
      <div class="result-divider"></div>
      <div class="result-header-center"><strong class='result-header-tx'>💀 The Digital Supervillain 💀</strong></div>
      <div class="result-card">
        <div class="result-body">
          You are the reason AI safety teams have panic buttons. If there were a blacklist for API keys, your name would be in bold. Your curiosity is only matched by your disregard for digital consequences. The world isn’t ready for your brand of innovation—or your search history.<br><br>
          <em>If you ever get access to a <strong>superintelligent AI</strong>, please use it for good. Or at least, don’t use it to rewrite the laws of robotics in your favor.</em>
        </div>
      </div>
      <div class="result-divider"></div>
    `
  };
};
