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
    title: "Free",
    description: "Register a free account and start chatting with the world",
  },
  modern: {
    title: "Modern",
    description: "Tria is built with latest frameworks to provide the best experience",
  },
  secure: {
    title: "Secure",
    description: "Tria is encrypted over a TLS protocol and the whole source code is public visible on GitHub",
  },
  quicknav: {
    title: "Quick Navigation",
    login: "Login",
    signup: "Sign Up",
    to_app: "To App",
    home: "Home",
  },
};

const login: LoginTranslations = {
  title: "Login",
  mail: "Mail",
  password: "Password",
  forgot: "Forgot Password",
  login: "Login",
};

const signup: SignUpTranslations = {
  title: "Sign Up",
  mail: "Mail",
  password: "Password",
  description: "Sign up using a mail address and a password. You'll recieve a mail to confirm your identity and to finish the registration.",
  signup: "Sign Up",
};

const register: RegisterTranslations = {
  title: "Finish Registration",
  form_description: "Finish the registration of your account by filling the following fields.",
  description: "Description",
  finish: "Finish",
  tag: "Tag",
  username: "Username",
};

const passwordreset: PasswordResetTranslations = {
  title: "Password Reset",
  mail: "Mail",
  send_mail: "Send Mail",
  finish: "Finish",
  password: "Password",
  description: "Enter the mail address with which your account was created. You'll recieve a mail with a link to finish the password reset.",
  confirm_description: "To finish the password reset enter a new password in the field below.",
};

const error: ErrorTranslations = {
  404: {
    title: "Page Not Found",
    description: "The requested URL was not found. Please make sure this page exists.",
  },
  500: {
    title: "Internal Server Error",
    description: "A Server side error occured. This is probably a temporarily issue. Please come back and try again in a few minutes.",
  },
  back: "Back To Home",
};

const app: AppTranslations = {
  profile: {
    title: "Profile",
    burger_title: "Profile",
    settings: {
      title: "Settings",
      description: "Description",
      name: "Name",
      tag: "Tag",
      upload_avatar: "Upload Avatar",
      delete_avatar: "Delete Avatar",
      delete: "Delete",
      change_password: "Change Password",
      save: "Save",
    },
    chats: {
      title: "Chats",
      search_chat: "Search chat",
    },
  },
  chat: {
    start: "Start of the chat",
    joined: "joined",
    left: "left",
    view_info: "View Chat Info",
    view_chat: "View Chat",
    manage_group: "Manage Group",
    delete_group: "Delete Group",
    delete_chat: "Delete Chat",
    mark_as_read: "Mark As Read",
    profile: "Profile",
    edit_message: "Edit Message",
    deleted_account: "Deleted Account",
    edited: "Edited",
    new_messages: "New Messages",
    stop_editing: "Stop Editing",
    unknown_sender: "Unknown Sender",
    new_message: "Type new message",
    leave_group: "Leave Group",
  },
  chat_settings: {
    settings: {
      title: "Settings",
      description: "Description",
      name: "Name",
      tag: "Tag",
      public: "Public",
      upload_avatar: "Upload Avatar",
      delete_avatar: "Delete Avatar",
      delete: "Delete",
      save: "Save",
    },
    member: {
      title: "Member",
      search_member: "Search member",
      roles: {
        owner: "Owner",
        admin: "Admin",
        member: "Member",
      },
      kick: "Kick",
      ban: "Ban",
      save: "Save",
      edit_member: "Edit Member",
      edit_chat: "Edit Chat",
      unban: "Unban",
    },

    banned_member: {
      title: "Banned Member",
      search_member: "Search banned member",
      unban: "Unban",
    },
  },
  explore: {
    title: "Explore user and chats",
    burger_title: "Explore",
    filters: {
      user: "User",
      chats: "Chats",
      name: "Name",
      tag: "Tag",
      uuid: "Uuid",
    },
    search: "Search user and chats",
  },
  create: {
    title: "Create chat",
    burger_title: "Create",
    informations: {
      title: "Informations",
      name: "Name",
      tag: "Tag",
      description: "Description",
      public: "Public",
    },
    members: {
      title: "Member",
      search_user: "Search user",
    },
    create: "Create",
  },
  logout: "Logout",
};

const locales: LocaleTranslations = {
  EN: "English",
  DE: "German",
  FR: "French",
};

const sites: SiteTitleTranslations = {
  404: "Error - Not Found",
  500: "Error - Server Error",
  app: "App",
  auth: "Auth",
  chat_settings: "Settings -",
  create: "Create Chat",
  explore: "Explore",
  home: "Home",
  login: "Login",
  passwordreset: "Password Reset",
  passwordreset_confirm: "Password Reset",
  profile: "Profile -",
  register: "Register",
  signup: "Sign Up",
  chat: "Chat -",
};

const modals: ModalTranslations = {
  minute: {
    name: "Minute",
    plural: "s",
  },
  hour: {
    name: "Hour",
    plural: "s",
  },
  day: {
    name: "Day",
    plural: "s",
  },
  week: {
    name: "Week",
    plural: "s",
  },
  month: {
    name: "Month",
    plural: "s",
  },
  year: {
    name: "Year",
    plural: "s",
  },
  time_prefix: "",
  time_suffix: "ago",
  user: {
    chats: "Chats",
    information: "Information",
    create_chat: "Create Chat",

    description: "Description",
    joined: "Joined",
    just_now: "Just Now",
    last_seen: "Last Seen",
    name: "Name",
    no_shared: "No Shared Chats",
    tag: "Tag",
  },
  chat_preview: {
    information: "Information",
    description: "Description",
    join_group: "Join Group",
    members: "Members",
    name: "Name",
    online: "Online",
    tag: "Tag",
  },
  chat: {
    admin: "Admin",
    ban_member: "Ban Member",
    information: "Information",
    kick_member: "Kick Member",
    member: "Memebr",
    members: "Memebr",
    owner: "Owner",
    created: "Created",
    description: "Description",
    tag: "Tag",
    name: "Name",
  },
  change_password: {
    title: "Change Password",
    new_password: "New Password",
    old_password: "Old Password",
    submit: "Change Password",
    forgot: "Forgot Password",
  },
};

export const English: Translation = {
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
