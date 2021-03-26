-- SUBJECT
INSERT INTO Subject(subject_name, description, author, address, email, phone, facebook_url)
VALUES('svinov', 'Krátký popisek pojednávající o obci Svinov. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'Aleš Sedláček', 'Adresa ve Svinově 654', 'ales.sedlacek@mail.com', '+420732666555', 'https://www.facebook.com/svinov');

-- SUBJECT_SCHEDULE
INSERT INTO Subject_Schedule(schedule_name, date_from, date_to, description, subject_id)
VALUES('Navrhování', '2021-01-01', '2021-04-30', 'Navrhovací část je první z částí participativního harmonogramu. Občané navrhují projekty a obec provádí postupně analýzu proveditelnost. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 1);
INSERT INTO Subject_Schedule(schedule_name, date_from, date_to, description, subject_id)
VALUES('Hlasování', '2021-05-01', '2021-08-31', 'Hlasovací část je další částí participativního harmonogramu. Občané hlasují v anketě navrhnutých projektů. Hlasovat lze jen pro proveditelné projekty. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 1);
INSERT INTO Subject_Schedule(schedule_name, date_from, date_to, description, subject_id)
VALUES('Výsledky', '2021-09-01', '2021-12-31', 'Výsledková část je poslední částí participativního harmonogramu. Navrhování i hlasování skončilo a je možné nahlížet do definitivních výsledků. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 1);

-- SUBJECT_POLYGON
INSERT INTO Subject_Polygon(polygon_data, subject_id)
VALUES('{
   "center":{
      "lat":49.198766952601716,
      "lng":16.61561608857421
   },
   "coords":[
      {
         "lat":49.227057212070264,
         "lng":16.657158141796867
      },
      {
         "lat":49.254627518813095,
         "lng":16.601196532910148
      },
      {
         "lat":49.234231456099586,
         "lng":16.53321862763671
      },
      {
         "lat":49.15503292578185,
         "lng":16.525665527050773
      },
      {
         "lat":49.14290638639034,
         "lng":16.639648681347648
      },
      {
         "lat":49.15301204199561,
         "lng":16.705566650097648
      },
      {
         "lat":49.20889275048098,
         "lng":16.693207030957023
      }
   ]
}',1);

-- PROJECT
INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id)
VALUES('Workoutové hřiště', 'Aleš Sedláček', 'ales.sedlacek@mail.com', NOW(), 'Sport', 'Uvítal bych nové workoutové hřiště vedle obchodu Kaufland.', 49.819792289954215, 18.189444568389817, 1);
INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id)
VALUES('Lavičky', 'Aleš Sedláček', 'ales.sedlacek@mail.com', NOW(), 'Jine', 'Uvítal bych lavičky vedle obchodu Kaufland.', 49.819792289954215, 18.189444568389817, 1);
-- old
INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id)
VALUES('Workoutové hřiště OLD1', 'Aleš Sedláček', 'ales.sedlacek@mail.com', '2020-03-05', 'Sport', 'Uvítal bych nové workoutové hřiště vedle obchodu Kaufland.', 49.819792289954215, 18.189444568389817, 1);
INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id)
VALUES('Workoutové hřiště OLD2', 'Aleš Sedláček', 'ales.sedlacek@mail.com', '2019-03-05', 'Sport', 'Uvítal bych nové workoutové hřiště vedle obchodu Kaufland.', 49.819792289954215, 18.189444568389817, 1);

-- PROJECT_PHOTO
INSERT INTO Project_Photo(photo_name, photo_path, project_id)
VALUES('dummy_photo_w.png', 'firebase/path/dummy_photo_w.png', 1);
INSERT INTO Project_Photo(photo_name, photo_path, project_id)
VALUES('dummy_photo_l.png', 'firebase/path/dummy_photo_l.png', 2);

-- PROJECT_EXPENSES
INSERT INTO Project_Expenses(expense_name, expense_cost, project_id)
VALUES('tyčinky', 42000, 1);
INSERT INTO Project_Expenses(expense_name, expense_cost, project_id)
VALUES('hrazdy', 54500, 1);
INSERT INTO Project_Expenses(expense_name, expense_cost, project_id)
VALUES('lavičky', 8500, 2);

-- VOTER
INSERT INTO Voter(voter_hash, date_created, subject_id)
VALUES('0b72491fd59c16ba2023b8b5d795a2c5059c70b6', NOW(), 1);

-- VOTE
INSERT INTO Vote(date_voted, voter_hash, project_id)
VALUES(NOW(), '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 1);
INSERT INTO Vote(date_voted, voter_hash, project_id)
VALUES(NOW(), '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 1);
INSERT INTO Vote(date_voted, voter_hash, project_id)
VALUES(NOW(), '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 2);
-- old
INSERT INTO Vote(date_voted, voter_hash, project_id)
VALUES(NOW(), '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 3);
INSERT INTO Vote(date_voted, voter_hash, project_id)
VALUES(NOW(), '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 4);


