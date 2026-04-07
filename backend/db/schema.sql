CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('todo', 'inprogress', 'review', 'done') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATE,
    project_id INT,
    assigned_to JSON,
    estimated_hours INT,
    actual_hours INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_project_id (project_id),
    INDEX idx_due_date (due_date),
    INDEX idx_user_id (user_id)
);


CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    due_date DATE,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('planning', 'active', 'onHold', 'completed', 'archived') DEFAULT 'planning',
    category VARCHAR(100),
    progress INT DEFAULT 0,
    estimated_hours INT,
    budget DECIMAL(15,2),
    project_lead VARCHAR(255),
    client_name VARCHAR(255),
    visibility ENUM('private', 'public') DEFAULT 'private',
    requires_approval BOOLEAN DEFAULT FALSE,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date),
    INDEX idx_user_id (user_id)
);

ALTER TABLE projects 
ADD COLUMN team_members JSON DEFAULT NULL,
ADD COLUMN tags JSON DEFAULT NULL,
ADD COLUMN goals JSON DEFAULT NULL;
ALTER TABLE projects 
ADD INDEX idx_visibility (visibility),
ADD INDEX idx_project_lead (project_lead);



CREATE TABLE IF NOT EXISTS project_team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
);

-- Tags junction table
CREATE TABLE IF NOT EXISTS project_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    UNIQUE KEY unique_project_tag (project_id, tag_name)
);

-- Goals table
CREATE TABLE IF NOT EXISTS project_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    goal_text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('project', 'task') NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id INT,
    user_name VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id)
);

-- Insert sample data
INSERT INTO projects (name, description, status, priority, progress, due_date, client_name, project_lead) VALUES
('Gate Alpha-7', 'Investigation of anomalous energy readings', 'active', 'urgent', 75, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'Hunter Guild', 'Captain Chen'),
('Abyss Gate', 'Deep sea exploration mission', 'active', 'high', 45, DATE_ADD(CURDATE(), INTERVAL 12 DAY), 'Deep Sea Research', 'Dr. Williams'),
('Crimson Tower', 'High-altitude anomaly investigation', 'planning', 'medium', 20, DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Skywatch Division', 'Commander Reyes'),
('Frozen Gate', 'Arctic expedition', 'onHold', 'low', 30, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Arctic Research', 'Professor Frost');

INSERT INTO tasks (title, description, status, priority, due_date, project_id) VALUES
('Initial reconnaissance', 'Scout the gate perimeter', 'inprogress', 'urgent', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1),
('Deploy monitoring equipment', 'Set up surveillance systems', 'todo', 'high', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 1),
('Team briefing', 'Mission parameters review', 'done', 'medium', DATE_ADD(CURDATE(), INTERVAL -1 DAY), 2),
('Equipment check', 'Verify all gear functionality', 'inprogress', 'medium', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2),
('Risk assessment', 'Evaluate gate stability', 'review', 'high', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 3);

INSERT INTO activity_logs (type, action, description, user_name) VALUES
('project', 'status_update', 'Gate Alpha-7 status changed to Active', 'System'),
('task', 'completion', 'Mission briefing completed', 'Captain Chen'),
('project', 'creation', 'New gate registered: Crimson Tower', 'Commander Reyes'),
('task', 'assignment', 'Risk assessment assigned to Analyst Team', 'System');

