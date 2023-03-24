--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: t_wards; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.t_wards (id, name, institution, is_park, created_at, updated_at) FROM stdin;
1	HDP_Urgência	HDP	t	2023-03-24 12:28:37.812481	2023-03-24 12:28:37.812481
2	HDP_Medicina	HDP	f	2023-03-24 12:28:37.812481	2023-03-24 12:28:37.812481
3	HSA_Intensiva	HSA	t	2023-03-24 12:28:37.812481	2023-03-24 12:28:37.812481
\.


--
-- Data for Name: t_users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.t_users (id, mec, name, role, password_hash, refresh_token, workplace_id, created_at, updated_at) FROM stdin;
1	9999	John Admin	admin	$argon2id$v=19$m=65536,t=3,p=4$VZx0SfvzvlDKs/oOQjOgJw$AZCJe3hg1uML5GMYHYR/oelfu3RUR7+fH+Vlp4gGmdQ	\N	\N	2023-03-24 12:28:37.913896	2023-03-24 12:28:37.913896
3	2000	Maria Consumer	consumer	$argon2id$v=19$m=65536,t=3,p=4$VZx0SfvzvlDKs/oOQjOgJw$AZCJe3hg1uML5GMYHYR/oelfu3RUR7+fH+Vlp4gGmdQ	\N	2	2023-03-24 12:28:37.913896	2023-03-24 12:28:37.913896
2	1000	Gil Dispatcher	dispatcher	$argon2id$v=19$m=65536,t=3,p=4$VZx0SfvzvlDKs/oOQjOgJw$AZCJe3hg1uML5GMYHYR/oelfu3RUR7+fH+Vlp4gGmdQ	$argon2id$v=19$m=65536,t=3,p=4$TNuHigWMMcT100CnWedZ7w$fgE7Dd6l8efd46OuUSNI0Z62iIzzFEr9palfhqsOOus	1	2023-03-24 12:28:37.913896	2023-03-24 12:29:36.918075
\.


--
-- Data for Name: t_ventilators; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.t_ventilators (id, brand, model, serial, category, is_free, park_id, created_at, updated_at) FROM stdin;
1	Philips	Trilogy	3000-AWX	VNI	t	1	2023-03-24 12:28:37.922673	2023-03-24 12:28:37.922673
2	Oxylog	Life	PUT665TR	VNI	t	1	2023-03-24 12:28:37.922673	2023-03-24 12:28:37.922673
3	Philips	Trilogy	3000-ZZTY	VNI	t	3	2023-03-24 12:28:37.922673	2023-03-24 12:28:37.922673
4	Medtronic	Assist	KH8765434H	VI	t	3	2023-03-24 12:28:37.922673	2023-03-24 12:28:37.922673
\.


--
-- Data for Name: t_orders; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.t_orders (id, order_type, patient_name, patient_bed, status, is_closed, obs, created_at, updated_at, from_id, to_id, ventilator_id, requested_by_id, dispatched_by_id, delivered_by_id, received_by_id) FROM stdin;
\.


--
-- Name: t_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.t_orders_id_seq', 1, false);


--
-- Name: t_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.t_users_id_seq', 3, true);


--
-- Name: t_ventilators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.t_ventilators_id_seq', 4, true);


--
-- Name: t_wards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.t_wards_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

