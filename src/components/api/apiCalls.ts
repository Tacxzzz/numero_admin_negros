import axios from "axios";

const API_URL = import.meta.env.VITE_DATABASE_URL;





export const loginAdmin = async (user: any , getAccessTokenSilently: any) => {
  try {
    console.log(user.email);
    const token = await getAccessTokenSilently();
    const response = await axios.post(
      `${API_URL}/admin/loginAdmin`,
      { email: user.email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data && response.data.authenticated) {
        const userData = response.data;
        return {
          userID: userData.userID,
          dbUpdate: true,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { dbUpdate: false, userID: "id"};
      }
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbUpdate: false, userID: "id" };
  } 
};


export const fetchUserData = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getUserData`, { userID: id });

    if (response.data && response.data.length > 0) {
      const userData = response.data[0];
      return {
        balance: Number(userData.balance) || 0,
        verified: userData.verified ?? "pending",
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { balance: 0, verified: "pending" };
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return { balance: 0, verified: "pending" };
  }
};

export const getGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getGames`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getGamesTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getGamesTypes`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};


export const getDraws = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getDraws`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};


export const getTransactionsCashin = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getTransactionsCashin`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};


export const getTransactionsCashout = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getTransactionsCashout`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};


export const updateGame = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/updateGame',
          formData,
          { headers: {
            'Content-Type': 'multipart/form-data' 
          } }
      );

      
      return response.data.authenticated;
  } 
  catch (error) 
  {
      console.error('Error authenticating user:', error);
      return false;
  }
};




export const updateGameType = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/updateGameType',
          formData,
          { headers: {
            'Content-Type': 'multipart/form-data' 
          } }
      );

      
      return response.data.authenticated;
  } 
  catch (error) 
  {
      console.error('Error authenticating user:', error);
      return false;
  }
};




export const getBetsHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getBetsHistory`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};


export const getBetsHistoryWinners = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getBetsHistoryWinners`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};