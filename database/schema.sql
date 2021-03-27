DROP TABLE IF EXISTS Subject_Schedule;
DROP TABLE IF EXISTS Subject_Polygon;

DROP TABLE IF EXISTS Project_Expenses;
DROP TABLE IF EXISTS Project_Photo;

DROP TABLE IF EXISTS Vote;
DROP TABLE IF EXISTS Voter;

DROP TABLE IF EXISTS Project;
DROP TABLE IF EXISTS Subject;

-- SUBJECT ======================================================
CREATE TABLE Subject(
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(50) NOT NULL,
    description VARCHAR(1500) NOT NULL,
    author VARCHAR(100) NOT NULL,
	address VARCHAR(150) NOT NULL,
	email VARCHAR(100) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	photo VARCHAR(500),
	facebook_url VARCHAR(200),
	instagram_url VARCHAR(200)
);

CREATE TABLE Subject_Schedule(
    schedule_id SERIAL PRIMARY KEY,
	schedule_name VARCHAR(50),
	date_from DATE NOT NULL,
	date_to DATE NOT NULL,
	description VARCHAR(500) NOT NULL,
	subject_id SERIAL REFERENCES Subject(subject_id),
	UNIQUE (schedule_name, subject_id)
);

CREATE TABLE Subject_Polygon(
    polygon_id SERIAL PRIMARY KEY,
	polygon_data JSON NOT NULL,
	subject_id SERIAL REFERENCES Subject(subject_id)
);	

-- PROJECT ======================================================
CREATE TABLE Project(
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL UNIQUE,
	author VARCHAR(150) NOT NULL,
	author_email VARCHAR(100) NOT NULL,
	date_created DATE NOT NULL,
	category VARCHAR(50) NOT NULL,
    description VARCHAR(1500) NOT NULL,
    geo_latitude DOUBLE PRECISION NOT NULL,
	geo_longtitude DOUBLE PRECISION NOT NULL,
	decision BIT,
	decision_text VARCHAR(250),
	subject_id SERIAL REFERENCES Subject(subject_id)
);

CREATE TABLE Project_Expenses(
    expense_id SERIAL PRIMARY KEY,
	expense_name VARCHAR(50) NOT NULL,
	expense_cost DOUBLE PRECISION NOT NULL,
	project_id SERIAL REFERENCES Project(project_id)
);

CREATE TABLE Project_Photo(
    photo_id SERIAL PRIMARY KEY,
	photo_name VARCHAR(50),
	photo_path VARCHAR(500) NOT NULL,
	project_id SERIAL REFERENCES Project(project_id)
);

-- VOTER ========================================================
CREATE TABLE Voter(
	voter_hash VARCHAR(100) PRIMARY KEY,
	date_created DATE NOT NULL,
	subject_id SERIAL REFERENCES Subject(subject_id)
);

-- VOTE =========================================================
CREATE TABLE Vote(
	vote_id SERIAL PRIMARY KEY,
	date_voted DATE NOT NULL,
	voter_hash VARCHAR(100) REFERENCES Voter(voter_hash),
	project_id SERIAL REFERENCES Project(project_id)
);
