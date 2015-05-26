# Database (outdated)

<!--
## ER model

Below are ER models of views and example layers and roles.

![maplayer](/images/architecture/maplayer-ER.png)

![views](/images/architecture/tablesER.png)

![rolesetc](/images/architecture/tables2ER.png)
-->



Below you can see all Oskari tables and their create SQL scripts.

## **Bundle and view**

Oskari bundle and views are defined in following tables.

### portti_bundle

Default values for the bundles are found in this table. The values can be overwritten in the View bundle sequence table.


	CREATE TABLE portti_bundle (
	    id bigint NOT NULL,
	    name character varying(128) NOT NULL,
	    config character varying(20000) DEFAULT '{}'::character varying,
	    state character varying(20000) DEFAULT '{}'::character varying,
	    startup character varying(20000) NOT NULL
	);
	

### portti_view

Oskari view information (frontend application specific details) is stored here.


	-- DROP TABLE portti_view IF EXISTS;
	CREATE TABLE portti_view (
	    uuid uuid,
	    id bigint NOT NULL,
	    name character varying(128) NOT NULL,
	    is_default boolean DEFAULT false,
	    type character varying(16) DEFAULT 'USER'::character varying,
	    description character varying(2000),
	    page character varying(128) DEFAULT 'index'::character varying,
	    application character varying(128) DEFAULT 'servlet'::character varying,
	    application_dev_prefix character varying(256) DEFAULT '/applications/sample'::character varying,
	    only_uuid boolean DEFAULT false,
	    creator bigint DEFAULT (-1),
	    domain character varying(512) DEFAULT ''::character varying,
	    lang character varying(2) DEFAULT 'en'::character varying,
	    is_public boolean DEFAULT false,
	    old_id bigint DEFAULT (-1),
	    created timestamp without time zone DEFAULT now()
	);

### portti_view_bundle_seq

Bundles belonging to a view and the sequence they are started is specified here.


	-- DROP TABLE portti_view_bundle_seq IF EXISTS;
	CREATE TABLE portti_view_bundle_seq (
	    view_id bigint NOT NULL,
	    bundle_id bigint NOT NULL,
	    seqno integer NOT NULL,
	    config character varying(20000) DEFAULT '{}'::character varying,
	    state character varying(20000) DEFAULT '{}'::character varying,
	    startup character varying(20000),
	    bundleinstance character varying(128) DEFAULT ''::character varying
	);

## **Analysis**

Analysis is defined in following tables.

### analysis

This table contains analysis. 


	-- DROP TABLE analysis IF EXISTS;
	CREATE TABLE analysis (
	    id bigint NOT NULL,
	    uuid character varying(64),
	    name character varying(256) NOT NULL,
	    layer_id integer,
	    analyse_json text,
	    style_id bigint,
	    col1 character varying(64),
	    col2 character varying(64),
	    col3 character varying(64),
	    col4 character varying(64),
	    col5 character varying(64),
	    col6 character varying(64),
	    col7 character varying(64),
	    col8 character varying(64),
	    col10 character varying(64),
	    select_to_data text,
	    created timestamp with time zone DEFAULT now(),
	    updated timestamp with time zone,
	    col9 character varying(64),
	    publisher_name character varying(256),
	    override_sld character varying(256)
	);

### analysis_data

This table contains analysis data. 


	-- DROP TABLE analysis_data IF EXISTS;
	CREATE TABLE analysis_data (
	    id bigint NOT NULL,
	    analysis_id bigint NOT NULL,
	    uuid character varying(64),
	    t1 text,
	    t2 text,
	    t3 text,
	    t4 text,
	    t5 text,
	    t6 text,
	    t7 text,
	    t8 text,
	    n1 numeric,
	    n2 numeric,
	    n3 numeric,
	    n4 numeric,
	    n5 numeric,
	    n6 numeric,
	    n7 numeric,
	    n8 numeric,
	    d1 date,
	    d2 date,
	    d3 date,
	    d4 date,
	    geometry geometry NOT NULL,
	    created timestamp with time zone DEFAULT now(),
	    updated timestamp with time zone
	);

### analysis_style

This table contains analysis style. 


	-- DROP TABLE analysis_style IF EXISTS;
	CREATE TABLE analysis_style (
	    id bigint NOT NULL,
	    stroke_width integer,
	    stroke_color character(7),
	    fill_color character(7),
	    dot_color character(7),
	    dot_size integer,
	    border_width integer,
	    border_color character(7),
	    dot_shape character varying(20) DEFAULT '8'::character varying NOT NULL,
	    stroke_linejoin character varying(256),
	    fill_pattern integer DEFAULT (-1),
	    stroke_linecap character varying(256),
	    stroke_dasharray character varying(256),
	    border_linejoin character varying(256),
	    border_dasharray character varying(256)
	);

