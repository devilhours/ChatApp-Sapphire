import { createContext, useContext, useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import io from "socket.io-client";

// Create the context
const SocketContext = createContext();

// Create a custom hook for easy access to the context
export const useSocket = () => {
  return useContext(SocketContext);
};

// Create the provider component
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser, setOnlineUsers } = useAuthStore();

  useEffect(() => {
    // This effect runs when the user's authentication status changes
    if (authUser) {
      // Connect to the backend socket server
      // We pass the logged-in user's ID as a query parameter
      const newSocket = io("https://chatapp-backend-4jwx.onrender.com", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      // Listen for the 'getOnlineUsers' event from the server
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users); // Update the global state with the list of online users
      });

      // Cleanup function: this runs when the user logs out or the component unmounts
      return () => newSocket.close();
    } else {
      // If there's no authenticated user, close any existing socket connection
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // The dependency array ensures this effect re-runs only when authUser changes
  }, [authUser, setOnlineUsers]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
