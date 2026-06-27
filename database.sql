-- =====================================================
-- STORES
-- =====================================================

CREATE TABLE stores (
    id UUID PRIMARY KEY,
    store_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CAMERAS
-- =====================================================

CREATE TABLE cameras (
    id UUID PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(id),

    camera_code VARCHAR(50) UNIQUE NOT NULL,
    camera_name VARCHAR(100),
    camera_type VARCHAR(50),

    status VARCHAR(20) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CAMERA HEALTH
-- =====================================================

CREATE TABLE camera_health (
    id UUID PRIMARY KEY,

    camera_id UUID NOT NULL REFERENCES cameras(id),

    heartbeat_at TIMESTAMP NOT NULL,

    fps INTEGER,

    latency_ms INTEGER,

    is_online BOOLEAN DEFAULT TRUE,

    dropped_frames INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ZONES
-- =====================================================

CREATE TABLE zones (
    id UUID PRIMARY KEY,

    store_id UUID NOT NULL REFERENCES stores(id),

    zone_name VARCHAR(100) NOT NULL,

    zone_type VARCHAR(50),

    polygon JSONB NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- STAFF
-- =====================================================

CREATE TABLE staff (
    id UUID PRIMARY KEY,

    store_id UUID NOT NULL REFERENCES stores(id),

    staff_code VARCHAR(50) UNIQUE NOT NULL,

    name VARCHAR(255),

    role VARCHAR(100),

    uniform_color VARCHAR(50),

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- VISITORS
-- =====================================================

CREATE TABLE visitors (
    id UUID PRIMARY KEY,

    visitor_code VARCHAR(100) UNIQUE NOT NULL,

    staff_id UUID REFERENCES staff(id),

    first_seen TIMESTAMP,

    last_seen TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- VISITOR SESSIONS
-- =====================================================

CREATE TABLE visitor_sessions (
    id UUID PRIMARY KEY,

    visitor_id UUID NOT NULL REFERENCES visitors(id),

    store_id UUID NOT NULL REFERENCES stores(id),

    entry_time TIMESTAMP NOT NULL,

    exit_time TIMESTAMP,

    session_duration_seconds INTEGER,

    converted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- EVENTS
-- =====================================================

CREATE TABLE events (
    id UUID PRIMARY KEY,

    event_type VARCHAR(50) NOT NULL,

    store_id UUID REFERENCES stores(id),

    camera_id UUID REFERENCES cameras(id),

    visitor_id UUID REFERENCES visitors(id),

    session_id UUID REFERENCES visitor_sessions(id),

    zone_id UUID REFERENCES zones(id),

    event_timestamp TIMESTAMP NOT NULL,

    metadata JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ZONE VISITS
-- =====================================================

CREATE TABLE zone_visits (
    id UUID PRIMARY KEY,

    visitor_id UUID NOT NULL REFERENCES visitors(id),

    session_id UUID NOT NULL REFERENCES visitor_sessions(id),

    zone_id UUID NOT NULL REFERENCES zones(id),

    entered_at TIMESTAMP NOT NULL,

    exited_at TIMESTAMP,

    dwell_seconds INTEGER,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- QUEUE SESSIONS
-- =====================================================

CREATE TABLE queue_sessions (
    id UUID PRIMARY KEY,

    visitor_id UUID NOT NULL REFERENCES visitors(id),

    session_id UUID NOT NULL REFERENCES visitor_sessions(id),

    joined_at TIMESTAMP NOT NULL,

    left_at TIMESTAMP,

    queue_duration_seconds INTEGER,

    abandoned BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CONVERSIONS
-- =====================================================

CREATE TABLE conversions (
    id UUID PRIMARY KEY,

    visitor_id UUID NOT NULL REFERENCES visitors(id),

    session_id UUID NOT NULL REFERENCES visitor_sessions(id),

    purchase_timestamp TIMESTAMP NOT NULL,

    invoice_id VARCHAR(100),

    amount DECIMAL(10,2),

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ANOMALIES
-- =====================================================

CREATE TABLE anomalies (
    id UUID PRIMARY KEY,

    store_id UUID REFERENCES stores(id),

    camera_id UUID REFERENCES cameras(id),

    visitor_id UUID REFERENCES visitors(id),

    anomaly_type VARCHAR(50) NOT NULL,

    severity VARCHAR(20),

    description TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- HEATMAP STATS
-- =====================================================

CREATE TABLE heatmap_stats (
    id UUID PRIMARY KEY,

    zone_id UUID NOT NULL REFERENCES zones(id),

    stat_date DATE NOT NULL,

    visit_count INTEGER DEFAULT 0,

    avg_dwell_seconds INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- HOURLY ANALYTICS
-- =====================================================

CREATE TABLE hourly_analytics (
    id UUID PRIMARY KEY,

    store_id UUID NOT NULL REFERENCES stores(id),

    hour_bucket TIMESTAMP NOT NULL,

    visitors INTEGER DEFAULT 0,

    conversions INTEGER DEFAULT 0,

    avg_dwell_seconds INTEGER DEFAULT 0,

    avg_queue_length INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_events_timestamp
ON events(event_timestamp);

CREATE INDEX idx_events_type
ON events(event_type);

CREATE INDEX idx_events_visitor
ON events(visitor_id);

CREATE INDEX idx_zone_visits_zone
ON zone_visits(zone_id);

CREATE INDEX idx_zone_visits_session
ON zone_visits(session_id);

CREATE INDEX idx_anomalies_created_at
ON anomalies(created_at);

CREATE INDEX idx_hourly_analytics_store
ON hourly_analytics(store_id, hour_bucket);

CREATE INDEX idx_camera_health_camera
ON camera_health(camera_id);

CREATE INDEX idx_camera_health_heartbeat
ON camera_health(heartbeat_at);

CREATE INDEX idx_staff_store
ON staff(store_id);

CREATE INDEX idx_visitors_staff
ON visitors(staff_id);
