// /i18n.ts
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Read from cookie or fallback to 'ar'
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
