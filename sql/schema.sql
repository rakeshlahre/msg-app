create table users (
  id bigserial primary key,
  username text not null,
  email text null,
  google_user_id text NULL,
  facebook_user_id text NULL,
  picture text NULL,
  email_verified boolean NOT NULL DEFAULT false,
  unique (username)
);

create table private_chats (
  id bigserial primary key,
  from_user_id bigint null,
  to_user_id bigint null,
  to_username text NOT NULL,
  from_username text NOT NULL,
  message text,
  date timestamp with time zone NOT NULL DEFAULT NOW()
);

create table user_tokens (
  id bigserial primary key,
  user_id bigint references users(id) not null,
  username text references users(username) not null,
  token text not null
);

