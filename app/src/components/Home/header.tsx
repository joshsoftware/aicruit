"use client";

import { useRouter } from "next/navigation";
import { BrowserRoute } from "@/constants/route";
import { primaryFont } from "@/fonts";
import useAuthUser from "@/hooks/useAuthUser";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { logout } from "@/utils/helpers";

const Header = () => {
  const router = useRouter();
  const user = useAuthUser();

  const handleLogoutClick = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={cn(
        "flex justify-between items-center bg-[#F4F3FF] sticky top-0",
        primaryFont.className
      )}
    >
      <div className="container flex items-center justify-between py-3 ml-8 relative">
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
        {user && <Button onClick={handleLogoutClick}>Logout</Button>}
      </div>
    </header>
  );
};

export default Header;
