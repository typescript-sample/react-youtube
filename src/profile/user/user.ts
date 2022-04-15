import { Attributes, DateRange, Filter, Repository, Service } from 'onecore';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  interests: string[];
  skills: Skill[];
  achievements: Achievement[];
  settings: UserSettings;

  title?: string;
  image?: string;
  coverImage?: string;
  nationality?: string;
  alternativeEmail?: string;
  address?: string;
  bio?: string;
  website?: string;
  occupation?: string;
  company?: string;
  lookingFor: string[];

  dribbbleLink: string;
  skypeLink: string;
  twitterLink: string;
  linkedinLink: string;
  googleLink: string;
  instagramLink: string;
  facebookLink: string;
  lastName: string;
  firstName: string;
  customLink01: string;
  customLink02: string;
  customLink03: string;
  customLink04: string;
  customLink05: string;
  customLink06: string;
  customLink07: string;
  customLink08: string;
}
export interface Skill {
  skill: string;
  hirable: boolean;
}
export interface UserSettings {
  userId: string;
  language: string;
  dateFormat: string;
  dateTimeFormat: string;
  timeFormat: string;
  notification: boolean;

  searchEnginesLinksToMyProfile: boolean;
  emailFeedUpdates: boolean;
  notifyFeedUpdates: boolean;
  emailPostMentions: boolean;
  notifyPostMentions: boolean;
  emailCommentsOfYourPosts: boolean;
  notifyCommentsOfYourPosts: boolean;
  emailEventInvitations: boolean;
  notifyEventInvitations: boolean;
  emailWhenNewEventsAround: boolean;
  notifyWhenNewEventsAround: boolean;
  followingListPublicOnMyProfile: boolean;
  showMyProfileInSpacesAroundMe: boolean;
  showAroundMeResultsInMemberFeed: boolean;
}
export interface Achievement {
  subject: string;
  description: string;
  highlight?: boolean;
}
export interface Appreciation {
  id: string;
  userId: string;
  appreciator: string;
  appreciatedAt: string;
  subject: string;
  description: string;
}

export interface UserFilter extends Filter {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  dateOfBirth?: DateRange;
  interests: string[];
  skills: Skill[];
  achievements: Achievement[];
  settings: UserSettings;
}
export interface UserRepository extends Repository<User, string> {
}
export interface UserService extends Service<User, string, UserFilter> {
  getUserBySearch(obj:any):Promise<User[]|null>;
}
export interface ProfileService{
  getMyProfile(id: string): Promise<User | null>;
  getMySettings(id: string): Promise<UserSettings | null>;
  // saveMySettings(id: string, settings: UserSettings): Promise<boolean>;
  // saveMyProfile(id: string, user: User): Promise<boolean>;
}

export const skillsModel: Attributes = {
  skill: {
    required: true
  },
  hirable: {
    type: 'boolean',
  }
};
export const userSettingsModel: Attributes = {
  userId: {},
  language: {},
  dateFormat: {},
  dateTimeFormat: {},
  timeFormat: {},
  notification: {
    type: 'boolean',
  }
};
export const achievements: Attributes = {
  subject: {},
  description: {}
};
export const userModel: Attributes = {
  id: {
    key: true,
    match: 'equal'
  },
  username: {},
  email: {
    format: 'email',
    required: true,
    match: 'prefix'
  },
  phone: {
    format: 'phone',
    required: true
  },
  dateOfBirth: {
    type: 'datetime',
    field: 'date_of_birth'
  },
  interests: {
    type: 'primitives',
  },
  skills: {
    type: 'primitives',
    typeof: skillsModel,
  },
  achievements: {
    type: 'primitives',
    typeof: achievements,
  },
  settings: {
    type: 'object',
    typeof: userSettingsModel,
  }
};
