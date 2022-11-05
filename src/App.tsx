import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { RootState } from "./store";
import { confirmAlertModal } from "./utils/confirmAlert";

function App() {
  const auth = useSelector((state: RootState) => state.auth);


  return auth.id ? (
    <HomePage />
  ) : <LoginPage />;
}

export default App;
