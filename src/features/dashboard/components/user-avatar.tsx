import { useProfile } from "@/features/auth/hooks/use-profile";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/shared/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserAvatar() {
  const { data: profile, isLoading } = useProfile();
  const logout = useLogout();
  const t = useTranslations("user_avatar");

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32 hidden 2xl:block" />
      </div>
    );
  }

  const user = profile?.data;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar>
            <AvatarImage src={user?.profileImageUrl || ""} alt={user?.name} />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <span className="text-gray-800 font-medium text-sm hidden 2xl:block">
            {user?.name || t("user")}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2">
          <User className="size-4" />
          {user?.name || t("user")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          {logout.isPending ? t("logging_out") : t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
