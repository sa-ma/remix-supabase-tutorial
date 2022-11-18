import { Form, useActionData, json, useTransition } from "remix";
import { createUser, resetPassword } from "~/utils/auth";
import Layout from "~/components/layout";

export async function action({ request }) {
  const errors = {};
  try {
    const form = await request.formData();

    const email = form.get("email");

    if (!email || !email.match(/^\S+@\S+$/)) {
      errors.email = "Email address is invalid";
    }

    // return data if we have errors
    if (Object.keys(errors).length) {
      errors.user = "Error";
      return json({ errors }, { status: 422 });
    }

    const { data, error } = await resetPassword(email, request);
  } catch (error) {
    console.log("error", error);
    errors.server = error?.message || error;
    errors.user = "Error";
    return json({ errors });
  }
}

const ForgotPassword = () => {
  const data = useActionData();
  const transition = useTransition();
  return (
    <Layout>
      <h2 className="text-3xl font-light">
        Forgot <strong className="font-bold">Password</strong>
      </h2>
      <Form method="post" className="my-3">
        {transition.state !== "idle" ? (
          <div
            className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Congrats! </strong>
            <span className="block sm:inline">
              Your password link has been sent. Please go to your email for
              confirmation instructions.
            </span>
          </div>
        ) : null}

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
          {data?.errors?.email ? (
            <p className="text-red-500 text-xs italic">{data?.errors.email}</p>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
            aria-live="polite"
            disabled={transition.state !== "idle"}
          >
            {transition.state !== "idle" ? "Loading..." : "Submit"}
          </button>
          {/* {data?.errors?.server ? (
            <p className="text-red-500 text-xs italic">{data?.errors.server}</p>
          ) : null} */}
        </div>
      </Form>
    </Layout>
  );
};

export default ForgotPassword;
