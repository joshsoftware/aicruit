import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_USER_DATA, PUBLIC_ROUTES } from "@/constants/constants";
import { clearCookie, fetchCookie } from "@/utils/cookies";

const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (PUBLIC_ROUTES.includes(pathname)) {
        clearCookie(AUTH_USER_DATA);
        setIsAuthorized(true);
        return;
      }

      const data = fetchCookie(AUTH_USER_DATA);

      if (!data) {
        router.push("/");
        return;
      }

      try {
        const userData = JSON.parse(data as string);
        if (userData.token) {
          setIsAuthorized(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error parsing cookie data:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (!isAuthorized && !PUBLIC_ROUTES.includes(pathname)) return null;

  return <div>{children}</div>;
};

export default RouterProvider;
