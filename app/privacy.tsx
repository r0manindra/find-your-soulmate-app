import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { useSettingsStore } from '@/src/store/settings-store';

export default function PrivacyScreen() {
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
          {isDE ? 'Datenschutzerklärung' : 'Privacy Policy'}
        </Text>
        <Text style={[styles.lastUpdated, { color: mutedColor }]}>
          {isDE ? 'Zuletzt aktualisiert: 25. Februar 2026' : 'Last updated: February 25, 2026'}
        </Text>

        {/* Section 1: Data Controller */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '1. Verantwortliche Stelle' : '1. Data Controller'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Verantwortlich für die Datenverarbeitung ist:\n\nFlirtIQ\nInhaber: Roman Indra\nE-Mail: privacy@flirt-iq.com\n\nFür Fragen zum Datenschutz kontaktieren Sie uns bitte unter der oben genannten E-Mail-Adresse.'
            : 'The data controller responsible for processing your data is:\n\nFlirtIQ\nOwner: Roman Indra\nEmail: privacy@flirt-iq.com\n\nFor any data protection inquiries, please contact us at the email address above.'}
        </Text>

        {/* Section 2: Data We Collect */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '2. Welche Daten wir erheben' : '2. Data We Collect'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? '• Kontodaten: E-Mail-Adresse, Name (optional)\n• App-Nutzungsdaten: Kapitelfortschritt, Quiz-Ergebnisse, Fähigkeitsstufe, Onboarding-Antworten\n• AI-Coach-Nachrichten: Gespräche mit dem KI-Coach\n• Abo-/Kaufdaten: Kaufverlauf (über RevenueCat)\n• Technische Daten: Gerätetyp, Betriebssystem-Version, App-Version, Absturzberichte\n• Lokale Daten: Einstellungen und Fortschritt lokal auf Ihrem Gerät (AsyncStorage)\n\nWir erheben KEINE Standortdaten, biometrischen Daten, Dating-Profile oder Daten zum persönlichen Matching.'
            : '• Account data: Email address, name (optional)\n• App usage data: Chapter completion progress, quiz results, skill level, onboarding responses\n• AI coach messages: Conversations with the AI coach\n• Subscription/purchase data: Purchase history (via RevenueCat)\n• Technical data: Device type, OS version, app version, crash reports\n• Local data: Preferences and progress stored locally on your device (AsyncStorage)\n\nWe do NOT collect location data, biometric data, dating profiles, or personal matchmaking data.'}
        </Text>

        {/* Section 3: Legal Basis */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '3. Rechtsgrundlage der Verarbeitung' : '3. Legal Basis for Processing'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir verarbeiten Ihre Daten auf folgenden Rechtsgrundlagen (Art. 6 DSGVO):\n\n• Vertragserfüllung (Art. 6 Abs. 1 lit. b): Kontodaten, App-Fortschritt, KI-Coach-Nachrichten und Kaufdaten — notwendig zur Erbringung unserer Dienste.\n• Berechtigtes Interesse (Art. 6 Abs. 1 lit. f): Analytics und Absturzberichte — zur Verbesserung der App-Stabilität und -Leistung.\n• Einwilligung (Art. 6 Abs. 1 lit. a): Marketing-Kommunikation (nur mit ausdrücklichem Opt-in).'
            : 'We process your data on the following legal bases (GDPR Art. 6):\n\n• Contract performance (Art. 6(1)(b)): Account data, app progress, AI coach messages, and purchase data — necessary to provide our services.\n• Legitimate interest (Art. 6(1)(f)): Analytics and crash reports — to improve app stability and performance.\n• Consent (Art. 6(1)(a)): Marketing communications (only with explicit opt-in).'}
        </Text>

        {/* Section 4: Purpose */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '4. Zweck der Datenverarbeitung' : '4. Purpose of Data Processing'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? '• Bereitstellung des Dating-Bildungsdienstes (Kapitel, KI-Coaching)\n• Personalisierung von Inhalten basierend auf Ihrem Nutzerprofil\n• Verwaltung von Abonnements und Premium-Funktionen\n• App-Analyse und Leistungsverbesserung\n• Betrugsprävention (RevenueCat-Kaufvalidierung)\n• Kommunikation bezüglich Ihres Kontos'
            : '• Providing the dating education service (chapters, AI coaching)\n• Personalizing content based on your user profile\n• Managing subscriptions and premium features\n• App analytics and performance improvement\n• Fraud prevention (RevenueCat receipt validation)\n• Communicating with you about your account'}
        </Text>

        {/* Section 5: AI Disclosure */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '5. KI-Coaching & Transparenz' : '5. AI Coaching & Transparency'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Unsere Coach-Funktion wird durch künstliche Intelligenz betrieben. Sie interagieren mit einem KI-System, nicht mit einem Menschen. Gemäß EU AI Act (Artikel 50):\n\n• Ihre Chat-Nachrichten werden zur Antwortgenerierung an unseren KI-Dienstleister übermittelt.\n• Ihre Chat-Daten werden NICHT zum Training von KI-Modellen verwendet.\n• Der KI-Coach bietet Bildungsinhalte — keine professionelle psychologische oder Beziehungsberatung.\n• Sie können Ihren Chat-Verlauf jederzeit löschen.\n• Chat-Nachrichten werden maximal 90 Tage auf unseren Servern gespeichert.'
            : 'Our coach feature is powered by artificial intelligence. You are interacting with an AI system, not a human. In compliance with the EU AI Act (Article 50):\n\n• Your chat messages are sent to our AI service provider to generate responses.\n• Your chat data is NOT used to train AI models.\n• The AI coach provides educational content — not professional psychological or relationship counseling.\n• You can delete your chat history at any time.\n• Chat messages are retained on our servers for a maximum of 90 days.'}
        </Text>

        {/* Section 6: Third Parties */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '6. Drittanbieter & Datenempfänger' : '6. Third-Party Services & Data Recipients'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir arbeiten mit folgenden Drittanbietern zusammen:\n\n• RevenueCat — Abo-Verwaltung (Kaufverlauf, anonyme Nutzer-ID)\n• Firebase (Google) — Backend, Analytics, Absturzberichte\n• Supabase — Datenbank und Backend (Kontodaten, Fortschritt, Chat)\n• KI-Dienstleister — Generierung von Coach-Antworten (Chat-Nachrichten)\n• Apple — App-Verteilung und Zahlungsabwicklung\n\nMit jedem Dienstleister besteht eine Auftragsverarbeitungsvereinbarung (AVV) gemäß DSGVO.'
            : 'We work with the following third-party services:\n\n• RevenueCat — Subscription management (purchase history, anonymous user ID)\n• Firebase (Google) — Backend, analytics, crash reports\n• Supabase — Database and backend (account data, progress, chat messages)\n• AI service provider — Coach response generation (chat messages)\n• Apple — App distribution and payment processing\n\nA Data Processing Agreement (DPA) is in place with each service provider in compliance with GDPR.'}
        </Text>

        {/* Section 7: International Transfers */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '7. Internationale Datenübermittlungen' : '7. International Data Transfers'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Einige unserer Dienstleister haben ihren Sitz in den USA oder anderen Ländern außerhalb des EWR. Datenübermittlungen werden durch folgende Mechanismen geschützt:\n\n• EU-US Data Privacy Framework (soweit anwendbar)\n• EU-Standardvertragsklauseln (SCCs)\n\nWir stellen sicher, dass alle internationalen Übermittlungen ein angemessenes Schutzniveau bieten.'
            : 'Some of our service providers are based in the United States or other countries outside the EEA. Data transfers are protected through:\n\n• EU-US Data Privacy Framework (where applicable)\n• EU Standard Contractual Clauses (SCCs)\n\nWe ensure all international transfers maintain an adequate level of data protection.'}
        </Text>

        {/* Section 8: Data Retention */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '8. Speicherdauer' : '8. Data Retention'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? '• Kontodaten: Für die Dauer des Kontos; Löschung auf Anfrage\n• KI-Chat-Nachrichten: Maximal 90 Tage oder bei früherer Löschungsanfrage\n• Kaufverlauf: Bis zu 7 Jahre gemäß österreichischer Bundesabgabenordnung (BAO)\n• Analytics-Daten: Anonymisiert oder gelöscht nach 26 Monaten\n• Lokale Daten (AsyncStorage): Nur auf Ihrem Gerät; werden bei Deinstallation gelöscht'
            : '• Account data: Retained for the duration of the account; deleted upon request\n• AI chat messages: Maximum 90 days, or upon earlier deletion request\n• Purchase history: Up to 7 years as required by Austrian tax law (BAO)\n• Analytics data: Anonymized or deleted after 26 months\n• Local data (AsyncStorage): Stored only on your device; cleared when the app is uninstalled'}
        </Text>

        {/* Section 9: Your Rights */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '9. Ihre Rechte' : '9. Your Rights'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Gemäß DSGVO haben Sie folgende Rechte:\n\n• Auskunftsrecht (Art. 15) — Kopie Ihrer personenbezogenen Daten anfordern\n• Recht auf Berichtigung (Art. 16) — Korrektur unrichtiger Daten\n• Recht auf Löschung (Art. 17) — Löschung Ihrer Daten verlangen\n• Recht auf Einschränkung der Verarbeitung (Art. 18)\n• Recht auf Datenübertragbarkeit (Art. 20) — Ihre Daten in maschinenlesbarem Format erhalten\n• Widerspruchsrecht (Art. 21) — der Verarbeitung widersprechen\n• Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3) — jederzeit, ohne Auswirkung auf die Rechtmäßigkeit vorheriger Verarbeitung\n\nZur Ausübung Ihrer Rechte kontaktieren Sie uns unter: privacy@flirt-iq.com\n\nSie haben außerdem das Recht, eine Beschwerde bei der österreichischen Datenschutzbehörde (dsb.gv.at) einzureichen.'
            : 'Under the GDPR, you have the following rights:\n\n• Right of access (Art. 15) — request a copy of your personal data\n• Right to rectification (Art. 16) — correct inaccurate data\n• Right to erasure (Art. 17) — request deletion of your data\n• Right to restriction of processing (Art. 18)\n• Right to data portability (Art. 20) — receive your data in a machine-readable format\n• Right to object (Art. 21) — object to processing based on legitimate interest\n• Right to withdraw consent (Art. 7(3)) — at any time, without affecting the lawfulness of prior processing\n\nTo exercise your rights, contact us at: privacy@flirt-iq.com\n\nYou also have the right to lodge a complaint with the Austrian Data Protection Authority (Datenschutzbehörde, dsb.gv.at).'}
        </Text>

        {/* Section 10: Account Deletion */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '10. Kontolöschung' : '10. Account Deletion'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Sie können Ihr Konto und alle zugehörigen Daten jederzeit löschen, indem Sie uns unter privacy@flirt-iq.com kontaktieren. Bei Löschung:\n\n• Ihr Konto und Profildaten werden dauerhaft gelöscht\n• KI-Chat-Verlauf wird gelöscht\n• Kaufbelege können gemäß gesetzlicher Anforderungen aufbewahrt werden\n• Lokale Daten auf Ihrem Gerät werden bei Deinstallation entfernt'
            : 'You can delete your account and all associated data at any time by contacting us at privacy@flirt-iq.com. Upon deletion:\n\n• Your account and profile data will be permanently removed\n• AI chat history will be deleted\n• Purchase receipts may be retained as required by law\n• Local data on your device is removed when you uninstall the app'}
        </Text>

        {/* Section 11: Tracking Technologies */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '11. Tracking-Technologien' : '11. Tracking Technologies'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir verwenden Firebase Analytics zur Erfassung anonymisierter Nutzungsstatistiken und Absturzberichte. Gemäß dem österreichischen Telekommunikationsgesetz (TKG 2021, § 165) holen wir Ihre Einwilligung ein, bevor nicht-essenzielle Tracking-Technologien eingesetzt werden.\n\nAsyncStorage wird ausschließlich lokal auf Ihrem Gerät verwendet, um App-Einstellungen und Fortschritt zu speichern. Dies stellt kein Tracking dar.'
            : 'We use Firebase Analytics to collect anonymized usage statistics and crash reports. In compliance with the Austrian Telecommunications Act (TKG 2021, Section 165), we obtain your consent before using any non-essential tracking technologies.\n\nAsyncStorage is used locally on your device only, to save app preferences and progress. This does not constitute tracking.'}
        </Text>

        {/* Section 12: Data Security */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '12. Datensicherheit' : '12. Data Security'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir setzen technische und organisatorische Maßnahmen zum Schutz Ihrer Daten ein:\n\n• Verschlüsselung bei der Übertragung (HTTPS/TLS)\n• Verschlüsselung im Ruhezustand\n• Zugriffskontrollen und Authentifizierung\n• Regelmäßige Sicherheitsüberprüfungen\n• Verfahren zur Reaktion auf Vorfälle'
            : 'We implement technical and organizational measures to protect your data:\n\n• Encryption in transit (HTTPS/TLS)\n• Encryption at rest\n• Access controls and authentication\n• Regular security reviews\n• Incident response procedures'}
        </Text>

        {/* Section 13: Children */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '13. Kinder & Jugendliche' : "13. Children's Privacy"}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'FlirtIQ ist nicht für Personen unter 16 Jahren bestimmt. Wir erheben wissentlich keine Daten von Kindern unter 16 Jahren. Sollten wir erfahren, dass wir Daten eines Kindes erhoben haben, werden diese unverzüglich gelöscht.'
            : 'FlirtIQ is not intended for individuals under the age of 16. We do not knowingly collect data from children under 16. If we become aware that we have collected data from a child, we will promptly delete it.'}
        </Text>

        {/* Section 14: Changes */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '14. Änderungen dieser Erklärung' : '14. Changes to This Policy'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Bei wesentlichen Änderungen werden wir Sie per In-App-Benachrichtigung informieren. Das Datum der letzten Aktualisierung finden Sie oben auf dieser Seite.'
            : 'We may update this privacy policy from time to time. For material changes, we will notify you via an in-app notification. The date of the last update is shown at the top of this page.'}
        </Text>

        {/* Section 15: Contact */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '15. Kontakt' : '15. Contact'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'FlirtIQ\nInhaber: Roman Indra\nE-Mail: privacy@flirt-iq.com\n\nBei Fragen zum Datenschutz kontaktieren Sie uns gerne. Sie haben außerdem das Recht, sich an die österreichische Datenschutzbehörde (dsb.gv.at) zu wenden.'
            : 'FlirtIQ\nOwner: Roman Indra\nEmail: privacy@flirt-iq.com\n\nFor any questions about data protection, please contact us. You also have the right to contact the Austrian Data Protection Authority (Datenschutzbehörde, dsb.gv.at).'}
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