### oskari_user_indicator

This table contains users indicators.


	-- DROP TABLE oskari_user_indicator IF EXISTS;
	CREATE TABLE oskari_user_indicator (
	    id integer NOT NULL,
	    user_id bigint,
	    title character varying(1000),
	    source character varying(1000),
	    layer_id bigint,
	    description character varying(1000),
	    year bigint,
	    data text,
	    published boolean,
	    category character varying(100)
	);


## **User and userrights **

User and his rights are defined in following tables.


### oskari_users

This table contains all Oskari users.

	-- DROP TABLE oskari_users IF EXISTS;
	CREATE TABLE oskari_users (
	    id integer NOT NULL,
	    user_name character varying(128) NOT NULL,
	    first_name character varying(128),
	    last_name character varying(128),
	    email character varying(256),
	    uuid character varying(64),
	    attributes text DEFAULT '{}'::text
	);


### oskari_roles

This table contains all Oskari user roles.


	-- DROP TABLE oskari_roles IF EXISTS;
	CREATE TABLE oskari_roles (
	    id integer NOT NULL,
	    name character varying(25) NOT NULL,
	    is_guest boolean DEFAULT false
	);

### oskari_role_oskari_user

This table maps users and their roles.


	-- DROP TABLE oskari_role_oskari_user IF EXISTS;
	CREATE TABLE oskari_role_oskari_user (
	    id integer NOT NULL,
	    role_id integer,
	    user_id bigint
	);


### oskari_jaas_users

This table contains Oskari JAAS users.

	
	-- DROP TABLE oskari_jaas_users IF EXISTS;
	CREATE TABLE oskari_jaas_users (
	    id integer NOT NULL,
	    login character varying(25) NOT NULL,
	    password character varying(50) NOT NULL
	);

### oskari_jaas_roles

This table contains Oskari JAAS user roles.

	
	-- DROP TABLE oskari_jaas_roles IF EXISTS;
	CREATE TABLE oskari_jaas_roles (
	    id integer NOT NULL,
	    login character varying(25) NOT NULL,
	    role character varying(50) NOT NULL
	);

### oskari_permissions

This table maps resource user to permission type. permission_type can be for example "viewlayer" or "publish"

	
	-- DROP TABLE oskari_permission IF EXISTS;
	CREATE TABLE oskari_permission (
	    id integer NOT NULL,
	    oskari_resource_id bigint NOT NULL,
	    external_type character varying(100),
	    permission character varying(100),
	    external_id character varying(1000)
	);


### oskari_role_external_mapping

This table contains external mapping for Oskari roles.


	-- DROP TABLE oskari_role_external_mapping EXISTS;
	CREATE TABLE oskari_role_external_mapping (
	    roleid bigint NOT NULL,
	    name character varying(50) NOT NULL,
	    external_type character varying(50) DEFAULT ''::character varying NOT NULL
	);


## **My places**

My places is defined following tables.

### my_places

This table contains my_places.


	-- DROP TABLE my_places IF EXISTS;
	CREATE TABLE my_places (
	    id bigint NOT NULL,
	    uuid character varying(64) NOT NULL,
	    category_id integer NOT NULL,
	    name character varying(256) NOT NULL,
	    attention_text text,
	    created timestamp with time zone DEFAULT now() NOT NULL,
	    updated timestamp with time zone,
	    geometry geometry NOT NULL,
	    place_desc text,
	    link text,
	    image_url character varying(512)
	);


### my_places_categories

This view contains my places view with styling.


	-- DROP VIEW my_places_categories IF EXISTS;
	CREATE VIEW my_places_categories AS
	 SELECT mp.id,
	    mp.uuid,
	    mp.category_id,
	    mp.name,
	    mp.attention_text,
	    mp.place_desc,
	    mp.created,
	    mp.updated,
	    mp.geometry,
	    c.category_name,
	    c."default",
	    c.stroke_width,
	    c.stroke_color,
	    c.fill_color,
	    c.dot_color,
	    c.dot_size,
	    c.dot_shape,
	    c.border_width,
	    c.border_color,
	    c.publisher_name,
	    mp.link,
	    mp.image_url,
	    c.fill_pattern,
	    c.stroke_linejoin,
	    c.stroke_linecap,
	    c.stroke_dasharray,
	    c.border_linejoin,
	    c.border_dasharray
	   FROM my_places mp,
	    categories c
	  WHERE (mp.category_id = c.id);


## **Layers**

### oskari_layergroup

This table contains Oskari maplayer groups.


	-- DROP TABLE oskari_layergroup IF EXISTS;
	CREATE TABLE oskari_layergroup (
	    id integer NOT NULL,
	    locale text DEFAULT '{}'::text
	);

