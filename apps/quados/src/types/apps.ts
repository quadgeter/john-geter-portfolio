import type { AppId } from "./os";

export interface AppDefinition {
  id: AppId;
  name: string;
  iconSrc: string;
  defaultSize: { width: number; height: number };
  component: React.ComponentType;
}
