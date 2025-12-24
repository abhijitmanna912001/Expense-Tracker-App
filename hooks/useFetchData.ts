import { firestore } from "@/config/firebase";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const useFetchData = <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const constraintsString = JSON.stringify(constraints);

  useEffect(() => {
    if (!collectionName || constraints.length === 0) {
      setLoading(false);
      return;
    }

    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setData(fetchedData);
        setLoading(false);
      },
      (err) => {
        console.log("error while fetching data", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, constraints, constraintsString]);

  return { data, loading, error };
};

export default useFetchData;

const styles = StyleSheet.create({});
