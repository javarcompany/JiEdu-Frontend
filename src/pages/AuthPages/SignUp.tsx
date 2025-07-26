import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="SignUp | JiEdu - School Management Information System"
        description="This is SignUp Dashboard page for JiEdu - SMIS"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
