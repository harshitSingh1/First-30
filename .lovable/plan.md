
# First30.ai - Emergency Guidance Platform MVP

## Overview
Building a premium medical emergency guidance platform with a "glass emergency HUD" design. The platform will feature two modes: Citizen Mode for step-by-step emergency guidance and Dispatcher Mode for professional emergency response coordination.

---

## Architecture Overview

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Main navigation header
│   │   ├── Footer.tsx              # Site footer
│   │   ├── Layout.tsx              # Main layout wrapper
│   │   └── EmergencyCallBanner.tsx # Sticky emergency call button
│   │
│   ├── emergency/
│   │   ├── EmergencyCard.tsx       # Quick-start emergency cards
│   │   ├── StepCard.tsx            # One instruction per screen
│   │   ├── ProgressBar.tsx         # Emergency flow progress
│   │   ├── EmergencyTimer.tsx      # CPR timer component
│   │   ├── SummaryCard.tsx         # Handoff summary card
│   │   └── SafetyAlertBanner.tsx   # Warning/safety alerts
│   │
│   ├── dispatcher/
│   │   ├── DispatcherPanel.tsx     # 3-column dashboard panel
│   │   ├── PriorityBadge.tsx       # P1-P4 priority indicators
│   │   └── CaseCard.tsx            # Emergency case summary
│   │
│   ├── map/
│   │   └── MapPanel.tsx            # Placeholder for map integration
│   │
│   └── ui/                         # Existing shadcn components
│       └── PrimaryCTAButton.tsx    # New: Large emergency CTA button
│
├── pages/
│   ├── Index.tsx                   # Home page with hero
│   ├── CitizenMode.tsx             # Emergency selector
│   ├── EmergencyFlow.tsx           # Step-by-step guidance
│   ├── CPRMode.tsx                 # CPR timer + rhythm UI
│   ├── EmergencySummary.tsx        # Handoff card page
│   ├── DispatcherDashboard.tsx     # Professional dashboard
│   ├── MapNearbyHelp.tsx           # Hospitals/pharmacy/police map
│   ├── About.tsx                   # About + Safety + Disclaimer
│   └── NotFound.tsx                # 404 page (existing)
│
├── data/
│   └── emergencyFlows.ts           # Structured emergency data
│
├── hooks/
│   ├── useEmergencyFlow.ts         # Emergency flow state management
│   └── useEmergencyTimer.ts        # Timer logic for CPR
│
└── types/
    └── emergency.ts                # TypeScript interfaces
