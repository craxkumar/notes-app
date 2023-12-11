import React from "react";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import socketIO from "socket.io-client";
import { useToast } from "@chakra-ui/react";
import Dashboard from "./Dashboard.js";
import PrivateRoute from "./config/auth/privateRoute.js";
import { useAuth } from "react-oidc-context";

const socket = socketIO.connect(process.env.REACT_APP_API_BASE_URL);
function App() {
  const auth = useAuth();
  const [schedules, setSchedules] = useState([]);
  const toast = useToast({
    containerStyle: {
      width: "500px",
      maxWidth: "100%",
    },
  });
  const toastIdRef = useRef();

  useEffect(() => {
    // Define the MongoDB endpoint URL (replace with your actual endpoint)
    const token = auth?.user?.access_token;
    if (token) {
      fetch(process.env.REACT_APP_API_BASE_URL + "/api/reminders", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((result) => result.json())
        .then((result) => {
          setSchedules(result);
        })
        .catch((error) => console.error(error));
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    socket.on("notification", (data) => {
      toast.close(toastIdRef.current);
      toastIdRef.current = toast({
        title: `Time for ${data.title}`,
        status: "success",
        duration: 5000,
        variant: "left-accent",
        isClosable: true,
      });
    });
  });

  return (
    <Router className="flex h-screen">
      <Navbar
        socket={socket}
        schedules={schedules}
        setSchedules={setSchedules}
      />
      <Switch>
        <Route exact path="/dashboard">
          <PrivateRoute>
            <Dashboard schedules={schedules} />
          </PrivateRoute>
        </Route>
        {/* <Route exact path="/profile"> */}
        {/* <Profile /> */}
        {/* </Route> */}
      </Switch>
    </Router>
  );
}

export default App;
