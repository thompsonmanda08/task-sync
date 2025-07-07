import { getUserRoles } from "@/app/_actions/config-actions";
import { Logo } from "@/components/base";
import { SignupForm } from "@/components/forms";

async function SignUp() {
  return (
    <div className="grid place-items-center w-full h-full">
      <div className="w-full max-w-sm xl:max-w-md px-1">
        <div className="flex flex-col gap-y-3 w-full mb-8">
          <div className="flex md:hidden max-h-12 justify-start">
            <Logo
              className="object-contain scale-80"
              width={100}
              height={60}
              alt="TaskSync Logo"
              href="/"
            />
          </div>
        </div>
        <div className="flex justify-center items-center w-full ">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
