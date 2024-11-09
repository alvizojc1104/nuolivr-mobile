import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { SERVER } from "@/constants/link";

const useUserData = () => {
  const [userData, setUserData] = useState<Object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { isLoaded, user } = useUser();

  useEffect(() => {
    const getAccountData = async () => {
      if (!user?.id || !isLoaded) return; // Exit early if no userId is provided

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${SERVER}/api/get-account/${user.id}`
        );
        setUserData(response.data);
      } catch (error:any) {
        setError(error);
        alert(JSON.stringify(error.errors));
      } finally {
        setLoading(false);
      }
    };

    getAccountData();
  }, [user?.id]);

  return { userData, loading, error };
};

export default useUserData;
