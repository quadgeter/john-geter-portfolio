export type OsState = "off" | "booting" | "on" | "sleep";

export type AppId = "showcase" | "calculator" | "mp3" | "notepad" | "credits";

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface OSWindow {
  id: string;
  appId: AppId;
  title: string;
  position: WindowPosition;
  size: WindowSize;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  preMaxPosition?: WindowPosition;
  preMaxSize?: WindowSize;
}
