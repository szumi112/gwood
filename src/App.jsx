import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LoginSignUp from "./login-signup/login-signup-form";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/dashbord";
import { database, db } from "./firebase-config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import LoginPlease from "./not-found/login-please";
import Admin from "./admin/admin";
import { useUser } from "./user-context";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const { userInfo, setUserInfo } = useUser();
  const [users, setUsers] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [userExists, setUserExists] = useState();
  const usersColRef = collection(db, "users");

  const currentUTCDate = new Date();

  const warsawTimeOffset = 0;
  const currentWarsawTime = new Date(
    currentUTCDate.getTime() + warsawTimeOffset * 60 * 60 * 1000
  );

  const warsawTimeFormatted = currentWarsawTime.toISOString();

  useEffect(() => {
    onAuthStateChanged(database, (user) => {
      if (user) {
        setIsAuth(true);
        setUserInfo(user.email);
      } else {
        setIsAuth(false);
        setUserInfo(null);
      }
    });
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersColRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setHasRun(true);
    };
    getUsers();
  }, [isAuth]);

  useEffect(() => {
    const createUser = async () => {
      let emailExists;

      if (users.length > 0) {
        const uniqueEmails = new Set(users.map((user) => user?.email));

        emailExists = uniqueEmails.has(userInfo);
        setUserExists(emailExists);
      }

      const usersQuery = query(usersColRef, where("email", "==", userInfo));
      const querySnapshot = await getDocs(usersQuery);

      if (!emailExists) {
        await addDoc(collection(db, "users"), {
          email: userInfo,
          logTime: [warsawTimeFormatted],
        });
      } else {
        const docId = querySnapshot.docs[0].id;
        const userDocRef = doc(collection(db, "users"), docId);

        const currentLogTime = (await getDoc(userDocRef)).data()?.logTime || [];
        const mostRecentDateString = currentLogTime[currentLogTime.length - 1];

        if (!mostRecentDateString) {
          return;
        }

        const mostRecentDate = new Date(mostRecentDateString);
        const timeDifference = mostRecentDate.getTime() - new Date().getTime();

        if (
          3600000 - timeDifference >=
          600000
          // 5000
        ) {
          const updatedLogTime = [...currentLogTime, warsawTimeFormatted];

          await updateDoc(userDocRef, { logTime: updatedLogTime });
        }
      }
    };

    setTimeout(() => {
      if (userInfo) {
        createUser();
      }
    }, 3000);
  }, [hasRun]);

  return (
    <Box>
      <Box>
        <Routes>
          <Route path="/" element={<LoginSignUp setIsAuth={setIsAuth} />} />
          {isAuth ? (
            <Route path="/dashboard" element={<Dashboard />} />
          ) : (
            <Route path="/dashboard" element={<LoginPlease />} />
          )}
          {isAuth &&
          [
            "test1@test1.com",
            "suzanna.k@kcharles.co.uk",
            "peter@kcharles.co.uk",
            "klaudia@kcharles.co.uk",
            "julia.w@kcharles.co.uk",
          ].includes(userInfo) ? (
            <Route path="/admin" element={<Admin />} />
          ) : (
            <Route path="/admin" element={<LoginPlease />} />
          )}
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
