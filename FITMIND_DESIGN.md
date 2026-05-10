# FitMind — Design Specification
**Version 1.0 · May 2026**
> Share this file with Claude or any designer to amend, extend, or redesign any part of the app.

---

## 1. Brand Identity

### Name & Positioning
- **App name:** FitMind
- **Tagline:** Your AI Dietitian & Fitness Coach
- **Market:** UAE (Dubai, Abu Dhabi, Sharjah) — halal-aware, Arabic-friendly, AED pricing
- **Tone:** Clean, calm, encouraging. Not aggressive fitness culture. Feels like a knowledgeable friend, not a drill sergeant.
- **Logo mark:** `FM` initials in a rounded rectangle with the sage-green gradient. No icon yet — opportunity to design a proper logomark.

### Logo mark (current — needs a real icon)
```
Shape:    Rounded rectangle (border-radius: 12px), 36×36px
Fill:     Linear gradient 135° → #52a07c to #3f8464
Text:     "FM" — Inter, Bold, 14px, white
```
**Design brief:** Replace the `FM` text with a proper icon. Ideas: a stylised brain with a leaf, a fork crossed with a dumbbell, a heart with a leaf. Should work at 16px (favicon) up to 512px (PWA icon).

---

## 2. Design System

### Colour Palette
All colours defined in `src/index.css` under `@theme`.

| Token | Hex | Usage |
|-------|-----|-------|
| `green-500` | `#52a07c` | Primary buttons, active states, CTAs |
| `green-600` | `#3f8464` | Button hover, gradient end |
| `green-50` | `#f4faf7` | Light backgrounds, selected chip bg |
| `green-100` | `#e6f4ed` | Card tints, badge backgrounds |
| `green-700` | `#336950` | Dark text on light green bg |
| White | `#ffffff` | Page background, cards |
| Gray-50 | `#f9fafb` | Page background (app shell) |
| Gray-100 | `#f3f4f6` | Dividers, input backgrounds |
| Gray-400 | `#9ca3af` | Placeholder text, secondary labels |
| Gray-900 | `#111827` | Primary text |
| Amber-400 | `#f59e0b` | Elite plan, warning states |
| Red-500 | `#ef4444` | Error states, danger actions |
| Blue-500 | `#3b82f6` | Hydration, steps |
| Purple-500 | `#8b5cf6` | Sleep metrics |

**Design brief:** The current green (`#52a07c`) is a warm sage. If you want to push softer/warmer, try `#6BAE8F` or a more muted `#5A9E80`. Avoid going too mint/cool — the UAE aesthetic skews warm.

### Typography
```
Font family:  Inter (Latin), Noto Sans Arabic (Arabic)
Loaded via:   Google Fonts

Scale:
  xs:    10–11px / font-size 0.625–0.75rem
  sm:    12–13px / font-size 0.75–0.8125rem  
  base:  14px    / font-size 0.875rem         ← body default
  lg:    16px    / font-size 1rem
  xl:    18–20px / font-size 1.125–1.25rem    ← section headers
  2xl:   22–24px / font-size 1.375–1.5rem     ← page titles
  4xl:   28–36px / font-size 1.75–2.25rem     ← hero/landing

Weights used:  400 (body), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
```

### Spacing System
Tailwind default — 4px base unit.
- Cards: `p-5` (20px padding)
- Page max-width: `max-w-2xl` (672px) centred
- Section gaps: `space-y-4` (16px)
- Tight gaps: `gap-2` / `gap-3` (8px / 12px)

### Border Radius
```
Buttons:          rounded-xl  (12px)
Cards:            rounded-2xl (16px)
Modals/sheets:    rounded-3xl (24px)
Avatars:          rounded-full
Small chips:      rounded-full
Large hero cards: rounded-3xl (24px)
```

### Shadows
```css
.card-shadow {
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
}
```
Hover state adds slightly more shadow. No heavy drop shadows — the design is deliberately flat-ish with subtle depth.

---

## 3. Component Library
Location: `src/components/ui/index.tsx`

### Button
```
Variants:   primary (green), secondary (light green), ghost, outline, danger
Sizes:      sm (32px h), md (40px h), lg (52px h)
States:     default, hover, active (scale-95), loading (spinner), disabled
```
**Brief:** Currently all use `rounded-xl`. Consider making `lg` buttons use `rounded-2xl` for a more premium feel on CTAs.

