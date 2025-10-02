import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import DtakaIcon from "@/assets/DtakaLogoBeta.svg";
import { FcGoogle } from "react-icons/fc";
import { useAuth0 } from '@auth0/auth0-react';
import PisoPlayAdminLogo from "@/assets/IloIloLogo.png";


const Login: React.FC = () =>{
  const { loginWithRedirect } = useAuth0();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <img
            src={PisoPlayAdminLogo}
            alt="Logo"
            className="w-auto h-30 transform group-hover:scale-110 transition-transform duration-200"
          />
          {/* <CardTitle className="text-2xl font-bold text-center">Piso Play Admin</CardTitle> */}
          <CardDescription className="text-center">
            Enter your admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          <Button onClick={() => loginWithRedirect()} className="google-login-button w-full">
            <FcGoogle size={20} style={{ marginRight: "8px" }}  />
            Login with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* <p className="text-sm text-gray-600">
            Demo credentials: admin@example.com / password
          </p> */}
        </CardFooter>
      </Card>
    </div>
  );
};


export default Login;