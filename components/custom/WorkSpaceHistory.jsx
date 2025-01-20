import { UserDetailContext } from "@/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";

function WorkSpaceHistory() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [workspaceList, setWorkspaceList] = useState();
  const convex = useConvex();

  useEffect(() => {
    userDetail && GetAllWorkspace();
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail?._id,
    });
    setWorkspaceList(result);
    console.log(result);
  };
  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      {workspaceList &&
        workspaceList?.map((workspace, index) => (
          <Link key={index} href={"/workspace/" + workspace?._id}>
            <h2 className="text-sm text-gray-400 mt-2 font-light hover:text-white cursor-pointer">
              {workspace?.messages[0]?.content}
            </h2>
          </Link>
        ))}
    </div>
  );
}

export default WorkSpaceHistory;
