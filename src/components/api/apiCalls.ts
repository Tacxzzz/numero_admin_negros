import axios from "axios";
import CryptoJS from "crypto-js";

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
          permissions: userData.permissions,
          dbUpdate: true,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { dbUpdate: false,permissions: "", userID: "id"};
      }
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbUpdate: false,permissions: "", userID: "id" };
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

export const getGamesData = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getGamesData`, { userID});
    
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

export const getCombinationLimits = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getCombinationLimits`, { userID});
    
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

export const addCombinationLimit = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/addCombinationLimit',
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


export const updateCombinationLimit = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/updateCombinationLimit',
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


export const getTeamTransactionsCashin = async (id:string) => {
  try {

    const response = await axios.post(`${API_URL}/admin/getTeamTransactionsCashin`, { userID: id });
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

export const getTeamTransactionsCashout = async (id:string) => {
  try {

    const response = await axios.post(`${API_URL}/admin/getTeamTransactionsCashout`, { userID: id });
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
export const getClientWinners = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getClientWinners`);

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


export const getPlayersAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getPlayersAdmin`);

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

export const getPlayersAdminChoice = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getPlayersAdminChoice`);

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
export const getPlayers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getPlayers`);

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

export const getPlayersTeam = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getPlayersTeam`, { userID: id });

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

export const getPlayersAgents = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getPlayersAgents`);

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


export const getClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getClients`);

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

export const updateClient = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/updateClient',
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


export const updateAdmin = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/updateAdmin',
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

export const revokeAccess = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/revokeAccess',
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


export const allowAccess = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/allowAccess',
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


export const updatePlayer = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/updatePlayer',
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

export const updatePlayerTeam = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/updatePlayerTeam',
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


export const getLevel1Referrals = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getLevel1Referrals`, { userID: id });
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




export const getLevel1ReferralsCount = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getLevel1ReferralsCount`, { userID: id });
    if (response.data) 
    {
      const userData = response.data;
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const getLevel2ReferralsCount = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getLevel2ReferralsCount`, { userID: id });
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const getRateChartData = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getRateChartData`, { start_date: start_date, end_date: end_date});
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



export const countBetsEarned = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/countBetsEarned`, { start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const totalWins = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalWins`, { start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const totalBalancePlayers = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalBalancePlayers`, { start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalCommissions = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalCommissions`, { start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalPlayers = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalPlayers`, { start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalClients = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalClients`, { start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const totalCashin = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalCashin`, { start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const totalCashOut = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalCashOut`, { start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};














///TEAM DASHBOARD

export const getRateChartDataTeam = async (id:string,start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getRateChartDataTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
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


export const countBetsEarnedTeam = async (id:string,start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/countBetsEarnedTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const totalWinsTeam = async (id:string,start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalWinsTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};


export const totalBalancePlayersTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/admin/totalBalancePlayersTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalCommissionsTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/admin/totalCommissionsTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalPlayersTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/admin/totalPlayersTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalClientsTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/admin/totalClientsTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalCashinTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/admin/totalCashinTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};

export const totalCashOutTeam = async (id:string,start_date:string, end_date:string) => {
  try {

    const response = await axios.post(`${API_URL}/admin/totalCashOutTeam`, { userID: id ,start_date: start_date, end_date: end_date});
    
    if (response.data) 
      {
      const userData = response.data;
      console.log(response);
      return {
        count: userData.count,
      };
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return { count: '-' };
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { count: '-' };
  }
};








export const getAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getAnnouncements`);

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

export const addAnnouncement = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/addAnnouncement',
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


export const updateAnnouncement = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/updateAnnouncement',
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



export const getTodayDraws = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getTodayDraws`);

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




export const getWebData = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getWebData`, { gameID: id });
    console.log('Raw Response:', response.data);

    // This is already parsed JSON (Axios does it automatically)
    return response.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};




export const setResultsDraw = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/setResultsDraw',
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




export const cashOutCashko = async (
  transID: string,
  winnings: string,
  full_name: string,
  bank: string,
  account: string
) => {
  try {
    const timestamp = Date.now().toString();
    const clientNo = `PPCO${timestamp}`;
    const clientCode = import.meta.env.VITE_CLIENT_CODE;
    const privateKey = import.meta.env.VITE_PRIVATE_KEY;
    const chainName = "BANK";
    const coinUnit = "PHP";

    const formData = new FormData();
    formData.append("clientCode", clientCode);
    formData.append("chainName", chainName);
    formData.append("coinUnit", coinUnit);
    formData.append("bankCardNum", account);
    formData.append("bankUserName", full_name);
    formData.append("ifsc", "null");
    formData.append("bankName", bank);
    formData.append("amount", (parseFloat(winnings) - 12).toString());
    formData.append("clientNo", clientNo);
    formData.append("requestTimestamp", timestamp);
    formData.append("callbackurl", `${API_URL}/main/requestCashOutCashko`);
    formData.append("sign", generateSign(clientCode, clientNo, timestamp, privateKey));

    const response = await axios.post(
      "https://gw01.ckogway.com/api/bank/agentPay/request",
      formData
    );
    console.log(response);

    if (
      response.data &&
      response.data.success &&
      response.data.code === 200 &&
      response.data.data &&
      response.data.data.orderNo
    ) {
      const { orderNo } = response.data.data;

      const res = await axios.post(`${API_URL}/admin/cashOutRequest`, {
        transID,
        clientNo,
        orderNo,
      });

      if (res.data && res.data.authenticated) {
        return { error: false };
      } else {
        console.warn("User data is empty or invalid.");
        return { error: true, message:"User data is empty or invalid." };
      }
    } else {
      console.warn("Cashko request failed.");
      return { error: true, message:"Transaction response is missing orderNo." };
    }
  } catch (error) {
    console.error("Cashko request failed:", error);
    return { error: true , message:"Cashko request failed." };
  }
};


const generateSign = (clientCode: string, clientNo: string, latest_requestTimestamp: string, privateKey: string) => {
  const signString = `${clientCode}&BANK&PHP&${clientNo}&${latest_requestTimestamp}${privateKey}`;
  const resultHash = CryptoJS.MD5(signString).toString(CryptoJS.enc.Hex);
  return resultHash;
};



export const getLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getLogs`);

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


export const getLogsByUser = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getLogsByUser`, { userID});
    
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


export const getAuditLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getAuditLogs`);
    
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

export const getBackups = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getBackups`);
    
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


export const deleteBackup = async (userID: string) => {
  try {
    await axios.post(`${API_URL}/admin/deleteBackup`, { userID});
    
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
};