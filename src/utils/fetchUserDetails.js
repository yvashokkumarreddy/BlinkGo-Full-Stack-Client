import Axios from "./Axios";

const fetchUserDetails = async () => {
  try {
    // Get current access token from localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return null; // No user logged in
    }

    // Make API call with Authorization header
    const response = await Axios.get("/user/user-details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the user data
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export default fetchUserDetails;
