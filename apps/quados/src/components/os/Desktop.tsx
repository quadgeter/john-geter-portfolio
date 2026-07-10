import { useOsStore } from "../../store/useOsStore";
import { APP_REGISTRY, APP_MAP } from "../../constants/apps";
import { MenuBar } from "./MenuBar";
import { BootScreen } from "./BootScreen";
import { DesktopShortcut } from "./DesktopShortcut";
import { Window } from "./Window";
import { Dock } from "./Dock";
import styles from "./Desktop.module.css";

export function Desktop() {
  const osState = useOsStore((s) => s.osState);
  const windows = useOsStore((s) => s.windows);

  if (osState === "off" || osState === "sleep") return null;

  if (osState === "booting") return <BootScreen />;

  return (
    <div className={styles.desktop}>
      <MenuBar />
      <div className={styles.desktopArea}>
        <div className={styles.shortcutGrid}>
          {APP_REGISTRY.map((app) => (
            <DesktopShortcut
              key={app.id}
              appId={app.id}
              name={app.name}
              iconSrc={app.iconSrc}
            />
          ))}
        </div>
        {windows.map((win) => {
          const appDef = APP_MAP[win.appId];
          if (!appDef) return null;
          const AppComponent = appDef.component;
          return (
            <Window key={win.id} window={win}>
              <AppComponent />
            </Window>
          );
        })}
      </div>
      <Dock />
    </div>
  );
}

export default Desktop;
