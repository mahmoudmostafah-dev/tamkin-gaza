import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TermsPage() {
  const t = await getTranslations("terms");

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t("title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-muted-foreground leading-7">
          <p>{t("acceptance")}</p>
          <p>{t("usage")}</p>
          <p>{t("liability")}</p>
          <p>{t("changes")}</p>
        </CardContent>
      </Card>
    </div>
  );
}