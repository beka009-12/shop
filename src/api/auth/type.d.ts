interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  avatar: any;
  role: string;
  createdAt: string;
}
namespace AUTH {
  // todo login
  type LoginReq = {
    email: string;
    password: string;
  };
  type LoginRes = {
    user: User;
    token: string;
  };
  // todo regsiter
  type RegisterRes = {
    user: User;
    token: string;
  };
  type RegisterReq = {
    email: string;
    password: string;
    name: string;
  };
}
