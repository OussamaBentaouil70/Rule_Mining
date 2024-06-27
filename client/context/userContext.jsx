import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(true);
      axios.get("/api/profile/").then(({ data }) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setLoading(false);
      }).catch(() => setLoading(false));
    }

    // Set up Axios interceptors
    const requestInterceptor = axios.interceptors.request.use((config) => {
      setLoading(true);
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  const logout = () => {
    setUser(null);
    axios
      .post("/api/logout/")
      .then(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("chatMessages");
        localStorage.removeItem("uploadedFiles");
        navigate("/login");
      })
      .catch((error) => console.error("Logout failed", error));
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
}
