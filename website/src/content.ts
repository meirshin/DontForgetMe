import { DEVELOPER, type Lang, type Route } from './site';

/** A paragraph, or a bullet list when given an array. */
export type Block = string | string[];
export interface Section {
  title: string;
  blocks: Block[];
}
export interface Permission {
  name: string;
  why: string;
}

const enPermissions: Permission[] = [
  {
    name: 'Nearby devices (Bluetooth)',
    why: 'To list your paired devices and know when the phone connects to or disconnects from the car.',
  },
  { name: 'Notifications', why: 'To show the reminder.' },
  {
    name: 'Alarms & reminders (exact alarms)',
    why: 'To deliver the reminder at the right time.',
  },
  {
    name: 'Battery optimization exemption',
    why: 'So that Android does not delay the reminder.',
  },
];

const hePermissions: Permission[] = [
  {
    name: 'מכשירים בקרבת מקום (בלוטוס)',
    why: 'כדי להציג את המכשירים המצומדים ולדעת מתי הטלפון מתחבר לרכב או מתנתק ממנו.',
  },
  { name: 'התראות', why: 'כדי להציג את התזכורת.' },
  {
    name: 'שעונים מעוררים ותזכורות (זמן מדויק)',
    why: 'כדי שהתזכורת תגיע בזמן.',
  },
  {
    name: 'פטור מאופטימיזציית סוללה',
    why: 'כדי שאנדרואיד לא ידחה את התזכורת.',
  },
];

const listPermissions = (list: Permission[]) =>
  list.map(p => `${p.name} – ${p.why}`);

