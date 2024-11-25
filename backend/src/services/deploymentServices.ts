// import { supabase } from "@/lib/supabase";

// export const createWorkspace = async (DATA: I_CREATE_INTERFACE_BODY) => {
//   const data = await supabase
//     .from("deployments")
//     .insert([
//       {
//         project_id: DATA.name,
//         company_name: DATA.company_name,
//         description: DATA.description,
//         created_by: DATA.created_by,
//       },
//     ])
//     .select()
//     .maybeSingle();

//   if (data.error) {
//     throw Error(data.error.message);
//   }

//   const { error } = await supabase.from("credentials").insert([
//     {
//       workspace_id: data.data?.id,
//       access_key: DATA.access_key,
//       secret_key: DATA.secret_key,
//     },
//   ]);

//   if (error) {
//     throw Error(error.message);
//   }

//   return data;
// };