### Card
```
Background:  white
Radius:      rounded-2xl
Shadow:      card-shadow
Padding:     p-5 (20px) by default
```
**Brief:** Cards could benefit from a very subtle border (`border border-gray-100`) always visible, to distinguish them better from the `bg-gray-50` page background on low-contrast displays.

### Input
```
Border:       1px solid gray-200
Focus:        border-green-500, ring-2 ring-green-100
Radius:       rounded-xl
Height:       ~42px
```

### Progress Ring (Whoop-style)
SVG-based circular ring. Used on dashboard for recovery score.
```
Sizes:      100px (dashboard), 120px (default)
Stroke:     8–10px
Track:      gray-100
Fill:       dynamic colour (green=peak, amber=moderate, red=low)
Animation:  stroke-dashoffset 0.6s ease
```
**Brief:** The ring animation could be more dramatic on first load — consider an entrance animation that sweeps from 0 to the actual score over 1.2s.

### Macro Progress Bars
Horizontal bars for Protein / Carbs / Fat.
```
Height:   8px (h-2) or 10px (h-2.5)
Track:    gray-100
Fill:     green (protein), amber (carbs), red (fat)
Radius:   rounded-full
```

### Halal Badge
```
Style:    Small pill, green-50 bg, green-700 text, green-200 border
Icon:     ☽ crescent
Text:     "Halal"
```
**Brief:** Replace text crescent with a proper SVG crescent icon for crispness at small sizes.

### Social Auth Buttons
Three buttons — Google (white/border), Apple (black), Meta (Facebook blue `#1877F2`).
```
Height:     ~48px
Radius:     rounded-xl
Icon:       Brand SVGs inlined
```

---

## 4. Page-by-Page Design Spec

### 4.1 Landing Page
**File:** `src/pages/public/LandingPage.tsx`
**Layout:** Full-width, sections stacked vertically

| Section | Description | Design notes |
|---------|-------------|--------------|
| Navbar | Logo + nav links + CTA buttons | Sticky, `bg-white/90` blur. Consider adding a mobile hamburger menu |
| Hero | Headline, subline, 2 CTAs, mock dashboard | Background: `from-green-50 via-white to-green-50/30`. Headline font could go bigger on desktop (80px) |
| Mock dashboard | 4 metric cards + meal plan + AI chat preview | This is a key conversion asset — consider making it animated/interactive |
| Features grid | 6 feature cards, 3-col on desktop | Cards animate in on scroll (not yet implemented) |
| Testimonials | 3 UAE user quotes | Add profile photos / UAE flag indicators |
| Pricing teaser | Free/Pro/Elite cards | Pro card scales up (`scale-105`). Elite could be darker/more premium |
| CTA banner | Full-width green gradient | Solid, works well |
| Footer | Links, legal | Minimal. Could add UAE social media handles |

**Brief:** The hero mock dashboard is static HTML. It would be much more compelling as an animated demo — numbers counting up, progress bars filling, chat typing. This is the highest-ROI design improvement.

---

### 4.2 Login & Register Pages
**Files:** `src/pages/public/LoginPage.tsx`, `RegisterPage.tsx`
**Layout:** Centred card on green-tinted gradient background

| Element | Current | Potential improvement |
|---------|---------|----------------------|
| Background | `from-green-50 via-white to-green-50/30` gradient | Could add a subtle pattern or illustration |
| Card | White, `rounded-3xl`, `p-8` | Works well. Consider adding a thin green border |
| Social buttons | Google / Apple / Meta stacked | Could go 2-column (Google + Apple) with Meta below |
| Role selector | Two buttons (User / Trainer) | Could be a cleaner segmented control |
| Form | Standard email/password | Add password strength indicator on Register |

**Brief:** The auth pages are functional but minimal. For a premium feel, consider adding:
- A subtle illustration or pattern on the left half (split layout on desktop)
- An animated FitMind logo on load
- Micro-animations on the role selector toggle

---

### 4.3 Onboarding Flow
**File:** `src/pages/onboarding/OnboardingPage.tsx`
**Steps:** 6 steps (Goal → Body data → Allergies → Diet → Health conditions → Done)

