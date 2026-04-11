import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t("title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-muted-foreground leading-7">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
