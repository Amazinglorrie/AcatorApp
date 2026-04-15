import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";

const SUPABASE_URL = "https://moidxhnmqsdvrjpmvmck.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaWR4aG5tcXNkdnJqcG12bWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTc3MjIsImV4cCI6MjA5MTY5MzcyMn0.gZJIPdirw5MU8DzXFR64gAxLV70Ws2K1OBO_ci1PewY";

const isWeb = Platform.OS === "web";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: isWeb
    ? {
        detectSessionInUrl: true,
      }
    : {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
});