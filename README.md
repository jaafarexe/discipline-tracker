# Discipline Tracker

A personal 90-day discipline challenge tracker: daily rule scoring, study-curriculum progress, training and nutrition logging, and sleep-cycle planning — all in one Arabic RTL dashboard that runs entirely in the browser.

## Features

- **90-day challenge dashboard** — Day counter and overall progress for a fixed 90-day challenge window.
- **Daily rule scoring** — Seven daily rules (wake-up time, deep study, workout, diet adherence, on-time sleep, distraction detox, end-of-day report) worth 10 points per day, with a full per-day score history.
- **Curriculum tracker** — Study subjects with per-subject task totals and completion progress.
- **Training log** — A weekly Push / Pull / Legs split with editable exercises, plus a weekly weigh-in log and a clean-bulk progress bar toward a target weight.
- **Nutrition log** — Daily calorie and protein targets, per-day food logging, and staple-food calorie estimates.
- **Sleep tools** — Sleep logging plus a 90-minute sleep-cycle calculator that works backwards from a fixed wake-up time.
- **Social & wellbeing** — A contacts/commitments tracker and a daily mood log.
- **Zero backend** — All state persists locally in the browser via `localStorage`; no account or server required.
- **Arabic-first RTL interface** with share support via the Web Share API.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Motion, Lucide icons
- Browser `localStorage` persistence

## Getting Started

**Prerequisites:** Node.js 18+

1. Clone the repository:
   ```bash
   git clone <your-fork-url> discipline-tracker
   cd discipline-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

To personalize the tracker, edit the example constants in `src/utils/challenge.ts` (challenge start/end dates, curriculum subjects) and the nutrition/weight targets in the Gym and Nutrition sections.

## Project Structure

```
src/
  components/   MainDashboard, DayCounterSection, DailyPointsSection,
                CurriculumSection, GymSection, NutritionSection,
                SleepSection, SleepCalculatorSection, SocialSection,
                WellbeingSection, Header
  utils/        challenge.ts (rules, curriculum, progress math),
                sleep.ts (sleep-cycle math), share.ts (Web Share helper)
  types.ts      Domain model
```

## License

MIT — see [LICENSE](LICENSE).
