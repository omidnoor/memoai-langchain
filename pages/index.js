import Head from "next/head";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { isLoading, error, user } = useUser();

  return (
    <>
      <Head>
        <title>MemoAI - Login or Signup</title>
      </Head>
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-800 text-center text-white">
        <div>
          {!!user && <Link href="/api/auth/logout">Logout</Link>}
          {!user && (
            <>
              <Link
                href="/api/auth/login"
                className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
              >
                Login
              </Link>
              <Link
                href="/api/auth/signup"
                className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