| Step | UI pattern | Brief |
|------|-----------|-------|
| 1: Goal | List of clickable cards with emoji + label | Make the selected state more dramatic — fill with green, white text |
| 2: Body data | Sliders for height/weight + date input | Sliders look bare. Add custom styled thumbs and current value display |
| 3: Allergies | 2-col chip grid | Good. Could add a search/filter |
| 4: Diet | 2-col card grid with emoji | Add brief description under each type |
| 5: Health | Vertical list with checkmarks | Add the medical disclaimer more prominently |
| 6: Done | Completion screen with checklist | Add a confetti animation or animated checkmarks |

**Progress bar:** Dot + line stepper at top. Currently text-based step numbers. Brief: Replace with animated filled dots and connecting lines.

---

### 4.4 Dashboard
**File:** `src/pages/app/DashboardPage.tsx`
**Layout:** Scrollable feed, max-width 672px centred

| Component | Current design | Brief |
|-----------|---------------|-------|
| Header | Name greeting + date + Whoop sync button | Add avatar top-right → profile nav |
| Recovery ring card | Green gradient card, SVG ring, score text | The hero card. Make ring larger (120px), add a pulsing glow on high recovery |
| 4 metric cards | 2×2 grid, icon + number + sub-label | Good. Consider making them tappable to log/edit |
| Macro progress | Calorie bar + 3 macro bars | Add a remaining calorie pill badge |
| Today's workout banner | Dark gradient card | Works well. Add a quick difficulty chip |
| Meals list | Recipe thumbnail + name + macros | Good. Empty state needs illustration |
| AI Coach tip | Green gradient card, bot icon | The copy here is hardcoded — should rotate or come from Claude |

**Key brief:** The dashboard needs a clear visual hierarchy. Currently everything is similar weight. The recovery ring card should feel like the centrepiece. Everything else should feel secondary.

---

### 4.5 Nutrition Page
**File:** `src/pages/app/NutritionPage.tsx`
**Tabs:** Today / Meal Plan / Recipes

| Tab | Key components | Brief |
|-----|---------------|-------|
| Today | Donut chart + macro bars + water tracker + meal list | Donut is 110px — could be bigger (160px) on its own card |
| Meal Plan | 7-day list with emoji meals | Replace with a proper weekly calendar grid |
| Recipes | Filterable card grid | Add a search bar. Cards need more visual richness (larger image) |

**Recipe cards:** Currently image (96px wide) + text. Brief: Make cards full-width with image at top (180px tall), title and macros below. Pinterest-style grid on tablet.

---

### 4.6 Recipe Detail Page
**File:** `src/pages/app/RecipeDetailPage.tsx`
**Layout:** Full-screen, header image + scrollable content

| Section | Current | Brief |
|---------|---------|-------|
| Hero image | 224px tall, full-width | Increase to 280px. Add a gradient overlay at bottom for back button visibility |
| Title + badges | Name, Arabic name, halal badge, tags | Good. Tags are small pills — make them slightly larger |
| Quick stats | 3 cards (time / servings / calories) | Works well |
| Macros | 4-column grid | Add circular mini-rings per macro for visual interest |
| Ingredients | List with store badges | Store badges (Carrefour/Spinneys) use brand colours — great. Make them tappable links |
| Instructions | Numbered steps | Add step illustrations or icons. Could be a swipeable card stack |
| Log meal CTA | Full-width green button | Sticky at bottom of screen — currently at bottom of scroll |

**Key brief:** The log meal button should be a sticky bottom bar (like a native app), not at the end of the scroll. Users shouldn't have to scroll all the way down to log.

---

### 4.7 Workout Pages
**Files:** `src/pages/app/WorkoutPage.tsx`, `ActiveWorkoutPage.tsx`

**Workout Library cards:**

| Element | Current | Brief |
|---------|---------|-------|
| Card | White card, workout name + tags + exercise list | Add a colour accent strip on the left edge per workout type |
| Difficulty badge | Coloured pill | Good |
| Exercise preview | Bullet list, max 3 shown | Show tiny exercise icons/thumbnails |
| Start button | Full-width green | Consider a play icon instead of text |

**Active Workout:**

| Element | Current | Brief |
|---------|---------|-------|
| Timer | Large green number, tabular nums | Good. Add a pause button |
| Progress bar | Green fill in header | Works |
| Exercise accordion | Expand/collapse per exercise | The set logger inputs are minimal — add +/- buttons for mobile friendliness |
| Set row | Grid: # / reps / weight / done | Swipe-right-to-complete gesture would feel very native |
| Rest timer | Not implemented | Add an automatic rest countdown after marking a set done |
| Finish modal | Simple confirmation | Add workout summary (volume, PRs, duration) before saving |

