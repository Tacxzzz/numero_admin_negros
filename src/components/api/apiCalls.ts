import axios from "axios";

const API_URL = import.meta.env.VITE_DATABASE_URL;


export const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/main/getUsers`);
  
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.error) {
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  };

export const fetchRecipients = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getRecipients`, { userID });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return [];
  }
};


export const getTransactions = async (userID: string) => {
  try {
    const response = await axios.post(`${API_URL}/main/getTransactions`, { userID });

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.error) {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recipients:", error);
    return [];
  }
};


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




export const redeemBalance =  async (
  formData: FormData,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/main/cashOut`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && response.data.authenticated) {
      const userData = response.data;
      return {
        transID: userData.transCode+userData.transID,
      };
    } else {
      console.warn("User data is empty or invalid.");
      return { transID: "" };
    }
    
  } catch (error) {
    console.error("Failed to redeem amount:", error);
    return { transID: "" };
  }
};



export const approveUser = async (
    formData: FormData,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/main/approveUser`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data && response.data.authenticated) {
        const userData = response.data;
        return {
          authenticated: true,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { authenticated: false };
      }
      
    } catch (error) {
      console.error("Failed to send remittance:", error);
      return { authenticated: false };
    }
  };

  export const rejectUser = async (
    formData: FormData,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/main/rejectUser`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data && response.data.authenticated) {
        const userData = response.data;
        return {
          authenticated: true,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { authenticated: false };
      }
      
    } catch (error) {
      console.error("Failed to send remittance:", error);
      return { authenticated: false };
    }
  };

  export const blockUser = async (
    formData: FormData,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/main/blockUser`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data && response.data.authenticated) {
        const userData = response.data;
        return {
          authenticated: true,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { authenticated: false };
      }
      
    } catch (error) {
      console.error("Failed to send remittance:", error);
      return { authenticated: false };
    }
  };


  export const getUserLogs = async (userID: string) => {
    try {
      const response = await axios.post(`${API_URL}/main/getUserLogs`, { userID });
  
      if (Array.isArray(response.data)) {
        console.log(response);
        return response.data;
      } else if (response.data.error) {
        
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      return [];
    }
  };


  export const getUserInfoDyna = async (
    formData: FormData,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/main/getUserInfoDyna`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data && response.data.authenticated) {
        const userData = response.data;
        return {
          authenticated: true,
          result: userData.result,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { authenticated: false, result: ""};
      }
      
    } catch (error) {
      console.error("Failed to send remittance:", error);
      return { authenticated: false, result: "" };
    }
  };


  export const getTransactionsAll = async () => {
    try {
      const response = await axios.get(`${API_URL}/main/getTransactionsAll`);
  
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.error) {
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
      return [];
    }
  };


  export const approveRedeem = async (
    formData: FormData,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/main/approveRedeem`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data && response.data.authenticated) {
        const userData = response.data;
        return {
          authenticated: true,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { authenticated: false };
      }
      
    } catch (error) {
      console.error("Failed to send remittance:", error);
      return { authenticated: false };
    }
  };

  export const rejectRedeem = async (
    formData: FormData,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/main/rejectRedeem`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data && response.data.authenticated) {
        const userData = response.data;
        return {
          authenticated: true,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { authenticated: false };
      }
      
    } catch (error) {
      console.error("Failed to send remittance:", error);
      return { authenticated: false };
    }
  };



  export const getLogsAll = async () => {
    try {
      const response = await axios.get(`${API_URL}/main/getLogsAll`);
  
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.error) {
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
      return [];
    }
  };

  export const getSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/main/getSettings`);
  
      if (response.data && response.data.authenticated) {
        const userData = response.data;
        return {
          authenticated: true,
          conversion: userData.conversion,
          trans_fee: userData.trans_fee,
          trans_limit: userData.trans_limit,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { authenticated: false, conversion: '0', trans_fee: '0', trans_limit: '0' };
      }
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
      return { authenticated: false, conversion: '0', trans_fee: '0', trans_limit: '0'  };
    }
  };


  export const updateSettings = async (
    formData: FormData,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/main/updateSettings`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data && response.data.authenticated) {
        return {
          authenticated: true,
        };
      } else {
        console.warn("User data is empty or invalid.");
        return { authenticated: false };
      }
      
    } catch (error) {
      console.error("Failed to send remittance:", error);
      return { authenticated: false };
    }
  };