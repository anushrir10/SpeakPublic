// SpeakPublic - Core Application Logic

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. FLOWCHART INTERACTION LOGIC
  const stepsData = {
    "step-install": {
      title: "Step 1: Install SpeakPublic",
      desc: "SpeakPublic is distributed as a lightweight, secure browser extension (Chrome, Firefox, Edge) or a standalone mobile application for iOS and Android. It integrates directly with standard rendering pipelines, operating silently until a public domain page is loaded.",
      tech: "Desktop: Injected Content-Scripts and Background Service Workers. Mobile: Core WebView overlay handler hook."
    },
    "step-setup": {
      title: "Step 2: One-Time Profile Configuration",
      desc: "Upon installation, users perform a simple setup. They select their primary regional language (e.g., Tamil, Bhojpuri, Odia, Bengali) and their accessibility requirements (Visual, Hearing, Cognitive, or Plain Language). This creates a persistent user configuration profile.",
      tech: "Synchronized Browser Storage (chrome.storage.sync) or local encrypted database."
    },
    "step-visit": {
      title: "Step 3: Visit Public Website",
      desc: "The user browses public portals naturally. SpeakPublic scans the URL against a registry of public utility networks, hospital systems, civic councils, and educational directories to decide when to activate its enhancement layer.",
      tech: "WebNavigation APIs filter URLs using regex mappings of government and healthcare domains."
    },
    "step-detect": {
      title: "Step 4: AI Domain & Template Detection",
      desc: "Once active, SpeakPublic's lightweight layout parser runs. It classifies the page layout to determine the document type (e.g., ration form, clinical summary, school advisory notice) and maps it to a specific simplification skeleton.",
      tech: "DOM structure heuristics and zero-shot NLP page structure classification."
    },
    "step-lang": {
      title: "Step 5a: Regional Language Translation",
      desc: "Rather than doing rigid dictionary-literal translations, the AI translates terms using community-calibrated local idioms. This ensures dialectal nuances (like Bhojpuri or rural Tamil terms) are naturally conveyed.",
      tech: "Contextual translation models incorporating custom locale idiom dictionary overrides."
    },
    "step-access": {
      title: "Step 5b: Accessibility Format Transformation",
      desc: "The document DOM is dynamically rewritten in-place. If visual mode is enabled, screen reader anchors and audio narration queues are built. If hearing mode is enabled, a signed language avatar renders key details. If cognitive mode is chosen, a clean, pictorial guide is shown.",
      tech: "Dynamic CSS DOM injection, Web Audio API, Canvas procedural vector skeleton engine."
    },
    "step-plain": {
      title: "Step 5c: Contextual Simplification",
      desc: "Dense legalese, section codes, and bureaucratic warnings are rewritten into plain, clear, and action-oriented sentences. Complex lists are reformatted into step-by-step checklists.",
      tech: "Few-shot text simplification templates parsing statutory texts into direct steps."
    },
    "step-reach": {
      title: "Step 6: Successful Information Delivery",
      desc: "The critical public information is successfully understood. The user is empowered to act, whether that means taking medication correctly, submitting form credentials correctly, or registering their child for school on time.",
      tech: "User comprehension feedback loops and validation tracking."
    }
  };

  const flowchartNodes = document.querySelectorAll(".flow-step, .outcome-step");
  const infoPanel = document.getElementById("flowchart-info-panel");
  const infoDefault = infoPanel.querySelector(".info-content-default");
  const infoActive = infoPanel.querySelector(".info-content-active");
  const infoTitle = document.getElementById("info-title");
  const infoDescription = document.getElementById("info-description");
  const infoTech = document.getElementById("info-tech");

  flowchartNodes.forEach(node => {
    node.addEventListener("click", () => {
      // Toggle active states on flowchart nodes
      flowchartNodes.forEach(n => n.classList.remove("active-step"));
      node.classList.add("active-step");
      
      const stepKey = node.id;
      const data = stepsData[stepKey];
      
      if (data) {
        infoDefault.classList.add("hidden");
        infoActive.classList.remove("hidden");
        
        infoTitle.textContent = data.title;
        infoDescription.textContent = data.desc;
        infoTech.textContent = data.tech;
        
        // Soft fade animation
        infoActive.style.animation = "none";
        infoActive.offsetHeight; // trigger reflow
        infoActive.style.animation = "slide-up 0.3s ease-out";
      }
    });
  });


  // 2. SIMULATOR LOGIC
  
  // Simulator State
  let simState = {
    enabled: true,
    documentId: "hospital_discharge",
    language: "tamil",
    accessMode: "none",
    audioPlaying: false,
    audioPaused: false,
    audioSectionIndex: 0,
    audioUtterance: null,
    speechTimers: [] // fallback simulation timers if speech synthesis fails
  };

  // DOM Elements for Simulator Controls
  const toggleOverlay = document.getElementById("speakpublic-toggle");
  const docSelector = document.getElementById("doc-selector");
  const langSelector = document.getElementById("lang-selector");
  const accessRadioBtns = document.querySelectorAll("input[name='access-mode']");
  
  // Diagnostics Elements
  const diagDocType = document.getElementById("diag-doc-type");
  const diagTemplate = document.getElementById("diag-template");
  const viewportUrl = document.getElementById("viewport-url");
  const viewportRoot = document.getElementById("viewport-webpage-root");
  const docContainer = document.getElementById("simulated-document-container");
  
  // Audio Narrator Panel Elements
  const audioBar = document.getElementById("visual-audio-bar");
  const btnAudioPlay = document.getElementById("btn-audio-play");
  const btnAudioPause = document.getElementById("btn-audio-pause");
  const audioProgressBar = document.getElementById("audio-progress-indicator");
  const audioTextStatus = document.getElementById("audio-text-status");
  
  // Hearing Avatar Panel Elements
  const avatarWidget = document.getElementById("hearing-avatar-widget");
  const avatarCaption = document.getElementById("avatar-caption");
  const closeAvatarWidget = document.getElementById("close-avatar-widget");

  // Initializing Event Listeners for Controls
  toggleOverlay.addEventListener("change", (e) => {
    simState.enabled = e.target.checked;
    stopAudioGuide();
    renderSimulatedPage();
  });

  docSelector.addEventListener("change", (e) => {
    simState.documentId = e.target.value;
    stopAudioGuide();
    renderSimulatedPage();
  });

  langSelector.addEventListener("change", (e) => {
    simState.language = e.target.value;
    stopAudioGuide();
    renderSimulatedPage();
  });

  accessRadioBtns.forEach(radio => {
    radio.addEventListener("change", (e) => {
      // Toggle active classes on radio cards
      document.querySelectorAll(".radio-card").forEach(card => card.classList.remove("active"));
      radio.closest(".radio-card").classList.add("active");
      
      simState.accessMode = e.target.value;
      stopAudioGuide();
      renderSimulatedPage();
    });
  });

  closeAvatarWidget.addEventListener("click", () => {
    avatarWidget.classList.add("hidden");
    // Switch radio button back to Standard
    document.querySelector("input[name='access-mode'][value='none']").checked = true;
    document.querySelectorAll(".radio-card").forEach(card => card.classList.remove("active"));
    document.querySelector("input[name='access-mode'][value='none']").closest(".radio-card").classList.add("active");
    simState.accessMode = "none";
    renderSimulatedPage();
  });

  // Global functions to bind to footer clicks
  window.setSimDoc = function(docId) {
    docSelector.value = docId;
    simState.documentId = docId;
    stopAudioGuide();
    renderSimulatedPage();
  };

  window.setSimAccess = function(mode) {
    document.querySelector(`input[name="access-mode"][value="${mode}"]`).checked = true;
    document.querySelectorAll(".radio-card").forEach(card => card.classList.remove("active"));
    document.querySelector(`input[name="access-mode"][value="${mode}"]`).closest(".radio-card").classList.add("active");
    simState.accessMode = mode;
    stopAudioGuide();
    renderSimulatedPage();
  };

  // Rendering engine inside Browser Viewport
  function renderSimulatedPage() {
    const documentData = window.SpeakPublicData.documents[simState.documentId];
    if (!documentData) return;

    // Update Diagnostics
    diagDocType.textContent = documentData.meta.docType;
    diagTemplate.textContent = documentData.meta.simplificationTemplate;
    
    // Update Address URL Mock
    let path = simState.documentId === "hospital_discharge" ? "discharge-summary" : 
               (simState.documentId === "ration_card" ? "ration-card/renew" : "admissions/rte-quota");
    viewportUrl.textContent = `https://apex.gov.in/${path}`;

    // Clean viewport container style classes
    const viewportViewport = document.querySelector(".simulator-viewport");
    viewportViewport.className = "simulator-viewport";
    
    if (simState.enabled) {
      viewportViewport.classList.add("speakpublic-active");
    }

    // Toggle widgets depending on state
    if (simState.enabled && simState.accessMode === "visual") {
      audioBar.classList.remove("hidden");
    } else {
      audioBar.classList.add("hidden");
    }

    if (simState.enabled && simState.accessMode === "hearing") {
      avatarWidget.classList.remove("hidden");
      // Trigger canvas loop
      window.SpeakPublicAvatar.init("avatar-canvas");
      window.SpeakPublicAvatar.clearQueue();
    } else {
      avatarWidget.classList.add("hidden");
      window.SpeakPublicAvatar.stop();
    }

    // Render original or adapted content
    if (!simState.enabled) {
      renderOriginalContent(documentData);
    } else {
      renderAdaptedContent(documentData);
    }
  }

  // Render Original jargon-heavy content
  function renderOriginalContent(doc) {
    let html = `
      <div class="sim-doc-header">
        <h2>${doc.originalContent.title}</h2>
        <div class="sim-doc-meta">
          <span>Official Portal</span>
          <span>Status: Verified Document</span>
        </div>
      </div>
      <div class="sim-doc-body">
    `;

    doc.originalContent.sections.forEach(sec => {
      html += `
        <div class="sim-section">
          <h3>${sec.heading}</h3>
          <p>${sec.content.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    });

    html += `</div>`;
    docContainer.innerHTML = html;
  }

  // Render translated & adapted content
  function renderAdaptedContent(doc) {
    const adaptation = doc.adaptations[simState.language];
    if (!adaptation) return;

    let html = `
      <div class="sim-doc-header translated-content">
        <h2>${adaptation.originalTitleTranslated}</h2>
        <div class="sim-doc-meta">
          <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8;"><i class="fa-solid fa-people-arrows"></i> SpeakPublic Overlay ON</span>
          <span style="background: rgba(16, 185, 129, 0.15); color: #10b981;"><i class="fa-solid fa-language"></i> Language: ${adaptation.languageName}</span>
        </div>
      </div>
      <div class="sim-doc-body mode-${simState.accessMode}">
    `;

    // Visual mode adds structured headers
    // Cognitive mode adds icons and highlights
    adaptation.sections.forEach((sec, idx) => {
      let iconHtml = "";
      let contentHtml = "";
      
      // Determine what to display based on access mode
      if (simState.accessMode === "cognitive") {
        const emoji = sec.icons[0] || "📋";
        iconHtml = `<span class="sim-section-icon">${emoji}</span>`;
        contentHtml = sec.plainContent.replace(/\n/g, '<br>');
      } else if (simState.accessMode === "visual") {
        iconHtml = `<span class="visual-step-badge">${idx + 1}</span> `;
        contentHtml = sec.content.replace(/\n/g, '<br>');
      } else {
        contentHtml = sec.content.replace(/\n/g, '<br>');
      }

      html += `
        <div class="sim-section translated-content" id="viewport-sec-${idx}" data-section-index="${idx}">
          <h3>${iconHtml}${sec.heading}</h3>
          <p>${contentHtml}</p>
        </div>
      `;
    });

    html += `</div>`;
    docContainer.innerHTML = html;

    // Attach interaction handlers for Hearing Mode hovering
    if (simState.accessMode === "hearing") {
      const sections = docContainer.querySelectorAll(".sim-section");
      sections.forEach(secDom => {
        const secIndex = parseInt(secDom.getAttribute("data-section-index"));
        const secData = adaptation.sections[secIndex];

        secDom.addEventListener("mouseenter", () => {
          triggerSignTranslation(secData);
          sections.forEach(s => s.style.borderColor = "#e2e8f0");
          secDom.style.borderColor = "var(--primary)";
        });

        secDom.addEventListener("click", () => {
          triggerSignTranslation(secData);
          sections.forEach(s => s.style.borderColor = "#e2e8f0");
          secDom.style.borderColor = "var(--primary)";
        });
      });
    }
  }

  // Hearing Mode: Trigger Avatar Signing
  function triggerSignTranslation(sectionData) {
    if (!sectionData || !sectionData.avatarSigns) return;
    
    window.SpeakPublicAvatar.clearQueue();
    window.SpeakPublicAvatar.playSigns(sectionData.avatarSigns);
    
    // Create captioned icons list
    let signTags = sectionData.avatarSigns.map(sign => {
      let icon = "👉";
      if (sign === "hospital") icon = "🏥";
      if (sign === "surgery") icon = "🔪";
      if (sign === "good") icon = "👍";
      if (sign === "go-home") icon = "🏠";
      if (sign === "medicine") icon = "💊";
      if (sign === "morning") icon = "🌅";
      if (sign === "night") icon = "🌃";
      if (sign === "food") icon = "🍽️";
      if (sign === "before") icon = "⏳";
      if (sign === "water") icon = "🥛";
      if (sign === "no-oil") icon = "🚫";
      if (sign === "no-heavy-lifting") icon = "🏋️‍♂️";
      if (sign === "rest") icon = "🛌";
      if (sign === "fever") icon = "🌡️";
      if (sign === "pain") icon = "🤕";
      if (sign === "vomit") icon = "🤢";
      if (sign === "danger") icon = "⚠️";
      if (sign === "quick") icon = "⚡";
      if (sign === "calendar") icon = "📅";
      if (sign === "friday") icon = "📆";
      if (sign === "room") icon = "🚪";
      if (sign === "1") icon = "➊";
      if (sign === "4") icon = "➍";
      if (sign === "5") icon = "➎";
      if (sign === "0") icon = "⓿";
      if (sign === "number-six") icon = "➏";
      if (sign === "doctor") icon = "🩺";
      if (sign === "family") icon = "👨‍👩‍👧‍👦";
      if (sign === "money") icon = "💰";
      if (sign === "low") icon = "📉";
      if (sign === "no-car") icon = "🚗";
      if (sign === "no-house") icon = "🏠";
      if (sign === "yes") icon = "✅";
      if (sign === "paper") icon = "📄";
      if (sign === "aadhaar") icon = "🆔";
      if (sign === "card") icon = "💳";
      if (sign === "signature") icon = "✍️";
      if (sign === "shop") icon = "🏪";
      if (sign === "write") icon = "📝";
      if (sign === "office") icon = "🏢";
      if (sign === "july") icon = "📅";
      if (sign === "stop") icon = "🛑";
      if (sign === "child") icon = "👶";
      if (sign === "age") icon = "🎂";
      if (sign === "birth-certificate") icon = "👶📜";
      if (sign === "free") icon = "🎁";
      if (sign === "school") icon = "🎒";
      if (sign === "quota") icon = "🏷️";
      if (sign === "computer") icon = "💻";
      if (sign === "online") icon = "🌐";
      if (sign === "lottery") icon = "🎲";
      
      return `<span class="sign-tag-badge">${icon} ${sign}</span>`;
    }).join(" ➔ ");

    avatarCaption.innerHTML = `<strong>Translate Captions:</strong><br><div class="sign-tags-wrapper">${signTags}</div>`;
  }

  // Hooking Avatar Skeletal Event to Highlight Captions
  window.addEventListener("avatarSignTrigger", (e) => {
    const activeSign = e.detail.sign;
    const badges = avatarCaption.querySelectorAll(".sign-tag-badge");
    badges.forEach(badge => {
      if (badge.textContent.includes(activeSign)) {
        badge.classList.add("sign-active-highlight");
      } else {
        badge.classList.remove("sign-active-highlight");
      }
    });
  });


  // 3. STRUCTURED AUDIO NARRATOR ENGINE (Web Speech API + Visual highlights)
  btnAudioPlay.addEventListener("click", () => {
    if (simState.audioPaused) {
      resumeAudioGuide();
    } else {
      startAudioGuide();
    }
  });

  btnAudioPause.addEventListener("click", () => {
    pauseAudioGuide();
  });

  function startAudioGuide() {
    stopAudioGuide();
    simState.audioPlaying = true;
    simState.audioPaused = false;
    simState.audioSectionIndex = 0;
    
    btnAudioPlay.classList.add("hidden");
    btnAudioPause.classList.remove("hidden");
    
    playNextAudioSection();
  }

  function playNextAudioSection() {
    if (!simState.audioPlaying) return;

    const documentData = window.SpeakPublicData.documents[simState.documentId];
    const adaptation = documentData.adaptations[simState.language];
    if (!adaptation || simState.audioSectionIndex >= adaptation.sections.length) {
      stopAudioGuide();
      return;
    }

    const index = simState.audioSectionIndex;
    const sectionData = adaptation.sections[index];
    
    // Highlight Active section in UI
    document.querySelectorAll(".sim-section").forEach(s => s.classList.remove("narrator-active"));
    const activeSectionDom = document.getElementById(`viewport-sec-${index}`);
    if (activeSectionDom) {
      activeSectionDom.classList.add("narrator-active");
      activeSectionDom.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Set Status
    audioTextStatus.textContent = `Reading Step ${index + 1}: ${sectionData.heading}`;
    
    // Calculate Progress Bar Width
    const percent = ((index) / adaptation.sections.length) * 100;
    audioProgressBar.style.width = `${percent}%`;

    // Speech Synthesis
    if ('speechSynthesis' in window) {
      // Cancel previous
      window.speechSynthesis.cancel();
      
      const textToSpeak = sectionData.audioNarration;
      simState.audioUtterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Attempt to configure voice locale for Tamil or Hindi (fallback for Odia/Bhojpuri if not natively supported)
      let locale = "en-US";
      if (simState.language === "tamil") locale = "ta-IN";
      else if (simState.language === "odia") locale = "or-IN";
      else if (simState.language === "bhojpuri") locale = "hi-IN"; // Hindi voice is a very close acoustic match for Bhojpuri
      
      simState.audioUtterance.lang = locale;
      simState.audioUtterance.rate = 0.9; // Slightly slower for clarity
      
      simState.audioUtterance.onend = () => {
        if (simState.audioPlaying && !simState.audioPaused) {
          simState.audioSectionIndex++;
          playNextAudioSection();
        }
      };

      simState.audioUtterance.onerror = (e) => {
        console.warn("SpeechSynthesis error, falling back to simulated timers", e);
        simulateSpeechTimer(sectionData);
      };

      window.speechSynthesis.speak(simState.audioUtterance);
    } else {
      // Fallback visual simulation
      simulateSpeechTimer(sectionData);
    }
  }

  function simulateSpeechTimer(sectionData) {
    // Approx read speed: 120 words per minute
    const wordsCount = sectionData.audioNarration.split(" ").length;
    const durationMs = Math.max(3000, (wordsCount / 2.5) * 1000); // minimum 3s
    
    let startTime = Date.now();
    
    const intervalTimer = setInterval(() => {
      let elapsed = Date.now() - startTime;
      let ratio = Math.min(1, elapsed / durationMs);
      
      // Update progress bar within the section segment
      const documentData = window.SpeakPublicData.documents[simState.documentId];
      const sectionsCount = documentData.adaptations[simState.language].sections.length;
      const basePercent = (simState.audioSectionIndex / sectionsCount) * 100;
      const stepPercent = (1 / sectionsCount) * 100;
      audioProgressBar.style.width = `${basePercent + (stepPercent * ratio)}%`;
      
      if (ratio >= 1) {
        clearInterval(intervalTimer);
        if (simState.audioPlaying && !simState.audioPaused) {
          simState.audioSectionIndex++;
          playNextAudioSection();
        }
      }
    }, 100);

    simState.speechTimers.push(intervalTimer);
  }

  function pauseAudioGuide() {
    if (!simState.audioPlaying) return;
    simState.audioPaused = true;
    btnAudioPause.classList.add("hidden");
    btnAudioPlay.classList.remove("hidden");
    btnAudioPlay.innerHTML = `<i class="fa-solid fa-circle-play"></i> Resume Audio Guide`;
    audioTextStatus.textContent = "Audio paused";

    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  function resumeAudioGuide() {
    simState.audioPaused = false;
    btnAudioPlay.classList.add("hidden");
    btnAudioPause.classList.remove("hidden");

    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      // If voice synth was cancelled or not active, play section again
      playNextAudioSection();
    }
  }

  function stopAudioGuide() {
    simState.audioPlaying = false;
    simState.audioPaused = false;
    btnAudioPause.classList.add("hidden");
    btnAudioPlay.classList.remove("hidden");
    btnAudioPlay.innerHTML = `<i class="fa-solid fa-circle-play"></i> Play Structured Audio Guide`;
    audioProgressBar.style.width = "0%";
    audioTextStatus.textContent = "Not playing - click play to guide through steps.";
    
    // Clear highlights
    document.querySelectorAll(".sim-section").forEach(s => s.classList.remove("narrator-active"));

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Clear timers
    simState.speechTimers.forEach(t => clearInterval(t));
    simState.speechTimers = [];
  }


  // 4. COMMUNITY CALIBRATION DATA INJECTION
  const tableBody = document.getElementById("corrections-table-body");
  const correctionForm = document.getElementById("idiom-correction-form");

  function renderCorrectionsTable() {
    tableBody.innerHTML = "";
    window.SpeakPublicData.communityCorrections.forEach(item => {
      const row = document.createElement("tr");
      row.id = `correction-row-${item.id}`;
      row.innerHTML = `
        <td class="td-doc">${item.documentName}</td>
        <td class="td-jargon">"${item.originalText}"</td>
        <td class="td-colloquial">
          <span style="font-size:0.75rem; color:var(--accent-cyan); display:block; margin-bottom:4px; font-weight:700;">
            ${item.language} Dialect Override
          </span>
          ${item.suggestedCorrection}
        </td>
        <td><strong>${item.contributor}</strong></td>
        <td>
          <button class="btn-vote" data-id="${item.id}">
            <i class="fa-solid fa-thumbs-up"></i> <span class="vote-count">${item.votes}</span>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Attach vote listeners
    tableBody.querySelectorAll(".btn-vote").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const item = window.SpeakPublicData.communityCorrections.find(c => c.id === id);
        if (item) {
          if (btn.classList.contains("voted")) {
            item.votes--;
            btn.classList.remove("voted");
          } else {
            item.votes++;
            btn.classList.add("voted");
          }
          btn.querySelector(".vote-count").textContent = item.votes;
        }
      });
    });
  }

  // Handle correction submission
  correctionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const docType = document.getElementById("form-doc-type").value;
    const lang = document.getElementById("form-lang").value;
    const original = document.getElementById("form-original-text").value;
    const corrected = document.getElementById("form-corrected-text").value;
    const contributor = document.getElementById("form-contributor").value || "Anonymous Local";

    // Generate unique ID
    const newId = Date.now();
    const newCorrection = {
      id: newId,
      documentName: docType,
      language: lang,
      originalText: original,
      suggestedCorrection: corrected,
      contributor: contributor,
      votes: 1
    };

    // Prepend to local dataset
    window.SpeakPublicData.communityCorrections.unshift(newCorrection);
    
    // Re-render table
    renderCorrectionsTable();

    // Trigger highlight animation on the new row
    const newRow = document.getElementById(`correction-row-${newId}`);
    if (newRow) {
      newRow.style.backgroundColor = "rgba(99, 102, 241, 0.15)";
      newRow.style.transition = "background-color 1s ease";
      setTimeout(() => {
        newRow.style.backgroundColor = "transparent";
      }, 1500);
    }

    // Reset Form & Alert success
    correctionForm.reset();
  });


  // 5. INITIAL BUILD TRIGGERS
  renderSimulatedPage();
  renderCorrectionsTable();
});