const en = {
  appName: "Don't Forget Me",
  nav: {
    home: 'Home',
    privacy: 'Privacy policy',
    source: 'Source code',
    otherLang: 'עברית',
  },
  skipToContent: 'Skip to content',
  home: {
    title: "Don't Forget Me – a back-seat reminder for parents",
    description:
      "Free Android app that reminds you to check the back seat a few minutes after your phone disconnects from your car's Bluetooth.",
    tagline: 'A reminder to check the back seat — every time you leave the car.',
    intro:
      'The app notices when your phone disconnects from your car’s Bluetooth and, a few minutes later, asks: “Did you forget a child in the car?”',
    cta: 'Coming soon to Google Play',
    badges: 'Free · No ads · No account · Android',
    howTitle: 'How it works',
    steps: [
      {
        title: 'Choose your car',
        text: 'Select your car’s Bluetooth device from the devices already paired with your phone.',
      },
      {
        title: 'Drive as usual',
        text: 'No need to open the app. Android tells it when the phone connects to or disconnects from the car — even when the app is closed.',
      },
      {
        title: 'Get a reminder',
        text: 'A few minutes after you disconnect (2 by default, adjustable from 1 to 60) a notification appears. If you reconnect before that, the reminder is cancelled.',
      },
      {
        title: 'Respond',
        text: 'Tap “All good” to dismiss it, or “Remind me in a minute” to be reminded again.',
      },
    ],
    featuresTitle: "Why Don't Forget Me",
    features: [
      {
        title: 'Private by design',
        text: 'Your settings never leave your phone. No account, no ads, no analytics.',
      },
      {
        title: 'Works when the app is closed',
        text: 'Detection is handled by Android itself — no persistent background service, minimal battery use.',
      },
      {
        title: 'On time',
        text: 'Uses exact alarms so the reminder arrives exactly when it should.',
      },
      {
        title: 'Hebrew and English',
        text: 'The app follows your phone’s language.',
      },
    ],
    permissionsTitle: 'Permissions and why they are needed',
    permissionsNote:
      'On some phones (e.g. Xiaomi, Huawei, Samsung) you may also need to allow “Autostart” or remove the app from “Sleeping apps”.',
    disclaimerTitle: 'Important',
    disclaimer:
      "Don't Forget Me is a supporting tool and does not replace a parent’s responsibility and attention. The reminder depends on your phone, the Bluetooth connection and system settings, and may not work in every situation. Always check the back seat before you lock the car.",
    sourceTitle: 'Open source',
    source:
      'The app is open source. You are welcome to browse the code, report issues and suggest improvements on GitHub:',
    contactTitle: 'Contact',
    contact: 'Questions, suggestions or bug reports? Email',
  },
  permissions: enPermissions,
  privacy: {
    title: 'Privacy Policy',
    description:
      "Privacy policy of the Don't Forget Me Android app: no personal data is collected, transmitted or shared.",
    subtitle: "Don't Forget Me (Android app)",
    updated: 'Last updated:',
    intro: `This privacy policy explains how the Don't Forget Me Android app (“the app”), developed by ${DEVELOPER} (“we”, “us”), handles your information. In short: the app does not collect, transmit, sell or share any personal data. Everything it needs stays on your phone.`,
    sections: [
      {
        title: 'Information the app accesses',
        blocks: [
          'To work, the app accesses the following information on your device only:',
          [
            'The list of paired Bluetooth devices (device names and hardware addresses), shown so you can choose which device is your car.',
            'Bluetooth connection events: whether your phone has connected to or disconnected from the devices you selected.',
            'App settings: whether monitoring is on, the reminder delay, and the hardware addresses of the devices you selected.',
          ],
          'The app does not access your location, contacts, photos, files, microphone, camera or any other personal content.',
        ],
      },
      {
        title: 'How the information is used',
        blocks: [
          'The information is used solely to detect when you leave your car and to schedule, show or cancel the back-seat reminder. It is not used for advertising, analytics, profiling or any other purpose.',
        ],
      },
      {
        title: 'Storage and transmission',
        blocks: [
          "Your settings are stored locally in the app's private storage on your device. The app has no servers and does not send any data over the internet. The app's data is excluded from Android cloud backups.",
        ],
      },
      {
        title: 'Sharing with third parties',
        blocks: [
          'We do not share, sell or transfer any data to third parties. The app contains no advertising, analytics or tracking SDKs.',
        ],
      },
      {
        title: 'Permissions',
        blocks: [
          listPermissions(enPermissions),
          "You can revoke any permission at any time in your phone's settings; without them the app cannot remind you.",
        ],
      },
      {
        title: 'Data security',
        blocks: [
          "Data is kept in the app's private storage, which Android isolates from other apps. Because no data is transmitted, there is no data in transit to protect. The app uses only the minimum information required for its core function.",
        ],
      },
      {
        title: 'Data retention and deletion',
        blocks: [
          "Settings are kept on your device until you change them. You can delete all of the app's data at any time by clearing its storage (Settings › Apps › Don't Forget Me › Storage › Clear data) or by uninstalling the app.",
          'Since we never receive your data, nothing is stored on our side that would need deleting. If you contact us by email, we keep your message only as long as needed to respond and will delete it on request.',
        ],
      },
      {
        title: 'Accounts',
        blocks: ['The app does not offer or require user accounts.'],
      },
      {
        title: "Children's privacy",
        blocks: [
          'The app is intended for adults — parents and caregivers. It is not directed at children and does not knowingly collect personal information from anyone, including children under 13.',
        ],
      },
      {
        title: 'Changes to this policy',
        blocks: [
          "If we change this policy, we will publish the updated version on this page and update the date above. Significant changes will also be noted in the app's release notes.",
        ],
      },
    ] as Section[],
    contactTitle: 'Contact us',
    contact: `For any privacy question or request, contact ${DEVELOPER} at`,
  },
  footer: 'All rights reserved.',
};

