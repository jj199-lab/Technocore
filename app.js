/* -------------------------------------------------------------
   app.js - Technocore Logo Playground Logic
   Conforms to FLOP Network brand guidelines
------------------------------------------------------------- */

// App State
const state = {
    concept: 'tri-agent',
    color: 'cyan',
    theme: 'dark',
    lockup: 'horizontal',
    scale: 180,
    guides: true
};

// Official FLOP Colors Mapping
const colorsMap = {
    cyan: '#00B4D8',
    green: '#32D74B',
    blue: '#0466C8',
    iceWhite: '#F5F7FA',
    base: '#0A1128',
    grey: '#5C6670',
    red: '#FF453A'
};

// UI Elements
const els = {
    svgContainer: document.getElementById('svg-container'),
    scaleSlider: document.getElementById('scale-slider'),
    scaleVal: document.getElementById('scale-val'),
    lockupSelect: document.getElementById('lockup-select'),
    toggleGridLines: document.getElementById('toggle-grid-lines'),
    toggleTheme: document.getElementById('toggle-theme'),
    btnToggleGuides: document.getElementById('btn-toggle-guides'),
    svgSourceOutput: document.getElementById('svg-source-output'),
    btnCopyCode: document.getElementById('btn-copy-code'),
    btnDownloadSvg: document.getElementById('btn-download-svg'),
    canvasTitle: document.getElementById('canvas-title-text'),
    conceptTitle: document.getElementById('concept-title'),
    conceptEthos: document.getElementById('concept-ethos'),
    descGeometry: document.getElementById('desc-geometry'),
    descAperture: document.getElementById('desc-aperture'),
    contrastVal: document.getElementById('contrast-val'),
    contrastBadge: document.getElementById('contrast-badge'),
    contrastDesc: document.getElementById('contrast-desc'),
    checklistContrast: document.getElementById('chk-contrast'),
    mascotContainer: document.getElementById('mascot-svg-container')
};

