import type { AppDefinition } from "../types/apps";
import { DEFAULT_WINDOW_SIZES } from "./layout";

const Placeholder: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ padding: 12 }}>{name}</div>
);

export const APP_REGISTRY: AppDefinition[] = [
  {
    id: "showcase",
    name: "My Showcase",
    iconSrc: "/icons/showcase.png",
    defaultSize: DEFAULT_WINDOW_SIZES.showcase,
    component: () => <Placeholder name="Showcase" />,
  },
  {
    id: "calculator",
    name: "Calculator",
    iconSrc: "/icons/calculator.png",
    defaultSize: DEFAULT_WINDOW_SIZES.calculator,
    component: () => <Placeholder name="Calculator" />,
  },
  {
    id: "mp3",
    name: "MP3 Player",
    iconSrc: "/icons/mp3.png",
    defaultSize: DEFAULT_WINDOW_SIZES.mp3,
    component: () => <Placeholder name="MP3 Player" />,
  },
  {
    id: "notepad",
    name: "Notepad",
    iconSrc: "/icons/notepad.png",
    defaultSize: DEFAULT_WINDOW_SIZES.notepad,
    component: () => <Placeholder name="Notepad" />,
  },
  {
    id: "credits",
    name: "Credits",
    iconSrc: "/icons/credits.png",
    defaultSize: DEFAULT_WINDOW_SIZES.credits,
    component: () => <Placeholder name="Credits" />,
  },
];

export const APP_MAP = Object.fromEntries(
  APP_REGISTRY.map((app) => [app.id, app]),
) as Record<string, AppDefinition>;
