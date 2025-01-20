import Image from "next/image";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { useContext } from "react";
import { UserDetailContext } from "@/context/userDetailContext";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex justify-between items-center p-4">
      <Link href={"/"}>
        <Image src={"/logo.png"} alt="Logo" width={70} height={70} />
      </Link>
      {userDetail && (
        <Image
          className="rounded-full cursor-pointer"
          onClick={toggleSidebar}
          src={userDetail?.picture}
          alt="user"
          width={38}
          height={38}
        />
      )}
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
