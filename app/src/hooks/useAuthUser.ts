import { useAppSelector } from "@/redux/hooks";

function useAuthUser() {
  return useAppSelector((state) => state.auth.user);
}

export default useAuthUser;
