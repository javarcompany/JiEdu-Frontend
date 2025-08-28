import { useState } from "react";

export default function useUserInfo() {
  const [user, setUser] = useState({
        fname: localStorage.getItem("userfname") || "",
        lname: localStorage.getItem("userlname") || ""
  });
  return user;
}
