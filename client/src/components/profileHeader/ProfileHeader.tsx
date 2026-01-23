import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Ellipsis, Upload } from "lucide-react";
import FollowButton from "../followButton/FollowButton";
import useAuthStore from "@/lib/authStore";
import { useNavigate } from "react-router";

export type ProfileHeaderProps = {
  avatarUrl?: string;
  name: string;
  username: string;
  followers: number;
  following: number;
  monthlyViews: string;
  bio?: string;
  isFollowing?: boolean;
};

export default function ProfileHeader({
  avatarUrl,
  name,
  username,
  followers,
  following,
  monthlyViews,
  bio,
  isFollowing,
}: ProfileHeaderProps) {
  const { currentUser } = useAuthStore()
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center bg-white p-6 shadow-[rgba(0,0,15,0.5)_0px_8px_6px_0px] rounded-2xl max-w-md mx-auto mt-4">
      {/* Avatar + Name */}
      <Avatar className="h-24 w-24">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} />
        ) : (
          <AvatarFallback className="text-xl uppercase">
            {name.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>

      <h1 className="mt-4 text-2xl font-bold text-center">
        {name}
      </h1>
      <p className="text-sm text-muted-foreground">@{username}</p>

      {/* Stats */}
      <div className="mt-3 flex gap-4 text-sm font-medium text-gray-700">
        <span>{followers} followers</span>
        <span>·</span>
        <span>{following} following</span>
        <span>·</span>
        {monthlyViews && <span>{monthlyViews} monthly views</span>}
      </div>

      {/* Bio */}
      {bio && (
        <p className="mt-2 text-center text-sm text-gray-600">
          {bio}
        </p>
      )}

      {/* Buttons */}
      {currentUser?.username !== username && <div className="flex items-center justify-center gap-2 mt-4">
        <Button
          variant="ghost"
          className="rounded-lg"
          onClick={() => !currentUser?._id && navigate("/auth")}
        >
          <Upload className="w-6! h-6!" size={9} />
        </Button>
        <Button variant="secondary" className="bg-gray-200" size="xl" onClick={() => !currentUser?._id && navigate("/auth")}>
          Message
        </Button>
        <FollowButton isFollowing={isFollowing || false} username={username} />
        <Button variant="ghost" size="xl" className="px-2!">
          <Ellipsis className="w-7! h-7!" />
        </Button>
      </div>}
    </div>
  );
}
