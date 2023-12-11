import React from "react";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import socketIO from "socket.io-client";
import { useToast } from "@chakra-ui/react";
import Dashboard from "./Dashboard.js";
import PrivateRoute from "./config/auth/privateRoute.js";
const socket = socketIO.connect("http://localhost:4000");
function App() {
  const [schedules, setSchedules] = useState([]);
  const toast = useToast({
    containerStyle: {
      width: "500px",
      maxWidth: "100%",
    },
  });
  const toastIdRef = useRef();
  useEffect(() => {
    socket.on("sendSchedules", (schedules) => {
      console.log(schedules);
      setSchedules(schedules);
    });

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
  }, []);

  return (
    <Router className="flex h-screen">
      <Navbar socket={socket} schedules={schedules} />
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
