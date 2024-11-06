'use client'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface ResetCookiesProps {

  resetCookies(p: string): void,
   profile : string,
   token : string,
    userid : string,
     email : string,
      enterprise : string


}

const ResetCookiesContext = createContext({} as ResetCookiesProps);

export function ResetCookiesProvider({ children }) {
  const router = useRouter(); 

  const [userid, setUserid] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState("");
  const [email, setEmail] = useState("");
  const [enterprise, setEnterprise] = useState("");

  useEffect(() => {
    const savedUserId = Cookies.get('userId');
    const savedToken = Cookies.get('access_token');
    const savedProfile = Cookies.get('profile');
    const savedEmail = Cookies.get('email');
    const savedEnterprise = Cookies.get('enterprise');
   
    if (!savedToken) router.push('/');
    
    
    setToken(savedToken);
    setUserid(savedUserId);
    setProfile(savedProfile);
    setEmail(savedEmail);
    setEnterprise(savedEnterprise);

  }, [router]);

  async function resetCookies(path) {
    try {

      console.log("resetando")

      const response = await api.get(`/users/${userid}`);
      const data = response.data;
      
      Cookies.set('email', data.email, { expires: 15/24, secure: true });
      Cookies.set('profile', data.path, { expires: 15/24, secure: true });
      Cookies.set('enterprise', data.enterprise, { expires: 15/24, secure: true });

      setProfile(data.path);
      setEmail(data.email);
      setEnterprise(data.enterprise);
    } catch (error) {
      console.error(error);
    }
  }

  function Logout() {
    Cookies.remove('user_id');
    Cookies.remove('access_token');
    router.push('/');
  }

  return (
    <ResetCookiesContext.Provider value={{resetCookies, profile, token, userid, email, enterprise}}>
      {children}
    </ResetCookiesContext.Provider>
  );
}

export function useResetCookies() {
  const context = useContext(ResetCookiesContext);
  if (context === undefined) {
    throw new Error('useResetCookies must be used within a ResetCookiesProvider');
  }
  return context;
}
