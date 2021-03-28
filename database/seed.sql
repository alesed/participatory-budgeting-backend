-- SUBJECT
INSERT INTO Subject(subject_name, description, author, address, email, phone, facebook_url)
VALUES('svinov', 'Svinov - dříve starobylá slezská obec, v roce 1936 povýšena na město, dnes jeden z městských obvodů Ostravy. Rozkládá se na ploše asi 12km2 a v současnosti čítá téměř 4 600 obyvatel. Původní osada byla založena v údolí Porubky, kde vznikala první hospodářská stavení. Postupem času se osada dále rozrůstala. K velkému nárůstu obyvatelstva došlo počátkem 80.let, kdy se přistěhovalo více než 1000 nových občanů. S rostoucím osídlením souvisel i rozvoj infrastruktury. K základní škole přibyla v roce 1992 i základní umělecká škola, v jejímž rámci byl vybudován i hudební sál. V roce 2002 byl zkolaudován a slavnostně uveden do provozu areál nové tělocvičny. Velmi kvalitní služby dětem i dospělým poskytuje místní knihovna. Další významnou akcí byla přestavba svinovského nádraží a přednádražního prostoru. Historická nádražní budova byla doplněna moderní, architektonicky vyváženou prosklenou přístavbou. Díky svému dynamickému rozvoji se městský obvod Svinov stává stále významnější součástí Statutárního města Ostravy a roste i jeho význam v rámci celého Moravskoslezského kraje.', 'Městský Obvod Ostrava-Svinov', 'Bílovecká 69, 721 00 Ostrava-Svinov', 'alesed998@gmail.com', '+420732666555', 'https://www.facebook.com/svinov');

-- SUBJECT_SCHEDULE
INSERT INTO Subject_Schedule(schedule_name, date_from, date_to, description, subject_id)
VALUES('Navrhování', '2021-01-01', '2021-03-27', 'Navrhovací část je první z částí participativního harmonogramu. Občané navrhují projekty a obec provádí postupně analýzu proveditelnost. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 1);
INSERT INTO Subject_Schedule(schedule_name, date_from, date_to, description, subject_id)
VALUES('Hlasování', '2021-03-28', '2021-08-31', 'Hlasovací část je další částí participativního harmonogramu. Občané hlasují v anketě navrhnutých projektů. Hlasovat lze jen pro proveditelné projekty. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 1);
INSERT INTO Subject_Schedule(schedule_name, date_from, date_to, description, subject_id)
VALUES('Výsledky', '2021-09-01', '2021-12-31', 'Výsledková část je poslední částí participativního harmonogramu. Navrhování i hlasování skončilo a je možné nahlížet do definitivních výsledků. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 1);

-- SUBJECT_POLYGON
INSERT INTO Subject_Polygon(polygon_data, subject_id)
VALUES('{
   "center":{
      "lat":49.816226703021925,
      "lng":18.197413147279015
   },
   "coords":[
      {
         "lat": 49.82686067087774,
         "lng": 18.214150131531945
      },
      {
         "lat": 49.829739790765956,
         "lng": 18.195954025574913
      },
      {
         "lat": 49.82038202453789,
         "lng": 18.18084782440304
      },
      {
         "lat": 49.81279481452633,
         "lng": 18.175440491029015
      },
      {
         "lat": 49.80559417216316,
         "lng": 18.18805760223507
      },
      {
         "lat": 49.80271361527789,
         "lng": 18.20282048065304
      },
      {
         "lat": 49.80803143257936,
         "lng": 18.213205993958702
      },
      {
         "lat": 49.81517632970542,
         "lng": 18.218956650086632
      },
      {
         "lat": 49.8223755465881,
         "lng": 18.219385803529015
      }
   ]
}',1);

-- PROJECT
-- INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id)
-- VALUES('Workoutové hřiště', 'Aleš Sedláček', 'ales.sedlacek@mail.com', NOW(), 'Sport', 'Uvítal bych nové workoutové hřiště vedle obchodu Kaufland.', 49.819792289954215, 18.189444568389817, 1);
-- INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id)
-- VALUES('Lavičky', 'Aleš Sedláček', 'ales.sedlacek@mail.com', NOW(), 'Jine', 'Uvítal bych lavičky vedle obchodu Kaufland.', 49.819792289954215, 18.189444568389817, 1);
-- old
INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id)
VALUES('Workoutové hřiště OLD1', 'Aleš Sedláček', 'ales.sedlacek@mail.com', '2020-03-05', 'Sport', 'Uvítal bych nové workoutové hřiště vedle obchodu Kaufland.', 49.81348647493309, 18.200331390687218, 1);
INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id)
VALUES('Workoutové hřiště OLD2', 'Aleš Sedláček', 'ales.sedlacek@mail.com', '2019-03-05', 'Sport', 'Uvítal bych nové workoutové hřiště vedle obchodu Kaufland.', 49.81348647493309, 18.200331390687218, 1);

-- PROJECT_PHOTO
-- INSERT INTO Project_Photo(photo_name, photo_path, project_id)
-- VALUES('dummy_photo_w.png', 'firebase/path/dummy_photo_w.png', 1);
-- INSERT INTO Project_Photo(photo_name, photo_path, project_id)
-- VALUES('dummy_photo_l.png', 'firebase/path/dummy_photo_l.png', 2);

-- PROJECT_EXPENSES
-- INSERT INTO Project_Expenses(expense_name, expense_cost, project_id)
-- VALUES('tyčinky', 42000, 1);
-- INSERT INTO Project_Expenses(expense_name, expense_cost, project_id)
-- VALUES('hrazdy', 54500, 1);
-- INSERT INTO Project_Expenses(expense_name, expense_cost, project_id)
-- VALUES('lavičky', 8500, 2);

-- VOTER
INSERT INTO Voter(voter_hash, date_created, subject_id)
VALUES('0b72491fd59c16ba2023b8b5d795a2c5059c70b6', NOW(), 1);

-- VOTE
-- INSERT INTO Vote(date_voted, voter_hash, project_id)
-- VALUES(NOW(), '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 1);
-- INSERT INTO Vote(date_voted, voter_hash, project_id)
-- VALUES(NOW(), '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 1);
-- INSERT INTO Vote(date_voted, voter_hash, project_id)
-- VALUES(NOW(), '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 2);
-- old
INSERT INTO Vote(date_voted, voter_hash, project_id)
VALUES('2020-03-20', '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 1);
INSERT INTO Vote(date_voted, voter_hash, project_id)
VALUES('2020-03-20', '0b72491fd59c16ba2023b8b5d795a2c5059c70b6', 2);


