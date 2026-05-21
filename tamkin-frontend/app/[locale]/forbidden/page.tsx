"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ForbiddenPage() {
  const t = useTranslations("errors.forbidden");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="text-6xl font-bold">403</div>

        <h1 className="text-2xl font-semibold">{t("title")}</h1>

        <p className="text-muted-foreground">{t("description")}</p>

        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">{t("home")}</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/contact">{t("contact")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
