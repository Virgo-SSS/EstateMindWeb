import AuthLayout from "./AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
    return (
        <>
            <AuthLayout>
                <LoginForm />
            </AuthLayout>
        </>
    );
}
