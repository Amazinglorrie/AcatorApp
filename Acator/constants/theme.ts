import { ProjectColor } from "./types";

// ── Raw color palette (used by components that reference Colors directly) ──────

export const Colors = {
  blue: "#378ADD",
  amber: "#BA7517",
  green: "#639922",
  red: "#E24B4A",
  purple: "#7F77DD",
  teal: "#1D9E75",

  badgeBg: {
    blue: "#E6F1FB",
    amber: "#FAEEDA",
    green: "#EAF3DE",
    red: "#FCEBEB",
    purple: "#EEEDFE",
    teal: "#E1F5EE",
  },
  badgeText: {
    blue: "#0C447C",
    amber: "#633806",
    green: "#27500A",
    red: "#791F1F",
    purple: "#3C3489",
    teal: "#085041",
  },

  background: "#F2F2F7",
  card: "#FFFFFF",
  label: "#6E6E73",
  separator: "rgba(0,0,0,0.1)",
  accent: "#007AFF",
  destructive: "#FF3B30",
  warning: "#FF9500",
  success: "#34C759",
  textPrimary: "#1A1A1A",
  textSecondary: "#6E6E73",
  textTertiary: "#AEAEB2",
};

// ── Theme object — single source of truth for auth screens & new components ───

export const theme = {
  colors: {
    // Backgrounds
    bg: "#F2F2F7", // light screen background
    card: "#FFFFFF", // white cards, modals
    overlay: "rgba(255,255,255,0.18)", // frosted input backgrounds on teal screens

    // Text
    text: "#1A1A1A", // primary text
    muted: "#6E6E73", // secondary / muted text
    textOnTeal: "#ffffff", // white text on teal backgrounds
    textOnTealMuted: "rgba(255,255,255,0.75)", // subtitles on teal
    textOnTealFaint: "rgba(255,255,255,0.7)", // links/cancel on teal
    placeholderOnTeal: "rgba(255,255,255,0.4)", // input placeholders on teal

    // Brand
    primary: "#1D9E75", // teal — main brand color (same as Colors.teal)
    border: "#E5E7EB", // light borders

    // Status
    error: "#E24B4A", // same as Colors.red
    success: "#1D9E75", // reuses teal for success states
  },

  spacing: {
    screen: 28, // horizontal padding on all screens
    card: 24, // inner padding for white cards
    gap: 12, // vertical gap between stacked elements
    inputH: 48, // fixed height for all text inputs
  },

  radius: {
    card: 16, // white cards / modals
    input: 10, // text inputs and buttons
    pill: 45, // circular icon containers
  },

  icon: {
    circleSize: 90,
    circleBg: "rgba(255,255,255,0.15)",
  },

  typography: {
    title: { fontSize: 24, fontWeight: "700" as const },
    subtitle: { fontSize: 15, lineHeight: 22 },
    label: { fontSize: 13, fontWeight: "500" as const },
    body: { fontSize: 14, lineHeight: 20 },
    button: { fontSize: 15, fontWeight: "600" as const },
    link: { fontSize: 14 },
  },
} as const;

export type Theme = typeof theme;

// ── Project helpers (unchanged) ───────────────────────────────────────────────

export const colorBarFill: Record<ProjectColor, string> = {
  blue: Colors.blue,
  amber: Colors.amber,
  green: Colors.green,
  red: Colors.red,
  purple: Colors.purple,
  teal: Colors.teal,
};

export const PROJECT_SUBJECTS = [
  "Science",
  "Mathematics",
  "Humanities",
  "Computer Science",
  "English",
  "Art",
  "History",
  "Geography",
  "Languages",
  "Physical Education",
  "Other",
];

export const PROJECT_COLORS: ProjectColor[] = [
  "blue",
  "amber",
  "green",
  "red",
  "purple",
  "teal",
];
