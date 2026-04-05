import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { LiquidGlassIconButton } from '@/src/presentation/components/ui/liquid-glass-icon-button';
import { useSettingsStore } from '@/src/store/settings-store';

export default function PrivacyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const locale = useSettingsStore((s) => s.locale);
  const isDE = locale === 'de';

  const textColor = isDark ? '#F5F5F5' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#525252';

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: 70 }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: textColor }]}>
          {isDE ? 'Datenschutzerkl\u00e4rung' : 'Privacy Policy'}
        </Text>
        <Text style={[styles.lastUpdated, { color: mutedColor }]}>
          {isDE ? 'Zuletzt aktualisiert: 6. April 2026' : 'Last updated: April 6, 2026'}
        </Text>

        {/* Section 1: Data Controller */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '1. Verantwortliche Stelle' : '1. Data Controller'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Verantwortlich f\u00fcr die Datenverarbeitung ist:\n\nRoman Indra (Einzelunternehmer)\nE-Mail: privacy@charismo.app\n\nF\u00fcr Fragen zum Datenschutz kontaktieren Sie uns bitte unter der oben genannten E-Mail-Adresse.'
            : 'The data controller responsible for processing your data is:\n\nRoman Indra (Sole Proprietor)\nEmail: privacy@charismo.app\n\nFor any data protection inquiries, please contact us at the email address above.'}
        </Text>

        {/* Section 2: Data We Collect */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '2. Welche Daten wir erheben' : '2. Data We Collect'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'a) Kontodaten (serverseitig gespeichert):\n\u2022 E-Mail-Adresse\n\u2022 Name (optional)\n\u2022 Geburtsdatum (zur Altersverifikation)\n\u2022 Authentifizierungsmethode (E-Mail, Google oder Apple)\n\u2022 Konto-Erstellungsdatum\n\nb) Profilangaben (nur auf Ihrem Ger\u00e4t gespeichert):\n\u2022 Geschlecht, Altersgruppe, soziale Energie\n\u2022 F\u00e4higkeitsstufe und Lernziel\n\u2022 Onboarding-Antworten\n\nDiese Profildaten werden bei jeder Coach-Anfrage vor\u00fcbergehend an unseren Server \u00fcbermittelt, aber NICHT dauerhaft in unserer Datenbank gespeichert.\n\nc) Nutzungsdaten (Server + Ger\u00e4t):\n\u2022 Abgeschlossene Kapitel und B\u00fccher\n\u2022 Tages-Streak und letzter Aktivit\u00e4tstag\n\u2022 Anzahl der Coach-Nachrichten\n\u2022 Quiz-Ergebnisse (nur auf dem Ger\u00e4t)\n\u2022 Gewohnheiten und Fortschritt (nur auf dem Ger\u00e4t)\n\nd) KI-Coach-Nachrichten (serverseitig gespeichert):\n\u2022 Ihre Chat-Nachrichten und KI-Antworten\n\u2022 Gespr\u00e4chs-ID und verwendeter Coach-Charakter\n\ne) Abo- und Kaufdaten:\n\u2022 Abonnementstatus (Gratis, Pro, Pro+)\n\u2022 RevenueCat-Nutzer-ID\n\nf) Ger\u00e4teeinstellungen (nur auf dem Ger\u00e4t):\n\u2022 Spracheinstellung, ausgew\u00e4hlter Coach, Theme-Modus\n\nWir erheben KEINE Standortdaten, Kontakte, Fotos, Werbe-IDs oder biometrische Daten. Es sind KEINE Analyse- oder Tracking-SDKs installiert.'
            : 'a) Account data (stored on our server):\n\u2022 Email address\n\u2022 Name (optional)\n\u2022 Date of birth (for age verification)\n\u2022 Authentication method (email, Google, or Apple)\n\u2022 Account creation date\n\nb) Profile data (stored only on your device):\n\u2022 Gender, age group, social energy level\n\u2022 Skill level and learning goal\n\u2022 Onboarding quiz responses\n\nThis profile data is transmitted to our server temporarily with each coaching request but is NOT stored permanently in our database.\n\nc) Usage data (server + device):\n\u2022 Completed chapters and books\n\u2022 Daily streak and last active date\n\u2022 Coach message count\n\u2022 Quiz scores (device only)\n\u2022 Habits and progress (device only)\n\nd) AI coach messages (stored on server):\n\u2022 Your chat messages and AI responses\n\u2022 Conversation ID and coach character used\n\ne) Subscription and purchase data:\n\u2022 Subscription status (Free, Pro, Pro+)\n\u2022 RevenueCat user ID\n\nf) Device settings (device only):\n\u2022 Language preference, selected coach character, theme mode\n\nWe do NOT collect location data, contacts, photos, advertising IDs, or biometric data. NO analytics or tracking SDKs are installed.'}
        </Text>

        {/* Section 3: Legal Basis */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '3. Rechtsgrundlage der Verarbeitung (DSGVO)' : '3. Legal Basis for Processing (GDPR)'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir verarbeiten Ihre Daten auf folgenden Rechtsgrundlagen (Art. 6 DSGVO):\n\n\u2022 Vertragserf\u00fcllung (Art. 6 Abs. 1 lit. b): Kontodaten, App-Fortschritt, KI-Coach-Nachrichten und Kaufdaten \u2014 notwendig zur Erbringung unserer Dienste.\n\u2022 Berechtigtes Interesse (Art. 6 Abs. 1 lit. f): Rate-Limiting und Betrugserkennung \u2014 zum Schutz unseres Dienstes.\n\u2022 Gesetzliche Verpflichtung (Art. 6 Abs. 1 lit. c): Aufbewahrung von Kaufbelegen gem\u00e4\u00df Steuerrecht.'
            : 'We process your data on the following legal bases (GDPR Art. 6):\n\n\u2022 Contract performance (Art. 6(1)(b)): Account data, app progress, AI coach messages, and purchase data \u2014 necessary to provide our services.\n\u2022 Legitimate interest (Art. 6(1)(f)): Rate limiting and fraud prevention \u2014 to protect our service.\n\u2022 Legal obligation (Art. 6(1)(c)): Retention of purchase records as required by tax law.'}
        </Text>

        {/* Section 4: Purpose */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '4. Zweck der Datenverarbeitung' : '4. Purpose of Data Processing'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? '\u2022 Bereitstellung des Bildungsdienstes (Kapitel, Phrasen, KI-Coaching)\n\u2022 Personalisierung von Inhalten basierend auf Ihrem Profil\n\u2022 Verwaltung von Abonnements und Premium-Funktionen\n\u2022 Rate-Limiting (Hearts-System) zum Schutz vor Missbrauch\n\u2022 Betrugserkennung bei K\u00e4ufen (RevenueCat-Kaufvalidierung)\n\u2022 Alterssicherung (Mindestalter 16 Jahre)'
            : '\u2022 Providing the education service (chapters, phrases, AI coaching)\n\u2022 Personalizing content based on your profile\n\u2022 Managing subscriptions and premium features\n\u2022 Rate limiting (hearts system) to prevent abuse\n\u2022 Fraud prevention (RevenueCat receipt validation)\n\u2022 Age verification (minimum age 16)'}
        </Text>

        {/* Section 5: AI Disclosure */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '5. KI-Coaching & Datenverarbeitung' : '5. AI Coaching & Data Processing'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Unsere Coach-Funktion wird durch k\u00fcnstliche Intelligenz von Anthropic (Claude) betrieben. Gem\u00e4\u00df EU AI Act (Artikel 50) informieren wir Sie:\n\n\u2022 Sie interagieren mit einem KI-System, NICHT mit einem Menschen.\n\u2022 Bei jeder Coach-Nachricht werden folgende Daten an die Anthropic-API \u00fcbermittelt: Ihre Nachricht, die letzten 20 Nachrichten der Unterhaltung, eine Zusammenfassung Ihres Profils (Geschlecht, Altersgruppe, F\u00e4higkeitsstufe, soziale Energie, Lernziel), Ihr Fortschritt (Kapitel, Streak), aktive Gewohnheiten und der Inhalt des aktuellen Kapitels.\n\u2022 Anthropic verarbeitet diese Daten ausschlie\u00dflich zur Generierung der Antwort. Gem\u00e4\u00df Anthropics Nutzungsbedingungen f\u00fcr die API werden Ihre Daten NICHT zum Training von KI-Modellen verwendet.\n\u2022 F\u00fcr Quiz-Generierung wird Kapitelinhalt (ohne pers\u00f6nliche Daten) an Anthropic gesendet.\n\u2022 Der KI-Coach bietet Bildungsinhalte \u2014 keine professionelle psychologische oder Beziehungsberatung.\n\u2022 Sie k\u00f6nnen Ihren Chat-Verlauf jederzeit l\u00f6schen.'
            : 'Our coach feature is powered by artificial intelligence from Anthropic (Claude). In compliance with the EU AI Act (Article 50), we inform you:\n\n\u2022 You are interacting with an AI system, NOT a human.\n\u2022 With each coaching message, the following data is sent to the Anthropic API: your message, the last 20 messages of the conversation, a summary of your profile (gender, age group, skill level, social energy, goal), your progress (chapters, streak), active habits, and the current chapter content.\n\u2022 Anthropic processes this data solely to generate the response. Per Anthropic\'s API terms, your data is NOT used to train AI models.\n\u2022 For quiz generation, chapter content (no personal data) is sent to Anthropic.\n\u2022 The AI coach provides educational content \u2014 not professional psychological or relationship counseling.\n\u2022 You can delete your chat history at any time.'}
        </Text>

        {/* Section 6: Third Parties */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '6. Drittanbieter & Datenempf\u00e4nger' : '6. Third-Party Services & Data Recipients'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir arbeiten mit folgenden Drittanbietern zusammen:\n\n\u2022 Anthropic (USA) \u2014 KI-Dienstleister f\u00fcr Coach-Antworten und Quiz-Generierung. Empf\u00e4ngt: Chat-Nachrichten, Profilzusammenfassung, Kapitelinhalte.\n\u2022 RevenueCat (USA) \u2014 Abo-Verwaltung. Empf\u00e4ngt: App-Nutzer-ID, Kauftransaktionen, Ger\u00e4teplattform.\n\u2022 Google (USA) \u2014 OAuth-Authentifizierung (falls gew\u00e4hlt). Empf\u00e4ngt/liefert: E-Mail, Name, Google-Nutzer-ID.\n\u2022 Apple (USA) \u2014 Sign-in mit Apple (falls gew\u00e4hlt) und App-Verteilung. Empf\u00e4ngt/liefert: Apple-Nutzer-ID, optional E-Mail und Name.\n\u2022 Railway (USA) \u2014 Server-Hosting. Standard-HTTP-Logs k\u00f6nnen IP-Adressen enthalten.\n\nKein Drittanbieter erh\u00e4lt mehr Daten als f\u00fcr seinen spezifischen Zweck erforderlich.'
            : 'We work with the following third-party services:\n\n\u2022 Anthropic (USA) \u2014 AI service provider for coach responses and quiz generation. Receives: chat messages, profile summary, chapter content.\n\u2022 RevenueCat (USA) \u2014 Subscription management. Receives: app user ID, purchase transactions, device platform.\n\u2022 Google (USA) \u2014 OAuth authentication (if chosen). Receives/provides: email, name, Google user ID.\n\u2022 Apple (USA) \u2014 Sign in with Apple (if chosen) and app distribution. Receives/provides: Apple user ID, optionally email and name.\n\u2022 Railway (USA) \u2014 Server hosting. Standard HTTP logs may contain IP addresses.\n\nNo third party receives more data than is necessary for its specific purpose.'}
        </Text>

        {/* Section 7: International Transfers */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '7. Internationale Daten\u00fcbermittlungen' : '7. International Data Transfers'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Unsere Dienstleister haben ihren Sitz in den USA. Daten\u00fcbermittlungen werden gesch\u00fctzt durch:\n\n\u2022 EU-US Data Privacy Framework (f\u00fcr zertifizierte Unternehmen)\n\u2022 EU-Standardvertragsklauseln (SCCs)\n\nWir stellen sicher, dass alle internationalen \u00dcbermittlungen ein angemessenes Datenschutzniveau bieten.'
            : 'Our service providers are based in the United States. Data transfers are protected through:\n\n\u2022 EU-US Data Privacy Framework (for certified companies)\n\u2022 EU Standard Contractual Clauses (SCCs)\n\nWe ensure all international transfers maintain an adequate level of data protection.'}
        </Text>

        {/* Section 8: Data Retention */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '8. Speicherdauer' : '8. Data Retention'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? '\u2022 Kontodaten: F\u00fcr die Dauer des Kontos; L\u00f6schung auf Anfrage\n\u2022 KI-Chat-Nachrichten: F\u00fcr die Dauer des Kontos; bei Kontol\u00f6schung werden alle Nachrichten gel\u00f6scht\n\u2022 Kaufbelege: Bis zu 7 Jahre gem\u00e4\u00df \u00f6sterreichischer Bundesabgabenordnung (BAO)\n\u2022 Lokale Daten (AsyncStorage): Nur auf Ihrem Ger\u00e4t; werden bei Deinstallation gel\u00f6scht\n\u2022 Server-Logs (IP-Adressen): Automatisch nach 30 Tagen gel\u00f6scht'
            : '\u2022 Account data: Retained for the duration of the account; deleted upon request\n\u2022 AI chat messages: Retained for the duration of the account; all messages are deleted when the account is deleted\n\u2022 Purchase records: Up to 7 years as required by Austrian tax law (BAO)\n\u2022 Local data (AsyncStorage): Stored only on your device; cleared when the app is uninstalled\n\u2022 Server logs (IP addresses): Automatically deleted after 30 days'}
        </Text>

        {/* Section 9: Your Rights (GDPR) */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '9. Ihre Rechte (DSGVO)' : '9. Your Rights (GDPR)'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wenn Sie sich im Europ\u00e4ischen Wirtschaftsraum (EWR) befinden, haben Sie gem\u00e4\u00df DSGVO folgende Rechte:\n\n\u2022 Auskunftsrecht (Art. 15) \u2014 Kopie Ihrer Daten anfordern\n\u2022 Recht auf Berichtigung (Art. 16) \u2014 Korrektur unrichtiger Daten\n\u2022 Recht auf L\u00f6schung (Art. 17) \u2014 L\u00f6schung Ihrer Daten verlangen\n\u2022 Recht auf Einschr\u00e4nkung (Art. 18) \u2014 Verarbeitung einschr\u00e4nken\n\u2022 Recht auf Daten\u00fcbertragbarkeit (Art. 20) \u2014 Daten in maschinenlesbarem Format\n\u2022 Widerspruchsrecht (Art. 21) \u2014 der Verarbeitung widersprechen\n\u2022 Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3)\n\nZur Aus\u00fcbung Ihrer Rechte kontaktieren Sie uns unter: privacy@charismo.app\nWir antworten innerhalb von 30 Tagen.\n\nSie haben au\u00dferdem das Recht, eine Beschwerde bei der \u00f6sterreichischen Datenschutzbe\u00f6rde (dsb.gv.at) einzureichen.'
            : 'If you are located in the European Economic Area (EEA), you have the following rights under GDPR:\n\n\u2022 Right of access (Art. 15) \u2014 request a copy of your data\n\u2022 Right to rectification (Art. 16) \u2014 correct inaccurate data\n\u2022 Right to erasure (Art. 17) \u2014 request deletion of your data\n\u2022 Right to restriction (Art. 18) \u2014 restrict processing\n\u2022 Right to data portability (Art. 20) \u2014 receive data in machine-readable format\n\u2022 Right to object (Art. 21) \u2014 object to processing\n\u2022 Right to withdraw consent (Art. 7(3))\n\nTo exercise your rights, contact us at: privacy@charismo.app\nWe will respond within 30 days.\n\nYou also have the right to lodge a complaint with the Austrian Data Protection Authority (Datenschutzbehoerde, dsb.gv.at).'}
        </Text>

        {/* Section 10: CCPA */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '10. Ihre Rechte (CCPA \u2014 Kalifornien)' : '10. Your Rights (CCPA \u2014 California)'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wenn Sie in Kalifornien ans\u00e4ssig sind, haben Sie gem\u00e4\u00df dem California Consumer Privacy Act (CCPA) folgende Rechte:\n\n\u2022 Recht auf Auskunft \u2014 Erfahren Sie, welche pers\u00f6nlichen Daten wir \u00fcber Sie erheben, verwenden und weitergeben\n\u2022 Recht auf L\u00f6schung \u2014 Verlangen Sie die L\u00f6schung Ihrer pers\u00f6nlichen Daten\n\u2022 Recht auf Opt-out \u2014 Dem Verkauf oder der Weitergabe Ihrer Daten widersprechen\n\u2022 Recht auf Nichtdiskriminierung \u2014 Keine Benachteiligung bei Aus\u00fcbung Ihrer Rechte\n\nWichtige Hinweise:\n\u2022 Wir VERKAUFEN Ihre pers\u00f6nlichen Daten NICHT.\n\u2022 Wir TEILEN Ihre pers\u00f6nlichen Daten NICHT f\u00fcr gezieltes Werbe-Targeting.\n\nZur Aus\u00fcbung Ihrer CCPA-Rechte kontaktieren Sie: privacy@charismo.app'
            : 'If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):\n\n\u2022 Right to know \u2014 Learn what personal information we collect, use, and share about you\n\u2022 Right to delete \u2014 Request deletion of your personal information\n\u2022 Right to opt-out \u2014 Opt out of the sale or sharing of your personal information\n\u2022 Right to non-discrimination \u2014 No penalty for exercising your rights\n\nImportant disclosures:\n\u2022 We do NOT sell your personal information.\n\u2022 We do NOT share your personal information for cross-context behavioral advertising.\n\nTo exercise your CCPA rights, contact: privacy@charismo.app'}
        </Text>

        {/* Section 11: Account Deletion */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '11. Kontol\u00f6schung' : '11. Account Deletion'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Sie k\u00f6nnen Ihr Konto und alle zugehoerigen Daten jederzeit l\u00f6schen, indem Sie uns unter privacy@charismo.app kontaktieren. Bei L\u00f6schung:\n\n\u2022 Ihr Konto und Profildaten werden dauerhaft gel\u00f6scht\n\u2022 Alle KI-Chat-Nachrichten werden gel\u00f6scht (Kaskadierung)\n\u2022 Kaufbelege k\u00f6nnen gem\u00e4\u00df gesetzlicher Anforderungen aufbewahrt werden\n\u2022 Lokale Daten auf Ihrem Ger\u00e4t werden bei Deinstallation entfernt\n\u2022 Daten bei Drittanbietern (RevenueCat, Anthropic) unterliegen deren L\u00f6schrichtlinien'
            : 'You can delete your account and all associated data at any time by contacting us at privacy@charismo.app. Upon deletion:\n\n\u2022 Your account and profile data will be permanently removed\n\u2022 All AI chat messages will be deleted (cascade deletion)\n\u2022 Purchase receipts may be retained as required by law\n\u2022 Local data on your device is removed when you uninstall the app\n\u2022 Data held by third parties (RevenueCat, Anthropic) is subject to their deletion policies'}
        </Text>

        {/* Section 12: Calendar Access */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '12. Kalenderzugriff' : '12. Calendar Access'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Die App kann mit Ihrer Erlaubnis Kalendereintr\u00e4ge f\u00fcr Gewohnheitserinnerungen erstellen. Wir:\n\n\u2022 Erstellen NUR Eintr\u00e4ge \u2014 wir lesen Ihre bestehenden Kalendereintr\u00e4ge NICHT\n\u2022 Senden KEINE Kalenderdaten an unsere Server\n\u2022 Verwenden den Zugriff ausschlie\u00dflich f\u00fcr die von Ihnen erstellten Erinnerungen'
            : 'The app may, with your permission, create calendar events for habit reminders. We:\n\n\u2022 Only CREATE entries \u2014 we do NOT read your existing calendar events\n\u2022 Do NOT send any calendar data to our servers\n\u2022 Use access solely for the reminders you create'}
        </Text>

        {/* Section 13: Data Security */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '13. Datensicherheit' : '13. Data Security'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir setzen folgende Ma\u00dfnahmen zum Schutz Ihrer Daten ein:\n\n\u2022 Verschl\u00fcsselung bei der \u00dcbertragung (HTTPS/TLS)\n\u2022 Passw\u00f6rter werden mit bcrypt (12 Runden) gehasht \u2014 nie im Klartext gespeichert\n\u2022 JWT-Authentifizierungstoken laufen nach 30 Tagen ab\n\u2022 Zugriffskontrollen und Authentifizierung f\u00fcr alle API-Endpunkte\n\u2022 Datenbank-Zugriff nur \u00fcber authentifizierte Verbindungen'
            : 'We implement the following measures to protect your data:\n\n\u2022 Encryption in transit (HTTPS/TLS)\n\u2022 Passwords are hashed with bcrypt (12 rounds) \u2014 never stored in plaintext\n\u2022 JWT authentication tokens expire after 30 days\n\u2022 Access controls and authentication for all API endpoints\n\u2022 Database access restricted to authenticated connections'}
        </Text>

        {/* Section 14: Children */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '14. Kinder & Jugendliche' : "14. Children's Privacy"}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Charismo ist nicht f\u00fcr Personen unter 16 Jahren bestimmt. Bei der Registrierung wird das Geburtsdatum \u00fcberpr\u00fcft, um sicherzustellen, dass Nutzer mindestens 16 Jahre alt sind. Sollten wir erfahren, dass wir Daten eines Kindes unter 16 Jahren erhoben haben, werden diese unverz\u00fcglich gel\u00f6scht.'
            : 'Charismo is not intended for individuals under the age of 16. Date of birth is verified during registration to ensure users are at least 16 years old. If we become aware that we have collected data from a child under 16, we will promptly delete it.'}
        </Text>

        {/* Section 15: No Tracking */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '15. Tracking & Werbung' : '15. Tracking & Advertising'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Charismo enth\u00e4lt KEINE Analyse-, Werbe- oder Tracking-SDKs. Wir:\n\n\u2022 Verwenden KEIN Firebase Analytics, Google Analytics oder vergleichbare Dienste\n\u2022 Zeigen KEINE Werbung an\n\u2022 Erstellen KEINE Nutzerprofile f\u00fcr Werbezwecke\n\u2022 Erheben KEINE Ger\u00e4te-IDs oder Werbe-Identifikatoren\n\nAsyncStorage wird ausschlie\u00dflich lokal auf Ihrem Ger\u00e4t verwendet, um App-Einstellungen und Fortschritt zu speichern.'
            : 'Charismo contains NO analytics, advertising, or tracking SDKs. We:\n\n\u2022 Do NOT use Firebase Analytics, Google Analytics, or similar services\n\u2022 Do NOT display advertisements\n\u2022 Do NOT create user profiles for advertising purposes\n\u2022 Do NOT collect device IDs or advertising identifiers\n\nAsyncStorage is used locally on your device only, to save app preferences and progress.'}
        </Text>

        {/* Section 16: Changes */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '16. \u00c4nderungen dieser Erkl\u00e4rung' : '16. Changes to This Policy'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir k\u00f6nnen diese Datenschutzerkl\u00e4rung von Zeit zu Zeit aktualisieren. Bei wesentlichen \u00c4nderungen werden wir Sie per In-App-Benachrichtigung informieren. Das Datum der letzten Aktualisierung finden Sie oben auf dieser Seite.'
            : 'We may update this privacy policy from time to time. For material changes, we will notify you via an in-app notification. The date of the last update is shown at the top of this page.'}
        </Text>

        {/* Section 17: Contact */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '17. Kontakt' : '17. Contact'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Roman Indra\nE-Mail: privacy@charismo.app\n\nBei Fragen zum Datenschutz kontaktieren Sie uns gerne.\n\nBeschwerderecht: \u00d6sterreichische Datenschutzbe\u00f6rde (dsb.gv.at)'
            : 'Roman Indra\nEmail: privacy@charismo.app\n\nFor any questions about data protection, please contact us.\n\nRight to complain: Austrian Data Protection Authority (Datenschutzbehoerde, dsb.gv.at)'}
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <View style={[styles.floatingBack, { top: insets.top + 8 }]}>
        <LiquidGlassIconButton
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          icon="arrow-back"
          size={42}
          iconSize={22}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  content: { padding: 20, paddingBottom: 60 },
  floatingBack: { position: 'absolute', left: 20, zIndex: 10 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, marginBottom: 4 },
  lastUpdated: { fontSize: 13, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2, marginTop: 24, marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 22 },
  bottomSpacer: { height: 40 },
});