### oskari_maplayer

This table contains Oskari maplayers.

	
	-- DROP TABLE oskari_maplayer IF EXISTS;
	CREATE TABLE oskari_maplayer (
	    id integer NOT NULL,
	    parentid integer DEFAULT (-1) NOT NULL,
	    externalid character varying(50),
	    type character varying(50) NOT NULL,
	    base_map boolean DEFAULT false NOT NULL,
	    groupid integer,
	    name character varying(2000),
	    url character varying(2000),
	    locale text,
	    opacity integer DEFAULT 100,
	    style character varying(100),
	    minscale double precision DEFAULT (-1),
	    maxscale double precision DEFAULT (-1),
	    legend_image character varying(2000),
	    metadataid character varying(200),
	    tile_matrix_set_id character varying(200),
	    tile_matrix_set_data text,
	    params text DEFAULT '{}'::text,
	    options text DEFAULT '{}'::text,
	    gfi_type character varying(200),
	    gfi_xslt text,
	    gfi_content text,
	    realtime boolean DEFAULT false,
	    refresh_rate integer DEFAULT 0,
	    created timestamp with time zone DEFAULT now(),
	    updated timestamp with time zone,
	    username character varying(256),
	    password character varying(256),
	    srs_name character varying,
	    version character varying(64),
	    attributes text DEFAULT '{}'::text
	);


### oskari_maplayer_metadata

This table contains Oskari maplayer metadata defination and its specifies layers bbox.


	-- DROP TABLE oskari_maplayer_metadata IF EXISTS;
	CREATE TABLE oskari_maplayer_metadata (
	    id integer NOT NULL,
	    metadataid character varying(256),
	    wkt character varying(512) DEFAULT ''::character varying,
	    json text DEFAULT ''::text,
	    ts timestamp without time zone DEFAULT now()
	);


### oskari_maplayer_themes

This table contains Oskari maplayer themes.


	-- DROP TABLE oskari_maplayer_themes IF EXISTS;
	CREATE TABLE oskari_maplayer_themes (
	    maplayerid integer NOT NULL,
	    themeid integer NOT NULL
	);


### oskari_wfs_parser_config

This table contains Oskari WFS parser configs.

	-- DROP TABLE oskari_wfs_parser_config IF EXISTS;
	CREATE TABLE oskari_wfs_parser_config (
	    id integer NOT NULL,
	    name character varying(128),
	    type character varying(64),
	    request_template text,
	    response_template text,
	    parse_config text,
	    sld_style text
	);

### portti_capabilities_cache

Cababilities requests are stored here and updated by a cron process.


	-- DROP TABLE portti_capabilities_cache IF EXISTS;
	CREATE TABLE portti_capabilities_cache (
	    layer_id integer NOT NULL,
	    data text,
	    updated timestamp without time zone DEFAULT now(),
	    "WMSversion" character(10) NOT NULL
	);


### portti_ispiretheme

This table contains INSPIRE theme names.


	-- DROP TABLE portti_inspiretheme IF EXISTS;
	CREATE TABLE portti_inspiretheme (
	    id integer NOT NULL,
	    locale character varying(20000)
	);


### portti_layer_keywords

This table contains Oskari maplayer keywords.


	-- DROP TABLE portti_layer_keywords IF EXISTS;
	CREATE TABLE portti_layer_keywords (
	    keyid bigint NOT NULL,
	    layerid bigint NOT NULL
	);


### portti_stats_layer

This table contains Oskari stats layers.


	-- DROP TABLE portti_stats_layer IF EXISTS;
	CREATE TABLE portti_stats_layer (
	    id bigint NOT NULL,
	    maplayer_id integer,
	    name text,
	    visualization character varying(1000),
	    classes character varying(2000),
	    colors character varying(1000),
	    layername character varying(1000),
	    filterproperty character varying(200),
	    geometryproperty character varying(200),
	    externalid character varying(200)
	);

### portti_wfs_layer

