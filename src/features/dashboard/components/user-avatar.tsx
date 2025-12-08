import { useProfile } from "@/features/auth/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserAvatar() {
  const { data: profile, isLoading } = useProfile();

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

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <Avatar>
        <AvatarImage src={user?.profileImageUrl || ""} alt={user?.name} />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <span className="text-gray-800 font-medium text-sm hidden 2xl:block">
        {user?.name || "المستخدم"}
      </span>
    </div>
  );
}
