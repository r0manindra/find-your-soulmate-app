import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { useSettingsStore } from '@/src/store/settings-store';

export default function TermsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const locale = useSettingsStore((s) => s.locale);
  const isDE = locale === 'de';

  const textColor = isDark ? '#F5F5F5' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#525252';

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={textColor} />
          <Text style={[styles.backText, { color: textColor }]}>
            {isDE ? 'Zurück' : 'Back'}
          </Text>
        </Pressable>

        <Text style={[styles.title, { color: textColor }]}>
          {isDE ? 'Nutzungsbedingungen' : 'Terms of Service'}
        </Text>
        <Text style={[styles.lastUpdated, { color: mutedColor }]}>
          {isDE ? 'Zuletzt aktualisiert: 25. Februar 2026' : 'Last updated: February 25, 2026'}
        </Text>

        {/* Section 1: Acceptance */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '1. Annahme der Bedingungen' : '1. Acceptance of Terms'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Durch die Nutzung der FlirtIQ-App ("App"), bereitgestellt von FlirtIQ ("wir", "uns"), stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie diesen Bedingungen nicht zustimmen, nutzen Sie die App bitte nicht.'
            : 'By using the FlirtIQ app ("App"), provided by FlirtIQ ("we", "us", "our"), you agree to these Terms of Service. If you do not agree to these terms, please do not use the App.'}
        </Text>

        {/* Section 2: Description */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '2. Beschreibung des Dienstes' : '2. Description of Service'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'FlirtIQ ist eine Dating-Bildungs-App, die soziale und Flirt-Fähigkeiten durch geführte Lektionen, KI-Coaching und Buchempfehlungen vermittelt. Die App ist kein Dating-Dienst und stellt keine Vermittlung zwischen Personen her.'
            : 'FlirtIQ is a dating education app that teaches social and flirting skills through guided lessons, AI coaching, and book recommendations. The App is not a dating service and does not facilitate matchmaking between individuals.'}
        </Text>

        {/* Section 3: Eligibility */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '3. Nutzungsberechtigung' : '3. Eligibility'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Sie müssen mindestens 16 Jahre alt sein, um die App zu nutzen. Durch die Nutzung der App bestätigen Sie, dass Sie diese Altersanforderung erfüllen.'
            : 'You must be at least 16 years old to use the App. By using the App, you confirm that you meet this age requirement.'}
        </Text>

        {/* Section 4: Account */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '4. Benutzerkonten' : '4. User Accounts'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Einige Funktionen erfordern ein Benutzerkonto. Sie sind verantwortlich für:\n\n• Die Sicherheit Ihrer Anmeldedaten\n• Alle Aktivitäten unter Ihrem Konto\n• Die Richtigkeit der angegebenen Kontoinformationen\n\nSie können Ihr Konto jederzeit löschen, indem Sie uns unter privacy@flirt-iq.com kontaktieren.'
            : 'Some features require a user account. You are responsible for:\n\n• Keeping your login credentials secure\n• All activities that occur under your account\n• Ensuring your account information is accurate\n\nYou may delete your account at any time by contacting us at privacy@flirt-iq.com.'}
        </Text>

        {/* Section 5: Subscriptions */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '5. Abonnements & Käufe' : '5. Subscriptions & Purchases'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? '• Premium-Funktionen sind über In-App-Abonnements verfügbar.\n• Abonnements werden automatisch verlängert, sofern sie nicht mindestens 24 Stunden vor Ablauf des aktuellen Zeitraums gekündigt werden.\n• Zahlungen werden über Ihr Apple-ID- bzw. Google-Play-Konto abgewickelt.\n• Abonnements können in den Einstellungen Ihres Apple- bzw. Google-Kontos verwaltet und gekündigt werden.\n• Erstattungen unterliegen den Richtlinien von Apple bzw. Google.\n• Die Preise können sich ändern, wobei wir Sie im Voraus benachrichtigen werden.'
            : '• Premium features are available through in-app subscriptions.\n• Subscriptions auto-renew unless canceled at least 24 hours before the end of the current period.\n• Payment is processed through your Apple ID or Google Play account.\n• Subscriptions can be managed and canceled in your Apple or Google account settings.\n• Refunds are subject to Apple or Google\'s refund policies.\n• Prices may change, and we will provide advance notice.'}
        </Text>

        {/* Section 6: AI Coach */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '6. KI-Coach' : '6. AI Coach'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Die KI-Coach-Funktion wird durch künstliche Intelligenz betrieben. Bitte beachten Sie:\n\n• Der KI-Coach ist kein Mensch und ersetzt keine professionelle Beratung.\n• Die bereitgestellten Inhalte dienen ausschließlich Bildungszwecken.\n• Der KI-Coach bietet keine psychologische, therapeutische oder professionelle Beziehungsberatung.\n• Wir übernehmen keine Garantie für die Genauigkeit, Vollständigkeit oder Eignung der KI-Antworten.\n• Bei ernsthaften persönlichen Problemen wenden Sie sich bitte an einen qualifizierten Fachmann.'
            : 'The AI coach feature is powered by artificial intelligence. Please note:\n\n• The AI coach is not a human and does not replace professional advice.\n• Content provided is for educational purposes only.\n• The AI coach does not provide psychological, therapeutic, or professional relationship counseling.\n• We do not guarantee the accuracy, completeness, or suitability of AI responses.\n• For serious personal issues, please consult a qualified professional.'}
        </Text>

        {/* Section 7: Acceptable Use */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '7. Akzeptable Nutzung' : '7. Acceptable Use'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Sie verpflichten sich, die App nicht zu nutzen für:\n\n• Illegale Aktivitäten oder Förderung solcher\n• Belästigung, Missbrauch oder Schädigung anderer\n• Verbreitung von schädlichen, hasserfüllten oder beleidigenden Inhalten\n• Versuche, den Dienst zu stören oder Sicherheitsmaßnahmen zu umgehen\n• Reverse Engineering oder Dekompilierung der App\n• Automatisiertes Scraping oder Datenextraktion'
            : 'You agree not to use the App for:\n\n• Illegal activities or promotion thereof\n• Harassment, abuse, or harm to others\n• Distributing harmful, hateful, or abusive content\n• Attempting to disrupt the service or circumvent security measures\n• Reverse engineering or decompiling the App\n• Automated scraping or data extraction'}
        </Text>

        {/* Section 8: Intellectual Property */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '8. Geistiges Eigentum' : '8. Intellectual Property'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Alle Inhalte der App, einschließlich Text, Grafiken, Logos, Kursstruktur und Software, sind Eigentum von FlirtIQ und durch Urheberrecht und andere Gesetze zum Schutz geistigen Eigentums geschützt. Sie erhalten eine begrenzte, nicht-exklusive, nicht übertragbare Lizenz zur persönlichen, nicht-kommerziellen Nutzung.'
            : 'All content in the App, including text, graphics, logos, course structure, and software, is the property of FlirtIQ and is protected by copyright and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license for personal, non-commercial use.'}
        </Text>

        {/* Section 9: Disclaimers */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '9. Haftungsausschluss' : '9. Disclaimers'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Die App wird "wie besehen" und "wie verfügbar" bereitgestellt. Wir übernehmen keine Garantie dafür, dass:\n\n• Die App ununterbrochen oder fehlerfrei funktioniert\n• Die Inhalte in allen Situationen zutreffend oder anwendbar sind\n• Die Nutzung der App zu bestimmten sozialen oder romantischen Ergebnissen führt\n\nDie App dient ausschließlich Bildungszwecken. Ergebnisse können variieren und hängen von individuellen Umständen ab.'
            : 'The App is provided "as is" and "as available." We do not guarantee that:\n\n• The App will operate uninterrupted or error-free\n• The content will be accurate or applicable in all situations\n• Using the App will lead to specific social or romantic outcomes\n\nThe App is for educational purposes only. Results may vary and depend on individual circumstances.'}
        </Text>

        {/* Section 10: Limitation of Liability */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '10. Haftungsbeschränkung' : '10. Limitation of Liability'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Soweit gesetzlich zulässig, haftet FlirtIQ nicht für indirekte, zufällige, besondere oder Folgeschäden, die sich aus der Nutzung oder der Unfähigkeit zur Nutzung der App ergeben. Unsere Gesamthaftung ist auf den Betrag beschränkt, den Sie in den 12 Monaten vor dem Anspruch für die App bezahlt haben.\n\nDiese Beschränkung gilt nicht für Schäden, die durch Vorsatz oder grobe Fahrlässigkeit verursacht werden, oder für die Haftung für Personenschäden gemäß österreichischem Recht.'
            : 'To the maximum extent permitted by law, FlirtIQ shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of or inability to use the App. Our total liability is limited to the amount you paid for the App in the 12 months preceding the claim.\n\nThis limitation does not apply to damages caused by willful intent or gross negligence, or to liability for personal injury under Austrian law.'}
        </Text>

        {/* Section 11: Termination */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '11. Kündigung' : '11. Termination'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir können Ihren Zugang zur App aussetzen oder kündigen, wenn Sie gegen diese Bedingungen verstoßen. Sie können die Nutzung jederzeit beenden und Ihr Konto löschen. Bei Kündigung erlöschen Ihre Nutzungsrechte an der App.'
            : 'We may suspend or terminate your access to the App if you violate these terms. You may stop using the App at any time and delete your account. Upon termination, your right to use the App ceases.'}
        </Text>

        {/* Section 12: Changes */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '12. Änderungen der Bedingungen' : '12. Changes to Terms'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir können diese Bedingungen von Zeit zu Zeit ändern. Bei wesentlichen Änderungen werden wir Sie per In-App-Benachrichtigung informieren. Die weitere Nutzung der App nach solchen Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen.'
            : 'We may modify these terms from time to time. For material changes, we will notify you via an in-app notification. Continued use of the App after such changes constitutes acceptance of the updated terms.'}
        </Text>

        {/* Section 13: Governing Law */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '13. Anwendbares Recht' : '13. Governing Law'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Diese Bedingungen unterliegen dem Recht der Republik Österreich. Für Verbraucher in der EU gelten zusätzlich die zwingenden Verbraucherschutzvorschriften des Landes, in dem Sie Ihren gewöhnlichen Aufenthalt haben.'
            : 'These terms are governed by the laws of the Republic of Austria. For consumers in the EU, the mandatory consumer protection provisions of the country of your habitual residence additionally apply.'}
        </Text>

        {/* Section 14: Contact */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '14. Kontakt' : '14. Contact'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Bei Fragen zu diesen Nutzungsbedingungen kontaktieren Sie uns unter:\n\nFlirtIQ\nE-Mail: support@flirt-iq.com'
            : 'For questions about these Terms of Service, contact us at:\n\nFlirtIQ\nEmail: support@flirt-iq.com'}
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  content: { padding: 20, paddingBottom: 60 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 17, fontWeight: '500' },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, marginBottom: 4 },
  lastUpdated: { fontSize: 13, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2, marginTop: 24, marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 22 },
  bottomSpacer: { height: 40 },
});
