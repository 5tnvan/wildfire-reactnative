"use server";

import { supabase } from "@/src/lib/supabase";

/* GET PUBLIC URL */
// export async function getPublicURL(filePath: any) {
//     const { data } = supabase.storage.from("3sec").getPublicUrl(`${filePath}`);
//     return data;
//   }