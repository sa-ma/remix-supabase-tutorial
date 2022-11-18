import { supabase } from "~/supabase.server";
import supabaseToken from "~/utils/cookie";

export const getToken = async (request) => {
  const cookieHeader = request.headers.get("Cookie");
  return await supabaseToken.parse(cookieHeader);
};

export const isAuthenticated = async (
  request,
  validateAndReturnUser = false
) => {
  const token = await getToken(request);
  if (!token && !validateAndReturnUser) return false;
  if (validateAndReturnUser) {
    const { user, error } = await getUserByToken(token);
    if (error) {
      return false;
    }
    return { user };
  }
  return true;
};

export const getUserByToken = async (token) => {
  supabase.auth.setAuth(token);
  const { user, error } = await supabase.auth.api.getUser(token);
  return { user, error };
};

export const getUserData = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .single();
  return { data, error };
};

export const createUser = async (data) => {
  const { user, error } = await supabase.auth.signUp({
    email: data?.email,
    password: data?.password,
  });
  const createProfile = await supabase.from("profiles").upsert({
    id: user?.id,
    first_name: data?.firstName,
    last_name: data?.lastName,
    phone_number: data?.phoneNumber,
  });

  return { user: createProfile, error };
};

export const signInUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signIn({ email, password });
  return { data, error };
};

export const signOutUser = async (request) => {
  const token = await getToken(request);
  return await supabase.auth.api.signOut(token);
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.api.resetPasswordForEmail(email, {
    redirectTo: "/reset-password", //// this will redirect to us at password-reset page,
    //// you can also set your own page for it.
  });

  return null;
};

export const updateUserPassword = async (password) => {
  const { user, error } = await supabase.auth.api.updateUser(
    {
      password: password,
    },
    { redirectTo: "/" }
  );

  return null;
};
