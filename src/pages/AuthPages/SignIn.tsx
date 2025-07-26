import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login | JiEdu - Application"
        description="This is SignIn Dashboard page for JiEdu"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
