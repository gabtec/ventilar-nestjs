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
-- Name: ventilar_db; Type: DATABASE; Schema: -; Owner: admin
--

CREATE DATABASE ventilar_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE ventilar_db OWNER TO admin;

\connect ventilar_db

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: t_orders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.t_orders (
    id integer NOT NULL,
    order_type character varying NOT NULL,
    patient_name character varying NOT NULL,
    patient_bed integer NOT NULL,
    status character varying(12) DEFAULT 'PENDING'::character varying NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    obs text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    from_id integer,
    to_id integer,
    ventilator_id integer,
    requested_by_id integer,
    dispatched_by_id integer,
    delivered_by_id integer,
    received_by_id integer
);


ALTER TABLE public.t_orders OWNER TO admin;

--
-- Name: t_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.t_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_orders_id_seq OWNER TO admin;

--
-- Name: t_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.t_orders_id_seq OWNED BY public.t_orders.id;


--
-- Name: t_users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.t_users (
    id integer NOT NULL,
    mec integer NOT NULL,
    name character varying NOT NULL,
    role character varying DEFAULT 'consumer'::character varying NOT NULL,
    password_hash character varying NOT NULL,
    refresh_token character varying,
    workplace_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.t_users OWNER TO admin;

--
-- Name: t_users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.t_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_users_id_seq OWNER TO admin;

--
-- Name: t_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.t_users_id_seq OWNED BY public.t_users.id;


--
-- Name: t_ventilators; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.t_ventilators (
    id integer NOT NULL,
    brand character varying NOT NULL,
    model character varying NOT NULL,
    serial character varying NOT NULL,
    category character varying(4) NOT NULL,
    is_free boolean DEFAULT true NOT NULL,
    park_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.t_ventilators OWNER TO admin;

--
-- Name: t_ventilators_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.t_ventilators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_ventilators_id_seq OWNER TO admin;

--
-- Name: t_ventilators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.t_ventilators_id_seq OWNED BY public.t_ventilators.id;


--
-- Name: t_wards; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.t_wards (
    id integer NOT NULL,
    name character varying NOT NULL,
    institution character varying NOT NULL,
    is_park boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.t_wards OWNER TO admin;

--
-- Name: t_wards_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.t_wards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_wards_id_seq OWNER TO admin;

--
-- Name: t_wards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.t_wards_id_seq OWNED BY public.t_wards.id;


--
-- Name: t_orders id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders ALTER COLUMN id SET DEFAULT nextval('public.t_orders_id_seq'::regclass);


--
-- Name: t_users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_users ALTER COLUMN id SET DEFAULT nextval('public.t_users_id_seq'::regclass);


--
-- Name: t_ventilators id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_ventilators ALTER COLUMN id SET DEFAULT nextval('public.t_ventilators_id_seq'::regclass);


--
-- Name: t_wards id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_wards ALTER COLUMN id SET DEFAULT nextval('public.t_wards_id_seq'::regclass);


--
-- Name: t_users PK_45e27b946b7f8cd527fd4fbe658; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_users
    ADD CONSTRAINT "PK_45e27b946b7f8cd527fd4fbe658" PRIMARY KEY (id);


--
-- Name: t_ventilators PK_6e09e4482737f0d2a4087eac5bd; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_ventilators
    ADD CONSTRAINT "PK_6e09e4482737f0d2a4087eac5bd" PRIMARY KEY (id);


--
-- Name: t_wards PK_d3910bff3ae7da327c10c7c161f; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_wards
    ADD CONSTRAINT "PK_d3910bff3ae7da327c10c7c161f" PRIMARY KEY (id);


--
-- Name: t_orders PK_f11934191df798e6a4a452b02eb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT "PK_f11934191df798e6a4a452b02eb" PRIMARY KEY (id);


--
-- Name: t_ventilators UQ_5151ad9b964ba81234a6cc4d9a7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_ventilators
    ADD CONSTRAINT "UQ_5151ad9b964ba81234a6cc4d9a7" UNIQUE (serial);


--
-- Name: t_wards UQ_5f068469d9c2c474ebf53700143; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_wards
    ADD CONSTRAINT "UQ_5f068469d9c2c474ebf53700143" UNIQUE (name);


--
-- Name: t_users UQ_e6e96929d5458970a196ab3145c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_users
    ADD CONSTRAINT "UQ_e6e96929d5458970a196ab3145c" UNIQUE (mec);


--
-- Name: IDX_e6e96929d5458970a196ab3145; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_e6e96929d5458970a196ab3145" ON public.t_users USING btree (mec);


--
-- Name: t_ventilators FK_0564c8577aa8a9361dfb1804076; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_ventilators
    ADD CONSTRAINT "FK_0564c8577aa8a9361dfb1804076" FOREIGN KEY (park_id) REFERENCES public.t_wards(id) ON DELETE SET NULL;


--
-- Name: t_orders FK_07fc7763da77ae038fe75011464; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT "FK_07fc7763da77ae038fe75011464" FOREIGN KEY (dispatched_by_id) REFERENCES public.t_users(id);


--
-- Name: t_orders FK_12f6fdf9f0b88cb602229b671d1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT "FK_12f6fdf9f0b88cb602229b671d1" FOREIGN KEY (from_id) REFERENCES public.t_wards(id);


--
-- Name: t_orders FK_72006fc5153e48d315178d58615; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT "FK_72006fc5153e48d315178d58615" FOREIGN KEY (ventilator_id) REFERENCES public.t_ventilators(id);


--
-- Name: t_users FK_8929d41910d08d7e2128a4a5ba8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_users
    ADD CONSTRAINT "FK_8929d41910d08d7e2128a4a5ba8" FOREIGN KEY (workplace_id) REFERENCES public.t_wards(id) ON DELETE SET NULL;


--
-- Name: t_orders FK_8cb149624cb40c4cf0d9b12940a; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT "FK_8cb149624cb40c4cf0d9b12940a" FOREIGN KEY (requested_by_id) REFERENCES public.t_users(id);


--
-- Name: t_orders FK_8ebf0baabce8f1cd68fb529f0e1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT "FK_8ebf0baabce8f1cd68fb529f0e1" FOREIGN KEY (received_by_id) REFERENCES public.t_users(id);


--
-- Name: t_orders FK_e2312d9b90a9f57dfef51a321fd; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT "FK_e2312d9b90a9f57dfef51a321fd" FOREIGN KEY (to_id) REFERENCES public.t_wards(id);


--
-- Name: t_orders FK_e767e35ccac59320ce9a86ec333; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT "FK_e767e35ccac59320ce9a86ec333" FOREIGN KEY (delivered_by_id) REFERENCES public.t_users(id);


--
-- PostgreSQL database dump complete
--

