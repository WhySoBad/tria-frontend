export interface Translation {
  landing: LandingTranslations;
  login: LoginTranslations;
  signup: SignUpTranslations;
  app: AppTranslations;
  register: RegisterTranslations;
  error: ErrorTranslations;
  passwordreset: PasswordResetTranslations;
  locales: LocaleTranslations;
  sites: SiteTitleTranslations;
  modals: ModalTranslations;
}

export interface LandingTranslations {
  secure: {
    title: string;
    description: string;
  };
  modern: {
    title: string;
    description: string;
  };
  free: {
    title: string;
    description: string;
  };
  quicknav: {
    title: string;
    login: string;
    signup: string;
    to_app: string;
    home: string;
  };
  api: {
    title: string;
    api: string;
    docs: string;
  };
  source: {
    title: string;
    backend: string;
    frontend: string;
    client: string;
  };
}

export interface LoginTranslations {
  title: string;
  mail: string;
  password: string;
  forgot: string;
  login: string;
}

export interface SignUpTranslations {
  title: string;
  mail: string;
  password: string;
  description: string;
  signup: string;
}

export interface RegisterTranslations {
  title: string;
  form_description: string;
  username: string;
  tag: string;
  description: string;
  finish: string;
}

export interface PasswordResetTranslations {
  title: string;
  mail: string;
  description: string;
  confirm_description: string;
  password: string;
  finish: string;
  send_mail: string;
}

export interface ErrorTranslations {
  back: string;
  404: {
    title: string;
    description: string;
  };
  500: {
    title: string;
    description: string;
  };
}

export interface AppTranslations {
  app: {
    select: string;
  };
  profile: {
    title: string;
    burger_title: string;
    settings: {
      title: string;
      description: string;
      name: string;
      tag: string;
      upload_avatar: string;
      delete_avatar: string;
      delete: string;
      change_password: string;
      save: string;
    };
    chats: {
      title: string;
      search_chat: string;
    };
  };
  chat: {
    start: string;
    joined: string;
    left: string;
    view_info: string;
    view_chat: string;
    manage_group: string;
    delete_group: string;
    delete_chat: string;
    mark_as_read: string;
    profile: string;
    edit_message: string;
    new_messages: string;
    unknown_sender: string;
    edited: string;
    stop_editing: string;
    deleted_account: string;
    new_message: string;
    leave_group: string;
  };
  chat_settings: {
    settings: {
      title: string;
      description: string;
      name: string;
      tag: string;
      public: string;
      upload_avatar: string;
      delete_avatar: string;
      delete: string;
      save: string;
    };
    member: {
      title: string;
      search_member: string;
      roles: {
        owner: string;
        admin: string;
        member: string;
      };
      kick: string;
      ban: string;
      save: string;
      edit_member: string;
      edit_chat: string;
      unban: string;
    };

    banned_member: {
      title: string;
      search_member: string;
      unban: string;
    };
  };
  explore: {
    title: string;
    burger_title: string;
    filters: {
      user: string;
      chats: string;
      name: string;
      tag: string;
      uuid: string;
    };
    search: string;
  };
  create: {
    title: string;
    burger_title: string;
    informations: {
      title: string;
      name: string;
      tag: string;
      description: string;
      public: string;
    };
    members: {
      title: string;
      search_user: string;
    };
    create: string;
  };
  logout: string;
}

export interface LocaleTranslations {
  EN: string;
  DE: string;
  FR: string;
}

export interface SiteTitleTranslations {
  home: string;
  chat_settings: string;
  passwordreset: string;
  passwordreset_confirm: string;
  register: string;
  404: string;
  500: string;
  app: string;
  auth: string;
  create: string;
  explore: string;
  login: string;
  profile: string;
  signup: string;
  chat: string;
}

export interface ModalTranslations {
  minute: {
    name: string;
    plural: string;
  };
  hour: {
    name: string;
    plural: string;
  };
  day: {
    name: string;
    plural: string;
  };
  week: {
    name: string;
    plural: string;
  };
  month: {
    name: string;
    plural: string;
  };
  year: {
    name: string;
    plural: string;
  };
  time_prefix: string;
  time_suffix: string;
  user: {
    create_chat: string;
    information: string;
    chats: string;
    just_now: string;

    last_seen: string;
    joined: string;
    name: string;
    tag: string;
    description: string;
    no_shared: string;
  };
  chat_preview: {
    information: string;
    join_group: string;
    name: string;
    tag: string;
    description: string;
    members: string;
    online: string;
  };
  chat: {
    information: string;
    members: string;
    owner: string;
    admin: string;
    member: string;
    kick_member: string;
    ban_member: string;
    name: string;
    tag: string;
    description: string;
    created: string;
  };
  change_password: {
    title: string;
    old_password: string;
    new_password: string;
    submit: string;
    forgot: string;
  };
}
