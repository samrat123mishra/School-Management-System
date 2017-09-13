
/*
CREATE TABLE
*/
CREATE TABLE school.student
(
  st_id character varying(755) PRIMARY KEY ,
  t_id character varying(755) REFERENCES school.teacher (t_id),
  s_name character varying(755),
  gender character varying(755),
  username character varying(755),
  password character varying(755)
);

CREATE TABLE school.teacher
(
  t_id character varying(755) PRIMARY KEY,
  t_name character varying(755),
  gender character varying(755),
  username character varying(755),
  password character varying(755)
);

CREATE TABLE school.result
(
  st_id character varying(755) REFERENCES school.student (st_id),
  maths integer,
  english integer,
  history integer,
  geography integer
);


/*
INSERT INTO TABLE
*/

INSERT INTO school.teacher (t_id, name, gender, username, password) VALUES ('t1','Juhi','female','juhi','juhi_pass'),
('t2','Subrata','male','subrata','subrata_pass'),
('t3','Rakhi','female','rakhi','rakhi_pass');


INSERT INTO school.student (st_id, t_id, name, gender, username, password) VALUES ('st1','t2','Rohan','male','rohan','rohan_pass'),
('st2','t1','Mithun','male','mithun','mithun_pass'),
('st3','t1','Vishal','male','vishal','vishal_pass'),
('st4','t2','Madhav','male','madhav','madhav_pass'),
('st5','t3','Priya','female','priya','priya_pass'),
('st6','t3','Rakesh','male','rakesh','rakesh_pass'),
('st7','t2','Vidya','female','vidya','vidya_pass');


INSERT INTO school.result (st_id, maths, english, history, geography) VALUES ('st1','75','60','39','82'),
('st2','30','79','88','67'),
('st3','90','80','44','27'),
('st4','80','33','54','59'),
('st5','84','63','22','49'),
('st6','55','40','87','73'),
('st7','75','64','77','33');




