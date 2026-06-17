import React from "react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import NavMobile from "./NavMobile";
import AppButton from "../buttons/AppButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "@/i18n/navigation";

export default async function NavBar() {
  const t = await getTranslations("navbar");

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="md:w-[85%] w-full mx-auto flex items-center justify-between h-16 px-4">
        {/* LEFT SIDE: Logo + Links */}
        <div className="flex items-center gap-8">
          <div className="font-bold text-lg">
            <Link href="/">تمكين</Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/campaigns">{t("campaigns")}</Link>
            <Link href="/blogs">{t("blogs")}</Link>
            <Link href="/stories">{t("stories")}</Link>
            <Link href="/contact">{t("contact")}</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">{t("more")}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/privacy">{t("privacy")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/terms">{t("terms")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/about">{t("about")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavMobile
              t={{
                campaigns: t("campaigns"),
                blogs: t("blogs"),
                stories: t("stories"),
                contact: t("contact"),
                privacy: t("privacy"),
                terms: t("terms"),
                about: t("about"),
                login: t("login"),
                register: t("register"),
              }}
            />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <AppButton variant="ghost">{t("login")}</AppButton>
            <AppButton variant="default">{t("register")}</AppButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
