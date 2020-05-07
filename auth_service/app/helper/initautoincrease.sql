delete from profile.user_details where user_id > 0;
ALTER TABLE profile.user_details AUTO_INCREMENT=1;
delete from authentication.users where id > 0;
ALTER TABLE authentication.users AUTO_INCREMENT=1;