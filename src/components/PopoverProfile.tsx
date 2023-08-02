import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const PopoverProfile = () => {
  const { data } = useSession();
  const router = useRouter();

  if (!data) {
    return (
      <Button onClick={() => void signIn("google")} variant="secondary">
        <FcGoogle size={20} className="mr-3" /> Login with Google
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Image
          src={data?.user.image as string}
          alt="profile"
          width={50}
          height={50}
          className="w-10 rounded-full"
        />
      </PopoverTrigger>
      <PopoverContent className="mr-5 mt-3 !w-80">
        <div className="flex items-center gap-3">
          <Image
            src={data?.user.image as string}
            alt="profile"
            width={70}
            height={70}
            className="rounded-full"
          />
          <div>
            <h1 className="text-lg">{data.user.name}</h1>
            <p className="text-sm">{data.user.email}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <Button variant="ghost" onClick={() => router.push("/profile")}>
            Profile
          </Button>
          <Button variant="ghost" onClick={() => void signOut()}>
            Log Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverProfile;
