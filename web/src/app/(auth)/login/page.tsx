import { Logo } from "@/components/base";
import { LoginForm } from "@/components/forms";

export default function Login() {
  return (
    <div className="grid place-items-center w-full h-full">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-3 w-full max-w-sm mb-8 ">
          <div className="flex md:hidden max-h-12 justify-start ">
            <Logo
              className="object-contain -translate-x-5 scale-80"
              width={100}
              height={60}
              alt="TaskSync Logo"
              href="/"
            />
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