```

---

## Phase 1: Design System Setup

### 1.1 Update CSS Theme (src/index.css)
Create the "glass emergency HUD" dark theme with:
- Dark background with subtle gradient (slate-950 to slate-900)
- Emergency accent colors:
  - Primary: Cyan/teal for calm, medical feel
  - Emergency Red: For critical actions
  - Warning Amber: For caution states
  - Success Green: For completed steps
- Glassmorphism variables for blur effects and soft borders
- Larger base font sizes for accessibility (18px base)
- Custom CSS classes for glass cards with backdrop blur

### 1.2 Update Tailwind Config (tailwind.config.ts)
- Add custom colors for emergency states
- Add new border radius values (xl, 2xl, 3xl)
- Add custom animations:
  - Pulse glow for emergency buttons
  - Slide transitions for step cards
  - Fade in/out for page transitions
  - Subtle hover tilt effects
- Add glassmorphism utility classes
- Configure Inter/Manrope font family

---

## Phase 2: Core Components

### 2.1 Layout Components

**Layout.tsx**
- Dark gradient background covering full viewport
- Conditional header display (hidden in emergency flow)
- EmergencyCallBanner sticky at bottom on Citizen pages
- Smooth page transitions

**Header.tsx**
- First30.ai logo with subtle glow
- Navigation: Home, Citizen Mode, Dispatcher, Map, About
- Mobile hamburger menu using Sheet component
- Semi-transparent glass effect

**EmergencyCallBanner.tsx**
- Sticky bottom banner with pulsing "Call Emergency Number" button
- Phone icon with animation
- Visible on all Citizen Mode pages
- Regional number display (placeholder: 911)

### 2.2 Emergency Components

**EmergencyCard.tsx**
- Large touch-friendly card (min 120px height)
- Icon, title, and brief description
- Glassmorphism styling with colored border accent
- Hover scale animation
- Click navigates to EmergencyFlow with category

**PrimaryCTAButton.tsx**
- Extra large button variant (h-16, text-xl)
- Glow effect on hover
- Supports different variants: primary, emergency (red), success
- Full-width option for mobile

**StepCard.tsx**
- Single instruction display card
- Large icon/image placeholder area
- Bold instruction title
- Supporting text (kept minimal)
- Warning text display (if applicable)
- Two large buttons: "Done" and "I can't do this"
- Fade/slide animation on step change

**ProgressBar.tsx**
- Visual step indicator (Step 3 of 8)
- Animated progress fill
- Time elapsed display option
- Glass card styling

**EmergencyTimer.tsx**
- Large digital timer display
- CPR rhythm indicator (visual pulse)
- Audio cue placeholder
- Start/Stop/Reset controls
- 30:2 compression-breath ratio display

**SummaryCard.tsx**
- Handoff information card
- Fields: Emergency type, actions taken, time elapsed, location
- Priority level badge
- Share/Copy functionality placeholders
- Print-friendly styling

**SafetyAlertBanner.tsx**
- Prominent warning banner
- Icon + message
- Variants: warning (amber), danger (red), info (cyan)
- Dismissible option

### 2.3 Dispatcher Components

**DispatcherPanel.tsx**
- 3-column responsive layout
- Column 1: Active cases list
- Column 2: Selected case details
- Column 3: Recommended actions/questions
- Glass panel styling

**PriorityBadge.tsx**
- P1 (red), P2 (orange), P3 (yellow), P4 (green)
- Animated pulse for P1
- Clear typography

**CaseCard.tsx**
- Compact case summary
- Time since report
- Location snippet
- Priority indicator
- Click to select

### 2.4 Map Component

**MapPanel.tsx**
- Placeholder container for future map integration
- Mock data for nearby services:
  - Hospitals (red markers)
  - Pharmacies (green markers)
  - Police (blue markers)
  - Fire stations (orange markers)
- List view of nearby services
- Distance/ETA placeholders

---

## Phase 3: Pages Implementation

### 3.1 Home Page (Index.tsx)
**Hero Section:**
- Large headline: "Help in the next 30 minutes. Step-by-step. Voice guided."
- Subheadline explaining the platform
- Two primary CTAs:
  - "Start Emergency Help" (navigates to /citizen)
  - "Start Voice Assistant" (placeholder, shows coming soon toast)

**Emergency Quick-Start Grid:**
- 6 EmergencyCard components in responsive grid
- Categories:
  1. Accident / Bleeding
  2. Breathing / Unconscious
  3. Chest Pain / Stroke
  4. Burns
  5. Choking
  6. Seizure

**Trust Points Section:**
- 3 cards with icons:
  1. "No login required" - Shield icon
  2. "Designed for panic situations" - Heart icon
  3. "Privacy-first" - Lock icon

**Footer Links:**
- About, Safety, Disclaimer links

### 3.2 Citizen Mode (CitizenMode.tsx)
- Full emergency category selection
- Search/filter option (placeholder)
- Larger cards than homepage
- "Back to Home" navigation
- EmergencyCallBanner visible

### 3.3 Emergency Flow (EmergencyFlow.tsx)
- URL parameter for category: /emergency/:category
- One step visible at a time
- ProgressBar at top
- StepCard with current instruction
- Navigation: "Done" advances, "I can't" shows alternative or skips
- "End & Summarize" option
- Timer display (optional, always running in background)
- Navigates to EmergencySummary when complete

### 3.4 CPR Mode (CPRMode.tsx)
- Dedicated CPR guidance page
- Large EmergencyTimer with metronome
- Visual rhythm indicator (pulse animation at 100-120 BPM)
- Instruction overlay: "30 compressions, 2 breaths"
- Audio cue placeholder
- Quick exit to call emergency services

### 3.5 Emergency Summary (EmergencySummary.tsx)
- SummaryCard with all emergency details
- What happened (category)
- Steps completed
- Duration
- Location (placeholder)
- "Share with responders" button (copy to clipboard)
- "Print summary" button
- "Start new emergency" button
- Priority level recommendation

### 3.6 Dispatcher Dashboard (DispatcherDashboard.tsx)
- Header with "Dispatcher Mode" title
- 3-column layout using DispatcherPanel
- Mock cases data (3-5 examples)
- Case selection updates detail panel
- Recommended questions list
- Suggested actions checklist
- Priority assignment UI

### 3.7 Map & Nearby Help (MapNearbyHelp.tsx)
- MapPanel placeholder (styled container)
- Tabs: Hospitals, Pharmacies, Police, Fire
- List of nearby services (mock data)
- Distance and direction indicators
- "Get Directions" button placeholders
- "Share Location" option

### 3.8 About Page (About.tsx)
- About First30.ai section
- Mission statement
- How it works (3 steps)
- Safety guidelines section
- Medical disclaimer (prominent, legally appropriate)
- Team/contact placeholders
- Links to resources

---

## Phase 4: Data Structure

### 4.1 Types (src/types/emergency.ts)
```typescript
interface EmergencyStep {
  id: string;
  title: string;
  instruction: string;
  warning?: string;
  imagePlaceholder?: string;
  alternatives?: string[];
}

interface EmergencyFlow {
  id: string;
  category: string;
  icon: string;
  description: string;
  priorityHint: 'P1' | 'P2' | 'P3' | 'P4';
  steps: EmergencyStep[];
  nextQuestions: string[];
  summaryTemplate: SummaryTemplate;
}

interface SummaryTemplate {
  fields: string[];
  recommendations: string[];
}

