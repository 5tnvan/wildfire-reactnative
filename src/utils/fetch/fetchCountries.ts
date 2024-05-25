"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const fetchCountries = async () => {
  const { data, error } = await supabase
    .from("countries")
    .select();

  return data;
};

/**
 * FETCH: fetchPublicProfileMatchingWith(username)
 * DB: supabase
 * TABLE: "profiles"
 **/

export const fetchCountriesMatchingWith = async (country: string) => {
  const { data } = await supabase
    .from("countries")
    .select()
    .ilike("name", `${country}%`);
  return data;
};
