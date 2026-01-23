import { useFollowUser } from "@/hooks/mutations/user.mutations";
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router";
import useAuthStore from "@/lib/authStore";

const FollowButton = ({ isFollowing, username }: { isFollowing: boolean, username: string }) => {
  const { mutate, status } = useFollowUser();
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

  const handleFollowUnfollow = () => {
    if (currentUser?._id === undefined) {
      navigate("/auth");
      return;
    }
    mutate(username, {
      onError: (error) => {
        console.error("Error updating follow status:", error.message);
      }
    });
  }
  return (
    <Button variant="destructive" size="xl" onClick={handleFollowUnfollow} disabled={status === "pending"}>
      {isFollowing ? "Unfollow" : "Follow"}
      {status === "pending" && <Spinner className="ml-2 size-4" />}
    </Button>
  )
}

export default FollowButton