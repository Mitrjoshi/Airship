import { getRandomUuid } from "@/functions/getRandomUuid";
import { supabase } from "@/lib/supabase";

export const checkUserForSignUp = async (username: string, email: string) => {
  const data = await supabase
    .from("users")
    .select()
    .or(`username.eq.${username},email.eq.${email}`)
    .maybeSingle();

  if (data.error) {
    throw Error(data.error.message);
  }

  return data;
};

export const checkUserWithUsername = async (username: string) => {
  const data = await supabase
    .from("users")
    .select()
    .eq("username", username)
    .maybeSingle();

  if (data.error) {
    throw Error(data.error.message);
  }

  return data;
};

export const createUser = async (
  username: string,
  password: string,
  email: string
) => {
  const data = await supabase
    .from("users")
    .insert([{ id: getRandomUuid(), username, password, email }])
    .select();

  if (data.error) {
    throw Error(data.error.message);
  }

  return data;
};
