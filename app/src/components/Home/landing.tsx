import { primaryFont, secondaryFont } from "@/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ValidationMessage } from "@/constants/messages";
import { BrowserRoute } from "@/constants/route";
import { buttonVariants } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="flex flex-col md:flex-row w-full h-full justify-between gap-4 pt-16 px-8">
      <div className="w-full flex flex-col mt-24 gap-3 justify-center items-start">
        <h1 className={cn(primaryFont.className, "text-4xl text-purple-dark")}>
          AiCruit
        </h1>
        <h1 className={cn(primaryFont.className, "text-4xl mt-2")}>
          AI-POWERED RECRUITMENT SYSTEM
        </h1>
        <p className={cn(secondaryFont.className, "text-xl ")}>
          {ValidationMessage.LANDING_PAGE}
        </p>
        <div className="w-full flex">
          <Link
            href={BrowserRoute.SignIn}
            className={buttonVariants({
              className: "bg-purple-dark text-white mt-2 px-2 py-0.5 text-lg",
            })}
          >
            Get Started
          </Link>
        </div>
      </div>
      <Image
        src={"/landing-frame.svg"}
        className="self-center mt-12"
        width={400}
        height={4}
        alt="Josh Logo"
      />
    </div>
  );
};

export default Landing;