---

### 4.8 Progress Page
**File:** `src/pages/app/ProgressPage.tsx`

| Element | Current | Brief |
|---------|---------|-------|
| Period selector | 4 pill buttons (7D/30D/90D/180D) | Good |
| Metric tabs | Horizontal scroll chips | Currently monochrome — colour each chip to match the metric line colour |
| Area chart | Recharts, gradient fill | Increase chart height to 220px. Add min/max annotation lines |
| Summary cards | 3 cards: weight / check-ins / sleep | Add a trend arrow animation |
| Recovery trend | Line chart, 14-day | Move this into the metric tabs rather than always showing |
| Photo comparison | Not implemented (UI placeholder) | High priority — add before/after photo upload and side-by-side view |
| AI Insight | Not implemented | "Generate Insights" button for Elite users → Claude analysis |

---

### 4.9 AI Chat Page
**File:** `src/pages/app/ChatPage.tsx`

| Element | Current | Brief |
|---------|---------|-------|
| Header | Bot icon + "AI Health Coach" title + chat count | Add a status pill ("Online" with green dot) |
| Quick prompt chips | 2-col grid of 8 preset questions | Increase to 3-col. Add a "More suggestions" expand |
| Message bubbles | User: right-aligned green. Assistant: left-aligned white | Good. Add subtle entrance animation (slide-up + fade) per message |
| Streaming indicator | Blinking cursor in bubble | Also add the typing dots animation before first token arrives |
| Input | Textarea + send button | Add a microphone button placeholder. Auto-resize works well |
| Session list | Toggle to show past sessions | Currently shows session count only — make it a proper slide-down panel |

**Empty state brief:** The empty state (before any messages) is good — bot icon + description + quick prompts. The quick prompts grid is the most important element here. Make each chip feel clickable and satisfying.

---

### 4.10 Subscription Page
**File:** `src/pages/app/SubscriptionPage.tsx`

| Element | Current | Brief |
|---------|---------|-------|
| Billing toggle | Monthly/Annual with 15% saving | Works well |
| Plan cards | Vertical stack, Pro highlighted with scale-105 | On desktop: 3-column horizontal. On mobile: swipeable cards |
| Feature list | Checkmark list per card | Good |
| Comparison table | Full table at bottom | Add sticky column headers when scrolling |
| Pro badge | "Most Popular" green badge | Works |
| Elite card | Amber accent | Make it feel more premium — dark background option? |

**Brief:** The pricing page needs a trust section above the plans: "Join X users", logos of UAE companies whose employees use FitMind, a security badge (Telr certified). This directly increases conversion.

---

### 4.11 Trainer Portal
**Files:** `src/pages/trainer/TrainerDashboardPage.tsx`, `ClientDetailPage.tsx`

| Element | Current | Brief |
|---------|---------|-------|
| Trainer dashboard | Stats + AI insight + client list | Add a revenue/billing section for trainer subscriptions |
| Client list | Card with progress bar | Add last activity status indicator (green=active today, amber=yesterday, red=3+ days) |
| Client detail tabs | Overview / Nutrition / Workouts / Progress | Add a "Messages" tab for trainer-client direct messaging |
| Workout upload | Modal with file drop zone | The file upload is a placeholder. Needs a full workout builder: add exercises, sets, reps |
| AI insight | Static text | Should pull real client data and generate via Claude |

---

### 4.12 Whoop Integration Page
**File:** `src/pages/app/WhoopConnectPage.tsx`

| Element | Current | Brief |
|---------|---------|-------|
| Connect state | Feature list + Connect button | Add an animated Whoop logo on load |
| Connected state | Live metric rows + sync button | Add sparkline mini-charts per metric |
| Recent workouts | List with sport name + strain | Add sport icon per activity type |
| Disconnect | Subtle gray button at bottom | Good placement |

---

## 5. Navigation

### Mobile Bottom Nav (5 items)
```
Home (LayoutDashboard) → /app/dashboard
Nutrition (Utensils)   → /app/nutrition
Workouts (Dumbbell)    → /app/workout
Progress (TrendingUp)  → /app/progress
AI Coach (MessageCircle) → /app/chat
```
**Brief:** The active tab uses a colour change only. Consider adding:
- A filled vs outline icon variant for active/inactive
- A small dot indicator for unread AI messages
- A subtle background pill behind the active icon

