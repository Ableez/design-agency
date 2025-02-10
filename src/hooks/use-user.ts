"use client";

import { authClient } from "#/lib/auth-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
}

interface SessionResponse {
  data: {
    session: Session;
    user: User;
  };
  error: null;
}

/**
 * @deprecated This hook is deprecated and do not use.
 */
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [cookies, setCookie] = useCookies(["user", "userCreationTime"]);
  const isFetchingRef = useRef(false);

  const fetchUser = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const sessionResponse =
        (await authClient.getSession()) as unknown as SessionResponse;
      const userData = sessionResponse.data?.user;
      const sessionData = sessionResponse.data?.session;

      if (userData) {
        const userDataString = JSON.stringify(userData);
        // Only update cookie if data changes
        if (cookies.user !== userDataString) {
          setCookie("user", userDataString, { path: "/" });
        }
        // Always update validation timestamp
        setCookie("userCreationTime", new Date().toISOString(), { path: "/" });
        setUser(userData);
      }
      if (sessionData) setSession(sessionData);
      return { user: userData, session: sessionData };
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return { user: null, session: null };
    } finally {
      isFetchingRef.current = false;
    }
  }, [setCookie, cookies.user]);

  useEffect(() => {
    const storedUser = cookies.user as string;
    const userCreationTime = cookies.userCreationTime as string;

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as unknown as User;
        setUser(parsedUser);

        // Revalidate if data is older than 1 minute
        const isStale =
          Date.now() - new Date(userCreationTime).getTime() > 60000;
        if (isStale) void fetchUser();
      } catch (error) {
        console.error(
          "Error parsing user from cookies or revalidating:",
          error,
        );
        void fetchUser();
      }
    } else {
      void fetchUser();
    }
  }, [cookies.user, cookies.userCreationTime, fetchUser]);

  return { user, session };
};
