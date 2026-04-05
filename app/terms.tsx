import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { LiquidGlassIconButton } from '@/src/presentation/components/ui/liquid-glass-icon-button';
import { useSettingsStore } from '@/src/store/settings-store';

export default function TermsScreen() {
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
          {isDE ? 'Nutzungsbedingungen' : 'Terms of Use'}
        </Text>
        <Text style={[styles.lastUpdated, { color: mutedColor }]}>
          {isDE ? 'Zuletzt aktualisiert: 6. April 2026' : 'Last updated: April 6, 2026'}
        </Text>

        {/* Section 1: Acceptance */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '1. Annahme der Bedingungen' : '1. Acceptance of Terms'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Durch die Nutzung der Charismo-App ("App"), bereitgestellt von Roman Indra ("wir", "uns"), stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie diesen Bedingungen nicht zustimmen, nutzen Sie die App bitte nicht.\n\nDiese Bedingungen stellen eine rechtsverbindliche Vereinbarung zwischen Ihnen und uns dar. Bitte lesen Sie sie sorgf\u00e4ltig durch.'
            : 'By using the Charismo app ("App"), provided by Roman Indra ("we", "us", "our"), you agree to these Terms of Use. If you do not agree to these terms, please do not use the App.\n\nThese terms constitute a legally binding agreement between you and us. Please read them carefully.'}
        </Text>

        {/* Section 2: Description */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '2. Beschreibung des Dienstes' : '2. Description of Service'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Charismo ist eine Bildungs-App, die soziale F\u00e4higkeiten und Selbstvertrauen durch gef\u00fchrte Lektionen, KI-Coaching, \u00dcbungen und Buchempfehlungen vermittelt. Die App ist KEIN Dating-Dienst und stellt KEINE Vermittlung zwischen Personen her. Charismo bietet ausschlie\u00dflich Bildungsinhalte zur pers\u00f6nlichen Entwicklung.'
            : 'Charismo is an education app that teaches social skills and confidence through guided lessons, AI coaching, exercises, and book recommendations. The App is NOT a dating service and does NOT facilitate matchmaking between individuals. Charismo provides educational content for personal development only.'}
        </Text>

        {/* Section 3: Eligibility */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '3. Nutzungsberechtigung' : '3. Eligibility'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Sie m\u00fcssen mindestens 16 Jahre alt sein, um die App zu nutzen. Bei der Registrierung wird Ihr Geburtsdatum \u00fcberpr\u00fcft. Durch die Nutzung der App best\u00e4tigen Sie, dass Sie diese Altersanforderung erf\u00fcllen.\n\nWenn Sie zwischen 16 und 18 Jahre alt sind, best\u00e4tigen Sie, dass ein Erziehungsberechtigter diesen Bedingungen zugestimmt hat.'
            : 'You must be at least 16 years old to use the App. Your date of birth is verified during registration. By using the App, you confirm that you meet this age requirement.\n\nIf you are between 16 and 18 years old, you confirm that a parent or guardian has consented to these terms.'}
        </Text>

        {/* Section 4: Account */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '4. Benutzerkonten' : '4. User Accounts'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Einige Funktionen erfordern ein Benutzerkonto. Sie k\u00f6nnen sich per E-Mail/Passwort, Google oder Apple anmelden. Sie sind verantwortlich f\u00fcr:\n\n\u2022 Die Sicherheit Ihrer Anmeldedaten\n\u2022 Alle Aktivit\u00e4ten unter Ihrem Konto\n\u2022 Die Richtigkeit der angegebenen Kontoinformationen\n\nDie App kann auch ohne Konto mit eingeschr\u00e4nktem Funktionsumfang genutzt werden (ohne Cloud-Sync, KI-Coach oder Premium-Funktionen).\n\nSie k\u00f6nnen Ihr Konto jederzeit l\u00f6schen, indem Sie uns unter privacy@charismo.app kontaktieren.'
            : 'Some features require a user account. You can sign up via email/password, Google, or Apple. You are responsible for:\n\n\u2022 Keeping your login credentials secure\n\u2022 All activities that occur under your account\n\u2022 Ensuring your account information is accurate\n\nThe App can also be used without an account with limited functionality (no cloud sync, AI coach, or premium features).\n\nYou may delete your account at any time by contacting us at privacy@charismo.app.'}
        </Text>

        {/* Section 5: Free & Premium */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '5. Kostenlose & Premium-Funktionen' : '5. Free & Premium Features'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Die App verwendet ein "Hearts"-System:\n\n\u2022 Gratis-Nutzer erhalten t\u00e4glich 5 Hearts\n\u2022 Pro-Abonnenten erhalten t\u00e4glich 15 Hearts\n\u2022 Pro+-Abonnenten erhalten t\u00e4glich 25 Hearts\n\u2022 Hearts werden f\u00fcr Coach-Nachrichten, Kapitel und \u00dcbungen verbraucht\n\u2022 Unverbrauchte Hearts verfallen am Ende des Tages\n\nGratis verf\u00fcgbar: Phase 1 (4 Kapitel), ausgew\u00e4hlte Phrasen, ein Coach-Charakter, grundlegende Gewohnheiten.\n\nPremium-Funktionen: Alle Kapitel, alle Coach-Charaktere, alle Phrasen, alle \u00dcbungsmodi, PDF-Guide.'
            : 'The App uses a "Hearts" system:\n\n\u2022 Free users receive 5 hearts per day\n\u2022 Pro subscribers receive 15 hearts per day\n\u2022 Pro+ subscribers receive 25 hearts per day\n\u2022 Hearts are consumed for coach messages, chapters, and exercises\n\u2022 Unused hearts expire at the end of the day\n\nFree features: Phase 1 (4 chapters), selected phrases, one coach character, basic habits.\n\nPremium features: All chapters, all coach characters, all phrases, all exercise modes, PDF guide.'}
        </Text>

        {/* Section 6: Subscriptions */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '6. Abonnements & K\u00e4ufe' : '6. Subscriptions & Purchases'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? '\u2022 Premium-Funktionen sind \u00fcber In-App-Abonnements verf\u00fcgbar (w\u00f6chentlich, monatlich oder j\u00e4hrlich).\n\u2022 Abonnements verl\u00e4ngern sich automatisch, sofern sie nicht mindestens 24 Stunden vor Ablauf des aktuellen Zeitraums gek\u00fcndigt werden.\n\u2022 Zahlungen werden \u00fcber Ihr Apple-ID- bzw. Google-Play-Konto abgewickelt.\n\u2022 Abonnements k\u00f6nnen in den Einstellungen Ihres Apple- bzw. Google-Kontos verwaltet und gek\u00fcndigt werden.\n\u2022 Erstattungen unterliegen den Richtlinien von Apple bzw. Google.\n\u2022 Die Preise k\u00f6nnen sich \u00e4ndern; wir informieren Sie im Voraus.\n\u2022 Es gibt keine kostenlose Testphase, sofern nicht ausdr\u00fccklich angegeben.\n\u2022 Einmalk\u00e4ufe (z.B. PDF-Guide, Kapitel-Freischaltung) sind nicht erstattbar, au\u00dfer gem\u00e4\u00df den Richtlinien der jeweiligen Plattform.'
            : '\u2022 Premium features are available through in-app subscriptions (weekly, monthly, or yearly).\n\u2022 Subscriptions auto-renew unless canceled at least 24 hours before the end of the current period.\n\u2022 Payment is processed through your Apple ID or Google Play account.\n\u2022 Subscriptions can be managed and canceled in your Apple or Google account settings.\n\u2022 Refunds are subject to Apple or Google\'s refund policies.\n\u2022 Prices may change; we will provide advance notice.\n\u2022 There is no free trial unless explicitly stated.\n\u2022 One-time purchases (e.g., PDF guide, chapter unlock) are non-refundable except per platform policies.'}
        </Text>

        {/* Section 7: AI Coach */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '7. KI-Coach \u2014 Haftungsausschluss' : '7. AI Coach \u2014 Disclaimer'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Die KI-Coach-Funktion wird durch k\u00fcnstliche Intelligenz (Anthropic Claude) betrieben. WICHTIGE HINWEISE:\n\n\u2022 Der KI-Coach ist KEIN Mensch und ersetzt KEINE professionelle Beratung.\n\u2022 Alle Inhalte dienen ausschlie\u00dflich Bildungs- und Unterhaltungszwecken.\n\u2022 Der KI-Coach bietet KEINE psychologische, therapeutische, medizinische oder rechtliche Beratung.\n\u2022 Wir \u00fcbernehmen KEINE Garantie f\u00fcr die Richtigkeit, Vollst\u00e4ndigkeit oder Eignung der KI-Antworten.\n\u2022 Bei ernsthaften pers\u00f6nlichen Problemen wenden Sie sich bitte an einen qualifizierten Fachmann.\n\u2022 KI-Antworten k\u00f6nnen Fehler enthalten oder in bestimmten Kontexten unangemessen sein.\n\u2022 Wir haften nicht f\u00fcr Handlungen, die auf Grundlage von KI-Ratschl\u00e4gen vorgenommen werden.'
            : 'The AI coach feature is powered by artificial intelligence (Anthropic Claude). IMPORTANT NOTICES:\n\n\u2022 The AI coach is NOT a human and does NOT replace professional advice.\n\u2022 All content is for educational and entertainment purposes only.\n\u2022 The AI coach does NOT provide psychological, therapeutic, medical, or legal advice.\n\u2022 We do NOT guarantee the accuracy, completeness, or suitability of AI responses.\n\u2022 For serious personal issues, please consult a qualified professional.\n\u2022 AI responses may contain errors or be inappropriate in certain contexts.\n\u2022 We are not liable for actions taken based on AI advice.'}
        </Text>

        {/* Section 8: User Content */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '8. Nutzergenerierte Inhalte' : '8. User-Generated Content'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wenn Sie Nachrichten an den KI-Coach senden:\n\n\u2022 Sie behalten das Eigentum an Ihren Nachrichten.\n\u2022 Sie gew\u00e4hren uns eine Lizenz zur Verarbeitung Ihrer Nachrichten zum Zweck der Diensterbringung (KI-Antwortgenerierung).\n\u2022 Ihre Nachrichten werden NICHT f\u00fcr KI-Training verwendet.\n\u2022 Ihre Nachrichten werden NICHT mit anderen Nutzern geteilt.\n\u2022 Sie sind verantwortlich f\u00fcr den Inhalt Ihrer Nachrichten.'
            : 'When you send messages to the AI coach:\n\n\u2022 You retain ownership of your messages.\n\u2022 You grant us a license to process your messages for the purpose of providing the service (AI response generation).\n\u2022 Your messages are NOT used for AI training.\n\u2022 Your messages are NOT shared with other users.\n\u2022 You are responsible for the content of your messages.'}
        </Text>

        {/* Section 9: Acceptable Use */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '9. Akzeptable Nutzung' : '9. Acceptable Use'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Sie verpflichten sich, die App nicht zu nutzen f\u00fcr:\n\n\u2022 Illegale Aktivit\u00e4ten oder F\u00f6rderung solcher\n\u2022 Bel\u00e4stigung, Missbrauch oder Sch\u00e4digung anderer\n\u2022 Verbreitung von sch\u00e4dlichen, hasserfuellten oder beleidigenden Inhalten\n\u2022 Versuche, den KI-Coach zu manipulieren (Jailbreaking, Prompt Injection)\n\u2022 Automatisiertes Scraping, Datenextraktion oder Bot-Nutzung\n\u2022 Reverse Engineering oder Dekompilierung der App\n\u2022 Versuche, das Hearts-System oder Rate-Limits zu umgehen\n\u2022 Weiterverkauf oder kommerzielle Nutzung der App-Inhalte\n\nVerst\u00f6\u00dfe k\u00f6nnen zur Sperrung oder L\u00f6schung Ihres Kontos f\u00fchren.'
            : 'You agree not to use the App for:\n\n\u2022 Illegal activities or promotion thereof\n\u2022 Harassment, abuse, or harm to others\n\u2022 Distributing harmful, hateful, or abusive content\n\u2022 Attempting to manipulate the AI coach (jailbreaking, prompt injection)\n\u2022 Automated scraping, data extraction, or bot usage\n\u2022 Reverse engineering or decompiling the App\n\u2022 Attempting to circumvent the hearts system or rate limits\n\u2022 Reselling or commercially exploiting App content\n\nViolations may result in suspension or deletion of your account.'}
        </Text>

        {/* Section 10: Intellectual Property */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '10. Geistiges Eigentum' : '10. Intellectual Property'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Alle Inhalte der App, einschlie\u00dflich Text, Grafiken, Logos, Kursstruktur, Phrasen, \u00dcbungen und Software, sind Eigentum von Roman Indra und durch Urheberrecht und andere Gesetze zum Schutz geistigen Eigentums gesch\u00fctzt.\n\nSie erhalten eine begrenzte, nicht-exklusive, nicht \u00fcbertragbare, widerrufliche Lizenz zur pers\u00f6nlichen, nicht-kommerziellen Nutzung der App.\n\nBuchempfehlungen verweisen auf Werke Dritter. Alle Marken und Titel sind Eigentum der jeweiligen Inhaber.'
            : 'All content in the App, including text, graphics, logos, course structure, phrases, exercises, and software, is the property of Roman Indra and is protected by copyright and other intellectual property laws.\n\nYou are granted a limited, non-exclusive, non-transferable, revocable license for personal, non-commercial use of the App.\n\nBook recommendations reference third-party works. All trademarks and titles are property of their respective owners.'}
        </Text>

        {/* Section 11: Disclaimers */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '11. Haftungsausschluss' : '11. Disclaimers'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Die App wird "wie besehen" und "wie verf\u00fcgbar" bereitgestellt. Wir \u00fcbernehmen keine Garantie daf\u00fcr, dass:\n\n\u2022 Die App ununterbrochen oder fehlerfrei funktioniert\n\u2022 Die Inhalte in allen Situationen zutreffend sind\n\u2022 Die Nutzung der App zu bestimmten sozialen oder romantischen Ergebnissen f\u00fchrt\n\u2022 KI-Antworten fehlerfrei oder f\u00fcr jede Situation geeignet sind\n\nDie App dient ausschlie\u00dflich Bildungs- und Unterhaltungszwecken. Ergebnisse variieren und h\u00e4ngen von individuellen Umst\u00e4nden ab.'
            : 'The App is provided "as is" and "as available." We do not guarantee that:\n\n\u2022 The App will operate uninterrupted or error-free\n\u2022 The content will be accurate or applicable in all situations\n\u2022 Using the App will lead to specific social or romantic outcomes\n\u2022 AI responses will be error-free or suitable for every situation\n\nThe App is for educational and entertainment purposes only. Results may vary and depend on individual circumstances.'}
        </Text>

        {/* Section 12: Limitation of Liability */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '12. Haftungsbeschr\u00e4nkung' : '12. Limitation of Liability'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Soweit gesetzlich zul\u00e4ssig, haftet Roman Indra nicht f\u00fcr indirekte, zuf\u00e4llige, besondere oder Folgesch\u00e4den, die sich aus der Nutzung oder der Unf\u00e4higkeit zur Nutzung der App ergeben. Unsere Gesamthaftung ist auf den Betrag beschr\u00e4nkt, den Sie in den 12 Monaten vor dem Anspruch f\u00fcr die App bezahlt haben.\n\nDiese Beschr\u00e4nkung gilt nicht f\u00fcr Sch\u00e4den durch Vorsatz oder grobe Fahrl\u00e4ssigkeit oder f\u00fcr die Haftung f\u00fcr Personensch\u00e4den gem\u00e4\u00df \u00f6sterreichischem Recht.\n\nInsbesondere haften wir nicht f\u00fcr:\n\u2022 Handlungen, die auf Grundlage von KI-Ratschl\u00e4gen vorgenommen werden\n\u2022 Verlust von lokal gespeicherten Daten (z.B. bei Deinstallation)\n\u2022 Unterbrechungen des Dienstes durch Drittanbieter'
            : 'To the maximum extent permitted by law, Roman Indra shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of or inability to use the App. Our total liability is limited to the amount you paid for the App in the 12 months preceding the claim.\n\nThis limitation does not apply to damages caused by willful intent or gross negligence, or to liability for personal injury under Austrian law.\n\nIn particular, we are not liable for:\n\u2022 Actions taken based on AI coaching advice\n\u2022 Loss of locally stored data (e.g., upon uninstallation)\n\u2022 Service interruptions caused by third-party providers'}
        </Text>

        {/* Section 13: Termination */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '13. K\u00fcndigung' : '13. Termination'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir k\u00f6nnen Ihren Zugang zur App aussetzen oder k\u00fcndigen, wenn Sie gegen diese Bedingungen versto\u00dfen. Sie k\u00f6nnen die Nutzung jederzeit beenden und Ihr Konto l\u00f6schen.\n\nBei K\u00fcndigung:\n\u2022 Erl\u00f6schen Ihre Nutzungsrechte an der App\n\u2022 Bestehende Abonnements m\u00fcssen separat \u00fcber Apple/Google gek\u00fcndigt werden\n\u2022 Nicht verbrauchte Herzen oder Bonus-Herzen verfallen'
            : 'We may suspend or terminate your access to the App if you violate these terms. You may stop using the App at any time and delete your account.\n\nUpon termination:\n\u2022 Your right to use the App ceases\n\u2022 Existing subscriptions must be canceled separately through Apple/Google\n\u2022 Unused hearts or bonus hearts are forfeited'}
        </Text>

        {/* Section 14: Changes */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '14. \u00c4nderungen der Bedingungen' : '14. Changes to Terms'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Wir k\u00f6nnen diese Bedingungen von Zeit zu Zeit \u00e4ndern. Bei wesentlichen \u00c4nderungen werden wir Sie per In-App-Benachrichtigung informieren. Die weitere Nutzung der App nach solchen \u00c4nderungen gilt als Zustimmung zu den aktualisierten Bedingungen.'
            : 'We may modify these terms from time to time. For material changes, we will notify you via an in-app notification. Continued use of the App after such changes constitutes acceptance of the updated terms.'}
        </Text>

        {/* Section 15: Governing Law */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '15. Anwendbares Recht & Streitbeilegung' : '15. Governing Law & Dispute Resolution'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Diese Bedingungen unterliegen dem Recht der Republik \u00d6sterreich. F\u00fcr Verbraucher in der EU gelten zus\u00e4tzlich die zwingenden Verbraucherschutzvorschriften Ihres Wohnsitzlandes.\n\nOnline-Streitbeilegung: Die EU-Kommission bietet eine Plattform f\u00fcr Online-Streitbeilegung an: ec.europa.eu/consumers/odr\n\nWir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
            : 'These terms are governed by the laws of the Republic of Austria. For consumers in the EU, the mandatory consumer protection provisions of your country of habitual residence additionally apply.\n\nOnline dispute resolution: The EU Commission provides a platform for online dispute resolution: ec.europa.eu/consumers/odr\n\nWe are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board.'}
        </Text>

        {/* Section 16: Apple EULA */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '16. Apple-spezifische Bedingungen' : '16. Apple-Specific Terms'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'F\u00fcr Nutzer, die die App \u00fcber den Apple App Store beziehen:\n\n\u2022 Diese Bedingungen gelten zwischen Ihnen und Roman Indra, nicht mit Apple.\n\u2022 Roman Indra ist allein verantwortlich f\u00fcr die App und deren Inhalte.\n\u2022 Apple hat keine Verpflichtung, Wartungs- oder Supportleistungen f\u00fcr die App zu erbringen.\n\u2022 Im Falle eines Mangels ist Apple nicht f\u00fcr Erstattungen verantwortlich (au\u00dfer gem\u00e4\u00df den geltenden App-Store-Bedingungen).\n\u2022 Apple ist nicht verantwortlich f\u00fcr Anspr\u00fcche im Zusammenhang mit der App (Produkthaftung, Verbraucherschutz, geistiges Eigentum).\n\u2022 Apple und seine Tochtergesellschaften sind Drittbeg\u00fcnstigte dieser Bedingungen.'
            : 'For users who obtain the App through the Apple App Store:\n\n\u2022 These terms are between you and Roman Indra, not Apple.\n\u2022 Roman Indra is solely responsible for the App and its content.\n\u2022 Apple has no obligation to provide maintenance or support services for the App.\n\u2022 In the event of a defect, Apple is not responsible for refunds (except under applicable App Store terms).\n\u2022 Apple is not responsible for any claims relating to the App (product liability, consumer protection, intellectual property).\n\u2022 Apple and its subsidiaries are third-party beneficiaries of these terms.'}
        </Text>

        {/* Section 17: Contact */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isDE ? '17. Kontakt' : '17. Contact'}
        </Text>
        <Text style={[styles.body, { color: mutedColor }]}>
          {isDE
            ? 'Bei Fragen zu diesen Nutzungsbedingungen kontaktieren Sie uns unter:\n\nRoman Indra\nE-Mail: support@charismo.app'
            : 'For questions about these Terms of Use, contact us at:\n\nRoman Indra\nEmail: support@charismo.app'}
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