### Desktop Sidebar
```
Width:      256px (w-64)
Style:      White, right border
Logo:       Top section
Nav items:  Icon + label, rounded-xl active bg
Profile:    Bottom section
```
**Brief:** The sidebar is functional but plain. Consider:
- Adding user avatar + name at the bottom above profile link
- Collapsible to icon-only mode
- A subtle gradient or pattern at the sidebar top

---

## 6. Motion & Animation

**Current state:** Mostly Tailwind transition utilities. No entrance animations.

**Recommended additions:**
```
Page transitions:    Fade + slight slide-up (150ms ease-out)
Card entrances:      Stagger fade-up on dashboard load
Progress ring:       Sweep from 0 → value on mount (1.2s)
Metric numbers:      Count up animation on first render
Chat messages:       Slide-up + fade-in per bubble
Button press:        active:scale-95 (already implemented)
Tab switches:        Slide content left/right
```
Framer Motion is already installed. Use `motion.div` with `initial={{ opacity: 0, y: 8 }}` and `animate={{ opacity: 1, y: 0 }}`.

---

## 7. Responsive Breakpoints

```
Mobile:   < 640px  (sm) — single column, bottom nav
Tablet:   640–1024px     — wider cards, some 2-col grids
Desktop:  > 1024px (lg)  — sidebar visible, max-w-2xl content
```

**Currently unoptimised for tablet:** At ~768px the layout is neither mobile nor desktop. The bottom nav disappears but the sidebar isn't wide enough. Brief: At `md` (768px), switch to a narrow icon-only sidebar (64px wide) with tooltip labels.

---

## 8. Accessibility Notes

| Area | Status | Action needed |
|------|--------|---------------|
| Colour contrast | ⚠️ Partial | `green-400` on white is borderline (4.1:1). Use `green-600` for interactive text |
| Focus rings | ⚠️ Missing | Add `focus-visible:ring-2 focus-visible:ring-green-500` to all interactive elements |
| ARIA labels | ⚠️ Partial | Icon-only buttons need `aria-label`. ProgressRing needs `role="img"` |
| Screen reader | ❌ Not tested | Test with VoiceOver (iOS) — primary UAE screen reader |
| RTL Arabic | ⚠️ Partial | `dir="auto"` on display names. Full RTL layout not yet implemented |

---

## 9. Dark Mode

**Status:** Not implemented. `darkMode: 'class'` is in Tailwind config.

**Brief:** The toggle is on the Profile page (not yet wired). When implementing:
- Background: `#0f1117` (not pure black)
- Cards: `#1a1f2e`
- Green primary stays `#52a07c` (slightly lighter at `#5db88a` for dark mode contrast)
- All `text-gray-900` → `text-white`, `text-gray-500` → `text-gray-400`

---

## 10. Design Files Needed

To fully hand off to a visual designer, the following assets are missing:

| Asset | Priority | Notes |
|-------|----------|-------|
| FitMind logomark | 🔴 High | SVG icon to replace `FM` text. Needed for PWA icons, favicon, splash screen |
| PWA icons | 🔴 High | 192×192 and 512×512 PNG. Currently placeholders |
| Apple touch icon | 🔴 High | 180×180 PNG with safe-zone padding |
| Splash screen | 🟡 Medium | For iOS PWA launch — 2048×2732px |
| OG image | 🟡 Medium | 1200×630px for social sharing |
| Empty state illustrations | 🟡 Medium | For empty meal log, empty workout history, empty progress |
| Onboarding illustrations | 🟠 Low | One per step to make onboarding feel premium |
| Recipe placeholder | 🟠 Low | Fallback when recipe has no image |

---

## 11. How to Share with Claude for Design Changes

Paste this into your message to Claude along with specific instructions:

```
I'm working on FitMind, an AI health & fitness PWA for the UAE market.
The design spec is in FITMIND_DESIGN.md.
The codebase is React + TypeScript + Tailwind CSS v4.
Primary colour: #52a07c (sage green). Font: Inter.

[Your specific request here]

For example:
- "Redesign the Dashboard recovery ring card to feel more premium"
- "Improve the Recipe card component in src/pages/app/NutritionPage.tsx"
- "Add a page transition animation to all app routes"
- "Make the onboarding step indicator more visually engaging"
- "Dark mode implementation starting with the Dashboard page"
```

---

*Generated from FitMind codebase · May 2026*