This table contains WFS layer extra definitions.


	-- DROP TABLE portti_wfs_layer IF EXISTS;
	CREATE TABLE portti_wfs_layer (
	    id integer NOT NULL,
	    maplayer_id bigint NOT NULL,
	    layer_name character varying(256),
	    gml_geometry_property character varying(256),
	    gml_version character varying(64),
	    gml2_separator boolean DEFAULT false NOT NULL,
	    get_highlight_image boolean DEFAULT true NOT NULL,
	    max_features integer DEFAULT 100 NOT NULL,
	    feature_namespace character varying DEFAULT 512,
	    wfs_template_model_id integer,
	    feature_type character varying(4000),
	    selected_feature_params character varying(4000) DEFAULT '{}'::character varying,
	    feature_params_locales text,
	    properties character varying(4000),
	    geometry_type character varying(8),
	    selection_sld_style_id integer,
	    get_map_tiles boolean DEFAULT true NOT NULL,
	    get_feature_info boolean DEFAULT true NOT NULL,
	    tile_request boolean DEFAULT false NOT NULL,
	    tile_buffer character varying(512) DEFAULT '{}'::character varying,
	    wms_layer_id integer,
	    wps_params character varying(256) DEFAULT '{}'::character varying,
	    feature_element character varying(512),
	    output_format character varying(256),
	    feature_namespace_uri character varying(512),
	    geometry_namespace_uri character varying(512),
	    job_type character varying(256),
	    request_impulse character varying(256)
	);


### portti_wfs_layer_style

This table contains WFS layer styles.


	-- DROP TABLE portti_wfs_layer_style IF EXISTS;
	CREATE TABLE portti_wfs_layer_style (
	    id integer NOT NULL,
	    name character varying(256),
	    sld_style text
	);

### portti_wfs_layers_styles

This table maps WFS layer style to WFS layer.


	-- DROP TABLE portti_wfs_layers_styles IF EXISTS;
	CREATE TABLE portti_wfs_layers_styles (
	    id integer NOT NULL,
	    wfs_layer_id bigint NOT NULL,
	    wfs_layer_style_id integer NOT NULL
	);


### portti_wfs_template_model

This table contains WFS model templates.


	-- DROP TABLE portti_wfs_template_model IF EXISTS;
	CREATE TABLE portti_wfs_template_model (
	    id integer NOT NULL,
	    name character varying(256),
	    description character varying(4000),
	    type character varying(64),
	    request_template text,
	    response_template text,
	    parse_config text
	);


### user_layer

This table contains user layers.


	-- DROP TABLE user_layer IF EXISTS;
	CREATE TABLE user_layer (
	    id bigint NOT NULL,
	    uuid character varying(64),
	    layer_name character varying(256) NOT NULL,
	    layer_desc character varying(256),
	    layer_source character varying(256),
	    publisher_name character varying(256),
	    style_id bigint,
	    created timestamp with time zone DEFAULT now() NOT NULL,
	    updated timestamp with time zone,
	    fields json
	);

### user_layer_data
	
This table contains user layer datas.


	-- DROP TABLE user_layer_data IF EXISTS;
	CREATE TABLE user_layer_data (
	    id bigint NOT NULL,
	    user_layer_id bigint NOT NULL,
	    uuid character varying(64),
	    feature_id character varying(64),
	    property_json json,
	    geometry geometry NOT NULL,
	    created timestamp with time zone DEFAULT now() NOT NULL,
	    updated timestamp with time zone
	);

### user_layer_style

This table contains user layer styles.


	-- DROP TABLE user_layer_style IF EXISTS;
	CREATE TABLE user_layer_style (
	    id bigint NOT NULL,
	    stroke_width integer,
	    stroke_color character(7),
	    fill_color character(7),
	    dot_color character(7),
	    dot_size integer,
	    border_width integer,
	    border_color character(7),
	    dot_shape character varying(20) DEFAULT '8'::character varying NOT NULL,
	    stroke_linejoin character varying(256),
	    fill_pattern integer DEFAULT (-1),
	    stroke_linecap character varying(256),
	    stroke_dasharray character varying(256),
	    border_linejoin character varying(256),
	    border_dasharray character varying(256)
	);

### user_layer_data_style

This view contains styles for user layer.


	-- DROP VIEW user_layer_data_style IF EXISTS;
	CREATE VIEW user_layer_data_style AS
	 SELECT ad.id,
	    ad.uuid,
	    ad.user_layer_id,
	    a.layer_name,
	    a.publisher_name,
	    ad.feature_id,
	    ad.created,
	    ad.updated,
	    ad.geometry,
	    st.stroke_width,
	    st.stroke_color,
	    st.fill_color,
	    st.dot_color,
	    st.dot_size,
	    st.dot_shape,
	    st.border_width,
	    st.border_color,
	    st.fill_pattern,
	    st.stroke_linejoin,
	    st.stroke_linecap,
	    st.stroke_dasharray,
	    st.border_linejoin,
	    st.border_dasharray
	   FROM user_layer_data ad,
	    user_layer a,
	    user_layer_style st
	  WHERE ((ad.user_layer_id = a.id) AND (a.style_id = st.id));

### vuser_layer_data

This view contains simplified user layer view.


	-- DROP VIEW vuser_layer_data IF EXISTS;
  	CREATE VIEW vuser_layer_data AS
	 SELECT user_layer_data.id,
	    user_layer_data.uuid,
	    user_layer_data.user_layer_id,
	    user_layer_data.feature_id,
	    (user_layer_data.property_json)::text AS property_json,
	    user_layer_data.created,
	    user_layer_data.updated,
	    user_layer_data.geometry
	   FROM user_layer_data;


