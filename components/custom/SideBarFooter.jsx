import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import { Button } from "../ui/button";

function SideBarFooter() {
  const options = [
    {
      name: "Settings",
      icons: Settings,
    },
    {
      name: "Help Center",
      icons: HelpCircle,
    },
    {
      name: "Subscriptions",
      icons: Wallet,
    },
    {
      name: "Logout",
      icons: LogOut,
    },
  ];
  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button variant="ghost" key={index} className="w-full flex justify-start my-2">
          <option.icons className="mr-2 h-4 w-4" />
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
