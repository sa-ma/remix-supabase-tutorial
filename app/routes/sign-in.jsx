import {
  Form,
  useActionData,
  json,
  redirect,
  useTransition,
  Link,
} from "remix";
import supabaseToken from "~/utils/cookie";
import Layout from "~/components/layout";
import { signInUser } from "~/utils/auth";

export async function action({ request }) {
  const errors = {};
  try {
    const form = await request.formData();
    const email = form.get("email");
    const password = form.get("password");

    // validate the fields
    if (typeof email !== "string" || !email.match(/^\S+@\S+$/)) {
      errors.email = "Email address is invalid";
    }

    if (typeof password !== "string" || password.length < 6) {
      errors.password = "Password must be > 6 characters";
    }

    // return data if we have errors
    if (Object.keys(errors).length) {
      return json(errors, { status: 422 });
    }

    // otherwise create the user and redirect
    const { data, error } = await signInUser({ email, password });

    if (data) {
      return redirect("/", {
        headers: {
          "Set-Cookie": await supabaseToken.serialize(data.access_token, {
            expires: new Date(data?.expires_at),
            maxAge: data.expires_in,
          }),
        },
      });
    }
    throw error;
  } catch (error) {
    console.log("error", error);
    errors.server = error?.message || error;
    return json(errors, { status: 500 });
  }
}

const SignIn = () => {
  const errors = useActionData();
  const transition = useTransition();
  return (
    <Layout>
      <h2 className="text-3xl font-light my-3">Sign In</h2>
      <Form method="post" className="my-3 lg:w-3/4">
        <div className="mb-2">
          <label
            className="text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Your email"
            name="email"
          />
          {errors?.email ? (
            <p className="text-red-500 text-md italic">{errors.email}</p>
          ) : null}
        </div>
        <div className="mb-2">
          <label
            className="text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            name="password"
            placeholder="Your password"
          />
          {errors?.password ? (
            <p className="text-red-500 text-md  italic">{errors.password}</p>
          ) : null}
        </div>
        <div className="flex flex-row items-center justify-between   ">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
            aria-live="polite"
            disabled={transition.state !== "idle"}
          >
            {transition.state !== "idle" ? "Loading..." : "Sign in"}
          </button>
          <Link
            to="/forgot-password"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline "
          >
            Forgot Password ?
          </Link>
        </div>
      </Form>

      {errors?.server ? (
        <p className="text-red-500 text-md italic">{errors.server}</p>
      ) : null}
      <Link to="/sign-up" className=" text-2xl font-bold bold mt-2 ">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
          aria-live="polite"
          disabled={transition.state !== "idle"}
        >
          Don't have an account Register Now
        </button>
      </Link>
    </Layout>
  );
};

export default SignIn;
