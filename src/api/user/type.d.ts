interface User {
  id: number;
  email: string;
  name: string;
  phone: any;
  role: string;
  avatar: string;
}

namespace AUTH {
  type SignUpReq = { email: string; password: string; name: string };
  type SignUpRes = { message: string; user: User; token: string };
  type SignInReq = { email: string; password: string };
  type SignInRes = { message: string; user: User; token: string };
  type MeRes = {
    user: User;
  };
  type MeReq = void;
}
