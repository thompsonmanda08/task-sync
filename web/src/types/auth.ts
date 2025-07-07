
export type RegistrationFormSchema = ({
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  password: string,
  code?: string, // 
  isStudent?: boolean
  agreeToTerms?: boolean
});

export type LoginSchema = {
  email: string;
  password: string;
  code?: string;
  [x: string]: unknown;
};



export type PasswordResetSchema = {
  email: string;
  code?: string;
  password?: string,
  token?: string;
  [x: string]: unknown;
};

export type Session = {
  user: User;
  accessToken: string;
  [x: string]: any;
};

export type User = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  role?: string;
  mobile?: string;
  [x: string]: unknown;
};