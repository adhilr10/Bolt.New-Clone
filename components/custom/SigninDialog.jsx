import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { UserDetailContext } from "@/context/userDetailContext";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";
import { api } from "@/convex/_generated/api";

function SigninDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.createUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer" + tokenResponse?.access_token } }
      );

      console.log(userInfo);
      const user = userInfo.data;
      await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        uid: uuid4(),
      });
      if (typeof window !== undefined) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      setUserDetail(userInfo?.data);
      closeDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <div className="flex flex-col items-center justify-center gap-3">
              <h2 className="font-bold text-2xl text-center text-white">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
              <Button
                onClick={googleLogin}
                className="bg-blue-500 text-white hover:bg-blue-400 mt-3"
              >
                Sign in With Google
              </Button>
              <p>{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SigninDialog;
