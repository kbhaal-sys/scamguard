import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in — SPeye" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="font-display text-3xl font-bold">Welcome</h1>
      <p className="mt-2 text-inkmut">Sign in or create a free account — 5 scans per month, no card required.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