interface DispatcherCase {
  id: string;
  category: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  reportedAt: Date;
  location: string;
  summary: string;
  suggestedActions: string[];
  suggestedQuestions: string[];
}
```

### 4.2 Emergency Flows Data (src/data/emergencyFlows.ts)
Pre-populated data for 6 emergency categories with 5-10 steps each:
1. Accident/Bleeding
2. Breathing/Unconscious
3. Chest Pain/Stroke
4. Burns
5. Choking
6. Seizure

Each with realistic first-responder guidance steps.

---

## Phase 5: Routing Setup

### Update App.tsx
```text
Routes:
/                    -> Index.tsx (Home)
/citizen             -> CitizenMode.tsx
/emergency/:category -> EmergencyFlow.tsx
/cpr                 -> CPRMode.tsx
/summary             -> EmergencySummary.tsx
/dispatcher          -> DispatcherDashboard.tsx
/map                 -> MapNearbyHelp.tsx
/about               -> About.tsx
*                    -> NotFound.tsx
```

---

## Phase 6: Custom Hooks

### useEmergencyFlow.ts
- Current step state
- Progress calculation
- Step navigation (next, previous, skip)
- Timer integration
- Flow completion detection
- Summary data compilation

### useEmergencyTimer.ts
- Elapsed time tracking
- Start/stop/reset controls
- CPR rhythm timing (for metronome feature)
- Time formatting utilities

---

## Visual Design Specifications

### Color Palette (Dark Theme)
- Background: slate-950 (#020617) with gradient to slate-900
- Card Background: slate-900/50 with backdrop-blur
- Primary Accent: cyan-500 (#06b6d4) - calm, medical
- Emergency: red-500 (#ef4444) - critical actions
- Warning: amber-500 (#f59e0b) - caution
- Success: emerald-500 (#10b981) - completed
- Text Primary: slate-50 (#f8fafc)
- Text Muted: slate-400 (#94a3b8)
- Border: slate-700/50 with blur

### Glassmorphism Effect
```css
.glass-card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 1.5rem;
}
```

### Typography Scale
- Display: 4rem (64px) - Hero headline
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body Large: 1.25rem (20px) - Default body text
- Body: 1.125rem (18px)
- Small: 0.875rem (14px)

### Animation Specifications
- Page transitions: 300ms fade + slide
- Hover effects: 200ms scale(1.02)
- Button glow: CSS box-shadow animation
- Timer pulse: Synchronized with CPR rhythm
- Step transitions: 400ms slide-left/right

---

## Implementation Order

1. **Design System** - Theme CSS, Tailwind config, font setup
2. **Layout Components** - Layout, Header, Footer, EmergencyCallBanner
3. **Core UI Components** - PrimaryCTAButton, EmergencyCard, StepCard
4. **Types & Data** - Emergency types, flow data structure
5. **Home Page** - Hero, quick-start grid, trust points
6. **Citizen Mode & Flow** - Category selection, step-by-step pages
7. **CPR Mode** - Timer, rhythm UI
8. **Summary Page** - Handoff card generation
9. **Dispatcher Dashboard** - 3-column layout with mock data
10. **Map Page** - Placeholder with service lists
11. **About Page** - Content and legal disclaimers
12. **Polish** - Animations, responsive testing, accessibility

---

## Technical Considerations

- All emergency steps are client-side only (no backend required yet)
- Data prepared for easy AI integration later
- Responsive design: Mobile-first for Citizen Mode
- Accessibility: Large touch targets, high contrast, screen reader support
- Performance: Minimal dependencies, optimized animations
- State management: React useState/useContext (no Redux needed for MVP)

---

## Files to Create/Modify

**New Files (27):**
- src/types/emergency.ts
- src/data/emergencyFlows.ts
- src/hooks/useEmergencyFlow.ts
- src/hooks/useEmergencyTimer.ts
- src/components/layout/Layout.tsx
- src/components/layout/Header.tsx
- src/components/layout/Footer.tsx
- src/components/layout/EmergencyCallBanner.tsx
- src/components/emergency/EmergencyCard.tsx
- src/components/emergency/StepCard.tsx
- src/components/emergency/ProgressBar.tsx (custom, not shadcn)
- src/components/emergency/EmergencyTimer.tsx
- src/components/emergency/SummaryCard.tsx
- src/components/emergency/SafetyAlertBanner.tsx
- src/components/dispatcher/DispatcherPanel.tsx
- src/components/dispatcher/PriorityBadge.tsx
- src/components/dispatcher/CaseCard.tsx
- src/components/map/MapPanel.tsx
- src/components/ui/PrimaryCTAButton.tsx
- src/pages/Index.tsx (rewrite)
- src/pages/CitizenMode.tsx
- src/pages/EmergencyFlow.tsx
- src/pages/CPRMode.tsx
- src/pages/EmergencySummary.tsx
- src/pages/DispatcherDashboard.tsx
- src/pages/MapNearbyHelp.tsx
- src/pages/About.tsx

**Modified Files (3):**
- src/index.css (new theme variables)
- tailwind.config.ts (new utilities and animations)
- src/App.tsx (new routes)
