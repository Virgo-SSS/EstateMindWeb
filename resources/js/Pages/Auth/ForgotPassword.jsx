import { Link, useForm, usePage } from "@inertiajs/react";
import Input from "../../components/ui/input/Input";
import Label from "../../components/ui/label/Label";
import AuthLayout from "../../layout/AuthLayout";
import Button from "../../components/ui/button/Button";
import { LoaderCircle } from "lucide-react";

export default function ForgotPassord() {
  const pageProps = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.email) {
      errors.email = "Email is required";

      // render the form again with errors
      setData("email", data.email);
      return;
    }

    post(route("password.email"), {
      onSuccess: () => {
        reset();
      },
      onError: (err) => {
        // TODO: Handle error case (e.g., show a toast notification)
        console.error("Failed to send reset password link:", err);
      },
    });
  };

  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
    delete errors[e.target.name];
  };

  return (
    <>
      <AuthLayout>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Forgot Your Password?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the email address linked to your account, and we’ll send you
              a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label htmlFor={"email"}>
                Email <span className="text-error-500">*</span>{" "}
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={data.email}
                onChange={handleChange}
                name="email"
                className="w-full"
                error={errors.email ? true : false}
                hint={errors.email}
                required={true}
              />
            </div>

            {pageProps.flash.success && (
              <div className="mb-4 text-sm text-green-600 dark:text-green-400">
                {pageProps.flash.success}
              </div>
            )}

            <Button
              disabled={processing}
              className="w-full dark:bg-[#C9262C]"
              size="sm"
              type="submit"
            >
              {processing && (
                <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
              )}
              Send Reset Link
            </Button>
          </form>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                href={route("login")}
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                data-discover="true"
              >
                Click here
              </Link>
            </p>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
