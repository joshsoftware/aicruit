"use client";

import { BrowserRoute } from "@/constants/route";
import { primaryFont } from "@/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetAuth } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    dispatch(resetAuth());
    router.push(BrowserRoute.SignIn);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Force a lightweight re-render on bfcache restore or when tab becomes visible
  useEffect(() => {
    const forceRerender = () => setTick((t) => t + 1);
    const onPageShow = (e: any) => {
      if (e && (e as any).persisted) {
        forceRerender();
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        forceRerender();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("pageshow", onPageShow);
      document.addEventListener("visibilitychange", onVisibility);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("pageshow", onPageShow);
        document.removeEventListener("visibilitychange", onVisibility);
      }
    };
  }, []);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

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

        {token && user && (
          <div className="ml-auto mr-2 relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              className={cn(
                // Button base
                "flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm",
                // Text styling
                "text-gray-900 hover:text-gray-900",
                // Hover/focus visibility
                "hover:border-indigo-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200"
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                {initials || "U"}
              </div>
              <svg
                className={cn(
                  "h-5 w-5 text-gray-500 transition-transform",
                  open ? "rotate-180" : "rotate-0"
                )}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {open && (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
              >
                <div className="px-4 py-3 bg-indigo-50/60">
                  <p className="text-base text-gray-600 tracking-wider">Signed in as</p>
                  <p className="text-lg font-normal text-gray-900 truncate tracking-wider">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-base text-indigo-700 font-medium truncate tracking-wider">
                    {user.roleName}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none tracking-wider"
                  role="menuitem"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
