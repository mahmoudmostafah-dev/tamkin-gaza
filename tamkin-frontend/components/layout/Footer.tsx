import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h3 className="font-bold text-lg">LOGO</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t("description")}
          </p>
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">{t("company")}</span>
            <Link href="/about">{t("about")}</Link>
            <Link href="/contact">{t("contact")}</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">{t("legal")}</span>
            <Link href="/privacy">{t("privacy")}</Link>
            <Link href="/terms">{t("terms")}</Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground py-4 border-t">
        &copy; {new Date().getFullYear()} Your Company. {t("rights")}
      </div>
    </footer>
  );
}
