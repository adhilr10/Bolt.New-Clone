"use client";
import { MessageContext } from "@/context/MessagesContext";
import { api } from "@/convex/_generated/api";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessageContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    setLoading(false);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      // Fetch last message
      const role = messages[messages.length - 1].role;
      if (role == "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post("/api/gen-ai-code/", {
      prompt: PROMPT,
    });

    console.log(result.data);
    const aiResponse = result.data;

    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResponse?.files };
    setFiles(mergedFiles);
    await UpdateFiles({
      files: aiResponse?.files,
      workspaceId: id,
    });
    setLoading(false);
  };
  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center justify-center rounded-full flex-wrap shrink-0 bg-black w-[140px] gap-3 p-1">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab == "preview" && "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        files={files}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandpackPreview style={{ height: "80vh" }} showNavigator />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex justify-center items-center gap-1">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating your files...</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;
