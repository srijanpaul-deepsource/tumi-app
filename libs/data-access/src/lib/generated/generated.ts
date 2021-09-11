import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `BigInt` scalar type represents non-fractional signed whole numeric values.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
   */
  BigInt: any;
  /** The `Byte` scalar type represents byte value as a Buffer */
  Bytes: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** An arbitrary-precision Decimal type */
  Decimal: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: any;
};

/** Input needed to create a new event template */
export type CreateEventTemplateInput = {
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  icon: Scalars['String'];
  location: Scalars['String'];
  locationId: Scalars['String'];
  organizerText: Scalars['String'];
  participantMail: Scalars['String'];
  participantText: Scalars['String'];
  title: Scalars['String'];
};

/** New user input object */
export type CreateUserInput = {
  birthdate: Scalars['DateTime'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

/** Template that holds all information for an event that is needed to run it */
export type EventTemplate = {
  __typename?: 'EventTemplate';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  duration: Scalars['Decimal'];
  eventInstances: Array<TumiEvent>;
  finances: Scalars['Json'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  location: Scalars['String'];
  locationId: Scalars['String'];
  organizerText: Scalars['String'];
  participantMail: Scalars['String'];
  participantText: Scalars['String'];
  tenant: Tenant;
  title: Scalars['String'];
};

export enum MembershipStatus {
  Alumni = 'ALUMNI',
  Full = 'FULL',
  None = 'NONE',
  Sponsor = 'SPONSOR',
  Trial = 'TRIAL'
}

export type Mutation = {
  __typename?: 'Mutation';
  createEventTemplate?: Maybe<EventTemplate>;
  /** Add a new user to the database */
  registerUser: User;
};


export type MutationCreateEventTemplateArgs = {
  eventTemplateInput?: Maybe<CreateEventTemplateInput>;
};


export type MutationRegisterUserArgs = {
  userInput?: Maybe<CreateUserInput>;
};

export type PhotoShare = {
  __typename?: 'PhotoShare';
  createdAt: Scalars['DateTime'];
  event: TumiEvent;
  eventId: Scalars['String'];
  id: Scalars['ID'];
};

export enum PublicationState {
  Approval = 'APPROVAL',
  Draft = 'DRAFT',
  Public = 'PUBLIC'
}

export type Query = {
  __typename?: 'Query';
  currentTenant?: Maybe<Tenant>;
  /** Returns the logged in user if found or null */
  currentUser?: Maybe<User>;
  /** Get one event template by ID */
  eventTemplate?: Maybe<EventTemplate>;
  /** Query event templates for the current tenant */
  eventTemplates: Array<EventTemplate>;
  tenants: Array<Tenant>;
  userById?: Maybe<User>;
};


export type QueryEventTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryUserByIdArgs = {
  id: Scalars['ID'];
};

export enum RegistrationType {
  Organizer = 'ORGANIZER',
  Participant = 'PARTICIPANT'
}

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum SubmissionItemType {
  Date = 'DATE',
  File = 'FILE',
  Number = 'NUMBER',
  Rating = 'RATING',
  Text = 'TEXT'
}

export enum SubmissionTime {
  After = 'AFTER',
  Before = 'BEFORE',
  During = 'DURING',
  Registration = 'REGISTRATION'
}

/** One Tenant of the app, most likely an ESN section */
export type Tenant = {
  __typename?: 'Tenant';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  shortName: Scalars['String'];
};

/** Actual instande of an TumiEventbased on a template */
export type TumiEvent = {
  __typename?: 'TumiEvent';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  end: Scalars['DateTime'];
  eventTemplate: EventTemplate;
  eventTemplateId: Scalars['String'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  location: Scalars['String'];
  organizerText: Scalars['String'];
  participantMail: Scalars['String'];
  participantText: Scalars['String'];
  photoShare?: Maybe<PhotoShare>;
  publicationState: PublicationState;
  start: Scalars['DateTime'];
  title: Scalars['String'];
};

/** One User of the app */
export type User = {
  __typename?: 'User';
  /** Id from auth0 for this user */
  authId: Scalars['String'];
  birthdate: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  firstName: Scalars['String'];
  /** Concatenated name of the user */
  fullName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', currentUser?: Maybe<{ __typename?: 'User', id: string }> };

export type CreateEventTemplateMutationVariables = Exact<{
  input?: Maybe<CreateEventTemplateInput>;
}>;


export type CreateEventTemplateMutation = { __typename?: 'Mutation', createEventTemplate?: Maybe<{ __typename?: 'EventTemplate', id: string, createdAt: any }> };

export type GetEventTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventTemplatesQuery = { __typename?: 'Query', eventTemplates: Array<{ __typename?: 'EventTemplate', id: string, title: string, icon: string }> };

export type GetEventTemplateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetEventTemplateQuery = { __typename?: 'Query', eventTemplate?: Maybe<{ __typename?: 'EventTemplate', id: string, title: string, icon: string }> };

export type RegisterUserMutationVariables = Exact<{
  userInput?: Maybe<CreateUserInput>;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'User', id: string } };

export type UserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type UserProfileQuery = { __typename?: 'Query', currentUser?: Maybe<{ __typename?: 'User', id: string, fullName: string, birthdate: any, firstName: string }> };

export const GetCurrentUserDocument = gql`
    query getCurrentUser {
  currentUser {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCurrentUserGQL extends Apollo.Query<GetCurrentUserQuery, GetCurrentUserQueryVariables> {
    document = GetCurrentUserDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateEventTemplateDocument = gql`
    mutation createEventTemplate($input: CreateEventTemplateInput) {
  createEventTemplate(eventTemplateInput: $input) {
    id
    createdAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateEventTemplateGQL extends Apollo.Mutation<CreateEventTemplateMutation, CreateEventTemplateMutationVariables> {
    document = CreateEventTemplateDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetEventTemplatesDocument = gql`
    query getEventTemplates {
  eventTemplates {
    id
    title
    icon
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetEventTemplatesGQL extends Apollo.Query<GetEventTemplatesQuery, GetEventTemplatesQueryVariables> {
    document = GetEventTemplatesDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetEventTemplateDocument = gql`
    query getEventTemplate($id: ID!) {
  eventTemplate(id: $id) {
    id
    title
    icon
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetEventTemplateGQL extends Apollo.Query<GetEventTemplateQuery, GetEventTemplateQueryVariables> {
    document = GetEventTemplateDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterUserDocument = gql`
    mutation RegisterUser($userInput: CreateUserInput) {
  registerUser(userInput: $userInput) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterUserGQL extends Apollo.Mutation<RegisterUserMutation, RegisterUserMutationVariables> {
    document = RegisterUserDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserProfileDocument = gql`
    query userProfile {
  currentUser {
    id
    fullName
    birthdate
    firstName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserProfileGQL extends Apollo.Query<UserProfileQuery, UserProfileQueryVariables> {
    document = UserProfileDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
