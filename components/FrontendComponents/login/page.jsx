"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 sm:p-10 w-[90%] max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Sign in to continue
        </p>
        <Button

          onClick={async () => {
            console.log("Sign in clicked");

            const res = await signIn("google");
            console.log("Sign in response:", res);
            if(res.ok){
            router.push("/");
            }
            router.push("/");
          }}

          variant="outline"
          className="w-full border border-gray-300 dark:border-gray-700 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