## **Backend status**


### portti_backendstatus

This table indicates whether the layer's server is online. This is updated in Paikkatietoikkuna as a cron process.

	
	-- DROP TABLE portti_backendstatus IF EXISTS;
	CREATE TABLE portti_backendstatus (
	    id integer NOT NULL,
	    ts timestamp without time zone DEFAULT now(),
	    maplayer_id character varying(50),
	    status character varying(500),
	    statusmessage character varying(2000),
	    infourl character varying(2000),
	    statusjson character varying(20000)
	);

### portti_backendalert

This view indicates alert statuses.

	
	-- DROP VIEW portti_backendalert IF EXISTS;
	CREATE VIEW portti_backendalert AS
	 SELECT portti_backendstatus.id,
	    portti_backendstatus.ts,
	    portti_backendstatus.maplayer_id,
	    portti_backendstatus.status,
	    portti_backendstatus.statusmessage,
	    portti_backendstatus.infourl,
	    portti_backendstatus.statusjson
	   FROM portti_backendstatus
	  WHERE (((NOT (portti_backendstatus.status IS NULL)) AND (NOT ((portti_backendstatus.status)::text = 'UNKNOWN'::text))) AND (NOT ((portti_backendstatus.status)::text = 'OK'::text)));

### portti_backendstatus_allknown

This view indicates allknown statuses.


	-- DROP VIEW portti_backendstatus_allknown IF EXISTS;
	CREATE VIEW portti_backendstatus_allknown AS
	 SELECT portti_backendstatus.id,
	    portti_backendstatus.ts,
	    portti_backendstatus.maplayer_id,
	    portti_backendstatus.status,
	    portti_backendstatus.statusmessage,
	    portti_backendstatus.infourl,
	    portti_backendstatus.statusjson
	   FROM portti_backendstatus;


## **Other**


### categories

This table contains categories.


	-- DROP TABLE categories IF EXISTS;
	CREATE TABLE categories (
	    id bigint NOT NULL,
	    category_name character varying(256) NOT NULL,
	    "default" boolean,
	    stroke_width integer DEFAULT 1,
	    stroke_color character(7),
	    fill_color character(7),
	    uuid character varying(64),
	    dot_color character(7) DEFAULT '#00FF00'::bpchar,
	    dot_size integer DEFAULT 3,
	    border_width integer,
	    border_color character(7),
	    publisher_name character varying(256),
	    dot_shape character varying(20) DEFAULT '1'::character varying NOT NULL,
	    stroke_linejoin character varying(256),
	    fill_pattern integer DEFAULT (-1),
	    stroke_linecap character varying(256),
	    stroke_dasharray character varying(256),
	    border_linejoin character varying(256),
	    border_dasharray character varying(256)
	);

### gt_pk_metadata_table

This table contains gt_pk_metadata_table.


	-- DROP TABLE gt_pk_metadata_table IF EXISTS;
	CREATE TABLE gt_pk_metadata_table (
	    table_schema character varying(32) NOT NULL,
	    table_name character varying(32) NOT NULL,
	    pk_column character varying(32) NOT NULL,
	    pk_column_idx integer,
	    pk_policy character varying(32),
	    pk_sequence character varying(64)
	);






	-- DROP TABLE oskari_resource IF EXISTS;
	CREATE TABLE oskari_resource (
	    id integer NOT NULL,
	    resource_type character varying(100) NOT NULL,
	    resource_mapping character varying(1000) NOT NULL
	);


	-- DROP TABLE portti_keywords IF EXISTS;
	CREATE TABLE portti_keywords (
	    id integer NOT NULL,
	    keyword character varying(2000),
	    uri character varying(2000),
	    lang character varying(10),
	    editable boolean
	);


	-- DROP TABLE portti_keyword_association IF EXISTS;
	CREATE TABLE portti_keyword_association (
	    keyid1 bigint NOT NULL,
	    keyid2 bigint NOT NULL,
	    type character varying(10)
	);


	-- DROP TABLE portti_published_map_usage IF EXISTS;
	CREATE TABLE portti_published_map_usage (
	    id integer NOT NULL,
	    published_map_id bigint NOT NULL,
	    usage_count bigint NOT NULL,
	    force_lock boolean DEFAULT false NOT NULL
	);

	-- DROP TABLE portti_terms_of_use_for_publishing IF EXISTS;
	CREATE TABLE portti_terms_of_use_for_publishing (
	    userid bigint NOT NULL,
	    agreed boolean DEFAULT false NOT NULL,
	    "time" timestamp with time zone
	);




	