// Relative Luminance Calculator (WCAG 2.0)
function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const a = [r, g, b].map(v => {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Contrast Ratio Calculator
function getContrastRatio(hex1, hex2) {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

// Generate the SVG code based on selected configuration
function generateSVG(config, isMockup = false, mockupScale = 1.0, forcedColor = null) {
    const { concept, color, theme, lockup, guides } = config;
    
    // Determine active colors based on theme
    const bg = theme === 'dark' ? colorsMap.base : colorsMap.iceWhite;
    
    // Wordmark color matches the contrasting neutral
    const wordmarkColor = theme === 'dark' ? colorsMap.iceWhite : colorsMap.base;
    
    // Chip color
    let chipColor = colorsMap[color];
    if (color === 'monochrome') {
        chipColor = wordmarkColor;
    }
    if (forcedColor) {
        chipColor = forcedColor;
    }

    // Grid details (8x8 grid: each module is 10 units -> size 80x80)
    const moduleSize = 10;
    
    // SVG Dimensions
    let width = 80;
    let height = 80;
    let viewX = 0;
    let viewY = 0;
    
    if (lockup === 'horizontal') {
        width = 320;
        height = 80;
    } else if (lockup === 'stacked') {
        width = 160;
        height = 140;
    }
    
    // Main SVG wrapper
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">`;
    
    // 1. Draw Grid lines if guides are active
    if (guides && !isMockup) {
        svg += `<g class="grid-helper" opacity="0.45">`;
        // Horizontal grid lines
        for (let y = 0; y <= height; y += moduleSize) {
            svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${wordmarkColor}" stroke-width="0.3" stroke-dasharray="1 3" />`;
        }
        // Vertical grid lines
        for (let x = 0; x <= width; x += moduleSize) {
            svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${wordmarkColor}" stroke-width="0.3" stroke-dasharray="1 3" />`;
        }
        svg += `</g>`;
    }

    // Define Chip paths (8x8 octagons in 80x80 viewBox)
    let chipPath = '';
    let symbolAperture = '';
    
    if (concept === 'tri-agent') {
        // Concept 1: The Tri-Agent Core
        // Consists of 3 overlapping 3.6x3.6 module octagons
        // We draw the group of nodes and connecting lines
        const node1 = `M 31 7 H 49 L 58 16 V 34 L 49 43 H 31 L 22 34 V 16 Z`; // Top
        const node2 = `M 15 35 H 33 L 42 44 V 62 L 33 71 H 15 L 6 62 V 44 Z`; // Bottom Left
        const node3 = `M 47 35 H 65 L 74 44 V 62 L 65 71 H 47 L 38 62 V 44 Z`; // Bottom Right
        
        svg += `<g id="tri-agent-icon" fill="${chipColor}">`;
        // Pipelines
        svg += `<path d="M 24 51 H 56 V 55 H 24 Z" opacity="0.8" />`;
        svg += `<path d="M 22 51 L 38 23 L 42 25 L 26 53 Z" opacity="0.8" />`;
        svg += `<path d="M 58 51 L 42 23 L 38 25 L 54 53 Z" opacity="0.8" />`;
        // Nodes (using evenodd so apertures are knocked out)
        svg += `<path d="${node1} M 37 22 H 43 V 28 H 37 Z" fill-rule="evenodd" />`;
        svg += `<path d="${node2} M 21 50 H 27 V 56 H 21 Z" fill-rule="evenodd" />`;
        svg += `<path d="${node3} M 53 50 H 59 V 56 H 53 Z" fill-rule="evenodd" />`;
        svg += `</g>`;
        
        // Add a central open triad core highlight
        svg += `<polygon points="35,39 45,39 40,30" fill="${bg}" />`;
        
    } else if (concept === 'synaptic') {
        // Concept 2: The Synaptic Chip
        // 8x8 Octagon with a linked keyhole-style aperture (representing dynamic messaging)
        const outerOctagon = `M 20 0 H 60 L 80 20 V 60 L 60 80 H 20 L 0 60 V 20 Z`;
        
        // Linked keyhole cutout: 2 connected square apertures in center
        // Center of left node is (30,40), center of right is (50,40)
        // apertures: (24,34) to (34,44) and (46,34) to (56,44)
        // link channel: (34,38) to (46,42)
        const apertureCutout = `M 25 33 H 35 V 37 H 45 V 33 H 55 V 47 H 45 V 43 H 35 V 47 H 25 Z`;
        
        // Chat tail block at bottom-left corner
        const chatTail = `M 20 60 L 10 70 V 60 Z`;
        
        svg += `<g id="synaptic-icon">`;
        svg += `<path d="${outerOctagon} ${apertureCutout}" fill="${chipColor}" fill-rule="evenodd" />`;
        svg += `<path d="${chatTail}" fill="${chipColor}" />`;
        svg += `</g>`;
        
    } else if (concept === 't-core') {
        // Concept 3: The T-Core Grid
        // 8x8 Octagon with a geometric T-shaped central aperture
        const outerOctagon = `M 20 0 H 60 L 80 20 V 60 L 60 80 H 20 L 0 60 V 20 Z`;
        
        // Geometric T-cutout: Crossbar (20,25) to (60,35), Stem (35,35) to (45,60)
        const tAperture = `M 20 23 H 60 V 33 H 45 V 58 H 35 V 33 H 20 Z`;
        
        svg += `<path d="${outerOctagon} ${tAperture}" fill="${chipColor}" fill-rule="evenodd" id="t-core-icon" />`;
    }

    // Offset coordinates for text elements based on lockup style
    if (lockup === 'horizontal') {
        // Horizontal Lockup
        // Icon is on left (x: 0-80, y: 0-80), text starts around x=95
        svg += `<g id="wordmark" transform="translate(95, 0)">`;
        svg += `<text x="0" y="47" font-family="'Space Mono', monospace" font-weight="700" font-size="28" fill="${wordmarkColor}" letter-spacing="-0.03em">Technocore</text>`;
        svg += `<text x="160" y="47" font-family="'Space Mono', monospace" font-weight="400" font-size="28" fill="${chipColor}" letter-spacing="-0.03em">.chat</text>`;
        svg += `</g>`;
    } else if (lockup === 'stacked') {
        // Stacked Lockup
        // Icon is centered on top (x: 40-120), text is centered below
        svg += `<g id="wordmark" transform="translate(0, 95)">`;
        svg += `<text x="80" y="15" font-family="'Space Mono', monospace" font-weight="700" font-size="16" fill="${wordmarkColor}" text-anchor="middle" letter-spacing="-0.02em">Technocore</text>`;
        svg += `<text x="80" y="32" font-family="'Space Mono', monospace" font-weight="400" font-size="16" fill="${chipColor}" text-anchor="middle" letter-spacing="-0.02em">.chat</text>`;
        svg += `</g>`;
    }
    
    // Draw guide annotations if toggled
    if (guides && !isMockup) {
        svg += `<g class="guide-lines" opacity="0.8">`;
        if (lockup === 'icon' || lockup === 'horizontal') {
            // Octagonal corner helper lines
            svg += `<line x1="20" y1="0" x2="0" y2="20" class="guide-line" />`;
            svg += `<line x1="60" y1="0" x2="80" y2="20" class="guide-line" />`;
            svg += `<line x1="80" y1="60" x2="60" y2="80" class="guide-line" />`;
            svg += `<line x1="0" y1="60" x2="20" y2="80" class="guide-line" />`;
            
            // Outer bounding box markers
            svg += `<rect x="0" y="0" width="80" height="80" fill="none" stroke="${colorsMap.cyan}" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4" />`;
            svg += `<text x="83" y="10" class="guide-text" font-size="5">8x8 Module Box</text>`;
            svg += `<text x="83" y="20" class="guide-text" font-size="4">45° Corner Cut</text>`;
        }
        
        if (lockup === 'horizontal') {
            // Horizontal layout labels
            svg += `<line x1="80" y1="40" x2="95" y2="40" stroke="${colorsMap.cyan}" stroke-width="0.5" stroke-dasharray="1 1" />`;
            svg += `<text x="83" y="38" class="guide-text" font-size="3">Clear Space</text>`;
        }
        svg += `</g>`;
    }
    
    svg += `</svg>`;
    return svg;
}

// Generate a simplified version of the icon only for small scale previews or medallion
function generateIconSVG(concept, color, theme, forcedColor = null) {
    const bg = theme === 'dark' ? colorsMap.base : colorsMap.iceWhite;
    const wordmarkColor = theme === 'dark' ? colorsMap.iceWhite : colorsMap.base;
    let chipColor = colorsMap[color];
    if (color === 'monochrome') {
        chipColor = wordmarkColor;
    }
    if (forcedColor) {
        chipColor = forcedColor;
    }

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="100%" height="100%">`;

    if (concept === 'tri-agent') {
        const node1 = `M 31 7 H 49 L 58 16 V 34 L 49 43 H 31 L 22 34 V 16 Z`;
        const node2 = `M 15 35 H 33 L 42 44 V 62 L 33 71 H 15 L 6 62 V 44 Z`;
        const node3 = `M 47 35 H 65 L 74 44 V 62 L 65 71 H 47 L 38 62 V 44 Z`;
        
        svg += `<g fill="${chipColor}">`;
        svg += `<path d="M 24 51 H 56 V 55 H 24 Z" opacity="0.8" />`;
        svg += `<path d="M 22 51 L 38 23 L 42 25 L 26 53 Z" opacity="0.8" />`;
        svg += `<path d="M 58 51 L 42 23 L 38 25 L 54 53 Z" opacity="0.8" />`;
        svg += `<path d="${node1} M 37 22 H 43 V 28 H 37 Z" fill-rule="evenodd" />`;
        svg += `<path d="${node2} M 21 50 H 27 V 56 H 21 Z" fill-rule="evenodd" />`;
        svg += `<path d="${node3} M 53 50 H 59 V 56 H 53 Z" fill-rule="evenodd" />`;
        svg += `</g>`;
        svg += `<polygon points="35,39 45,39 40,30" fill="${bg}" />`;
    } else if (concept === 'synaptic') {
        const outerOctagon = `M 20 0 H 60 L 80 20 V 60 L 60 80 H 20 L 0 60 V 20 Z`;
        const apertureCutout = `M 25 33 H 35 V 37 H 45 V 33 H 55 V 47 H 45 V 43 H 35 V 47 H 25 Z`;
        const chatTail = `M 20 60 L 10 70 V 60 Z`;
        
        svg += `<path d="${outerOctagon} ${apertureCutout}" fill="${chipColor}" fill-rule="evenodd" />`;
        svg += `<path d="${chatTail}" fill="${chipColor}" />`;
    } else if (concept === 't-core') {
        const outerOctagon = `M 20 0 H 60 L 80 20 V 60 L 60 80 H 20 L 0 60 V 20 Z`;
        const tAperture = `M 20 23 H 60 V 33 H 45 V 58 H 35 V 33 H 20 Z`;
        
        svg += `<path d="${outerOctagon} ${tAperture}" fill="${chipColor}" fill-rule="evenodd" />`;
    }

    svg += `</svg>`;
    return svg;
}

// Generate the official FLOP mascot SVG with dynamic Technocore chest medallion
function generateMascotSVG(chipSVG) {
    const visorColor = colorsMap.cyan;
    const bodyColor = state.color === 'green' ? colorsMap.green : colorsMap.cyan;
    
    // Dynamic mascot rendering (Mascot V3.0)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">`;
    
    // Subtle backdrop glow
    svg += `<circle cx="100" cy="110" r="70" fill="${bodyColor}" opacity="0.06" filter="blur(15px)" />`;
    
    // Ears (Long, floppy, recognition asset)
    svg += `<path d="M 65 90 C 45 40, 20 30, 30 75 C 38 110, 68 115, 68 110" fill="${bodyColor}" opacity="0.9" stroke="#061025" stroke-width="1.5" />`; // Left Ear
    svg += `<path d="M 135 90 C 155 40, 180 30, 170 75 C 162 110, 132 115, 132 110" fill="${bodyColor}" opacity="0.9" stroke="#061025" stroke-width="1.5" />`; // Right Ear
    
    // Ear inside lining
    svg += `<path d="M 60 85 C 45 45, 30 40, 35 70 C 40 95, 60 100, 60 100" fill="#0A1128" opacity="0.3" />`;
    svg += `<path d="M 140 85 C 155 45, 170 40, 165 70 C 160 95, 140 100, 140 100" fill="#0A1128" opacity="0.3" />`;
    
    // Head / Helmet (Chrome/silver crown cap)
    svg += `<path d="M 60 110 C 60 75, 140 75, 140 110 Z" fill="#99A2AD" stroke="#061025" stroke-width="1.5" />`;
    // visors brow indicator (cyan oval)
    svg += `<ellipse cx="100" cy="85" rx="8" ry="12" fill="${visorColor}" />`;
    
    // Face (Dome carrying cyan eyes and small w smile)
    svg += `<path d="M 63 110 C 63 90, 137 90, 137 110 C 137 135, 63 135, 63 110 Z" fill="#0E1628" stroke="#061025" stroke-width="1.5" />`;
    
    // Eyes (Visor-like Cyan ovals)
    svg += `<ellipse cx="82" cy="112" rx="5" ry="9" fill="${visorColor}" />`;
    svg += `<ellipse cx="118" cy="112" rx="5" ry="9" fill="${visorColor}" />`;
    
    // w smile
    svg += `<path d="M 94 121 Q 97 125, 100 121 Q 103 125, 106 121" fill="none" stroke="${visorColor}" stroke-width="1.5" stroke-linecap="round" />`;
    
    // Body (Glossy dark chassis)
    svg += `<path d="M 72 133 C 65 155, 60 180, 100 180 C 140 180, 135 155, 128 133 Z" fill="#081022" stroke="#061025" stroke-width="1.5" />`;
    
    // Hands/Paws (glossy dark tips)
    svg += `<ellipse cx="65" cy="155" rx="7" ry="10" fill="#040A18" stroke="#061025" stroke-width="1" />`; // Left paw
    svg += `<ellipse cx="135" cy="155" rx="7" ry="10" fill="#040A18" stroke="#061025" stroke-width="1" />`; // Right paw
    
    // Medallion - The chest plate holding our custom dynamic icon!
    // Medallion frame (chrome octagon)
    svg += `<polygon points="82,143 118,143 128,153 128,171 118,181 82,181 72,171 72,153" fill="#D9DDE1" stroke="#061025" stroke-width="1" />`;
    // Medallion inner backing (navy)
    svg += `<polygon points="85,146 115,146 124,155 124,169 115,178 85,178 76,169 76,155" fill="#0A1128" />`;
    
    // Inject custom Technocore Chip logo inside medallion (translated & scaled to fit)
    svg += `<g transform="translate(80, 147) scale(0.5)">`;
    svg += chipSVG;
    svg += `</g>`;
    
    svg += `</svg>`;
    return svg;
}

// Update App View & Renders
function updateView() {
    // 1. Update Preview Canvas
    const svgCode = generateSVG(state);
    els.svgContainer.innerHTML = svgCode;
    els.svgSourceOutput.textContent = svgCode;
    
    // Resize based on scale slider
    const svgEl = els.svgContainer.querySelector('svg');
    if (svgEl) {
        svgEl.style.width = `${state.scale}px`;
        svgEl.style.height = 'auto';
        if (state.guides) {
            svgEl.classList.add('glow-active');
        } else {
            svgEl.classList.remove('glow-active');
        }
    }
    
    // Update labels and classes based on configuration
    const viewPort = document.getElementById('canvas-viewport');
    if (state.guides) {
        viewPort.classList.add('grid-active');
        els.btnToggleGuides.textContent = 'Hide Guides';
        els.btnToggleGuides.classList.add('btn-primary');
        els.btnToggleGuides.classList.remove('btn-secondary');
    } else {
        viewPort.classList.remove('grid-active');
        els.btnToggleGuides.textContent = 'Show Guides';
        els.btnToggleGuides.classList.add('btn-secondary');
        els.btnToggleGuides.classList.remove('btn-primary');
    }
    
    // Update theme class on body
    if (state.theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    
    // 2. Update Rationale Texts based on Concept
    updateRationales();
    
    // 3. Update Contrast Calculator
    updateContrast();

    // 4. Update Mockups
    updateMockups();
}

function updateRationales() {
    if (state.concept === 'tri-agent') {
        els.canvasTitle.textContent = 'Concept 01: The Tri-Agent Core';
        els.conceptTitle.textContent = 'Concept 01: The Tri-Agent Core';
        els.conceptEthos.innerHTML = '<strong>Ethos:</strong> Represents communication, commerce, and memory converging into a unified space.';
        els.descGeometry.textContent = 'Three overlapping 3.6-module octagonal nodes aligned on the grid, connected by solid communication conduits. Fits the 45° corner cut profile of the FLOP network standards.';
        els.descAperture.textContent = 'A shared central hollow triangular aperture representing open, trustless agent communication and shared ledger memory. The background is fully visible through the aperture.';
    } else if (state.concept === 'synaptic') {
        els.canvasTitle.textContent = 'Concept 02: The Synaptic Chip';
        els.conceptTitle.textContent = 'Concept 02: The Synaptic Chip';
        els.conceptEthos.innerHTML = '<strong>Ethos:</strong> Represents dynamic messaging, key transaction verification, and connected AI agents.';
        els.descGeometry.textContent = 'An 8x8 module octagon Chip adhering exactly to construction guidelines, with a dialog tail highlight added at the bottom corner for immediate .chat context.';
        els.descAperture.textContent = 'A linked keyhole-style double aperture representing messaging nodes and transactional ports. Follows the strictly open-empty aperture rule for visibility.';
    } else if (state.concept === 't-core') {
        els.canvasTitle.textContent = 'Concept 03: The T-Core Grid';
        els.conceptTitle.textContent = 'Concept 03: The T-Core Grid';
        els.conceptEthos.innerHTML = '<strong>Ethos:</strong> Focuses on structural name indexing, terminal operations, and computational core strength.';
        els.descGeometry.textContent = 'An 8x8 module octagon built on the pixel-grid using standard hairlines and gutters. Minimalist, industrial-grade engineering aesthetic.';
        els.descAperture.textContent = 'A T-shaped hollow aperture cut out from the center of the chip, revealing the background. Synthesizes name and icon into a single, clean architectural object.';
    }
}

function updateContrast() {
    const bgHex = state.theme === 'dark' ? colorsMap.base : colorsMap.iceWhite;
    
    // Calculate contrast of wordmark text
    const textHex = state.theme === 'dark' ? colorsMap.iceWhite : colorsMap.base;
    const textContrast = getContrastRatio(textHex, bgHex).toFixed(1);
    
    // Calculate contrast of colored chip
    const chipHex = state.color === 'monochrome' ? textHex : colorsMap[state.color];
    const chipContrast = getContrastRatio(chipHex, bgHex).toFixed(1);
    
    // Display results based on color selected
    els.contrastVal.textContent = `${chipContrast}:1`;
    
    // Set validation status
    if (chipContrast >= 7.0) {
        els.contrastBadge.textContent = 'AAA Pass';
        els.contrastBadge.style.backgroundColor = 'rgba(50, 215, 75, 0.15)';
        els.contrastBadge.style.color = colorsMap.green;
        els.contrastBadge.style.borderColor = colorsMap.green;
        els.checklistContrast.className = 'checked';
        els.contrastDesc.textContent = `Excellent contrast safety. The ${state.color} chip meets AAA compliance on the substrate (body requirement is >= 7.0:1).`;
    } else if (chipContrast >= 4.5) {
        els.contrastBadge.textContent = 'AA Pass';
        els.contrastBadge.style.backgroundColor = 'rgba(50, 215, 75, 0.08)';
        els.contrastBadge.style.color = colorsMap.green;
        els.contrastBadge.style.borderColor = colorsMap.green;
        els.checklistContrast.className = 'checked';
        els.contrastDesc.textContent = `Good contrast. Meets AA compliance (>= 4.5:1). Fully readable for elements and large headings.`;
    } else {
        els.contrastBadge.textContent = 'Fail';
        els.contrastBadge.style.backgroundColor = 'rgba(255, 69, 58, 0.15)';
        els.contrastBadge.style.color = colorsMap.red;
        els.contrastBadge.style.borderColor = colorsMap.red;
        els.checklistContrast.className = '';
        els.contrastDesc.textContent = `Warning: ${state.color} on ${state.theme === 'dark' ? 'Base' : 'Ice White'} falls below the body text limit. Under FLOP rules, treat as a fill only; place contrasting text on top.`;
    }
}

function updateMockups() {
    // 1. Dashboard Sidebar Lockup
    // Render a small horizontal lockup with no guides
    const dashLockupConfig = { ...state, lockup: 'horizontal', guides: false };
    document.getElementById('mock-logo-dash').innerHTML = generateSVG(dashLockupConfig, true);
    
    // 2. Terminal Lockup
    // Render one-color terminal output
    const termLockupConfig = { ...state, lockup: 'horizontal', color: 'monochrome', guides: false };
    document.getElementById('mock-logo-term').innerHTML = generateSVG(termLockupConfig, true);
    
    // 3. Scaled Icons
    // Render icon only at different sizes
    const iconConfig = { ...state, lockup: 'icon', guides: false };
    
    document.getElementById('mock-icon-16').innerHTML = generateSVG({ ...iconConfig, scale: 16 }, true);
    document.getElementById('mock-icon-24').innerHTML = generateSVG({ ...iconConfig, scale: 24 }, true);
    document.getElementById('mock-icon-64').innerHTML = generateSVG({ ...iconConfig, scale: 64 }, true);
    
    // 4. Mascot MEDALLION
    // Get raw chip SVG string (without envelope svg)
    const chipRaw = generateIconSVG(state.concept, state.color, state.theme);
    els.mascotContainer.innerHTML = generateMascotSVG(chipRaw);
}

// Event Listeners Setup
function initEvents() {
    // Concept Selector Tabs
    document.getElementById('concept-tabs').addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        state.concept = btn.dataset.concept;
        updateView();
    });
    
    // Color Buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            state.color = btn.dataset.color;
            updateView();
        });
    });
    
    // Display Controls
    els.scaleSlider.addEventListener('input', (e) => {
        state.scale = parseInt(e.target.value);
        els.scaleVal.textContent = `${state.scale}px`;
        
        const svgEl = els.svgContainer.querySelector('svg');
        if (svgEl) {
            svgEl.style.width = `${state.scale}px`;
        }
    });
    
    els.lockupSelect.addEventListener('change', (e) => {
        state.lockup = e.target.value;
        updateView();
    });
    
    els.toggleGridLines.addEventListener('change', (e) => {
        state.guides = e.target.checked;
        updateView();
    });
    
    els.toggleTheme.addEventListener('change', (e) => {
        state.theme = e.target.checked ? 'light' : 'dark';
        updateView();
    });
    
    els.btnToggleGuides.addEventListener('click', () => {
        state.guides = !state.guides;
        els.toggleGridLines.checked = state.guides;
        updateView();
    });
    
    // Copy Code to Clipboard
    els.btnCopyCode.addEventListener('click', () => {
        const codeText = els.svgSourceOutput.textContent;
        navigator.clipboard.writeText(codeText).then(() => {
            const originalText = els.btnCopyCode.textContent;
            els.btnCopyCode.textContent = 'Copied!';
            setTimeout(() => {
                els.btnCopyCode.textContent = originalText;
            }, 1500);
        });
    });
    
    // Download SVG File
    els.btnDownloadSvg.addEventListener('click', () => {
        // Generate SVG output without grid helpers or guides for production download
        const downloadConfig = { ...state, guides: false };
        const cleanSVG = generateSVG(downloadConfig);
        
        const blob = new Blob([cleanSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `technocore-${state.concept}-${state.color}-${state.lockup}.svg`;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    // Default values sync
    els.scaleSlider.value = state.scale;
    els.scaleVal.textContent = `${state.scale}px`;
    els.toggleGridLines.checked = state.guides;
    els.toggleTheme.checked = state.theme === 'light';
    els.lockupSelect.value = state.lockup;
    
    updateView();
});
