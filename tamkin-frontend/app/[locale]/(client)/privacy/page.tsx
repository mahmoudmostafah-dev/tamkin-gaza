import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t("title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-muted-foreground leading-7">
          <p>{t("intro")}</p>
          <p>{t("dataCollection")}</p>
          <p>{t("cookies")}</p>
          <p>{t("security")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
