const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// SQLite 데이터베이스 초기화
const db = new sqlite3.Database('work_reports.db');

// 테이블 생성
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS work_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_name TEXT NOT NULL,
    work_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    location TEXT,
    notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 작업량 보고 API
app.post('/api/report', (req, res) => {
  const { workerName, workType, quantity, unit, location, notes } = req.body;
  
  const stmt = db.prepare(`INSERT INTO work_reports 
    (worker_name, work_type, quantity, unit, location, notes) 
    VALUES (?, ?, ?, ?, ?, ?)`);
  
  stmt.run([workerName, workType, quantity, unit, location, notes], function(err) {
    if (err) {
      console.error('데이터베이스 오류:', err);
      res.status(500).json({ error: '데이터 저장 실패' });
    } else {
      const reportData = {
        id: this.lastID,
        workerName,
        workType,
        quantity,
        unit,
        location,
        notes,
        timestamp: new Date().toISOString()
      };
      
      // 모든 클라이언트에게 실시간 업데이트 전송
      io.emit('new_report', reportData);
      
      res.json({ success: true, data: reportData });
    }
  });
  
  stmt.finalize();
});

// 최근 보고서 조회 API
app.get('/api/reports', (req, res) => {
  const limit = req.query.limit || 50;
  
  db.all(`SELECT * FROM work_reports 
    ORDER BY timestamp DESC 
    LIMIT ?`, [limit], (err, rows) => {
    if (err) {
      console.error('데이터베이스 오류:', err);
      res.status(500).json({ error: '데이터 조회 실패' });
    } else {
      res.json(rows);
    }
  });
});

// Socket.io 연결 처리
io.on('connection', (socket) => {
  console.log('클라이언트 연결됨:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('클라이언트 연결 해제됨:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`PC 대시보드: http://localhost:${PORT}/dashboard`);
  console.log(`모바일 입력: http://localhost:${PORT}/mobile`);
  console.log(`외부 접속: http://192.168.0.2:${PORT}/mobile`);
});
