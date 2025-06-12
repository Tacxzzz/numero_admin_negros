import axios from "axios";
import CryptoJS from "crypto-js";

const API_URL = import.meta.env.VITE_DATABASE_URL;
const rawToken = import.meta.env.VITE_API_KEY;
const API_KEY = btoa(rawToken);




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
    const response = await axios.post(`${API_URL}/admin/getUserData`, { userID: id },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getGames`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.post(`${API_URL}/admin/getGamesData`, { userID},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/getCombinationLimits`, { userID},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`,  
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
    const response = await axios.get(`${API_URL}/admin/getGamesTypes`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getDraws`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

    const response = await axios.post(`${API_URL}/admin/getTeamTransactionsCashin`, { userID: id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
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

    const response = await axios.post(`${API_URL}/admin/getTeamTransactionsCashout`, { userID: id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
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
    const response = await axios.get(`${API_URL}/admin/getTransactionsCashin`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getTransactionsCashout`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`,  
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
    const response = await axios.get(`${API_URL}/admin/getBetsHistory`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getClientWinners`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getBetsHistoryWinners`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getPlayersAdmin`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getPlayersAdminChoice`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getPlayers`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.post(`${API_URL}/admin/getPlayersTeam`, { userID: id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getPlayersAgents`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.get(`${API_URL}/admin/getClients`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`,  
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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

export const addBalance = async (formData: FormData): Promise<boolean> => {
  try 
  {
      const response = await axios.post(
          import.meta.env.VITE_DATABASE_URL+'/admin/addBalance',
          formData,
          { headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
    const response = await axios.post(`${API_URL}/admin/getLevel1Referrals`, { userID: id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
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
    const response = await axios.post(`${API_URL}/admin/getLevel1ReferralsCount`, { userID: id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
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
    const response = await axios.post(`${API_URL}/admin/getLevel2ReferralsCount`, { userID: id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
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
    const response = await axios.post(`${API_URL}/admin/getRateChartData`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
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
    const response = await axios.post(`${API_URL}/admin/countBetsEarned`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

export const countSelfBetsEarned = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/countSelfBetsEarned`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

export const countClientBetsEarned = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/countClientBetsEarned`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/totalWins`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/totalBalancePlayers`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/totalCommissions`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/totalPlayers`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

export const totalPlayersActive = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalPlayersActive`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

export const totalPlayersInactive = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalPlayersInactive`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/totalClients`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/totalCashin`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/totalCashOut`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/getRateChartDataTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/countBetsEarnedTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.post(`${API_URL}/admin/totalWinsTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

    const response = await axios.post(`${API_URL}/admin/totalBalancePlayersTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

    const response = await axios.post(`${API_URL}/admin/totalCommissionsTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

    const response = await axios.post(`${API_URL}/admin/totalPlayersTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

    const response = await axios.post(`${API_URL}/admin/totalClientsTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

    const response = await axios.post(`${API_URL}/admin/totalCashinTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

    const response = await axios.post(`${API_URL}/admin/totalCashOutTeam`, { userID: id ,start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.get(`${API_URL}/admin/getAnnouncements`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`,  
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
    const response = await axios.get(`${API_URL}/admin/getTodayDraws`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.post(`${API_URL}/admin/getWebData`, { gameID: id },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
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
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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
    formData.append("amount", (parseFloat(winnings) - 8).toString());
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
      },{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
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
    const response = await axios.get(`${API_URL}/admin/getLogs`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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
    const response = await axios.post(`${API_URL}/admin/getLogsByUser`, { userID},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.get(`${API_URL}/admin/getAuditLogs`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    const response = await axios.get(`${API_URL}/admin/getBackups`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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
    await axios.post(`${API_URL}/admin/deleteBackup`, { userID},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
};


export const backupAndCleanupDBLOGS = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/backupAndCleanupDBLOGS`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Failed to backup and cleanup DB logs:", error);
    return null; 
  }
};

export const backupAndCleanupLOGS = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/backupAndCleanupLOGS`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Failed to backup and cleanup logs:", error);
    return null; 
  }
};


export const createDraws = async (): Promise<boolean> => {
  try 
  {
      const response = await axios.get(
          import.meta.env.VITE_DATABASE_URL+'/admin/createDraws',
          { headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_KEY}`, 
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

export const getCommission = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/getCommissions`,{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });

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

export const cashinHourlyData = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/cashinHourlyData`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getCashinData = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getCashinData`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const cashoutHourlyData = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/cashoutHourlyData`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const totalCashoutFromCommissions = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalCashoutFromCommissions`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

export const totalCashoutFromWinnings = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/totalCashoutFromWinnings`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
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

export const getCashoutData = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getCashoutData`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getPlayersData = async (start_date:string, end_date:string, status:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getPlayersData`, { start_date: start_date, end_date: end_date, status: status},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getBetsWinsPerTimeSlot = async (start_date:string, end_date:string, time_slot:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getBetsWinsPerTimeSlot`, { start_date: start_date, end_date: end_date, time_slot: time_slot},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getBetsWinsPerGameType = async (start_date:string, end_date:string, game_name:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getBetsWinsPerGameType`, { start_date: start_date, end_date: end_date, game_name: game_name},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getBetsWins4D = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getBetsWins4D`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getBetsWinsPerGame = async (start_date:string, end_date:string, game_name:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getBetsWinsPerGame`, { start_date: start_date, end_date: end_date, game_name: game_name},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getBetsData = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getBetsData`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getCommissionsData = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getCommissionsData`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};

export const getWinnersData = async (start_date:string, end_date:string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/getWinnersData`, { start_date: start_date, end_date: end_date},{
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        }
      });
    
    if (response.data) 
      {
      const userData = response.data;
      return userData;
    } 
    else 
    {
      console.warn("User data is empty or invalid.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
};