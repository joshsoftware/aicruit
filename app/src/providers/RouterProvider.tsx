import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PUBLIC_ROUTES } from "@/constants/constants";
import Cookies from "@/utils/cookies";

const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (PUBLIC_ROUTES.includes(pathname)) {
        setAuthorized(true);
        return;
      }

      const data = Cookies.getItem(Cookies.AUTH_USER_DATA);

      if (!data) {
        router.push("/");
        return;
      }

      try {
        const userData = JSON.parse(data as string);
        if (userData.token) {
          setAuthorized(true);
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

  if (!authorized && !PUBLIC_ROUTES.includes(pathname)) return null;

  return <div>{children}</div>;
};

export default RouterProvider;
