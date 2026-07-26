// SpeakPublic Procedural Sign Language Avatar Engine
window.SpeakPublicAvatar = (function() {
  let canvas, ctx;
  let animationFrameId = null;
  let isRunning = false;
  
  // Avatar skeletal state
  let state = {
    time: 0,
    currentSign: "idle",
    signProgress: 0,
    signQueue: [],
    
    // Joint positions (relative to canvas center/base)
    // Scale: canvas is 240 x 240
    head: { x: 120, y: 75, r: 35 },
    chest: { x: 120, y: 155 },
    lShoulder: { x: 75, y: 150 },
    rShoulder: { x: 165, y: 150 },
    
    // Dynamic hand targets
    lHand: { x: 60, y: 180, targetX: 60, targetY: 180, size: 8 },
    rHand: { x: 180, y: 180, targetX: 180, targetY: 180, size: 8 },
    lElbow: { x: 55, y: 170 },
    rElbow: { x: 185, y: 170 },
    
    // Facial expressions
    eyeScaleY: 1.0,
    mouthShape: "smile", // smile, open, serious, flat
    eyebrowY: 0,
    
    // Sign duration tracker
    actionTimer: 0,
    actionDuration: 60 // frames
  };

  // Preset signs with procedural trajectories
  const signKeyframes = {
    idle: (t, s) => {
      // Natural breathing & slight hand sway
      s.lHand.targetX = 65 + Math.sin(t * 0.05) * 3;
      s.lHand.targetY = 175 + Math.cos(t * 0.05) * 4;
      s.rHand.targetX = 175 - Math.sin(t * 0.05) * 3;
      s.rHand.targetY = 175 + Math.cos(t * 0.05) * 4;
      s.eyeScaleY = (Math.sin(t * 0.02) > 0.98) ? 0.1 : 1.0; // random blink
      s.mouthShape = "smile";
      s.eyebrowY = 0;
    },
    hospital: (t, s) => {
      // Cross hands over chest to form a 'Red Cross' or protective guard
      s.lHand.targetX = 110 + Math.sin(t * 0.2) * 5;
      s.lHand.targetY = 120;
      s.rHand.targetX = 130 - Math.sin(t * 0.2) * 5;
      s.rHand.targetY = 120;
      s.mouthShape = "serious";
      s.eyebrowY = -2;
    },
    surgery: (t, s) => {
      // Left hand flat, right hand acts as scalpel slicing across left hand
      s.lHand.targetX = 90;
      s.lHand.targetY = 130;
      s.rHand.targetX = 90 + Math.sin(t * 0.3) * 15;
      s.rHand.targetY = 120 + Math.cos(t * 0.3) * 5;
      s.mouthShape = "flat";
      s.eyebrowY = 1;
    },
    good: (t, s) => {
      // Right hand raises, thumbs up (moving up and down)
      s.lHand.targetX = 60;
      s.lHand.targetY = 180;
      s.rHand.targetX = 150;
      s.rHand.targetY = 100 + Math.sin(t * 0.2) * 10;
      s.mouthShape = "smile";
      s.eyebrowY = -3; // happy
    },
    "go-home": (t, s) => {
      // Both hands form a roof overhead, then point outwards
      if (s.signProgress < 0.5) {
        s.lHand.targetX = 100;
        s.lHand.targetY = 60;
        s.rHand.targetX = 140;
        s.rHand.targetY = 60;
      } else {
        s.lHand.targetX = 50;
        s.lHand.targetY = 140;
        s.rHand.targetX = 190;
        s.rHand.targetY = 140;
      }
      s.mouthShape = "smile";
    },
    medicine: (t, s) => {
      // Right hand near mouth, mimicking eating/drinking medicine
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 120 + Math.sin(t * 0.25) * 8;
      s.rHand.targetY = 85 + Math.cos(t * 0.25) * 10;
      s.mouthShape = "open";
      s.eyebrowY = -1;
    },
    morning: (t, s) => {
      // Right hand starts low and rises up like the sun
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 120 + (s.signProgress * 40);
      s.rHand.targetY = 160 - (s.signProgress * 90);
      s.mouthShape = "smile";
    },
    night: (t, s) => {
      // Both hands start high and sweep down crossing to show sunset/darkness
      s.lHand.targetX = 140 - (s.signProgress * 80);
      s.lHand.targetY = 80 + (s.signProgress * 80);
      s.rHand.targetX = 100 + (s.signProgress * 80);
      s.rHand.targetY = 80 + (s.signProgress * 80);
      s.mouthShape = "flat";
    },
    food: (t, s) => {
      // Tap fingers of right hand to mouth repeatedly
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 115 + Math.sin(t * 0.4) * 5;
      s.rHand.targetY = 95 + Math.cos(t * 0.4) * 5;
      s.mouthShape = "open";
    },
    before: (t, s) => {
      // Right hand sweeps backwards over shoulder
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 160 + (1 - s.signProgress) * 40;
      s.rHand.targetY = 100 - (s.signProgress * 40);
      s.mouthShape = "smile";
    },
    water: (t, s) => {
      // Right hand index finger taps chin
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 120 + Math.sin(t * 0.4) * 2;
      s.rHand.targetY = 90 + Math.cos(t * 0.4) * 4;
      s.mouthShape = "open";
    },
    "no-oil": (t, s) => {
      // Left hand flat, right hand slices across it and does "no" shaking
      s.lHand.targetX = 90;
      s.lHand.targetY = 130;
      s.rHand.targetX = 140 + Math.sin(t * 0.3) * 20;
      s.rHand.targetY = 130;
      s.mouthShape = "serious";
      s.eyebrowY = 2;
    },
    "no-heavy-lifting": (t, s) => {
      // Act like lifting a heavy box, then shake hands/head "no"
      if (s.signProgress < 0.5) {
        // lifting
        s.lHand.targetX = 80;
        s.lHand.targetY = 150 - (s.signProgress * 60);
        s.rHand.targetX = 160;
        s.rHand.targetY = 150 - (s.signProgress * 60);
        s.mouthShape = "open";
        s.eyebrowY = 3; // straining
      } else {
        // waving no
        s.lHand.targetX = 60 + Math.sin(t * 0.3) * 15;
        s.lHand.targetY = 130;
        s.rHand.targetX = 180 - Math.sin(t * 0.3) * 15;
        s.rHand.targetY = 130;
        s.mouthShape = "serious";
        s.eyebrowY = 2;
      }
    },
    rest: (t, s) => {
      // Hands crossed over chest, head tilts slightly
      s.lHand.targetX = 100;
      s.lHand.targetY = 140;
      s.rHand.targetX = 140;
      s.rHand.targetY = 140;
      s.mouthShape = "smile";
      s.eyebrowY = -1;
    },
    fever: (t, s) => {
      // Right hand back-of-hand touches forehead
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 120 + Math.sin(t * 0.1) * 3;
      s.rHand.targetY = 65;
      s.mouthShape = "serious";
      s.eyebrowY = 2;
    },
    pain: (t, s) => {
      // Hands massage head/temples or hold stomach
      s.lHand.targetX = 90 + Math.sin(t * 0.3) * 5;
      s.lHand.targetY = 70;
      s.rHand.targetX = 150 - Math.sin(t * 0.3) * 5;
      s.rHand.targetY = 70;
      s.mouthShape = "flat";
      s.eyebrowY = 3;
    },
    vomit: (t, s) => {
      // Hand sweeps away from mouth rapidly
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 120 - (s.signProgress * 60);
      s.rHand.targetY = 100 + (s.signProgress * 40);
      s.mouthShape = "open";
      s.eyebrowY = 2;
    },
    danger: (t, s) => {
      // Both hands wave urgently in front of face, wide eyes
      s.lHand.targetX = 90 + Math.sin(t * 0.5) * 15;
      s.lHand.targetY = 100;
      s.rHand.targetX = 150 + Math.cos(t * 0.5) * 15;
      s.rHand.targetY = 100;
      s.mouthShape = "open";
      s.eyebrowY = 4;
      s.eyeScaleY = 1.3;
    },
    quick: (t, s) => {
      // Hands snap fingers or shake rapidly
      s.lHand.targetX = 75;
      s.lHand.targetY = 150;
      s.rHand.targetX = 160 + Math.sin(t * 0.8) * 10;
      s.rHand.targetY = 120 + Math.cos(t * 0.8) * 10;
      s.mouthShape = "smile";
    },
    calendar: (t, s) => {
      // Left hand flat, right hand points/taps grid locations on it
      s.lHand.targetX = 90;
      s.lHand.targetY = 130;
      s.rHand.targetX = 90 + Math.sin(t * 0.4) * 8;
      s.rHand.targetY = 125 + Math.cos(t * 0.4) * 5;
      s.mouthShape = "smile";
    },
    friday: (t, s) => {
      // Draw an 'F' or circle hand in air
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 160 + Math.sin(t * 0.3) * 15;
      s.rHand.targetY = 110 + Math.cos(t * 0.3) * 15;
      s.mouthShape = "smile";
    },
    room: (t, s) => {
      // Hands trace box outline in front of chest
      if (s.signProgress < 0.25) {
        s.lHand.targetX = 100; s.lHand.targetY = 110;
        s.rHand.targetX = 140; s.rHand.targetY = 110;
      } else if (s.signProgress < 0.5) {
        s.lHand.targetX = 80; s.lHand.targetY = 110;
        s.rHand.targetX = 160; s.rHand.targetY = 110;
      } else if (s.signProgress < 0.75) {
        s.lHand.targetX = 80; s.lHand.targetY = 150;
        s.rHand.targetX = 160; s.rHand.targetY = 150;
      } else {
        s.lHand.targetX = 100; s.lHand.targetY = 150;
        s.rHand.targetX = 140; s.rHand.targetY = 150;
      }
      s.mouthShape = "smile";
    },
    "1": (t, s) => {
      // Right index finger up
      s.lHand.targetX = 65; s.lHand.targetY = 175;
      s.rHand.targetX = 150; s.rHand.targetY = 100;
      s.mouthShape = "smile";
    },
    "4": (t, s) => {
      // Right four fingers up
      s.lHand.targetX = 65; s.lHand.targetY = 175;
      s.rHand.targetX = 150; s.rHand.targetY = 90;
      s.mouthShape = "smile";
    },
    "0": (t, s) => {
      // Fist gesture (zero)
      s.lHand.targetX = 65; s.lHand.targetY = 175;
      s.rHand.targetX = 150; s.rHand.targetY = 110;
      s.mouthShape = "smile";
    },
    "5": (t, s) => {
      // Five fingers spread
      s.lHand.targetX = 65; s.lHand.targetY = 175;
      s.rHand.targetX = 155; s.rHand.targetY = 85;
      s.mouthShape = "smile";
    },
    "number-six": (t, s) => {
      // Right hand shows thumb/pinky or makes "six" sign
      s.lHand.targetX = 65; s.lHand.targetY = 175;
      s.rHand.targetX = 150; s.rHand.targetY = 95;
      s.mouthShape = "smile";
    },
    doctor: (t, s) => {
      // Right hand checks pulse on left wrist
      s.lHand.targetX = 90;
      s.lHand.targetY = 140;
      s.rHand.targetX = 90 + Math.sin(t * 0.3) * 3;
      s.rHand.targetY = 135;
      s.mouthShape = "smile";
    },
    family: (t, s) => {
      // Both hands start together, draw a circle, meet at bottom
      let theta = s.signProgress * Math.PI * 2;
      s.lHand.targetX = 120 + Math.sin(theta - Math.PI/2) * 35;
      s.lHand.targetY = 140 + Math.cos(theta - Math.PI/2) * 20;
      s.rHand.targetX = 120 + Math.sin(-theta + Math.PI/2) * 35;
      s.rHand.targetY = 140 + Math.cos(-theta + Math.PI/2) * 20;
      s.mouthShape = "smile";
    },
    money: (t, s) => {
      // Right fingers rub thumb rapidly
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 140;
      s.rHand.targetY = 130 + Math.sin(t * 0.5) * 5;
      s.mouthShape = "smile";
    },
    low: (t, s) => {
      // Flat hand moves downwards showing small height/amount
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 150;
      s.rHand.targetY = 100 + (s.signProgress * 65);
      s.mouthShape = "flat";
    },
    "no-car": (t, s) => {
      // Steering wheel motion, then cross arms "no"
      if (s.signProgress < 0.5) {
        s.lHand.targetX = 100 + Math.sin(t * 0.2) * 10;
        s.lHand.targetY = 130;
        s.rHand.targetX = 140 - Math.sin(t * 0.2) * 10;
        s.rHand.targetY = 130;
      } else {
        s.lHand.targetX = 100 + Math.sin(t * 0.4) * 15;
        s.lHand.targetY = 110;
        s.rHand.targetX = 140 - Math.sin(t * 0.4) * 15;
        s.rHand.targetY = 110;
      }
      s.mouthShape = "serious";
    },
    "no-house": (t, s) => {
      // Hands form roof shape, then shake side to side
      if (s.signProgress < 0.5) {
        s.lHand.targetX = 105; s.lHand.targetY = 80;
        s.rHand.targetX = 135; s.rHand.targetY = 80;
      } else {
        s.lHand.targetX = 70 + Math.sin(t * 0.3) * 10;
        s.lHand.targetY = 130;
        s.rHand.targetX = 170 - Math.sin(t * 0.3) * 10;
        s.rHand.targetY = 130;
      }
      s.mouthShape = "serious";
    },
    yes: (t, s) => {
      // Right hand makes nodding fist gesture
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 145;
      s.rHand.targetY = 110 + Math.sin(t * 0.3) * 15;
      s.mouthShape = "smile";
    },
    paper: (t, s) => {
      // Hands flat, clap/tap each other horizontally to mock sheet of paper
      s.lHand.targetX = 100 + Math.sin(t * 0.1) * 3;
      s.lHand.targetY = 130;
      s.rHand.targetX = 130 - Math.sin(t * 0.2) * 15;
      s.rHand.targetY = 130;
      s.mouthShape = "smile";
    },
    aadhaar: (t, s) => {
      // Hold card in front, point to it
      s.lHand.targetX = 100;
      s.lHand.targetY = 120;
      s.rHand.targetX = 140;
      s.rHand.targetY = 120 + Math.sin(t * 0.3) * 10;
      s.mouthShape = "smile";
    },
    card: (t, s) => {
      // Trace outline of card with index/thumb
      s.lHand.targetX = 100;
      s.lHand.targetY = 130;
      s.rHand.targetX = 140;
      s.rHand.targetY = 130;
      s.mouthShape = "smile";
    },
    signature: (t, s) => {
      // Left hand flat, right hand writes on it
      s.lHand.targetX = 90;
      s.lHand.targetY = 140;
      s.rHand.targetX = 100 + Math.sin(t * 0.4) * 12;
      s.rHand.targetY = 135 + Math.cos(t * 0.4) * 5;
      s.mouthShape = "smile";
    },
    shop: (t, s) => {
      // Hand mimics exchanging/handing items
      s.lHand.targetX = 85;
      s.lHand.targetY = 145;
      s.rHand.targetX = 145 + Math.sin(t * 0.2) * 20;
      s.rHand.targetY = 135;
      s.mouthShape = "smile";
    },
    write: (t, s) => {
      // Mimic writing in the air
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 140 + Math.sin(t * 0.3) * 15;
      s.rHand.targetY = 120 + Math.cos(t * 0.3) * 10;
      s.mouthShape = "smile";
    },
    office: (t, s) => {
      // Form building roof, then type
      if (s.signProgress < 0.5) {
        s.lHand.targetX = 100; s.lHand.targetY = 80;
        s.rHand.targetX = 140; s.rHand.targetY = 80;
      } else {
        s.lHand.targetX = 95 + Math.sin(t * 0.4) * 5;
        s.lHand.targetY = 140;
        s.rHand.targetX = 145 + Math.cos(t * 0.4) * 5;
        s.rHand.targetY = 140;
      }
      s.mouthShape = "serious";
    },
    july: (t, s) => {
      // Spell or trace 'J' in the air
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 140 + Math.sin(t * 0.2) * 20;
      s.rHand.targetY = 100 + Math.cos(t * 0.2) * 20;
      s.mouthShape = "smile";
    },
    stop: (t, s) => {
      // Hand raised, palm out in stop gesture
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 160;
      s.rHand.targetY = 95;
      s.mouthShape = "serious";
      s.eyebrowY = 3;
    },
    child: (t, s) => {
      // Pat hands at low heights (measuring children height)
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 150 + Math.sin(t * 0.1) * 10;
      s.rHand.targetY = 140 + Math.sin(t * 0.2) * 10;
      s.mouthShape = "smile";
    },
    age: (t, s) => {
      // Tap chin to show growth/beard, or measure height
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 120;
      s.rHand.targetY = 95 + Math.sin(t * 0.3) * 5;
      s.mouthShape = "smile";
    },
    "birth-certificate": (t, s) => {
      // Hand mimics small baby rocking, then shows paper
      if (s.signProgress < 0.5) {
        s.lHand.targetX = 100; s.lHand.targetY = 130;
        s.rHand.targetX = 140; s.rHand.targetY = 130;
      } else {
        s.lHand.targetX = 90; s.lHand.targetY = 130;
        s.rHand.targetX = 140; s.rHand.targetY = 130;
      }
      s.mouthShape = "smile";
    },
    free: (t, s) => {
      // Swipe hand open, palm facing up with a swift release gesture
      s.lHand.targetX = 50;
      s.lHand.targetY = 140;
      s.rHand.targetX = 180 - (1 - s.signProgress) * 60;
      s.rHand.targetY = 120 + Math.sin(t * 0.2) * 10;
      s.mouthShape = "smile";
    },
    school: (t, s) => {
      // Clap flat hands twice (standard sign for school/teach)
      s.lHand.targetX = 100;
      s.lHand.targetY = 130;
      s.rHand.targetX = 105 + Math.sin(t * 0.4) * 15;
      s.rHand.targetY = 120 + Math.cos(t * 0.4) * 5;
      s.mouthShape = "smile";
    },
    quota: (t, s) => {
      // Hands mark out a portion/compartment in the air
      s.lHand.targetX = 90;
      s.lHand.targetY = 120;
      s.rHand.targetX = 150;
      s.rHand.targetY = 140;
      s.mouthShape = "smile";
    },
    computer: (t, s) => {
      // Hands mimic typing
      s.lHand.targetX = 90 + Math.sin(t * 0.5) * 5;
      s.lHand.targetY = 150 + Math.cos(t * 0.5) * 5;
      s.rHand.targetX = 150 + Math.cos(t * 0.5) * 5;
      s.rHand.targetY = 150 + Math.sin(t * 0.5) * 5;
      s.mouthShape = "smile";
    },
    online: (t, s) => {
      // Finger traces lines in space (waves)
      s.lHand.targetX = 65;
      s.lHand.targetY = 175;
      s.rHand.targetX = 130 + Math.sin(t * 0.25) * 40;
      s.rHand.targetY = 110 + Math.cos(t * 0.1) * 20;
      s.mouthShape = "smile";
    },
    lottery: (t, s) => {
      // Mimic rolling a drum/wheel or pulling a card out of a hat
      s.lHand.targetX = 90 + Math.sin(t * 0.3) * 15;
      s.lHand.targetY = 130 + Math.cos(t * 0.3) * 15;
      s.rHand.targetX = 150 + Math.cos(t * 0.3) * 15;
      s.rHand.targetY = 130 + Math.sin(t * 0.3) * 15;
      s.mouthShape = "open";
    }
  };

  // Interpolation helper
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  // Skeletal updates
  function updateSkeletalState() {
    state.time++;
    
    if (state.currentSign === "idle") {
      // Check queue
      if (state.signQueue.length > 0) {
        state.currentSign = state.signQueue.shift();
        state.actionTimer = 0;
        state.signProgress = 0;
        // Trigger visual cue event
        const event = new CustomEvent("avatarSignTrigger", { detail: { sign: state.currentSign } });
        window.dispatchEvent(event);
      } else {
        signKeyframes.idle(state.time, state);
      }
    } else {
      // Execute active sign trajectory
      state.actionTimer++;
      state.signProgress = state.actionTimer / state.actionDuration;
      
      const signFunc = signKeyframes[state.currentSign];
      if (signFunc) {
        signFunc(state.time, state);
      } else {
        signKeyframes.idle(state.time, state);
      }
      
      if (state.actionTimer >= state.actionDuration) {
        state.currentSign = "idle";
        state.signProgress = 0;
      }
    }

    // Smoothly drag physical joint positions to target locations
    state.lHand.x = lerp(state.lHand.x, state.lHand.targetX, 0.25);
    state.lHand.y = lerp(state.lHand.y, state.lHand.targetY, 0.25);
    state.rHand.x = lerp(state.rHand.x, state.rHand.targetX, 0.25);
    state.rHand.y = lerp(state.rHand.y, state.rHand.targetY, 0.25);
    
    // Draw elbow joints procedurally (IK approximation)
    // Left elbow: midpoint bent slightly outward
    state.lElbow.x = lerp(state.lShoulder.x, state.lHand.x, 0.5) - 15;
    state.lElbow.y = lerp(state.lShoulder.y, state.lHand.y, 0.5) + 10;
    
    // Right elbow
    state.rElbow.x = lerp(state.rShoulder.x, state.rHand.x, 0.5) + 15;
    state.rElbow.y = lerp(state.rShoulder.y, state.rHand.y, 0.5) + 10;
  }

  // Drawing routines
  function drawAvatar() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw Background Ring
    let gradient = ctx.createRadialGradient(120, 120, 40, 120, 120, 110);
    gradient.addColorStop(0, '#1e1b4b'); // deep indigo
    gradient.addColorStop(1, '#0f172a'); // dark slate
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(120, 120, 115, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#4f46e5'; // glowing indigo border
    ctx.stroke();
    
    // Draw active sign label
    if (state.currentSign !== "idle") {
      ctx.fillStyle = "rgba(79, 70, 229, 0.2)";
      ctx.fillRect(50, 205, 140, 22);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
      ctx.strokeRect(50, 205, 140, 22);
      
      ctx.fillStyle = "#a5b4fc";
      ctx.font = "bold 11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SIGN: " + state.currentSign.toUpperCase(), 120, 220);
    } else {
      ctx.fillStyle = "#64748b";
      ctx.font = "italic 11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Ready / Idle", 120, 220);
    }
    
    // 2. Draw Torso / Clothing (Stylized Lavender Hoodie)
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(70, 200);
    ctx.quadraticCurveTo(120, 140, 170, 200);
    ctx.closePath();
    ctx.fill();
    
    // Hoodie collar
    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.moveTo(100, 160);
    ctx.lineTo(120, 180);
    ctx.lineTo(140, 160);
    ctx.closePath();
    ctx.fill();
    
    // 3. Draw Arms (Thick strokes)
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Left Arm (Shoulder -> Elbow -> Hand)
    ctx.beginPath();
    ctx.moveTo(state.lShoulder.x, state.lShoulder.y);
    ctx.lineTo(state.lElbow.x, state.lElbow.y);
    ctx.lineTo(state.lHand.x, state.lHand.y);
    ctx.stroke();
    
    // Right Arm
    ctx.beginPath();
    ctx.moveTo(state.rShoulder.x, state.rShoulder.y);
    ctx.lineTo(state.rElbow.x, state.rElbow.y);
    ctx.lineTo(state.rHand.x, state.rHand.y);
    ctx.stroke();
    
    // 4. Draw Neck
    ctx.fillStyle = '#ffedd5'; // Skin tone
    ctx.fillRect(112, 100, 16, 20);
    
    // 5. Draw Head
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(state.head.x, state.head.y, state.head.r, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair (Sleek Dark Indigo Crop)
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(120, 65, 36, Math.PI, 0);
    ctx.quadraticCurveTo(156, 75, 150, 85);
    ctx.quadraticCurveTo(120, 75, 90, 85);
    ctx.quadraticCurveTo(84, 75, 84, 65);
    ctx.fill();
    
    // 6. Draw Eyes
    ctx.fillStyle = '#0f172a';
    
    // Left Eye
    ctx.save();
    ctx.translate(108, 72);
    ctx.scale(1, state.eyeScaleY);
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Right Eye
    ctx.save();
    ctx.translate(132, 72);
    ctx.scale(1, state.eyeScaleY);
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Eyebrows
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Left Eyebrow
    ctx.beginPath();
    ctx.moveTo(102, 65 + state.eyebrowY);
    ctx.quadraticCurveTo(108, 62 + state.eyebrowY, 114, 65 + state.eyebrowY);
    ctx.stroke();
    
    // Right Eyebrow
    ctx.beginPath();
    ctx.moveTo(126, 65 + state.eyebrowY);
    ctx.quadraticCurveTo(132, 62 + state.eyebrowY, 138, 65 + state.eyebrowY);
    ctx.stroke();
    
    // 7. Draw Mouth
    ctx.strokeStyle = '#e11d48'; // Rosy red mouth
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    
    if (state.mouthShape === "smile") {
      ctx.beginPath();
      ctx.arc(120, 84, 8, 0, Math.PI, false);
      ctx.stroke();
    } else if (state.mouthShape === "open") {
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(120, 86, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (state.mouthShape === "serious") {
      ctx.beginPath();
      ctx.arc(120, 92, 6, Math.PI, 0, false);
      ctx.stroke();
    } else { // flat
      ctx.beginPath();
      ctx.moveTo(114, 87);
      ctx.lineTo(126, 87);
      ctx.stroke();
    }
    
    // 8. Draw Hands (Fingers drawn as glowing circular node + palm shape)
    ctx.fillStyle = '#ffedd5';
    ctx.strokeStyle = '#a5b4fc';
    ctx.lineWidth = 1.5;
    
    // Left Hand Node
    ctx.beginPath();
    ctx.arc(state.lHand.x, state.lHand.y, state.lHand.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right Hand Node
    ctx.beginPath();
    ctx.arc(state.rHand.x, state.rHand.y, state.rHand.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Core Animation Loop
  function loop() {
    if (!isRunning) return;
    updateSkeletalState();
    drawAvatar();
    animationFrameId = requestAnimationFrame(loop);
  }

  return {
    init: function(canvasId) {
      canvas = document.getElementById(canvasId);
      if (!canvas) {
        console.warn(`Canvas with id ${canvasId} not found.`);
        return;
      }
      ctx = canvas.getContext('2d');
      this.start();
    },
    
    start: function() {
      if (isRunning) return;
      isRunning = true;
      loop();
    },
    
    stop: function() {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    },
    
    playSigns: function(signs) {
      if (!Array.isArray(signs)) return;
      // Filter valid keyframe signs
      const validSigns = signs.filter(s => typeof signKeyframes[s] === "function");
      if (validSigns.length > 0) {
        state.signQueue = [...state.signQueue, ...validSigns];
      }
    },
    
    clearQueue: function() {
      state.signQueue = [];
      state.currentSign = "idle";
      state.signProgress = 0;
      state.actionTimer = 0;
    },
    
    getCurrentSign: function() {
      return state.currentSign;
    }
  };
})();
