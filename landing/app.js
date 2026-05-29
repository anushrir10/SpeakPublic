/* ==========================================================================
   FixIt Playground Interactive Engine — Tab Switching, RSVP, Auditory & Flashcards
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // TAB NAVIGATION CONTROL
  // ==========================================
  const tabs = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.viewport-panel');
  const panelTitle = document.getElementById('current-panel-title');

  // Map tab ID to panel headers
  const panelHeaderMap = {
    'tab-menu': 'Active Textbook: Cell Biology Class XI',
    'tab-rsvp': 'Speed Reader: RSVP Cognitive Sync',
    'tab-auditory': 'Auditory Reader: Cached TTS Sync',
    'tab-spaced': 'Spaced Repetition: Adaptive Recall Quiz',
    'tab-mindmap': 'Concept Map: Interactive Concept Connections'
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('aria-controls');
      
      // Stop ongoing playbacks on tab change
      stopAllSimulations();

      // Deactivate all tabs & panels
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      // Activate selected tab & panel
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const activePanel = document.getElementById(targetPanelId);
      activePanel.classList.add('active');

      // Update Header title
      panelTitle.textContent = panelHeaderMap[tab.id] || 'Active Textbook: Biology XI';
    });
  });

  // Global cleanup to stop RSVP and Auditory sync runs when changing tabs
  function stopAllSimulations() {
    stopRSVP();
    stopAuditoryPlayback();
    resetFlashcards();
  }

  // Helper to switch tab programmatically
  function switchTab(tabId) {
    const tabBtn = document.getElementById(tabId);
    if (tabBtn) tabBtn.click();
  }


  // ==========================================
  // TAB 1: TEXT SELECTION & RADIAL MENU
  // ==========================================
  const textbookBody = document.getElementById('selectable-body');
  const radialMenu = document.getElementById('radial-menu-popover');
  let selectedTextStr = "";

  // Handle Selection on Mouseup
  textbookBody.addEventListener('mouseup', handleTextSelection);

  function handleTextSelection(e) {
    // Small timeout to let selection complete in browser
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 2) {
        selectedTextStr = text;
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const parentRect = textbookBody.getBoundingClientRect();

        // Calculate absolute position inside container
        const topPos = rect.top - parentRect.top - 65; // Position above text
        const leftPos = rect.left - parentRect.left + (rect.width / 2) - 130; // Center menu

        showRadialMenu(topPos, leftPos);
      } else {
        hideRadialMenu();
      }
    }, 10);
  }

  function showRadialMenu(top, left) {
    radialMenu.style.top = `${top}px`;
    radialMenu.style.left = `${left}px`;
    radialMenu.classList.remove('hidden');
  }

  function hideRadialMenu() {
    radialMenu.classList.add('hidden');
  }

  // Preset Highlight buttons
  const presetMitochondria = document.getElementById('preset-mitochondria');
  const presetVariability = document.getElementById('preset-variability');
  const presetShape = document.getElementById('preset-shape');

  [presetMitochondria, presetVariability, presetShape].forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const start = parseInt(btn.getAttribute('data-start'));
      const end = parseInt(btn.getAttribute('data-end'));
      
      // Programmatically highlight range inside paragraph
      const paragraph = textbookBody.firstElementChild;
      const textNode = paragraph.firstChild;
      
      const range = document.createRange();
      range.setStart(textNode, start);
      range.setEnd(textNode, end);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Position menu
      const rect = range.getBoundingClientRect();
      const parentRect = textbookBody.getBoundingClientRect();
      const topPos = rect.top - parentRect.top - 65;
      const leftPos = rect.left - parentRect.left + (rect.width / 2) - 130;
      
      selectedTextStr = selection.toString().trim();
      showRadialMenu(topPos, leftPos);
    });
  });

  // Click outside selection hides menu
  document.addEventListener('mousedown', (e) => {
    if (!radialMenu.contains(e.target) && !textbookBody.contains(e.target) && !e.target.classList.contains('preset-btn')) {
      hideRadialMenu();
    }
  });

  // Radial Menu Actions
  document.getElementById('radial-action-speak').addEventListener('click', () => {
    hideRadialMenu();
    switchTab('tab-auditory');
    // Pre-populate Auditory text layout if custom selected
    if (selectedTextStr) {
      document.getElementById('auditory-text-paragraphs').innerHTML = `
        <span class="audio-sentence playing-highlight" id="sent-custom" data-duration="4500">${selectedTextStr}</span>
      `;
    }
    // Auto click Play Voice
    setTimeout(() => {
      document.getElementById('audio-play-btn').click();
    }, 300);
  });

  document.getElementById('radial-action-rsvp').addEventListener('click', () => {
    hideRadialMenu();
    switchTab('tab-rsvp');
    if (selectedTextStr) {
      document.getElementById('rsvp-passage-preview').textContent = selectedTextStr;
      prepareRSVPText(selectedTextStr);
    }
    // Auto click Play RSVP
    setTimeout(() => {
      document.getElementById('rsvp-btn-play').click();
    }, 300);
  });

  document.getElementById('radial-action-flash').addEventListener('click', () => {
    hideRadialMenu();
    switchTab('tab-spaced');
    if (selectedTextStr) {
      // Simulate generating cards from custom text
      document.getElementById('card-question-text').textContent = `[Generated Card from selection] What key concept relates to this text:`;
      document.getElementById('card-answer-text').textContent = selectedTextStr;
    }
  });

  document.getElementById('radial-action-map').addEventListener('click', () => {
    hideRadialMenu();
    switchTab('tab-mindmap');
    if (selectedTextStr) {
      // Highlight the Mitochondria main node
      document.getElementById('node-mitochondria').click();
    }
  });

  // Simplify (ELI5) Modal Actions
  const simplifyModal = document.getElementById('simplify-modal');
  const simplifyText = document.getElementById('simplify-selection-text');
  const closeSimplify = document.getElementById('close-simplify-btn');
  const simplifyContent = document.getElementById('simplified-output-content');
  const eli5Tab = document.getElementById('simp-tab-eli5');
  const analogyTab = document.getElementById('simp-tab-analogy');

  const simplifications = {
    "mitochondria": {
      eli5: "Mitochondria are like tiny energy factories inside your body cells. They take the food you eat and turn it into battery power (energy) that your body needs to run, play, and think!",
      analogy: "Think of mitochondria as cell phone chargers. Just like a charger takes power from the wall socket and fills up your phone's battery, mitochondria take nutrients from food and charge up your cell's energy batteries (ATP)."
    },
    "physiological activity of the cells": {
      eli5: "This is just a fancy way of saying how busy a cell is. An active cell (like in a working muscle) is like a busy, bustling city. A quiet cell is like a sleepy village. Active cells need way more power plants!",
      analogy: "Think of a factory. A factory that is working 24/7 (high physiological activity) uses tons of electricity and needs massive generators. A warehouse that is closed (low activity) barely needs any power at all."
    },
    "sausage-shaped or cylindrical": {
      eli5: "Mitochondria have a rounded shape like a small hotdog, sausage, or a tube. They aren't flat circles; they are shaped like tiny pills so they have room inside to build chemical batteries.",
      analogy: "Mitochondria are shaped exactly like capsules or tablets. This round, hotdog-like structure allows them to pack a folded inner lining inside, maximizing the surface area just like folds in a sleeping bag."
    },
    "default": {
      eli5: "This describes cellular structures acting as power plants. They organize themselves inside the cell boundaries to generate and distribute chemical battery power (ATP) to keep the organism alive.",
      analogy: "It functions like an electrical substation in a city grid. It converts high-voltage transmission lines into usable voltage levels for residential appliances, distributing power efficiently to where work is performed."
    }
  };

  document.getElementById('radial-action-simplify').addEventListener('click', () => {
    hideRadialMenu();
    simplifyText.textContent = `"${selectedTextStr}"`;
    
    // Choose appropriate simplification text
    let matchedKey = "default";
    const lowerText = selectedTextStr.toLowerCase();
    if (lowerText.includes("mitochondria")) matchedKey = "mitochondria";
    else if (lowerText.includes("activity")) matchedKey = "physiological activity of the cells";
    else if (lowerText.includes("shape") || lowerText.includes("sausage")) matchedKey = "sausage-shaped or cylindrical";

    currentSimplification = simplifications[matchedKey];
    
    // Default to ELI5 view
    eli5Tab.classList.add('active');
    analogyTab.classList.remove('active');
    simplifyContent.textContent = currentSimplification.eli5;
    
    simplifyModal.classList.remove('hidden');
  });

  let currentSimplification = simplifications.default;

  eli5Tab.addEventListener('click', () => {
    eli5Tab.classList.add('active');
    analogyTab.classList.remove('active');
    simplifyContent.textContent = currentSimplification.eli5;
  });

  analogyTab.addEventListener('click', () => {
    analogyTab.classList.add('active');
    eli5Tab.classList.remove('active');
    simplifyContent.textContent = currentSimplification.analogy;
  });

  closeSimplify.addEventListener('click', () => {
    simplifyModal.classList.add('hidden');
  });


  // ==========================================
  // TAB 2: RSVP SPEED READER
  // ==========================================
  const rsvpWordDisplay = document.getElementById('rsvp-word-display');
  const rsvpBtnPlay = document.getElementById('rsvp-btn-play');
  const rsvpBtnReset = document.getElementById('rsvp-btn-reset');
  const rsvpWpmInput = document.getElementById('rsvp-wpm-input');
  const wpmValue = document.getElementById('wpm-value');

  let rsvpWords = [];
  let rsvpIndex = 0;
  let rsvpInterval = null;
  let isRsvpPlaying = false;

  // Initialize RSVP text from the default HTML passage
  const defaultRSVPPassage = document.getElementById('rsvp-passage-preview').textContent;
  prepareRSVPText(defaultRSVPPassage);

  function prepareRSVPText(text) {
    rsvpWords = text.trim().replace(/\s+/g, ' ').split(' ');
    rsvpIndex = 0;
    updateRSVPWord();
  }

  // Calculate Optimal Recognition Point (ORP) index
  function getOrpIndex(word) {
    const len = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").length; // length without punctuation
    if (len <= 1) return 0;
    if (len <= 5) return 1;
    if (len <= 9) return 2;
    if (len <= 13) return 3;
    return 4;
  }

  function updateRSVPWord() {
    if (rsvpIndex >= rsvpWords.length) {
      stopRSVP();
      rsvpIndex = 0;
      return;
    }

    const rawWord = rsvpWords[rsvpIndex];
    if (!rawWord) return;

    // Clean word for ORP calculations, keeping punctuation for suffix
    const orpIdx = getOrpIndex(rawWord);
    
    const prefix = rawWord.substring(0, orpIdx);
    const orp = rawWord.charAt(orpIdx);
    const suffix = rawWord.substring(orpIdx + 1);

    rsvpWordDisplay.innerHTML = `
      <span class="rsvp-word-prefix">${prefix}</span><span class="rsvp-word-orp">${orp}</span><span class="rsvp-word-suffix">${suffix}</span>
    `;
  }

  // Triggered on WPM input slider
  rsvpWpmInput.addEventListener('input', () => {
    wpmValue.textContent = rsvpWpmInput.value;
    if (isRsvpPlaying) {
      // Re-trigger interval with new speed
      stopRSVPInterval();
      startRSVPInterval();
    }
  });

  rsvpBtnPlay.addEventListener('click', () => {
    if (isRsvpPlaying) {
      pauseRSVP();
    } else {
      playRSVP();
    }
  });

  rsvpBtnReset.addEventListener('click', () => {
    stopRSVP();
    rsvpIndex = 0;
    updateRSVPWord();
  });

  function playRSVP() {
    isRsvpPlaying = true;
    rsvpBtnPlay.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
      <span>Pause</span>
    `;
    startRSVPInterval();
  }

  function pauseRSVP() {
    isRsvpPlaying = false;
    rsvpBtnPlay.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <span>Play</span>
    `;
    stopRSVPInterval();
  }

  function stopRSVP() {
    isRsvpPlaying = false;
    rsvpBtnPlay.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <span>Play</span>
    `;
    stopRSVPInterval();
  }

  function stopRSVPInterval() {
    if (rsvpInterval) {
      clearTimeout(rsvpInterval);
      rsvpInterval = null;
    }
  }

  // Uses timeout recursion to support punctuation duration multiplier delays
  function startRSVPInterval() {
    const wpm = parseInt(rsvpWpmInput.value);
    const baseDelay = 60000 / wpm; // normal delay in ms
    
    function tick() {
      if (!isRsvpPlaying) return;

      const currentWord = rsvpWords[rsvpIndex];
      let delayMultiplier = 1.0;

      if (currentWord) {
        // Pause longer on punctuation marks
        if (/[.,;:?!]$/.test(currentWord)) {
          if (/[.?!]$/.test(currentWord)) {
            delayMultiplier = 2.0; // Periods/question marks get 2x pause
          } else {
            delayMultiplier = 1.5; // Commas/colons get 1.5x pause
          }
        }
      }

      updateRSVPWord();
      rsvpIndex++;

      rsvpInterval = setTimeout(tick, baseDelay * delayMultiplier);
    }

    rsvpInterval = setTimeout(tick, baseDelay);
  }


  // ==========================================
  // TAB 3: AUDITORY HIGHLIGHTING
  // ==========================================
  const audioPlayBtn = document.getElementById('audio-play-btn');
  const audioProgress = document.getElementById('audio-progress-indicator');
  const audioTimer = document.getElementById('audio-timer');
  const waveBars = document.querySelectorAll('.wave-bar');
  const sentences = document.querySelectorAll('.audio-sentence');

  let isAudioPlaying = false;
  let audioTimerId = null;
  let activeSentenceIndex = 0;
  let sentenceTimeoutId = null;
  let totalAudioDuration = 0;
  let currentAudioTimeMs = 0;

  // Calculate total audio duration from data values
  sentences.forEach(s => {
    totalAudioDuration += parseInt(s.getAttribute('data-duration'));
  });

  audioPlayBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      pauseAuditory();
    } else {
      playAuditory();
    }
  });

  // Clicking sentences skips directly to that part of audio
  sentences.forEach((sent, index) => {
    sent.addEventListener('click', () => {
      stopAuditoryPlayback();
      
      // Calculate start time in ms
      let startTime = 0;
      for (let i = 0; i < index; i++) {
        startTime += parseInt(sentences[i].getAttribute('data-duration'));
      }
      
      currentAudioTimeMs = startTime;
      activeSentenceIndex = index;
      playAuditory();
    });
  });

  function playAuditory() {
    isAudioPlaying = true;
    audioPlayBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
      <span>Pause Voice</span>
    `;

    // Start wave visualizer animations
    waveBars.forEach(bar => bar.classList.add('active-animation'));

    // Start progress ticking
    startAuditoryTimeTick();
    playSentenceSequence();
  }

  function pauseAuditory() {
    isAudioPlaying = false;
    audioPlayBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="6 4 20 12 6 20 6 4"></polygon>
      </svg>
      <span>Play Voice</span>
    `;
    
    // Stop waves
    waveBars.forEach(bar => bar.classList.remove('active-animation'));
    
    // Stop timer ticks
    clearInterval(audioTimerId);
    clearTimeout(sentenceTimeoutId);
  }

  function stopAuditoryPlayback() {
    isAudioPlaying = false;
    audioPlayBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="6 4 20 12 6 20 6 4"></polygon>
      </svg>
      <span>Play Voice</span>
    `;
    waveBars.forEach(bar => bar.classList.remove('active-animation'));
    sentences.forEach(s => s.classList.remove('playing-highlight'));
    
    clearInterval(audioTimerId);
    clearTimeout(sentenceTimeoutId);
  }

  function startAuditoryTimeTick() {
    clearInterval(audioTimerId);
    
    audioTimerId = setInterval(() => {
      if (!isAudioPlaying) return;

      currentAudioTimeMs += 100;
      
      // Update UI bar width
      const pct = (currentAudioTimeMs / totalAudioDuration) * 100;
      audioProgress.style.width = `${Math.min(pct, 100)}%`;

      // Update timer text
      const secTotal = Math.floor(totalAudioDuration / 1000);
      const secCurr = Math.floor(currentAudioTimeMs / 1000);
      audioTimer.textContent = `0:${secCurr.toString().padStart(2, '0')} / 0:${secTotal}`;

      if (currentAudioTimeMs >= totalAudioDuration) {
        stopAuditoryPlayback();
        currentAudioTimeMs = 0;
        activeSentenceIndex = 0;
        audioProgress.style.width = '0%';
        audioTimer.textContent = `0:00 / 0:${secTotal}`;
      }
    }, 100);
  }

  function playSentenceSequence() {
    if (activeSentenceIndex >= sentences.length) return;

    // Remove active highlight from all
    sentences.forEach(s => s.classList.remove('playing-highlight'));
    
    // Highlight current sentence
    const currentSentNode = sentences[activeSentenceIndex];
    currentSentNode.classList.add('playing-highlight');

    // Scroll slightly if viewport overflows
    currentSentNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Read duration, adjust to match current sentence remaining time
    const fullDuration = parseInt(currentSentNode.getAttribute('data-duration'));
    
    // Calculate sentence elapsed time to handle resumes correctly
    let precedingTime = 0;
    for (let i = 0; i < activeSentenceIndex; i++) {
      precedingTime += parseInt(sentences[i].getAttribute('data-duration'));
    }
    const elapsedInCurrentSent = currentAudioTimeMs - precedingTime;
    const remainingDuration = Math.max(fullDuration - elapsedInCurrentSent, 0);

    sentenceTimeoutId = setTimeout(() => {
      activeSentenceIndex++;
      if (activeSentenceIndex < sentences.length) {
        playSentenceSequence();
      }
    }, remainingDuration);
  }


  // ==========================================
  // TAB 4: SPACED REPETITION (FSRS)
  // ==========================================
  const spacedFlashcard = document.getElementById('spaced-flashcard-box');
  const cardQuestion = document.getElementById('card-question-text');
  const cardAnswer = document.getElementById('card-answer-text');
  const ratingsContainer = document.getElementById('card-ratings-container');
  const spacedCardTracker = document.getElementById('spaced-card-index-tracker');
  const completeScreen = document.getElementById('spaced-complete-screen');
  const restartSpaced = document.getElementById('restart-spaced-btn');

  const flashcardDeck = [
    {
      q: "What is the main function of the inner membrane folds (cristae) in mitochondria?",
      a: "The cristae increase the surface area of the inner membrane, allowing more space for chemical reactions that produce ATP (cellular energy)."
    },
    {
      q: "Why does the number of mitochondria per cell vary in different tissues?",
      a: "It depends on the metabolic activity of the cell; cells with higher energy demands (like muscle cells) contain significantly more mitochondria."
    }
  ];

  let deckIndex = 0;
  let isCardFlipped = false;

  // Toggle Flip card
  spacedFlashcard.addEventListener('click', () => {
    if (spacedFlashcard.classList.contains('flipped')) {
      spacedFlashcard.classList.remove('flipped');
      isCardFlipped = false;
      ratingsContainer.classList.add('hidden');
    } else {
      spacedFlashcard.classList.add('flipped');
      isCardFlipped = true;
      ratingsContainer.classList.remove('hidden');
    }
  });

  // FSRS self grading clicks
  const ratingButtons = document.querySelectorAll('.rating-btn');
  ratingButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent flipping card again
      
      // Perform rating button visual feedback
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => btn.style.transform = '', 150);

      // Transition to next card or complete screen
      deckIndex++;
      
      // Flip back first
      spacedFlashcard.classList.remove('flipped');
      ratingsContainer.classList.add('hidden');
      isCardFlipped = false;

      setTimeout(() => {
        if (deckIndex < flashcardDeck.length) {
          // Load next card
          cardQuestion.textContent = flashcardDeck[deckIndex].q;
          cardAnswer.textContent = flashcardDeck[deckIndex].a;
          spacedCardTracker.textContent = `Card ${deckIndex + 1} of ${flashcardDeck.length}`;
        } else {
          // Complete deck
          completeScreen.classList.remove('hidden');
        }
      }, 300);
    });
  });

  restartSpaced.addEventListener('click', () => {
    completeScreen.classList.add('hidden');
    resetFlashcards();
  });

  function resetFlashcards() {
    deckIndex = 0;
    isCardFlipped = false;
    spacedFlashcard.classList.remove('flipped');
    ratingsContainer.classList.add('hidden');
    cardQuestion.textContent = flashcardDeck[0].q;
    cardAnswer.textContent = flashcardDeck[0].a;
    spacedCardTracker.textContent = `Card 1 of ${flashcardDeck.length}`;
  }


  // ==========================================
  // TAB 5: MIND MAP CONCEPTS
  // ==========================================
  const conceptNodes = document.querySelectorAll('.concept-node');
  const line1 = document.querySelector('.line-1');
  const line2 = document.querySelector('.line-2');
  const line3 = document.querySelector('.line-3');
  const line4 = document.querySelector('.line-4');
  
  const relationHeading = document.getElementById('concept-relationship-heading');
  const relationDesc = document.getElementById('concept-relationship-desc');
  const relationBadge = document.getElementById('concept-relation-badge');

  const nodeDetails = {
    'node-mitochondria': {
      title: 'Mitochondria (Central Concept)',
      badge: 'MAIN CONCEPT',
      desc: 'Double-membrane bound organelles which are the sites of aerobic respiration. They generate cellular energy in the form of ATP, hence called the "powerhouse of the cell".',
      links: []
    },
    'node-atp': {
      title: 'ATP Synthesis',
      badge: 'RELATIONSHIP: CHEMICAL PRODUCT',
      desc: 'Mitochondria produce ATP (Adenosine Triphosphate). The inner membrane contains ATP synthase complexes that generate ATP from ADP using proton gradient forces.',
      activeLines: [line1]
    },
    'node-cristae': {
      title: 'Cristae Folds',
      badge: 'RELATIONSHIP: STRUCTURAL COMPONENT',
      desc: 'The inner membrane forms numerous infoldings called the cristae. The cristae increase the surface area of the membrane to host more respiratory chain complexes.',
      activeLines: [line2]
    },
    'node-matrix': {
      title: 'Dense Matrix',
      badge: 'RELATIONSHIP: INNER COMPARTMENT',
      desc: 'The inner compartment contains a dense, homogeneous liquid matrix. It contains single circular DNA molecule, RNA molecules, ribosomes, and Krebs cycle enzymes.',
      activeLines: [line3]
    },
    'node-double': {
      title: 'Double Membrane',
      badge: 'RELATIONSHIP: STRUCTURAL ENVELOPE',
      desc: 'Consists of outer and inner membranes. The outer membrane serves as a boundary envelope, while the inner membrane maintains selective permeability for energy reactions.',
      activeLines: [line4]
    }
  };

  conceptNodes.forEach(node => {
    node.addEventListener('click', () => {
      // Clear active classes
      conceptNodes.forEach(n => {
        n.classList.remove('active');
        n.classList.remove('active-linked');
      });
      [line1, line2, line3, line4].forEach(l => l.classList.remove('active-link'));

      // Make clicked active
      node.classList.add('active');
      
      const details = nodeDetails[node.id];
      if (details) {
        relationHeading.textContent = details.title;
        relationBadge.textContent = details.badge;
        relationDesc.textContent = details.desc;

        // Highlight connected links
        if (details.activeLines) {
          details.activeLines.forEach(line => line.classList.add('active-link'));
          // Set central node as secondary active to show connection
          if (node.id !== 'node-mitochondria') {
            document.getElementById('node-mitochondria').classList.add('active-linked');
          }
        } else {
          // If central is selected, show links to all
          [line1, line2, line3, line4].forEach(l => l.classList.add('active-link'));
        }
      }
    });
  });

  // Initial map link load trigger
  document.getElementById('node-mitochondria').click();

});
