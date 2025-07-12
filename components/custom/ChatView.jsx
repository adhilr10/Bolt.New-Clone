"use client";
import { MessageContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/userDetailContext";
import ReactMarkdown from "react-markdown";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Colors from "@/data/Colors";
import Image from "next/image";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { api } from "@/convex/_generated/api";
import { useSidebar } from "../ui/sidebar";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessageContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const { toggleSidebar } = useSidebar();

  const UpdateWorkspace = useMutation(api.workspace.UpdateWorkspace);

  useEffect(() => {
    id && getWorkSpaceData();
  }, [id]);

  const getWorkSpaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    console.log(result);
    setMessages(Array.isArray(result?.messages) ? result.messages : []);
    // const UpdateFiles = useMutation(api.workspace.UpdateWorkspace);
  };
  useEffect(() => {
    if (messages?.length > 0) {
      // Fetch last message
      const role = messages[messages.length - 1].role;
      if (role == "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat/", { prompt: PROMPT });
    console.log(result.data.result);
    const aiResp = {
      role: "ai",
      content: result.data.result,
    };
    setLoading(false);
    setMessages((prev) => [...prev, aiResp]);
    await UpdateWorkspace({
      messages: [...messages, aiResp],
      workspaceId: id,
    });
  };

  const onGenerate = async (input) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[80vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide px-5 ">
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            {msg?.role == "user" && (
              <Image
                src={userDetail?.picture}
                alt="userImage"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <ReactMarkdown className="flex flex-col">
              {msg?.content}
            </ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>

      {/* input Section */}
      <div className="flex gap-2 items-end">
        {userDetail && (
          <Image
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
            src={userDetail?.picture}
            alt="user"
            width={30}
            height={30}
          />
        )}
        <div
          className="p-4 border rounded-xl max-w-lg w-full mt-3"
          style={{
            backgroundColor: Colors.BACKGROUND,
          }}
        >
          <div className="flex gap-2">
            <textarea
              value={userInput}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full h-24 max-h-52 resize-none"
              onChange={(event) => setUserInput(event.target.value)}
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
