import React, { useState } from "react";
import { Icon, Input } from "react-native-elements";
import {
  Alert,
  View,
  AppState,
  Pressable,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";

import { supabase } from "@/src/lib/supabase";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function AuthRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);

    if (username.length < 3) {
      Alert.alert("Username too short");
      return;
    }

    if (
      !!(await supabase.from("profiles").select("*").eq("username", username))
        .data?.length ??
      0
    ) {
      Alert.alert("Username has already taken");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid email");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      Alert.alert("Password is too short or too weak");
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) Alert.alert(error.message);
    else if (!session)
      Alert.alert("Please check your inbox for email verification!");

    setLoading(false);
  }

  return (
    <>
      {/* Card */}
      <View style={styles.imageContainer} className="mb-10">
        <ImageBackground
          source={require("@/assets/images/wildpay-card.png")}
          style={styles.imageBackground}
        >
          <Text className="text-3xl font-extrabold">
            {username == "" ? "username" : username}
          </Text>
        </ImageBackground>
      </View>

      <View className="w-full">
        <View>
          <Input
            label="Username"
            leftIcon={{ type: "font-awesome", name: "user" }}
            onChangeText={(text) => setUsername(text.toLowerCase())}
            value={username}
            placeholder="username"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Input
            label="Email"
            leftIcon={{ type: "font-awesome", name: "envelope" }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
          />
        </View>

        <View>
          <Input
            label="Password"
            leftIcon={{ type: "font-awesome", name: "lock" }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
          />
        </View>

        <View className="items-center mb-5">
          <Pressable
            className="w-full items-center justify-center p-3 rounded-full bg-accent"
            disabled={loading}
            onPress={() => signUpWithEmail()}
          >
            <Text className="text-lg text-black font-semibold">Register</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%", // Set width to 400px
    aspectRatio: 315 / 200, // Maintain aspect ratio (width / height)
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
