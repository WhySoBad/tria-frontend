import {
  AppTranslations,
  ErrorTranslations,
  LandingTranslations,
  LocaleTranslations,
  LoginTranslations,
  ModalTranslations,
  PasswordResetTranslations,
  RegisterTranslations,
  SignUpTranslations,
  SiteTitleTranslations,
  Translation,
} from "..";

const landing: LandingTranslations = {
  free: {
    title: "Gratis",
    description: "Erstelle einen gratis Account und starte mit der Welt zu chatten",
  },
  modern: {
    title: "Modern",
    description: "Tria wurde mit modernen Frameworks erstellt, um die bestmögliche Erfahrung zu bieten",
  },
  secure: {
    title: "Sicher",
    description: "Tria ist mit einem TLS-Protokoll verschlüsselt und zusätzlich ist der komplette Quellcode auf %GitHub% einzusehen",
  },
  quicknav: {
    title: "Schnellnavigation",
    login: "Login",
    signup: "Registrieren",
    to_app: "Zur App",
    home: "Home",
  },
  api: {
    title: "API",
    api: "API",
    docs: "Dokumentation",
  },
  source: {
    title: "Quellcode",
    backend: "Backend",
    client: "Client",
    frontend: "Frontend",
  },
};

const login: LoginTranslations = {
  title: "Anmelden",
  mail: "Mail",
  password: "Passwort",
  forgot: "Passwort Vergessen",
  login: "Anmelden",
};

const signup: SignUpTranslations = {
  title: "Registrieren",
  mail: "Mail",
  password: "Passwort",
  description: "Registriere dich mit einer Mail Adresse und einem Passwort. Anschliessend wirst du ein Bestätigungsmail erhalten um deine Identität zu bestätigen und die Registration abzuschliessen.",
  signup: "Registrieren",
};

const register: RegisterTranslations = {
  title: "Registrierung Abschliessen",
  form_description: "Schliesse die Registerierung deines Accounts ab, indem du die folgenden Felder ausfüllst.",
  description: "Beschreibung",
  finish: "Fertigstellen",
  tag: "Tag",
  username: "Benutzername",
};

const passwordreset: PasswordResetTranslations = {
  title: "Passwort Zurücksetzen",
  mail: "Mail",
  send_mail: "Mail senden",
  finish: "Fertigstellen",
  password: "Passwort",
  description: "Gib die Mail Adresse an, mit welcher dein Account erstellt wurde. Anschliessend wirst du ein Mail erhalten, um das Passwort zurückzusetzen.",
  confirm_description: "Setze ein neues Passwort, um die Zurücksetzung abzuschliessen",
};

const error: ErrorTranslations = {
  404: {
    title: "Seite Nicht Gefunden",
    description: "Die angefragte URL konnte nicht gefunden werden. Bitte versichere dich, dass diese Seite existiert.",
  },
  500: {
    title: "Intener Server Fehler",
    description: "Ein serverseitiger Fehler ist aufgetreten. Dies ist wahrscheinlich ein temporäres Problem. Probiere es in wenigen Minuten ereneut.",
  },
  back: "Zurück zum Home",
};

