import { Form, useActionData, json, useTransition } from "remix";
import { updateUserPassword } from "~/utils/auth";
import Layout from "~/components/layout";

export async function action({ request }) {
  const errors = {};
  try {
    const form = await request.formData();

    const password = form.get("password");
    const confirm_password = form.get("confirm_password");
    if (!password) {
      errors.password = "Please Type password";
    }

    if (!confirm_password) {
      errors.confirm_password = "Please Type password";
    }

    // return data if we have errors
    if (Object.keys(errors).length) {
      return json({ errors }, { status: 422 });
    }
    if (password !== confirm_password) {
      errors.match_password = "Password not match";
    }

    const { user, error } = await updateUserPassword(password);
    console.log(user);
  } catch (error) {
    console.log("error", error);
    errors.server = error?.message || error;
    return json({ errors }, { status: 500 });
  }
}

const ResetPassword = () => {
  const data = useActionData();
  const transition = useTransition();

  return (
    <Layout>
      <h2 className="text-3xl font-light">Update Password</h2>
      <Form method="post" className="my-3">
        {data?.user && (
          <div
            className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Congrats! </strong>
            <span className="block sm:inline">
              Your account has been registered. Please go to your email for
              confirmation instructions.
            </span>
          </div>
        )}

        <div className="mb-2">
          <label
            className="text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Password
          </label>
          <input
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="New Password"
            name="password"
          />
          {data?.errors?.password ? (
            <p className="text-red-500 text-xs italic">
              {data?.errors.password}
            </p>
          ) : null}
        </div>

        <div className="mb-2">
          <label
            className="text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Confirm Password
          </label>
          <input
            id="confirm_password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder=" Confirm Password"
            name="confirm_password"
          />
          {data?.errors?.confirm_password ? (
            <p className="text-red-500 text-xs italic">
              {data?.errors.confirm_password}
            </p>
          ) : null}
        </div>
        {data?.errors?.match_password ? (
          <p className="text-red-500 text-xs italic">
            {data?.errors?.match_password}
          </p>
        ) : null}
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
            aria-live="polite"
            disabled={transition.state !== "idle"}
          >
            {transition.state !== "idle" ? "Loading..." : "Submit"}
          </button>
          {data?.errors?.server ? (
            <p className="text-red-500 text-xs italic">{data?.errors.server}</p>
          ) : null}
        </div>
      </Form>
    </Layout>
  );
};

export default ResetPassword;
