"use client";

import { BrowserRoute } from "@/constants/route";
import { primaryFont } from "@/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetAuth } from "@/redux/authSlice";
import useAuthUser from "@/hooks/useAuthUser";
import { AUTH_USER_COOKIE } from "@/constants/constants";
import { clearCookie } from "@/utils/cookies";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    clearCookie(AUTH_USER_COOKIE);
    router.push("/");
    dispatch(resetAuth());
  };
  const user = useAuthUser();

  return (
    <header
      className={cn(
        "flex justify-center items-center bg-[#F4F3FF] sticky top-0",
        primaryFont.className
      )}
    >
      <div className="container flex items-center justify-between py-3 relative">
        <Link href={BrowserRoute.Home} className="text-4xl text-black">
          AiCruit
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src={"/josh-logo.svg"}
            className="self-center"
            width={131}
            height={29}
            alt="Josh Logo"
          />
        </div>
        {user && <Button onClick={handleLogout}>Logout</Button>}
      </div>
    </header>
  );
};

export default Header;
