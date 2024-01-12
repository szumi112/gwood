import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase-config/firebase-config";

const LoadContext = createContext();

export const useLoadContext = () => {
  return useContext(LoadContext);
};

export const LoadContextProvider = ({ children }) => {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const loadCollectionRef = collection(db, "loads");
      const querySnapshot = await getDocs(loadCollectionRef);
      const loadData = [];
      querySnapshot.forEach((doc) => {
        loadData.push({ ...doc.data(), id: doc.id });
      });
      setLoads(loadData);
    };

    fetchData();

    return () => {};
  }, []);

  const addLoad = async (newLoadData) => {
    try {
      const loadsCollection = collection(db, "loads");
      await addDoc(loadsCollection, { formData: newLoadData });

      const querySnapshot = await getDocs(loadsCollection);
      const updatedLoadData = [];
      querySnapshot.forEach((doc) => {
        updatedLoadData.push({ ...doc.data(), id: doc.id });
      });
      setLoads(updatedLoadData);
    } catch (error) {
      console.error("Error adding load:", error);
    }
  };

  const deleteLoadContext = (loadId) => {
    setLoads((prevLoads) => prevLoads.filter((load) => load.id !== loadId));
  };

  return (
    <LoadContext.Provider
      value={{ loads, addLoad, deleteLoadContext, setLoads }}
    >
      {children}
    </LoadContext.Provider>
  );
};
