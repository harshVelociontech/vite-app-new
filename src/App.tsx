import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth.js";
import TaskManager from "./components/task-manager.js";
import supabase  from "./supabaseClient/index.js";
import PrivateRoute from "./components/PrivateRoute.js";
import { Session } from "@supabase/supabase-js";

// Helper type for your "users" table response
type UserRoleResponse = {
  role: string;
};

// --- Main AppWrapper component ---
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

// --- Main App Component ---
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);

  // Fetch session and user role from Supabase
  const fetchSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    let sessionData = data?.session ?? null;

    if (sessionData && sessionData.user?.id) {
      const { data: userData, error: userError } = await supabase
        .from<UserRoleResponse>("users")
        .select("role")
        .eq("auth_uid", sessionData.user.id)
        .single();

      if (!userError && userData) {
        sessionData = {
          ...sessionData,
          user: {
            ...sessionData.user,
            app_metadata: {
              ...(sessionData.user.app_metadata || {}),
              role: userData.role,
            },
          },
        };
      }
    }
    setSession(sessionData);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, sessionValue) => {
        setSession(sessionValue);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session && location.pathname !== "/tasks") {
      navigate("/tasks", { replace: true });
    }
  }, [session, location.pathname, navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {session && <button onClick={logout}>Log Out</button>}
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute session={session} allowedRoles={["user"]}>
              <TaskManager session={session} />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
      </Routes>
    </>
  );
}

export default AppWrapper;