const he: typeof en = {
  appName: 'אל תשכח אותי',
  nav: {
    home: 'דף הבית',
    privacy: 'מדיניות פרטיות',
    source: 'קוד מקור',
    otherLang: 'English',
  },
  skipToContent: 'דלג לתוכן',
  home: {
    title: 'אל תשכח אותי – תזכורת לבדוק את המושב האחורי',
    description:
      'אפליקציית אנדרואיד חינמית שמזכירה לך לבדוק את המושב האחורי כמה דקות אחרי שהטלפון מתנתק מהבלוטוס של הרכב.',
    tagline: 'תזכורת לבדוק את המושב האחורי – בכל פעם שיוצאים מהרכב.',
    intro:
      'האפליקציה מזהה מתי הטלפון מתנתק מהבלוטוס של הרכב, ואחרי כמה דקות שואלת: "האם שכחת ילד באוטו?"',
    cta: 'בקרוב בחנות Google Play',
    badges: 'חינם · ללא פרסומות · ללא הרשמה · אנדרואיד',
    howTitle: 'איך זה עובד',
    steps: [
      {
        title: 'בוחרים את הרכב',
        text: 'בוחרים את מכשיר הבלוטוס של הרכב מתוך המכשירים שכבר מצומדים לטלפון.',
      },
      {
        title: 'נוסעים כרגיל',
        text: 'אין צורך לפתוח את האפליקציה. אנדרואיד מעדכן אותה כשהטלפון מתחבר לרכב או מתנתק ממנו – גם כשהיא סגורה.',
      },
      {
        title: 'מקבלים תזכורת',
        text: 'כמה דקות אחרי הניתוק (2 כברירת מחדל, ניתן לשנות בין 1 ל-60) מופיעה התראה. אם הטלפון מתחבר שוב לרכב לפני כן, התזכורת מבוטלת.',
      },
      {
        title: 'מגיבים',
        text: '"הכל בסדר" סוגר את התזכורת, ו"הזכר לי שוב בעוד דקה" מזכיר שוב.',
      },
    ],
    featuresTitle: 'למה אל תשכח אותי',
    features: [
      {
        title: 'פרטיות מלאה',
        text: 'ההגדרות שלך לא יוצאות מהטלפון. בלי הרשמה, בלי פרסומות ובלי מעקב.',
      },
      {
        title: 'עובדת גם כשהאפליקציה סגורה',
        text: 'הזיהוי מתבצע על ידי אנדרואיד עצמו – בלי שירות רקע קבוע ובצריכת סוללה מינימלית.',
      },
      {
        title: 'בזמן',
        text: 'שימוש בהתראות בזמן מדויק כדי שהתזכורת תגיע בדיוק מתי שצריך.',
      },
      {
        title: 'עברית ואנגלית',
        text: 'האפליקציה מוצגת בשפת הטלפון.',
      },
    ],
    permissionsTitle: 'הרשאות ולמה הן נחוצות',
    permissionsNote:
      'בחלק מהטלפונים (למשל שיאומי, וואווי, סמסונג) ייתכן שיהיה צורך לאפשר "הפעלה אוטומטית" או להוציא את האפליקציה מרשימת "אפליקציות במצב שינה".',
    disclaimerTitle: 'חשוב לדעת',
    disclaimer:
      'אל תשכח אותי היא כלי עזר בלבד ואינה מחליפה את האחריות ותשומת הלב של ההורה. פעולת התזכורת תלויה בטלפון, בחיבור הבלוטוס ובהגדרות המערכת, וייתכן שלא תפעל בכל מצב. תמיד בדקו את המושב האחורי לפני נעילת הרכב.',
    sourceTitle: 'קוד פתוח',
    source:
      'קוד המקור של האפליקציה פתוח לכולם. מוזמנים לעיין בו, לדווח על תקלות ולהציע שיפורים בגיטהאב:',
    contactTitle: 'יצירת קשר',
    contact: 'שאלות, הצעות או דיווח על תקלה? כתבו לנו לכתובת',
  },
  permissions: hePermissions,
  privacy: {
    title: 'מדיניות פרטיות',
    description:
      'מדיניות הפרטיות של אפליקציית האנדרואיד אל תשכח אותי: לא נאסף, לא מועבר ולא משותף שום מידע אישי.',
    subtitle: 'אל תשכח אותי (אפליקציית אנדרואיד)',
    updated: 'עודכן לאחרונה:',
    intro: `מדיניות פרטיות זו מסבירה כיצד אפליקציית האנדרואיד "אל תשכח אותי" ("האפליקציה"), שפותחה על ידי ${DEVELOPER} ("אנחנו"), מטפלת במידע שלך. בקצרה: האפליקציה אינה אוספת, מעבירה, מוכרת או משתפת מידע אישי כלשהו. כל מה שהיא צריכה נשאר בטלפון שלך.`,
    sections: [
      {
        title: 'מידע שהאפליקציה ניגשת אליו',
        blocks: [
          'כדי לפעול, האפליקציה ניגשת למידע הבא, במכשיר שלך בלבד:',
          [
            'רשימת מכשירי הבלוטוס המצומדים (שמות המכשירים וכתובות החומרה שלהם), המוצגת כדי שתוכל לבחור איזה מכשיר הוא הרכב.',
            'אירועי חיבור בלוטוס: האם הטלפון התחבר למכשירים שבחרת או התנתק מהם.',
            'הגדרות האפליקציה: האם הניטור פעיל, זמן ההמתנה לתזכורת וכתובות החומרה של המכשירים שבחרת.',
          ],
          'האפליקציה אינה ניגשת למיקום, לאנשי קשר, לתמונות, לקבצים, למיקרופון, למצלמה או לכל תוכן אישי אחר.',
        ],
      },
      {
        title: 'כיצד המידע משמש',
        blocks: [
          'המידע משמש אך ורק כדי לזהות מתי יצאת מהרכב וכדי לתזמן, להציג או לבטל את התזכורת. הוא אינו משמש לפרסום, לניתוח נתונים, לבניית פרופיל או לכל מטרה אחרת.',
        ],
      },
      {
        title: 'אחסון והעברה',
        blocks: [
          'ההגדרות נשמרות באופן מקומי באחסון הפרטי של האפליקציה במכשיר שלך. לאפליקציה אין שרתים והיא אינה שולחת מידע דרך האינטרנט. נתוני האפליקציה אינם נכללים בגיבוי הענן של אנדרואיד.',
        ],
      },
      {
        title: 'שיתוף עם צדדים שלישיים',
        blocks: [
          'איננו משתפים, מוכרים או מעבירים מידע כלשהו לצדדים שלישיים. האפליקציה אינה כוללת רכיבי פרסום, ניתוח נתונים או מעקב (SDK).',
        ],
      },
      {
        title: 'הרשאות',
        blocks: [
          listPermissions(hePermissions),
          'ניתן לבטל כל הרשאה בכל עת בהגדרות הטלפון; ללא ההרשאות האפליקציה לא תוכל להזכיר לך.',
        ],
      },
      {
        title: 'אבטחת מידע',
        blocks: [
          'המידע נשמר באחסון הפרטי של האפליקציה, שאנדרואיד מבודד מאפליקציות אחרות. מאחר שלא מועבר מידע, אין מידע בתעבורה שיש להגן עליו. האפליקציה משתמשת רק במידע המינימלי הנדרש לפעולתה.',
        ],
      },
      {
        title: 'שמירה ומחיקה של מידע',
        blocks: [
          'ההגדרות נשמרות במכשיר עד שתשנה אותן. ניתן למחוק את כל נתוני האפליקציה בכל עת על ידי ניקוי האחסון שלה (הגדרות › אפליקציות › אל תשכח אותי › אחסון › ניקוי נתונים) או על ידי הסרת האפליקציה.',
          'מאחר שאיננו מקבלים את המידע שלך, לא נשמר אצלנו שום מידע שיש למחוק. אם תפנה אלינו בדוא״ל, נשמור את ההודעה רק כל עוד הדבר נחוץ כדי להשיב לך, ונמחק אותה לבקשתך.',
        ],
      },
      {
        title: 'חשבונות משתמש',
        blocks: ['האפליקציה אינה מציעה ואינה דורשת יצירת חשבון משתמש.'],
      },
      {
        title: 'פרטיות ילדים',
        blocks: [
          'האפליקציה מיועדת למבוגרים – הורים ומטפלים. היא אינה מיועדת לילדים ואינה אוספת ביודעין מידע אישי מאף אחד, כולל ילדים מתחת לגיל 13.',
        ],
      },
      {
        title: 'שינויים במדיניות',
        blocks: [
          'אם נשנה מדיניות זו, נפרסם את הגרסה המעודכנת בדף זה ונעדכן את התאריך שלמעלה. שינויים מהותיים יצוינו גם בהערות הגרסה של האפליקציה.',
        ],
      },
    ],
    contactTitle: 'יצירת קשר',
    contact: `לכל שאלה או בקשה בנושא פרטיות, ניתן לפנות אל ${DEVELOPER} בכתובת`,
  },
  footer: 'כל הזכויות שמורות.',
};

export const content: Record<Lang, typeof en> = { en, he };
export type Content = typeof en;

export function pageMeta({ lang, page }: Route) {
  const t = content[lang];
  return page === 'home'
    ? { title: t.home.title, description: t.home.description }
    : {
        title: `${t.privacy.title} – ${t.appName}`,
        description: t.privacy.description,
      };
}
