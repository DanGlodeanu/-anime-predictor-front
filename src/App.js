import { useState, createContext, useMemo, useEffect, } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import axios from "axios";
import { API_URL, } from "./utils/constants.js"
import Login from "./pages/Login.js"
import Logout from "./pages/Logout.js"
import AddUser from "./pages/AddUser.js"
import UserRecommendation from "./pages/UserRecommendation.js"
import ColdStart from "./pages/ColdStart.js"
import NotFound from "./pages/NotFound.js"
import Header from "./components/Header.js"
import EditAccount from "./pages/EditAccount.js";
import Courses from "./pages/Courses.js";
import AddCourse from "./pages/AddCourse.js";
import EditCourse from "./pages/EditCourse.js";
import Qr from "./pages/Qr.js";
import QrScan from "./pages/QrScan.js";
import Statistics from "./pages/Statistics.js";
import Recommendation from "./pages/Recommendation.js";

export const UserContext = createContext({
  user: {
    firstname: '',
    lastname: '',
    group: '',
    email: '',
    type: -1,
  },
  updateUser: () => {},
});

function App() {
  const [user, updateUser] = useState({
    firstname: '',
    lastname: '',
    group: '',
    email: '',
    type: 2,
  });
  const value = useMemo(
    () => ({ user, updateUser }), 
    [user]
  );

  const _getElementWithHeader = component => {
    return (
      <>
        <Header />
        { component }
      </>
    )
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios.get(API_URL + "/auto_login/",
          {
            headers: {
              Authorization: `Bearer ${ localStorage.getItem("token") }`
          },
      })
      .then(res => {
          if (res?.data?.error) {
              console.log(res?.data?.error);
          } else {
              updateUser(res.data);
          }
      })
      .catch(err => console.log(err))
    }
  }, [])

  return (
    <UserContext.Provider value={value}>
      <Router>
        <Routes>
          <Route path="/user-recommendation" element={ _getElementWithHeader(<UserRecommendation />) } />
          <Route path="/cold-start" element={ _getElementWithHeader(<ColdStart />) } />
          <Route path="*" element={ _getElementWithHeader(<NotFound />) } />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
