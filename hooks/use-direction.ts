import { useLocale } from "next-intl";

export const useDirection = () => {
  const local = useLocale();
  const isRTL = local === "ar";
  return { isRTL };
};