const app: AppTranslations = {
  app: { select: "Wähle oder erstelle einen Chat" },
  profile: {
    title: "Profil",
    burger_title: "Profil",
    settings: {
      title: "Einstellungen",
      description: "Beschreibung",
      name: "Name",
      tag: "Tag",
      upload_avatar: "Avatar Hochladen",
      delete_avatar: "Avatar Löschen",
      delete: "Löschen",
      change_password: "Passwort Ändern",
      save: "Speichern",
    },
    chats: {
      title: "Chats",
      search_chat: "Chat suchen",
    },
  },
  chat: {
    start: "Start des Chats",
    joined: "ist dem Chat beigetreten",
    left: "hat den Chat verlassen",
    view_info: "Chat Info Öffnen",
    view_chat: "Chat Öffnen",
    manage_group: "Gruppe Bearbeiten",
    delete_group: "Gruppe Löschen",
    delete_chat: "Chat Löschen",
    mark_as_read: "Als Gelesen Markieren",
    profile: "Profil",
    edit_message: "Nachricht Bearbeiten",
    deleted_account: "Gelöschter Account",
    edited: "Editiert",
    new_messages: "Neue Nachrichten",
    stop_editing: "Bearbeitung Abbrechen",
    unknown_sender: "Unbekannter Nutzer",
    new_message: "Neue Nachricht eingeben",
    leave_group: "Gruppe Verlassen",
  },
  chat_settings: {
    settings: {
      title: "Einstellungen",
      description: "Beschreibung",
      name: "Name",
      tag: "Tag",
      public: "Öffentlich",
      upload_avatar: "Avatar Hochladen",
      delete_avatar: "Avatar Löschen",
      delete: "Löschen",
      save: "Speichern",
    },
    member: {
      title: "Mitglieder",
      search_member: "Mitglied suchen",
      roles: {
        owner: "Owner",
        admin: "Admin",
        member: "Mitglied",
      },
      kick: "Kicken",
      ban: "Bannen",
      save: "Speichern",
      edit_member: "Mitglieder bearbeiten",
      edit_chat: "Chat bearbeiten",
      unban: "Entbannen",
    },

    banned_member: {
      title: "Gebannte Mitglieder",
      search_member: "Gebanntes Mitglied suchen",
      unban: "Entbannen",
    },
  },
  explore: {
    title: "Nutzer und Chats finden",
    burger_title: "Erkunden",
    filters: {
      user: "Nutzer",
      chats: "Chats",
      name: "Name",
      tag: "Tag",
      uuid: "Uuid",
    },
    search: "Nutzer und Chats suchen",
  },
  create: {
    title: "Chat erstellen",
    burger_title: "Erstellen",
    informations: {
      title: "Informationen",
      name: "Name",
      tag: "Tag",
      description: "Beschreibung",
      public: "Öffentlich",
    },
    members: {
      title: "Mitglieder",
      search_user: "Nutzer suchen",
    },
    create: "Erstellen",
  },
  logout: "Abmelden",
};

const locales: LocaleTranslations = {
  EN: "Englisch",
  DE: "Deutsch",
  FR: "Französisch",
};

const sites: SiteTitleTranslations = {
  404: "Tria - Seite Nicht Gefunden",
  500: "Tria - Serverseitiger Fehler",
  app: "Tria",
  auth: "Tria - Authentifizierung",
  chat_settings: "Einstellungen -",
  create: "Chat Erstellen",
  explore: "Erkunden",
  home: "Tria - Ein Messenger um mit der Welt zu kommunizieren",
  login: "Tria - Anmelden",
  passwordreset: "Tria - Passwort Zurücksetzen",
  passwordreset_confirm: "Tria - Passwort Zurücksetzen",
  profile: "Profil -",
  register: "Tria - Registrierung Fertigstellen",
  signup: "Tria - Erstelle einen Account",
  chat: "Chat -",
};

const modals: ModalTranslations = {
  minute: {
    name: "Minute",
    plural: "n",
  },
  hour: {
    name: "Stunde",
    plural: "n",
  },
  day: {
    name: "Tag",
    plural: "en",
  },
  week: {
    name: "Woche",
    plural: "n",
  },
  month: {
    name: "Monat",
    plural: "en",
  },
  year: {
    name: "Jahr",
    plural: "en",
  },
  time_prefix: "Vor",
  time_suffix: "",
  user: {
    chats: "Chats",
    information: "Informationen",
    create_chat: "Chat Starten",

    description: "Beschreibung",
    joined: "Beigetreten",
    just_now: "Gerade Eben",
    last_seen: "Zuletzt Gesehen",
    name: "Name",
    no_shared: "Keine Gemeinsamen Chats",
    tag: "Tag",
  },
  chat_preview: {
    information: "Informationen",
    description: "Beschreibung",
    join_group: "Gruppe Beitreten",
    members: "Mitglieder",
    name: "Name",
    online: "Online",
    tag: "Tag",
  },
  chat: {
    admin: "Admin",
    ban_member: "Mitglied Bannen",
    information: "Informationen",
    kick_member: "Mitglied Kicken",
    member: "Mitglied",
    members: "Mitglieder",
    owner: "Owner",
    created: "Erstellt",
    description: "Beschreibung",
    tag: "Tag",
    name: "Name",
  },
  change_password: {
    title: "Passwort Ändern",
    new_password: "Neues Passwort",
    old_password: "Altes Passwort",
    submit: "Passwort Ändern",
    forgot: "Passwort Vergessen",
  },
};

export const German: Translation = {
  landing: landing,
  login: login,
  signup: signup,
  app: app,
  register: register,
  error: error,
  passwordreset: passwordreset,
  locales: locales,
  sites: sites,
  modals: modals,
};
