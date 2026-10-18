
import LoginHandler from "@/components/auth/loginContainer/LoginHandler";


import AuthPageHeader from "@/components/auth/authPageHeader";

export default async function  Login() {
  
       
    return (
               
         <div className="flex flex-col items-center gap-3 w-[430px] max-md:w-[80%] ">


           <AuthPageHeader head="ورود به رویش" />

             <LoginHandler/>
             
           </div>
      

    )
}