"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchRandomLocation()
 * DB: supabase
 * TABLE: "1sec"
 **/

export const fetchRandomLocation = async () => {
  const { data, error } = await supabase
      .from('1sec_random_view')
      .select('country_id')
      .not('country_id', 'is', null)
      .limit(1)
      .single()

    return data;
};
