// ==UserScript==
// @name         Songsterr Layout Fixer - Smart Hide & Full Hitboxes
// @namespace    http://tampermonkey.net/
// @version      32.3
// @description  Good Play Button + Perfectly Centered Metronome + Tiny Top-Right Dots
// @match        *://*.songsterr.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const customCss = `
        /* --- FIX HORIZONTAL SCROLLBAR --- */
        html, body {
            overflow-x: hidden !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
        }

        /* --- FIX SCREEN TINT BUTTON --- */
        .idrtTa_controlsCard ._5pcfpW_backgroundButton {
            pointer-events: auto !important;
            cursor: pointer !important;
            opacity: 1 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
        }
        .idrtTa_controlsCard ._5pcfpW_backgroundButton svg {
            pointer-events: none !important;
        }

        /* --- DESTROY THE NATIVE SIDEBAR NOTCH & DRAG HANDLE --- */
        #controls.idrtTa_pane,
        aside.idrtTa_pane {
            background: transparent !important;
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
            pointer-events: none !important;
        }

        /* Ensure the drag handle is completely dead and invisible */
        #controls-panel-handle,
        .idrtTa_panelHandle,
        .idrtTa_panelHandleBar {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* --- NATIVE CONTAINER OVERRIDES (Keep React intact) --- */
        #tab-controls {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            overflow: visible !important;
            pointer-events: none !important;
            z-index: 99990 !important;
        }

        /* Hide the native top bar */
        #tab-controls > [data-controls-top-panel="true"] {
            display: none !important;
        }

        /* Hide the native video container but keep the panel container visible */
        #tab-controls .oCvYpa_video {
            display: none !important;
        }

        #tab-controls .oCvYpa_panel {
            position: absolute !important;
            pointer-events: none !important;
            overflow: visible !important;
        }

        /* Position the native side panel right next to our custom Hide button */
        #tab-controls .PdDsXq_sidePanel {
            position: fixed !important;
            bottom: 180px !important;
            right: 42px !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 2px !important;
            z-index: 9999999 !important;
            pointer-events: auto !important;
            height: 26px !important;
            align-items: flex-end !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Style the native buttons to match our custom Hide button */
        #tab-controls .PdDsXq_sideButton,
        #tab-controls .PdDsXq_select {
            background: rgba(20, 20, 20, 0.9) !important;
            border: 1px solid #555 !important;
            border-bottom: none !important;
            border-radius: 4px 4px 0 0 !important;
            padding: 0 10px !important;
            color: white !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 26px !important;
            min-height: 26px !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            font-family: inherit !important;
            font-size: 11px !important;
            font-weight: 500 !important;
        }

        /* Force native SVGs inside to be small and fully opaque */
        #tab-controls .PdDsXq_sideButton svg,
        #tab-controls .PdDsXq_sideButton svg * {
            width: 14px !important;
            height: 14px !important;
            fill: white !important;
            stroke: white !important;
            opacity: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
            pointer-events: none !important;
        }

        /* --- LOGO & HEADER TOP ALIGNMENT --- */
        header, [class*="Header"], [class*="header"], [class*="Logo"], [class*="logo"] {
            margin-top: 0 !important;
            padding-top: 0 !important;
            top: 0 !important;
        }
        .song-header, .gtr-header, [class*="SongHeader"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            width: 100% !important;
            margin-top: 5px !important;
        }

        /* --- PERFECTLY CENTERED TOP BAR --- */
        div[data-bottom-bar="true"] {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
            width: max-content !important;
            height: auto !important;
            bottom: auto !important;
            z-index: 9999 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            display: flex !important;
            justify-content: center !important;
            pointer-events: auto !important;
            transition: opacity 0.2s, visibility 0.2s !important;
            opacity: 1 !important;
            visibility: visible !important;
        }

        div[data-bottom-bar="true"].is-hidden {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        div[data-bottom-bar="true"].is-pinned {
            position: fixed !important;
            top: 0 !important;
            background: rgba(20, 20, 20, 0.65) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border-radius: 0 0 20px 20px !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-top: none !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) !important;
            animation: dropDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }

        @keyframes dropDown {
            0% { transform: translateY(-100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }

        div[data-bottom-bar="true"] > nav {
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
            width: 100% !important;
            padding: 4px 0 2px 0 !important;
            background: transparent !important;
            gap: 12px !important;
        }

        div[data-bottom-bar="true"].is-pinned > nav {
            padding: 4px 25px 2px 25px !important;
            width: max-content !important;
        }

        div[data-bottom-bar="true"] > nav > div { display: contents !important; }

        div[data-bottom-bar="true"] > nav a {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            margin: 0 6px !important;
            text-decoration: none !important;
            line-height: 1 !important;
        }

        div[data-bottom-bar="true"] ._0meAjW_text {
            display: block !important;
            font-size: 10px !important;
            color: #ccc !important;
            margin-top: 1px !important;
            font-family: inherit !important;
            -webkit-font-smoothing: antialiased !important;
            letter-spacing: 0.2px !important;
            white-space: nowrap !important;
        }

        div[data-bottom-bar="true"] svg {
            fill: #ffffff !important;
            width: 20px !important;
            height: 20px !important;
            opacity: 0.8 !important;
            transition: opacity 0.2s !important;
            display: block !important;
        }

        div[data-bottom-bar="true"] a:hover svg { opacity: 1 !important; }
        div[data-bottom-bar="true"] a:hover ._0meAjW_text { color: #fff !important; }

        /* --- EXISTING HELP MENU FIX --- */
        div:has(> .lokr4q_defaultOutput) {
            position: fixed !important;
            top: 55px !important;
            bottom: auto !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 99999 !important;
        }

        .lokr4q_defaultOutput {
            transform: none !important;
            flex-direction: column !important;
            background-color: #1e1e1e !important;
            border: 1px solid #444 !important;
            border-radius: 8px !important;
            padding: 15px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
            display: flex !important;
            width: 300px !important;
            margin-top: 0 !important;
        }

        .lokr4q_search { transform: none !important; margin-bottom: 12px !important; position: relative !important; }
        .ve9kvW_field { position: relative !important; }
        .ve9kvW_input { width: 100% !important; background: #2a2a2a !important; border: 1px solid #444 !important; color: white !important; padding: 8px 30px 8px 10px !important; border-radius: 4px !important; font-size: 14px !important; box-sizing: border-box !important; }
        .ve9kvW_label { display: none !important; }
        .lokr4q_hotKeyInSearch { position: absolute !important; right: 8px !important; top: 50% !important; transform: translateY(-50%) !important; display: flex !important; gap: 2px !important; }
        .lokr4q_hotkeytextbtn { background: #444 !important; color: #aaa !important; font-size: 10px !important; padding: 2px 5px !important; border-radius: 3px !important; font-family: monospace !important; }
        .lokr4q_link { color: #ccc !important; padding: 10px !important; text-decoration: none !important; font-size: 14px !important; white-space: nowrap !important; border-radius: 4px !important; cursor: pointer !important; display: block !important; }
        .lokr4q_link:hover { background-color: #333 !important; color: #fff !important; }

        /* ========================================= */
        /* --- STANDALONE SIDEBAR STRICT GRID --- */
        /* ========================================= */

        #right-hover-zone {
            position: fixed;
            top: 0;
            right: 0;
            width: 55px;
            height: 100vh;
            z-index: 99998;
            pointer-events: none !important;
        }

        .idrtTa_controlsCard {
            position: fixed !important;
            right: 15px !important;
            top: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            width: 90px !important;
            transform: translateX(150px) !important;
            transition: transform 0.3s ease !important;
            z-index: 99999 !important;

            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            justify-items: center !important;
            align-content: start !important;
            gap: 4px !important;
            padding: 0 2px 20px 2px !important;
            box-sizing: border-box !important;

            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            overflow: visible !important;

            visibility: visible !important;
            pointer-events: auto !important;
        }

        body.menu-hovered .idrtTa_controlsCard {
            transform: translateX(0) !important;
        }

        .idrtTa_controlsCard ._5pcfpW_controlsTopPanel,
        .idrtTa_controlsCard .idrtTa_controls,
        .idrtTa_controlsCard .idrtTa_itemPlayButton {
            display: contents !important;
        }

        .idrtTa_controlsCard > *,
        .idrtTa_controlsCard .idrtTa_item,
        .idrtTa_controlsCard ._5pcfpW_controlsTopItem,
        .idrtTa_controlsCard #pin-toggle-btn {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            padding: 0 !important;
        }

        /* Row 1: Menu (Left) | To Start (Right) */
        .idrtTa_controlsCard #pin-toggle-btn {
            grid-area: 1 / 1 / 2 / 2 !important;
            justify-self: start !important;
            width: 40px !important;
            height: 40px !important;
            background: rgba(20, 20, 20, 0.6) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 6px !important;
            color: #fff !important;
            font-size: 22px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 10 !important;
            transition: all 0.2s !important;
        }
        .idrtTa_controlsCard #pin-toggle-btn:hover { background: rgba(60, 60, 60, 0.8) !important; color: #fff !important; }
        .idrtTa_controlsCard #pin-toggle-btn.active { color: #007bff !important; border-color: #007bff !important; }

        .idrtTa_controlsCard ._5pcfpW_controlsTopItemToStart {
            grid-area: 1 / 2 / 2 / 3 !important;
            justify-self: end !important;
            width: 40px !important;
            height: 40px !important;
        }

        /* Row 2: Tab (Left) | Dark Mode (Right) */
        .idrtTa_controlsCard ._5pcfpW_controlsTopItemSelect {
            grid-area: 2 / 1 / 3 / 2 !important;
            justify-self: stretch !important;
            width: 100% !important;
            border-radius: 6px !important;
            margin-right: 2px !important;
        }

        .idrtTa_controlsCard ._5pcfpW_controlsTopItemBackground {
            grid-area: 2 / 2 / 3 / 3 !important;
            justify-self: end !important;
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            pointer-events: auto !important;
        }

        /* Row 3: Fav (Left) | Edit (Right) */
        .idrtTa_controlsCard ._5pcfpW_controlsTopItemFavorite:not(._5pcfpW_controlsTopItemBackground):not(._5pcfpW_controlsTopItemEditor):not(._5pcfpW_controlsTopItemToStart) {
            grid-area: 3 / 1 / 4 / 2 !important;
            justify-self: start !important;
            width: 40px !important;
            height: 40px !important;
        }

        .idrtTa_controlsCard ._5pcfpW_controlsTopItemEditor {
            grid-area: 3 / 2 / 4 / 3 !important;
            justify-self: end !important;
            width: 40px !important;
            height: 40px !important;
        }

        /* Row 4: Play (Left) | Orig/Synth (Right) - Spans 2 Columns */
        .idrtTa_controlsCard #c-play {
            grid-area: 4 / 1 / 5 / 3 !important;
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 4px !important;
            width: 100% !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        .idrtTa_controlsCard #control-play {
            grid-column: 1 !important;
            justify-self: center !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 6px !important;
            background: rgba(20, 20, 20, 0.6) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
        }

        /* --- PLAY ICON: VERSION 1 GOOD SIZE (28px) + WHITE FILL --- */
        .idrtTa_controlsCard #control-play svg {
            width: 28px !important;
            height: 28px !important;
            min-width: 28px !important;
            max-width: 28px !important;
            fill: currentColor !important;
            display: block !important;
            pointer-events: none !important;
            margin: 0 !important;
        }

        .idrtTa_controlsCard #control-source {
            grid-column: 2 !important;
            justify-self: center !important;
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            max-width: 40px !important;
            border-radius: 6px !important;
            background: rgba(20, 20, 20, 0.6) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            font-size: 9px !important;
            overflow: hidden !important;
        }

        .idrtTa_controlsCard #control-source span {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            line-height: 1 !important;
            font-size: 8px !important;
        }

        /* --- ROW 5+ MAIN CONTROLS EXPLICIT PLACEMENT --- */
        .idrtTa_controlsCard #mixer-button { grid-area: 5 / 1 / 6 / 2 !important; }
        .idrtTa_controlsCard #c-speed { grid-area: 5 / 2 / 6 / 3 !important; }
        .idrtTa_controlsCard #c-loop { grid-area: 6 / 1 / 7 / 2 !important; }
        .idrtTa_controlsCard #c-transpose { grid-area: 6 / 2 / 7 / 3 !important; }
        .idrtTa_controlsCard #c-detectchords { grid-area: 7 / 1 / 8 / 2 !important; }
        .idrtTa_controlsCard #c-solo { grid-area: 7 / 2 / 8 / 3 !important; }
        .idrtTa_controlsCard #c-mute { grid-area: 8 / 1 / 9 / 2 !important; }
        .idrtTa_controlsCard #c-countin { grid-area: 8 / 2 / 9 / 3 !important; }
        .idrtTa_controlsCard #c-metronome { grid-area: 9 / 1 / 10 / 2 !important; }
        .idrtTa_controlsCard #c-export { grid-area: 9 / 2 / 10 / 3 !important; }
        .idrtTa_controlsCard #c-print { grid-area: 10 / 1 / 11 / 2 !important; }
        .idrtTa_controlsCard #c-revision { grid-area: 10 / 2 / 11 / 3 !important; }
        .idrtTa_controlsCard #c-settings { grid-area: 11 / 1 / 12 / 2 !important; }

        /* --- METRONOME: CENTERED ICON WITH TOP RIGHT DOTS --- */
        .idrtTa_controlsCard #c-metronome {
            position: relative !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 0 !important;
            margin: 0 !important;
            /* REMOVED overflow: hidden to prevent the badge from going invisible */
        }

        /* Force the main button to be full size and perfectly centered */
        .idrtTa_controlsCard #c-metronome #control-metronome {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Main metronome icon stays perfectly in the center */
        .idrtTa_controlsCard #c-metronome #control-metronome svg {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
            max-width: 20px !important;
            margin: 0 !important;
            padding: 2px !important;
            display: block !important;
            transform: none !important; /* Removed previous offset */
        }

        /* The settings badge - Hitbox in the top right corner */
        .idrtTa_controlsCard #c-metronome #metronome-settings,
        .idrtTa_controlsCard #c-metronome .idrtTa_settings {
            position: absolute !important;
            top: -9px !important;
            right: 0 !important;
            width: 36px !important;
            height: 20px !important;
            display: flex !important;
            justify-content: flex-end !important;
            align-items: flex-start !important;
            padding: 0px 0px 0 0 !important;
            opacity: 1 !important;
            cursor: pointer !important;
            background: transparent !important;
            z-index: 10 !important;
            border: none !important;
            margin: 0 !important;
        }

        /* The visual 3 dots - extremely small (6px width) */
        .idrtTa_controlsCard #c-metronome #metronome-settings svg,
        .idrtTa_controlsCard #c-metronome .idrtTa_settings svg {
            width: 6px !important;
            height: auto !important; /* Maintains the 10:3 aspect ratio */
            fill: #fff !important;
            opacity: 0.6 !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            pointer-events: none !important;
            transition: opacity 0.2s !important;
        }

        .idrtTa_controlsCard #c-metronome #metronome-settings:hover svg,
        .idrtTa_controlsCard #c-metronome .idrtTa_settings:hover svg {
            opacity: 1 !important;
        }

        /* --- SHARED BUTTON STYLES --- */
        .idrtTa_controlsCard ._5pcfpW_controlsTopItem,
        .idrtTa_controlsCard .idrtTa_item {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background: rgba(20, 20, 20, 0.6) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 6px !important;
            transition: background 0.2s !important;
            cursor: pointer !important;
            width: 40px !important;
            height: 40px !important;
        }

        .idrtTa_controlsCard ._5pcfpW_controlsTopItem:hover,
        .idrtTa_controlsCard .idrtTa_item:hover {
            background: rgba(60, 60, 60, 0.8) !important;
        }

        .idrtTa_controlsCard ._5pcfpW_controlsTopItem > div,
        .idrtTa_controlsCard ._5pcfpW_controlsTopItem > a,
        .idrtTa_controlsCard ._5pcfpW_controlsTopItem button,
        .idrtTa_controlsCard .idrtTa_item button {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            pointer-events: auto !important;
            padding: 0 !important;
            color: #fff !important;
            border-radius: 6px !important;
        }

        /* --- TOP PANEL ICONS (Fav, Edit, etc) --- */
        .idrtTa_controlsCard ._5pcfpW_controlsTopItem svg {
            width: 20px !important;
            height: 20px !important;
            fill: currentColor !important;
            display: block !important;
            pointer-events: none !important;
            margin: 0 !important;
        }

        /* --- MAIN CONTROLS (Excluding Speed and Play) --- */
        .idrtTa_controlsCard .idrtTa_item:not(#c-speed):not(#c-play) svg:not(.Ss9MrW_lock) {
            width: 26px !important;
            height: 26px !important;
            min-width: 26px !important;
            max-width: 26px !important;
            fill: currentColor !important;
            display: block !important;
            pointer-events: none !important;
            margin: 0 !important;
        }

        .idrtTa_controlsCard .gYbqeG_iconBoxInstrument,
        .idrtTa_controlsCard .gYbqeG_iconInstrument {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
        }

        /* --- FIXED: HIDE ARROW & CENTER TEXT --- */
        .idrtTa_controlsCard #display-mode-button svg,
        .idrtTa_controlsCard .GXOmPa_arrow {
            display: none !important;
        }
        .idrtTa_controlsCard #display-mode-button {
            padding: 0 !important;
            margin: 0 auto !important;
            justify-content: center !important;
            width: 100% !important;
            text-align: center !important;
            border-radius: 6px !important;
        }
        .idrtTa_controlsCard #display-mode-button span {
            margin: 0 auto !important;
            padding: 0 !important;
            text-align: center !important;
            width: 100% !important;
            justify-content: center !important;
            display: flex !important;
        }
        .idrtTa_controlsCard ._5pcfpW_controlsTopItemSelect > div,
        .idrtTa_controlsCard ._5pcfpW_controlsTopItemSelect .GXOmPa_selectWrapper,
        .idrtTa_controlsCard ._5pcfpW_controlsTopItemSelect .GXOmPa_chosenValue {
            width: 100% !important;
            max-width: 100% !important;
            justify-content: center !important;
            border-radius: 6px !important;
            overflow: hidden !important;
        }

        /* --- FORCE DROPDOWN TO BE FIXED --- */
        .GXOmPa_selectMenu,
        .GXOmPa_dropdown,
        ul[role="listbox"],
        div[role="listbox"],
        .idrtTa_controlsCard ._5Wq5Ea_select > ul {
            position: fixed !important;
            top: 110px !important;
            right: 130px !important;
            left: auto !important;
            width: 150px !important;
            min-width: 150px !important;
            max-width: 150px !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            z-index: 9999999 !important;
            background-color: #1e1e1e !important;
            border: 1px solid #555 !important;
            border-radius: 8px !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.9) !important;
            padding: 5px !important;
            pointer-events: auto !important;
            transform: none !important;
        }

        /* Hide the hidden native "Sheet" link just in case */
        .idrtTa_controlsCard ._5Wq5Ea_select > a {
            display: none !important;
        }

        /* --- YOUTUBE PLAYER --- */
        #custom-yt-container {
            position: fixed !important;
            bottom: 0 !important;
            right: 16px !important;
            z-index: 999999 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            pointer-events: none !important;
            width: 320px !important;
            transition: opacity 0.2s ease, visibility 0.2s ease !important;
        }

        #custom-yt-top-bar {
            display: flex !important;
            flex-direction: row !important;
            justify-content: flex-end !important;
            align-items: flex-end !important;
            gap: 2px !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            pointer-events: none !important;
        }

        #custom-yt-wrapper {
            width: 320px !important;
            height: 180px !important;
            pointer-events: auto !important;
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        #custom-yt-toggle {
            background: rgba(20, 20, 20, 0.9) !important;
            border: 1px solid #555 !important;
            border-bottom: none !important;
            border-radius: 4px 4px 0 0 !important;
            padding: 0 10px !important;
            color: white !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 26px !important;
            min-height: 26px !important;
            box-sizing: border-box !important;
            font-family: inherit !important;
            -webkit-font-smoothing: antialiased !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            letter-spacing: 0.2px !important;
            margin: 0 !important;
            line-height: 1 !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            z-index: 2147483647 !important;
            transition: opacity 0.2s !important;
        }

        /* When the video is hidden, hide the Show button by default */
        #custom-yt-toggle.is-video-hidden {
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* Show the Show button only when the sidebar is hovered */
        body.menu-hovered #custom-yt-toggle.is-video-hidden {
            opacity: 1 !important;
            pointer-events: auto !important;
        }

        #custom-yt-wrapper,
        #custom-yt-wrapper *,
        #custom-yt-wrapper div,
        #custom-yt-wrapper iframe {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        #custom-yt-wrapper iframe {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
            pointer-events: auto !important;
        }
    `;

    let isCompareMode = window.location.href.includes('...');

    function checkUrlAndToggle() {
        const newIsCompare = window.location.href.includes('...');
        if (newIsCompare === isCompareMode) return;

        isCompareMode = newIsCompare;

        if (isCompareMode) {
            const style = document.getElementById('songsterr-layout-fixer-style');
            if (style) style.remove();

            const pin = document.getElementById('pin-toggle-btn');
            if (pin) pin.remove();

            const yt = document.getElementById('custom-yt-container');
            if (yt) yt.remove();

            const hover = document.getElementById('right-hover-zone');
            if (hover) hover.remove();

            document.body.classList.remove('menu-hovered');

            const menuCard = document.querySelector('.idrtTa_controlsCard');
            const topPanel = document.querySelector('._5pcfpW_controlsTopPanel');
            const nativeParent = document.querySelector('._5pcfpW_controlsTopPanelRow');
            if (menuCard && topPanel && nativeParent && menuCard.contains(topPanel)) {
                nativeParent.appendChild(topPanel);
            }
        } else {
            if (!document.getElementById('songsterr-layout-fixer-style')) {
                const style = document.createElement('style');
                style.id = 'songsterr-layout-fixer-style';
                style.textContent = customCss;
                document.head.appendChild(style);
            }

            if (!document.getElementById('pin-toggle-btn')) document.body.appendChild(pinBtn);
            if (!document.getElementById('right-hover-zone')) document.body.appendChild(hoverZone);
        }
    }

    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        checkUrlAndToggle();
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        checkUrlAndToggle();
    };
    window.addEventListener('popstate', checkUrlAndToggle);

    if (!isCompareMode) {
        const style = document.createElement('style');
        style.id = 'songsterr-layout-fixer-style';
        style.textContent = customCss;
        document.head.appendChild(style);
    }

    const pinBtn = document.createElement('button');
    pinBtn.id = 'pin-toggle-btn';
    pinBtn.innerHTML = '☰';
    pinBtn.title = 'Pin Top Bar';

    const hoverZone = document.createElement('div');
    hoverZone.id = 'right-hover-zone';

    let lastClickedId = null;
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('div[data-bottom-bar="true"] a');
        if (link && link.id) lastClickedId = link.id;
    });

    let isPinned = false;
    pinBtn.addEventListener('click', () => {
        isPinned = !isPinned;
        const topBars = document.querySelectorAll('div[data-bottom-bar="true"]');
        if (topBars.length > 0) {
            const topBar = topBars[0];
            if (isPinned) {
                topBar.classList.add('is-pinned');
                topBar.classList.remove('is-hidden');
                pinBtn.classList.add('active');
                pinBtn.title = 'Unpin Top Bar';

                if (lastClickedId) {
                    setTimeout(() => {
                        const el = document.getElementById(lastClickedId);
                        if (el) el.click();
                    }, 350);
                }
            } else {
                topBar.classList.remove('is-pinned');
                topBar.classList.add('is-hidden');
                pinBtn.classList.remove('active');
                pinBtn.title = 'Pin Top Bar';
            }
        }
    });

    function isAnyPanelOpen() {
        const panelButtons = ['#control-settings', '#control-mixer', '#control-speed', '#control-transpose', '#control-export', '#control-print', '#control-metronome'];
        const openSelector = panelButtons.map(id => `${id}[aria-pressed="true"], ${id}[aria-expanded="true"]`).join(', ');
        return !!document.querySelector(openSelector);
    }

    let closeTimeout = null;

    setInterval(() => {
        if (isCompareMode) return;

        const tintBtn = document.querySelector('._5pcfpW_backgroundButton');
        if (tintBtn && tintBtn.hasAttribute('disabled')) {
            tintBtn.removeAttribute('disabled');
            tintBtn.style.setProperty('pointer-events', 'auto', 'important');
            tintBtn.style.setProperty('opacity', '1', 'important');
        }

        const topBars = document.querySelectorAll('div[data-bottom-bar="true"]');
        if (topBars.length > 1) {
            for (let i = 1; i < topBars.length; i++) {
                topBars[i].remove();
            }
        }

        const menuCards = document.querySelectorAll('.idrtTa_controlsCard');
        if (menuCards.length > 1) {
            for (let i = 1; i < menuCards.length; i++) {
                menuCards[i].remove();
            }
        }

        const pins = document.querySelectorAll('#pin-toggle-btn');
        if (pins.length > 1) {
            for (let i = 1; i < pins.length; i++) {
                pins[i].remove();
            }
        }

        const menuCard = document.querySelector('.idrtTa_controlsCard');
        if (!menuCard) return;

        const ytContainer = document.getElementById('custom-yt-container');
        const panelOpen = isAnyPanelOpen();

        if (ytContainer) {
            if (panelOpen) {
                ytContainer.style.setProperty('display', 'none', 'important');
            } else if (ytContainer.style.display === 'none') {
                ytContainer.style.removeProperty('display');
            }
        }

        const dropdownOpen = document.querySelector('#display-mode-button[aria-expanded="true"]');
        const isOverYt = document.getElementById('custom-yt-container')?.matches(':hover');
        const isInHoverZone = mouseX > window.innerWidth - 55 && !isOverYt;

        const rect = menuCard.getBoundingClientRect();
        const isOverMenu = mouseX >= rect.left - 10 && mouseX <= rect.right + 25 &&
                           mouseY >= rect.top && mouseY <= rect.bottom;

        if (isInHoverZone || isOverMenu || dropdownOpen) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
            document.body.classList.add('menu-hovered');
        } else {
            if (document.body.classList.contains('menu-hovered') && !closeTimeout) {
                closeTimeout = setTimeout(() => {
                    document.body.classList.remove('menu-hovered');
                    closeTimeout = null;
                }, 400);
            }
        }
    }, 100);

    function setupYouTubePlayer() {
        if (isCompareMode) return;

        const iframe = document.querySelector('iframe[src*="youtube.com/embed"]');
        if (!iframe) return;

        let container = document.getElementById('custom-yt-container');

        if (!container) {
            container = document.createElement('div');
            container.id = 'custom-yt-container';

            const topBar = document.createElement('div');
            topBar.id = 'custom-yt-top-bar';

            const wrapper = document.createElement('div');
            wrapper.id = 'custom-yt-wrapper';

            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'custom-yt-toggle';
            toggleBtn.innerText = '▼';

            topBar.appendChild(toggleBtn);
            container.appendChild(topBar);
            container.appendChild(wrapper);

            let isHidden = false;
            toggleBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isHidden = !isHidden;

                if (isHidden) {
                    wrapper.style.setProperty('display', 'none', 'important');
                    toggleBtn.innerText = '▲';
                    toggleBtn.classList.add('is-video-hidden');
                } else {
                    wrapper.style.setProperty('display', 'block', 'important');
                    toggleBtn.innerText = '▼';
                    toggleBtn.classList.remove('is-video-hidden');
                }

                const sidePanel = document.querySelector('.PdDsXq_sidePanel');
                if (sidePanel) sidePanel.style.setProperty('display', isHidden ? 'none' : 'flex', 'important');
            });

            document.body.appendChild(container);
        }

        const wrapper = document.getElementById('custom-yt-wrapper');
        const iframeParent = iframe.closest('.nGwXTW_video') || iframe.parentElement;
        if (wrapper && !wrapper.contains(iframeParent)) {
            wrapper.appendChild(iframeParent);
        }

        const videoId = iframe.src.match(/embed\/([^?&]+)/)?.[1];
        if (videoId) {
            fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.width && data.height) {
                        const ratio = data.width / data.height;
                        if (wrapper && container) {
                            if (ratio < 1.5) {
                                wrapper.style.setProperty('width', '180px', 'important');
                                container.style.setProperty('width', '180px', 'important');
                            } else {
                                wrapper.style.setProperty('width', '320px', 'important');
                                container.style.setProperty('width', '320px', 'important');
                            }
                        }
                    }
                }).catch(e => {
                    if (wrapper && container) {
                        wrapper.style.setProperty('width', '320px', 'important');
                        container.style.setProperty('width', '320px', 'important');
                    }
                });
        }

        let curr = iframeParent;
        while (curr && curr !== document.body) {
            curr.style.setProperty('background', 'transparent', 'important');
            curr.style.setProperty('background-color', 'transparent', 'important');
            curr.style.setProperty('border', 'none', 'important');
            curr.style.setProperty('box-shadow', 'none', 'important');
            curr = curr.parentElement;
        }
    }

    const waitForMenu = setInterval(() => {
        if (isCompareMode) return;

        let menuCard = document.querySelector('.idrtTa_controlsCard');

        let topPanel = document.querySelector('.idrtTa_controlsCard ._5pcfpW_controlsTopPanel');
        if (!topPanel) {
            topPanel = document.querySelector('._5pcfpW_controlsTopPanel');
        }

        setupYouTubePlayer();

        if (menuCard && topPanel) {
            if (!menuCard.contains(topPanel)) {
                menuCard.insertBefore(topPanel, menuCard.firstChild);
            }
            if (!topPanel.contains(pinBtn)) {
                topPanel.insertBefore(pinBtn, topPanel.firstChild);
            }
        }
    }, 500);

    if (!window.hasSidebarClickOutside) {
        document.addEventListener('mousedown', (e) => {
            if (isCompareMode) return;

            const menuCard = document.querySelector('.idrtTa_controlsCard');
            if (!menuCard) return;

            const isClickInsideMenu = menuCard.contains(e.target);
            const isClickOnDropdown = e.target.closest('[role="listbox"]') || e.target.closest('.GXOmPa_dropdown');
            const isClickOnYt = e.target.closest('#custom-yt-container');
            const isClickOnNativeSidePanel = e.target.closest('.PdDsXq_sidePanel');

            const isClickOnHoverZone = mouseX > window.innerWidth - 55;

            if (!isClickInsideMenu && !isClickOnDropdown && !isClickOnYt && !isClickOnHoverZone && !isClickOnNativeSidePanel && document.body.classList.contains('menu-hovered')) {
                document.body.classList.remove('menu-hovered');
                const dropdownBtn = document.querySelector('#display-mode-button[aria-expanded="true"]');
                if (dropdownBtn) dropdownBtn.click();
            }
        });
        window.hasSidebarClickOutside = true;
    }

    if (!isCompareMode) {
        document.body.appendChild(pinBtn);
        document.body.appendChild(hoverZone);
    }
})();
