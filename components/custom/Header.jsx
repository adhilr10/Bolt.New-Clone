import Image from "next/image";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { useContext } from "react";
import { UserDetailContext } from "@/context/userDetailContext";

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className="flex justify-between items-center p-4">
      <Image src={"/logo.png"} alt="Logo" width={70} height={70} />
      {!userDetail && (
        <div className="flex gap-5">
          <Button variant={"ghost"}>Sign in</Button>
          <Button
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
