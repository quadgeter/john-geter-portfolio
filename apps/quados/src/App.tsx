import { useMessageBus } from "./hooks/useMessageBus";
import { Desktop } from "./components/os/Desktop";

function App() {
  useMessageBus();
  return <Desktop />;
}

export default App;
