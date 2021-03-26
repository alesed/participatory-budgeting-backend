SELECT * FROM Subject
SELECT * FROM Project
SELECT * FROM Voter
SELECT * FROM Vote

SELECT project_id, project_name, category, COUNT(*) as number_of_votes
FROM Project 
INNER JOIN Subject USING (subject_id)
INNER JOIN Vote USING (project_id)
WHERE subject_name = 'svinov' AND category in ('Sport','Vzdelani')
GROUP BY project_id

SELECT project_id, project_name, category
FROM Project 
INNER JOIN Subject USING (subject_id)
LEFT JOIN Vote USING (project_id)
WHERE subject_name = 'svinov' AND category in ('Sport','Vzdelani')

INSERT INTO Voter(voter_hash, date_created, subject_id)
VALUES('54b0fd4dc5dc68a50813190ca9827647', NOW(), 1);

INSERT INTO Vote(date_voted, voter_hash, project_id)
VALUES(NOW(), '54b0fd4dc5dc68a50813190ca9827647', 2);