<!--
# Old stuff

namefi, namesv and nameen columns are deprecated, use locale column, which will contain localization in i18n.

This table contains maplayers. Layerclassid indicates the layer's class position in the layer hierarchy.

### Maplayer


  	-- DROP TABLE portti_maplayer IF EXISTS;

  	CREATE TABLE portti_maplayer
  	(
  	id serial NOT NULL,
  	layerclassid integer,
  	namefi character varying(2000),
  	namesv character varying(2000),
  	nameen character varying(2000),
  	wmsname character varying(2000),
  	wmsurl character varying(2000),
    opacity integer,
    style text,
    minscale double precision,
    maxscale double precision,
    description_link character varying(2000),
    legend_image character varying(2000),
    inspire_theme_id integer,
    dataurl character varying(2000),
    metadataurl character varying(2000),
    order_number integer,
    layer_type character varying(100) NOT NULL,
    tile_matrix_set_id character varying(1024),
    tile_matrix_set_data text,
    created timestamp with time zone,
    updated timestamp with time zone,
    wms_dcp_http character varying(2000),
    wms_parameter_layers character varying(2000),
    resource_url_scheme character varying(100),
    resource_url_scheme_pattern character varying(2000),
    resource_url_client_pattern character varying(2000),
    resource_daily_max_per_ip integer,
    xslt text,
    gfi_type character varying(2000),
    subtitle_fi character varying(2000),
    subtitle_en character varying(2000),
    subtitle_sv character varying(2000),
    selection_style text,
    version character varying(10),
    epsg integer DEFAULT 3067,
    locale text,
    CONSTRAINT portti_maplayer_pkey PRIMARY KEY (id),
    CONSTRAINT portti_maplayer_inspire_theme_id_fkey FOREIGN KEY (inspire_theme_id)
        REFERENCES portti_inspiretheme (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT portti_maplayer_layerclassid_fkey FOREIGN KEY (layerclassid)
        REFERENCES portti_layerclass (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE
        )
    WITH (
    OIDS=FALSE
    );
    ALTER TABLE portti_maplayer
    GRANT SELECT, UPDATE ON TABLE portti_maplayer TO maplog;

    -- Index: portti_maplayer_q1

    -- DROP INDEX portti_maplayer_q1;

    CREATE INDEX portti_maplayer_q1
    ON portti_maplayer
    USING btree
    (layerclassid);

    -- Index: portti_maplayer_q2

    -- DROP INDEX portti_maplayer_q2;

    CREATE INDEX portti_maplayer_q2
    ON portti_maplayer
    USING btree
    (inspire_theme_id);

    -- Index: portti_maplayer_q3

    -- DROP INDEX portti_maplayer_q3;

    CREATE INDEX portti_maplayer_q3
    	ON portti_maplayer
    	USING btree
  	  (order_number);


### Layerclass

LayerClass specifies the layer's organization for normal layers, basemaps and groupmaps. If the layer is a basemap or a groupmap it has parent which refers to another layerclass. 





    -- DROP TABLE portti_layerclass;

    CREATE TABLE portti_layerclass
    (
    id serial NOT NULL,
    namefi character varying(2000),
    namesv character varying(2000),
    nameen character varying(2000),
    maplayers_selectable boolean,
    parent integer,
    legend_image character varying(2000),
    dataurl character varying(2000),
    group_map boolean,
    locale text,
    CONSTRAINT portti_layerclass_pkey PRIMARY KEY (id),
    CONSTRAINT portti_layerclass_parent_fkey FOREIGN KEY (parent)
        REFERENCES portti_layerclass (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE
    )
    WITH (
    OIDS=FALSE
    );


    -- Index: portti_layerclass_q1

    -- DROP INDEX portti_layerclass_q1;

    CREATE INDEX portti_layerclass_q1
    ON portti_layerclass
    USING btree
    (parent);

### InspireTheme

This table tells the layers inspire name.


	-- Table: portti_inspiretheme

	-- DROP TABLE portti_inspiretheme;

	CREATE TABLE portti_inspiretheme
	(
	  id serial NOT NULL,
	  namefi character varying(2000),
	  namesv character varying(2000),
	  nameen character varying(2000),
	  CONSTRAINT portti_inspiretheme_pkey PRIMARY KEY (id)
	)
	WITH (
	  OIDS=FALSE
	);



### Maplayer metadata

This table specifies layers bbox.

    -- Table: portti_maplayer_metadata

	-- DROP TABLE portti_maplayer_metadata;

	CREATE TABLE portti_maplayer_metadata
	(
	  id serial NOT NULL,
	  maplayerid integer,
	  uuid character varying(256),
	  namefi character varying(512),
	  namesv character varying(512),
	  nameen character varying(512),
	  abstractfi text,
	  abstractsv text,
	  abstracten text,
	  browsegraphic character varying(1024),
	  geom character varying(512),
	  CONSTRAINT portti_maplayer_metadata_pkey PRIMARY KEY (id)
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE portti_maplayer_metadata
	  OWNER TO postgres;
	GRANT ALL ON TABLE portti_maplayer_metadata TO postgres;
	GRANT SELECT, UPDATE, INSERT, DELETE, REFERENCES ON TABLE portti_maplayer_metadata TO maplog;


	-- Index: portti_maplayer_metadata_q1

	-- DROP INDEX portti_maplayer_metadata_q1;

	CREATE INDEX portti_maplayer_metadata_q1
	  ON portti_maplayer_metadata
	  USING btree
	  (maplayerid);

	-- Index: portti_maplayer_metadata_q2

	-- DROP INDEX portti_maplayer_metadata_q2;

	CREATE INDEX portti_maplayer_metadata_q2
	  ON portti_maplayer_metadata
	  USING btree
	  (uuid);


### Backend status

This table indicates whether the layer's server is online. This is updated in Paikkatietoikkuna as a cron process.

	-- Table: portti_backendstatus

	-- DROP TABLE portti_backendstatus;

	CREATE TABLE portti_backendstatus
	(
	  id bigserial NOT NULL,
	  ts timestamp without time zone DEFAULT now(),
	  maplayer_id character varying(50),
	  status character varying(500),
	  statusmessage character varying(2000),
	  infourl character varying(2000),
	  statusjson text,
	  CONSTRAINT portti_backendstatus_pkey PRIMARY KEY (id)
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE portti_backendstatus
	  OWNER TO postgres;
	GRANT ALL ON TABLE portti_backendstatus TO postgres;
	GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE portti_backendstatus TO maplog;


	-- Index: portti_backendstatus_maplayer_id_q1

	-- DROP INDEX portti_backendstatus_maplayer_id_q1;

	CREATE INDEX portti_backendstatus_maplayer_id_q1
	  ON portti_backendstatus
	  USING btree
	  (maplayer_id);

	-- Index: portti_backendstatus_maplayer_id_q2

	-- DROP INDEX portti_backendstatus_maplayer_id_q2;

	CREATE INDEX portti_backendstatus_maplayer_id_q2
	  ON portti_backendstatus
	  USING btree
	  (maplayer_id, status);

	-- Index: portti_backendstatus_maplayer_id_q3

	-- DROP INDEX portti_backendstatus_maplayer_id_q3;

	CREATE INDEX portti_backendstatus_maplayer_id_q3
	  ON portti_backendstatus
	  USING btree
	  (maplayer_id, status, ts);

	-- Index: portti_backendstatus_maplayer_id_q4

	-- DROP INDEX portti_backendstatus_maplayer_id_q4;

	CREATE INDEX portti_backendstatus_maplayer_id_q4
	  ON portti_backendstatus
	  USING btree
	  (status);

### Capabilities cache

Cababilities requests are stored here and updated by a cron process.

	-- Table: portti_capabilities_cache

	-- DROP TABLE portti_capabilities_cache;

	CREATE TABLE portti_capabilities_cache
	(
	  layer_id integer NOT NULL,
	  data text,
	  updated timestamp without time zone,
	  "WMSversion" character(10) NOT NULL,
	  CONSTRAINT portti_capabilities_cache_pkey PRIMARY KEY (layer_id)
	)
	WITH (
	  OIDS=FALSE
	);




	-- Trigger: update_capabilities_cache_timestamp on portti_capabilities_cache

	-- DROP TRIGGER update_capabilities_cache_timestamp ON portti_capabilities_cache;

	CREATE TRIGGER update_capabilities_cache_timestamp
	  BEFORE UPDATE
	  ON portti_capabilities_cache
	  FOR EACH ROW
	  EXECUTE PROCEDURE update_timestamp();

### Permissions

This table maps resource user to permission type. permission_type can be for example "viewlayer" or "publish"

	-- Table: portti_permissions

	-- DROP TABLE portti_permissions;

	CREATE TABLE portti_permissions
	(
	  id serial NOT NULL,
	  resource_user_id integer NOT NULL,
	  permissions_type character varying(100),
	  CONSTRAINT portti_permissions_pkey PRIMARY KEY (id)
	)
	WITH (
	  OIDS=FALSE
	);


	-- Index: portti_permissions_q1

	-- DROP INDEX portti_permissions_q1;

	CREATE INDEX portti_permissions_q1
	  ON portti_permissions
	  USING btree
	  (permissions_type);

	-- Index: portti_permissions_q2

	-- DROP INDEX portti_permissions_q2;

	CREATE INDEX portti_permissions_q2
	  ON portti_permissions
	  USING btree
	  (resource_user_id);

	-- Index: portti_permissions_q3

	-- DROP INDEX portti_permissions_q3;

	CREATE INDEX portti_permissions_q3
	  ON portti_permissions
	  USING btree
	  (resource_user_id, permissions_type);

### Resource user

This table describes wms layer or base layer resources. Check [user management documentation](/documentation/backend/usermanagement).

	-- Table: portti_resource_user

	-- DROP TABLE portti_resource_user;

	CREATE TABLE portti_resource_user
	(
	  id serial NOT NULL,
	  resource_name character varying(1000),
	  resource_namespace character varying(1000),
	  resource_type character varying(100),
	  externalid character varying(1000),
	  externalid_type character varying(20),
	  CONSTRAINT portti_resource_user_pkey PRIMARY KEY (id),
	  CONSTRAINT portti_resource_user_externalid_type_check CHECK (externalid_type::text = 'USER'::text OR externalid_type::text = 'ROLE'::text)
	)
	WITH (
	  OIDS=FALSE
	);

	GRANT SELECT, UPDATE ON TABLE portti_resource_user TO maplog;

	-- Index: portti_resource_user_q1

	-- DROP INDEX portti_resource_user_q1;

	CREATE INDEX portti_resource_user_q1
	  ON portti_resource_user
	  USING btree
	  (resource_name, resource_namespace, resource_type, externalid, externalid_type);

	-- Index: portti_resource_user_q2

	-- DROP INDEX portti_resource_user_q2;

	CREATE INDEX portti_resource_user_q2
	  ON portti_resource_user
	  USING btree
	  (resource_type, externalid, externalid_type);


### View

Oskari view information (frontend application specific details) is stored here.

	-- Table: portti_view

    CREATE TABLE portti_view (
       uuid             UUID,
       id               bigserial NOT NULL,
       name             VARCHAR(128)  NOT NULL,
       is_default       BOOLEAN       DEFAULT FALSE,
       type		    varchar(16)	  DEFAULT 'USER',
       description   VARCHAR(2000) ,
       page character varying(128) DEFAULT 'index',
       application character varying(128) DEFAULT 'servlet',
       application_dev_prefix character varying(256) DEFAULT '/applications/sample',
       only_uuid boolean DEFAULT FALSE,
       creator bigint DEFAULT (-1),
       domain character varying(512) DEFAULT ''::character varying,
       lang character varying(2) DEFAULT 'en'::character varying,
       is_public boolean DEFAULT FALSE,
       old_id bigint DEFAULT (-1),
       created timestamp DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT portti_view_pkey PRIMARY KEY (id),
      CONSTRAINT portti_view_uuid_key UNIQUE (uuid)
    );


### View bundle sequence

Bundles belonging to a view and the sequence they are started is specified here.


	-- Table: portti_view_bundle_seq

	-- DROP TABLE portti_view_bundle_seq;

	CREATE TABLE portti_view_bundle_seq
	(
	  view_id bigint NOT NULL,
	  bundle_id bigint NOT NULL,
	  seqno integer NOT NULL,
	  config text DEFAULT '{}'::text,
	  state text DEFAULT '{}'::text,
	  startup text DEFAULT '{}'::text,
	  bundleinstance character varying(128) NOT NULL DEFAULT ''::character varying,
	  CONSTRAINT portti_view_bundle_seq_bundle_id_fkey FOREIGN KEY (bundle_id)
	      REFERENCES portti_bundle (id) MATCH SIMPLE
	      ON UPDATE NO ACTION ON DELETE NO ACTION,
	  CONSTRAINT portti_view_bundle_seq_view_id_fkey FOREIGN KEY (view_id)
	      REFERENCES portti_view (id) MATCH SIMPLE
	      ON UPDATE NO ACTION ON DELETE NO ACTION,
	  CONSTRAINT view_seq UNIQUE (view_id, seqno)
	)
	WITH (
	  OIDS=FALSE
	);



### Bundle

Default values for the bundles are found in this table. The values can be overwritten in the View bundle sequence table.

	-- Table: portti_bundle

	-- DROP TABLE portti_bundle;

	CREATE TABLE portti_bundle
	(
	  id bigserial NOT NULL,
	  name character varying(128) NOT NULL,
	  startup text NOT NULL,
	  config text DEFAULT '{}'::text,
	  state text DEFAULT '{}'::text,
	  CONSTRAINT portti_bundle_pkey PRIMARY KEY (id),
	  CONSTRAINT portti_bundle_name_key UNIQUE (name)
	)
	WITH (
	  OIDS=FALSE
	);

-->