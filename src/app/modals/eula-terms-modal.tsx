import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { Image } from 'react-native';
import { Text } from "@/src/components/Themed";
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center px-5">


      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{`Terms and Conditions`}</Text>
      
      <View style={styles.section}>
        <Text>
          <Text style={styles.strong}>Effective Date:</Text> June 11, 2024
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          Welcome to Wildfire! These Terms and Conditions {`("Terms")`} govern your use of our 3-second content-sharing video app {`("App")`}. By using Wildfire, you agree to be bound by these Terms. If you do not agree, please do not use the App.
        </Text>
      </View>

      <Text style={styles.subtitle}>1. Acceptance of Terms</Text>
      <View style={styles.section}>
        <Text>
          By creating an account or using the App, you agree to comply with and be bound by these Terms, our Privacy Policy, and any additional terms and conditions that may apply to specific sections of the App or to products and services available through the App.
        </Text>
      </View>

      <Text style={styles.subtitle}>2. Eligibility</Text>
      <View style={styles.section}>
        <Text>
          You must be at least 13 years old to use the App. By using the App, you represent and warrant that you meet this age requirement.
        </Text>
      </View>

      <Text style={styles.subtitle}>3. Account Registration</Text>
      <View style={styles.section}>
        <Text>
          To access certain features of the App, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account information and for all activities that occur under your account.
        </Text>
      </View>

      <Text style={styles.subtitle}>4. User Conduct</Text>
      <View style={styles.section}>
        <Text>When using the App, you agree not to:</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Post or share content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable.</Text>
          <Text style={styles.listItem}>• Impersonate any person or entity, or falsely state or otherwise misrepresent yourself or your affiliation with any person or entity.</Text>
          <Text style={styles.listItem}>• Engage in any activity that interferes with or disrupts the App or the servers and networks connected to the App.</Text>
          <Text style={styles.listItem}>• Use the App for any illegal or unauthorized purpose.</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>5. Content Ownership and Rights</Text>
      <View style={styles.section}>
        <Text>
          You retain ownership of any content you post or share on the App. By posting or sharing content on the App, you grant us a non-exclusive, royalty-free, worldwide, sublicensable, and transferable license to use, reproduce, distribute and display the content in connection with the App.
        </Text>
      </View>

      <Text style={styles.subtitle}>6. Termination</Text>
      <View style={styles.section}>
        <Text>
          We may terminate or suspend your account and access to the App at our sole discretion, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the App will immediately cease.
        </Text>
      </View>

      <Text style={styles.subtitle}>7. Disclaimers</Text>
      <View style={styles.section}>
        <Text>
          The App is provided on an {`"as is" and "as available"`} basis. We make no warranties, expressed or implied, regarding the App, including but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the App will be uninterrupted, secure, or error-free.
        </Text>
      </View>

      <Text style={styles.subtitle}>8. Limitation of Liability</Text>
      <View style={styles.section}>
        <Text>
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the App; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any bugs, viruses, trojan horses, or the like that may be transmitted to or through the App by any third party; or (iv) any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the App.
        </Text>
      </View>

      <Text style={styles.subtitle}>9. Governing Law</Text>
      <View style={styles.section}>
        <Text>
          These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Wildfire is based, without regard to its conflict of law provisions.
        </Text>
      </View>

      <Text style={styles.subtitle}>10. Changes to Terms</Text>
      <View style={styles.section}>
        <Text>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 {`days'`} notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the App after any such changes constitutes your acceptance of the new Terms.
        </Text>
      </View>

      <Text style={styles.subtitle}>11. Contact Us</Text>
      <View style={styles.section}>
        <Text>If you have any questions about these Terms, please contact us at:</Text>
        <Text>
          <Text style={styles.strong}>Email:</Text> tran@micalabs.com
        </Text>
      </View>

      <View style={styles.section}>
        <Text>Thank you for using Wildfire!</Text>
      </View>
    </ScrollView>

      
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  section: {
    marginVertical: 10,
  },
  list: {
    marginVertical: 10,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 5,
  },
  strong: {
    fontWeight: 'bold',
  },
});
