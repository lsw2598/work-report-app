# 작업량 보고 시스템

외부 작업자가 스마트폰으로 작업량을 입력하고, 사무실 PC에서 실시간으로 확인할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- 📱 **모바일 입력**: 스마트폰에서 작업량을 쉽게 입력하고 전송
- 📊 **실시간 대시보드**: PC에서 실시간으로 작업량 데이터 확인
- 🔄 **실시간 통신**: WebSocket을 통한 즉시 데이터 동기화
- 💾 **데이터 저장**: SQLite 데이터베이스에 모든 보고서 저장
- 📈 **통계 제공**: 일일 작업량, 활성 작업자 수 등 통계 정보

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 서버 실행
```bash
npm start
```

또는 개발 모드로 실행:
```bash
npm run dev
```

### 3. 접속
- **메인 페이지**: http://localhost:3000
- **모바일 입력**: http://localhost:3000/mobile
- **PC 대시보드**: http://localhost:3000/dashboard

## 사용 방법

### 작업자 (모바일)
1. 스마트폰 브라우저에서 `/mobile` 페이지 접속
2. 작업자 이름, 작업 유형, 작업량 등 입력
3. "전송하기" 버튼 클릭

### 관리자 (PC)
1. PC 브라우저에서 `/dashboard` 페이지 접속
2. 실시간으로 전송되는 작업량 데이터 확인
3. 통계 정보 및 최근 보고서 목록 확인

## 기술 스택

- **Backend**: Node.js, Express.js
- **Real-time**: Socket.io
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: CSS Grid, Flexbox, Gradient

## 프로젝트 구조

```
work-report-app/
├── server.js              # 메인 서버 파일
├── package.json           # 프로젝트 설정
├── work_reports.db        # SQLite 데이터베이스 (자동 생성)
└── public/                # 정적 파일
    ├── index.html         # 메인 페이지
    ├── mobile.html        # 모바일 입력 페이지
    └── dashboard.html     # PC 대시보드 페이지
```

## API 엔드포인트

- `POST /api/report` - 작업량 보고서 전송
- `GET /api/reports` - 최근 보고서 목록 조회

## 데이터베이스 스키마

```sql
CREATE TABLE work_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_name TEXT NOT NULL,
    work_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    location TEXT,
    notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 라이선스

MIT License
