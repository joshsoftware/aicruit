"use client";

import { primaryFont } from "@/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header
      className={cn(
        "flex justify-between items-center bg-[#F4F3FF] sticky top-0",
        primaryFont.className
      )}
    >
      <div className="container flex items-center justify-between py-3 ml-8 relative">
        <Link href={"/"} className="text-4xl text-black">
          AiCruit
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src={"/JoshDarkLogo.svg"}
            className="self-center"
            width={131}
            height={29}
            alt="Josh Logo"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
