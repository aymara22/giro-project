PGDMP  #    6            
    |            dbgiro    16.4    16.4 9    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16397    dbgiro    DATABASE     y   CREATE DATABASE dbgiro WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE dbgiro;
                postgres    false            S           1247    16399    estado_categoria    TYPE     N   CREATE TYPE public.estado_categoria AS ENUM (
    'activa',
    'inactiva'
);
 #   DROP TYPE public.estado_categoria;
       public          postgres    false            V           1247    16404    tipo_usuario_enum    TYPE     L   CREATE TYPE public.tipo_usuario_enum AS ENUM (
    'ADMIN',
    'VIEWER'
);
 $   DROP TYPE public.tipo_usuario_enum;
       public          postgres    false            �            1259    16410 	   categoria    TABLE     �   CREATE TABLE public.categoria (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text NOT NULL,
    estado public.estado_categoria DEFAULT 'activa'::public.estado_categoria NOT NULL
);
    DROP TABLE public.categoria;
       public         heap    postgres    false    851    851            �            1259    16409    categoria_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.categoria_id_seq;
       public          postgres    false    216            �           0    0    categoria_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;
          public          postgres    false    215            �            1259    16420    insumo    TABLE     0  CREATE TABLE public.insumo (
    id integer NOT NULL,
    categoria_id integer NOT NULL,
    nombre_insumo character varying(100) NOT NULL,
    punto_control_id integer NOT NULL,
    descripcion text NOT NULL,
    cantidad integer NOT NULL,
    interdeposito_id integer,
    apto boolean DEFAULT true
);
    DROP TABLE public.insumo;
       public         heap    postgres    false            �            1259    16419    insumo_id_seq    SEQUENCE     �   CREATE SEQUENCE public.insumo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.insumo_id_seq;
       public          postgres    false    218            �           0    0    insumo_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.insumo_id_seq OWNED BY public.insumo.id;
          public          postgres    false    217            �            1259    16434    interdeposito    TABLE     7  CREATE TABLE public.interdeposito (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    telefono character varying(100) NOT NULL,
    insumos text NOT NULL,
    origen integer NOT NULL,
    destino integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 !   DROP TABLE public.interdeposito;
       public         heap    postgres    false            �            1259    16433    interdeposito_id_seq    SEQUENCE     �   CREATE SEQUENCE public.interdeposito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.interdeposito_id_seq;
       public          postgres    false    220            �           0    0    interdeposito_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.interdeposito_id_seq OWNED BY public.interdeposito.id;
          public          postgres    false    219            �            1259    16444    punto_de_control    TABLE     T  CREATE TABLE public.punto_de_control (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    longitud character varying(100) NOT NULL,
    responsable character varying(100) NOT NULL,
    telefono character varying(50) NOT NULL,
    horario character varying(100) NOT NULL,
    latitud character varying(100) NOT NULL
);
 $   DROP TABLE public.punto_de_control;
       public         heap    postgres    false            �            1259    16443    punto_de_control_id_seq    SEQUENCE     �   CREATE SEQUENCE public.punto_de_control_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.punto_de_control_id_seq;
       public          postgres    false    222            �           0    0    punto_de_control_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.punto_de_control_id_seq OWNED BY public.punto_de_control.id;
          public          postgres    false    221            �            1259    16453    turnos    TABLE     �   CREATE TABLE public.turnos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    punto_control_id integer NOT NULL,
    fecha_inicio timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_fin timestamp without time zone
);
    DROP TABLE public.turnos;
       public         heap    postgres    false            �            1259    16452    turnos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.turnos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.turnos_id_seq;
       public          postgres    false    224            �           0    0    turnos_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.turnos_id_seq OWNED BY public.turnos.id;
          public          postgres    false    223            �            1259    16461    usuario    TABLE     r  CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre_completo character varying(200) NOT NULL,
    nombre_usuario character varying(200) NOT NULL,
    dni bigint NOT NULL,
    email character varying(100) NOT NULL,
    tipo_usuario public.tipo_usuario_enum NOT NULL,
    password character varying(200) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);
    DROP TABLE public.usuario;
       public         heap    postgres    false    854            �            1259    16460    usuario_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.usuario_id_seq;
       public          postgres    false    226            �           0    0    usuario_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;
          public          postgres    false    225            9           2604    16413    categoria id    DEFAULT     l   ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);
 ;   ALTER TABLE public.categoria ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            ;           2604    16423 	   insumo id    DEFAULT     f   ALTER TABLE ONLY public.insumo ALTER COLUMN id SET DEFAULT nextval('public.insumo_id_seq'::regclass);
 8   ALTER TABLE public.insumo ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            =           2604    16437    interdeposito id    DEFAULT     t   ALTER TABLE ONLY public.interdeposito ALTER COLUMN id SET DEFAULT nextval('public.interdeposito_id_seq'::regclass);
 ?   ALTER TABLE public.interdeposito ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            ?           2604    16447    punto_de_control id    DEFAULT     z   ALTER TABLE ONLY public.punto_de_control ALTER COLUMN id SET DEFAULT nextval('public.punto_de_control_id_seq'::regclass);
 B   ALTER TABLE public.punto_de_control ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            @           2604    16456 	   turnos id    DEFAULT     f   ALTER TABLE ONLY public.turnos ALTER COLUMN id SET DEFAULT nextval('public.turnos_id_seq'::regclass);
 8   ALTER TABLE public.turnos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            B           2604    16464 
   usuario id    DEFAULT     h   ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);
 9   ALTER TABLE public.usuario ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    226    226            �          0    16410 	   categoria 
   TABLE DATA           D   COPY public.categoria (id, nombre, descripcion, estado) FROM stdin;
    public          postgres    false    216   =C       �          0    16420    insumo 
   TABLE DATA           �   COPY public.insumo (id, categoria_id, nombre_insumo, punto_control_id, descripcion, cantidad, interdeposito_id, apto) FROM stdin;
    public          postgres    false    218   ZC       �          0    16434    interdeposito 
   TABLE DATA           k   COPY public.interdeposito (id, usuario_id, telefono, insumos, origen, destino, fecha_creacion) FROM stdin;
    public          postgres    false    220   wC       �          0    16444    punto_de_control 
   TABLE DATA           i   COPY public.punto_de_control (id, nombre, longitud, responsable, telefono, horario, latitud) FROM stdin;
    public          postgres    false    222   �C       �          0    16453    turnos 
   TABLE DATA           [   COPY public.turnos (id, usuario_id, punto_control_id, fecha_inicio, fecha_fin) FROM stdin;
    public          postgres    false    224   �C       �          0    16461    usuario 
   TABLE DATA           r   COPY public.usuario (id, nombre_completo, nombre_usuario, dni, email, tipo_usuario, password, activo) FROM stdin;
    public          postgres    false    226   �C                   0    0    categoria_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.categoria_id_seq', 1, false);
          public          postgres    false    215                       0    0    insumo_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.insumo_id_seq', 1, false);
          public          postgres    false    217                       0    0    interdeposito_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.interdeposito_id_seq', 1, false);
          public          postgres    false    219                       0    0    punto_de_control_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.punto_de_control_id_seq', 1, false);
          public          postgres    false    221                       0    0    turnos_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.turnos_id_seq', 1, false);
          public          postgres    false    223                       0    0    usuario_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.usuario_id_seq', 13, true);
          public          postgres    false    225            E           2606    16418    categoria categoria_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.categoria DROP CONSTRAINT categoria_pkey;
       public            postgres    false    216            G           2606    16427    insumo insumo_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT insumo_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.insumo DROP CONSTRAINT insumo_pkey;
       public            postgres    false    218            J           2606    16442     interdeposito interdeposito_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.interdeposito
    ADD CONSTRAINT interdeposito_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.interdeposito DROP CONSTRAINT interdeposito_pkey;
       public            postgres    false    220            L           2606    16451 &   punto_de_control punto_de_control_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.punto_de_control
    ADD CONSTRAINT punto_de_control_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.punto_de_control DROP CONSTRAINT punto_de_control_pkey;
       public            postgres    false    222            N           2606    16459    turnos turnos_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.turnos
    ADD CONSTRAINT turnos_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.turnos DROP CONSTRAINT turnos_pkey;
       public            postgres    false    224            P           2606    16469    usuario usuario_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public            postgres    false    226            H           1259    16480    fki_usuario    INDEX     K   CREATE INDEX fki_usuario ON public.interdeposito USING btree (usuario_id);
    DROP INDEX public.fki_usuario;
       public            postgres    false    220            Q           2606    16496    insumo fk_categoria    FK CONSTRAINT     {   ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES public.categoria(id);
 =   ALTER TABLE ONLY public.insumo DROP CONSTRAINT fk_categoria;
       public          postgres    false    218    4677    216            T           2606    16511    interdeposito fk_destino    FK CONSTRAINT     �   ALTER TABLE ONLY public.interdeposito
    ADD CONSTRAINT fk_destino FOREIGN KEY (destino) REFERENCES public.punto_de_control(id);
 B   ALTER TABLE ONLY public.interdeposito DROP CONSTRAINT fk_destino;
       public          postgres    false    4684    222    220            R           2606    24576    insumo fk_interdeposito    FK CONSTRAINT     �   ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT fk_interdeposito FOREIGN KEY (interdeposito_id) REFERENCES public.interdeposito(id) NOT VALID;
 A   ALTER TABLE ONLY public.insumo DROP CONSTRAINT fk_interdeposito;
       public          postgres    false    220    4682    218            U           2606    16506    interdeposito fk_origen    FK CONSTRAINT     �   ALTER TABLE ONLY public.interdeposito
    ADD CONSTRAINT fk_origen FOREIGN KEY (origen) REFERENCES public.punto_de_control(id);
 A   ALTER TABLE ONLY public.interdeposito DROP CONSTRAINT fk_origen;
       public          postgres    false    222    4684    220            W           2606    16486    turnos fk_punto_control    FK CONSTRAINT     �   ALTER TABLE ONLY public.turnos
    ADD CONSTRAINT fk_punto_control FOREIGN KEY (punto_control_id) REFERENCES public.punto_de_control(id);
 A   ALTER TABLE ONLY public.turnos DROP CONSTRAINT fk_punto_control;
       public          postgres    false    4684    224    222            S           2606    16501    insumo fk_punto_control    FK CONSTRAINT     �   ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT fk_punto_control FOREIGN KEY (punto_control_id) REFERENCES public.punto_de_control(id);
 A   ALTER TABLE ONLY public.insumo DROP CONSTRAINT fk_punto_control;
       public          postgres    false    222    4684    218            X           2606    16481    turnos fk_usuario    FK CONSTRAINT     u   ALTER TABLE ONLY public.turnos
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);
 ;   ALTER TABLE ONLY public.turnos DROP CONSTRAINT fk_usuario;
       public          postgres    false    4688    226    224            V           2606    16491    interdeposito fk_usuario    FK CONSTRAINT     |   ALTER TABLE ONLY public.interdeposito
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);
 B   ALTER TABLE ONLY public.interdeposito DROP CONSTRAINT fk_usuario;
       public          postgres    false    4688    220    226            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x�34��*M��,�Wp���M<�1�3$����i��%�ٙٙ�F鹉�9z�����.��~�*FI*�*�i�>F�&AF��Q�ni�U�z^�Uɾ�e���ᎎ�y~�~�y�ήQ��%\1z\\\ �(�     