import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await updateUserData(firebaseUser.uid);
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });

    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      return { success: false, msg };
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(response.user, {
          displayName: name,
        });

        await setDoc(doc(firestore, "users", response.user.uid), {
          email,
          name,
          uid: response.user.uid,
        });

        return { success: true };
      } catch (error: any) {
        return { success: false, msg: error.message };
      }
    },
    []
  );

  const updateUserData = useCallback(async (uid: string) => {
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      setUser({
        uid: data.uid,
        email: data.email || null,
        name: data.name || null,
        image: data.image || null,
      });
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      login,
      register,
      updateUserData,
    }),
    [user, login, register, updateUserData]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
