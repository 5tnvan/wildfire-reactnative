import { Platform } from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from "@/src/lib/supabase";

export function AuthApple() {
  if (Platform.OS === 'ios')
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 64 }}
        onPress={async () => {
          console.log("im here");
          try {
            console.log("im trying");
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            })
            // Sign in via Supabase Auth.
            console.log("credentials", credential);
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: 'apple',
                token: credential.identityToken,
              })
              console.log(JSON.stringify({ error, user }, null, 2))
              if (!error) {
                // User is signed in.
              }
            } else {
              throw new Error('No identityToken.')
            }
          } catch (e:any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    )
  return <>{/* Implement Android Auth options. */}</>
}