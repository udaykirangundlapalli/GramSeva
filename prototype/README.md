<div align="center">
  <!-- Placeholder for a project banner. You can replace this URL with your own image later! -->
  <img src="https://via.placeholder.com/800x200/4CAF50/FFFFFF?text=GramSeva+Village+Portal" alt="GramSeva Banner">
  
  <h1>GramSeva Village Portal 🌾</h1>
  
  <p>
    <b>A comprehensive, centralized digital portal designed to modernize and streamline Gram Panchayat administration.</b>
  </p>

  <!-- Badges -->
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v14+-green.svg" alt="Node.js"></a>
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
</div>

<br/>

**GramSeva** bridges the gap between local administrators and residents by providing a transparent, easy-to-use platform for daily village activities, fund management, public grievance redressal, and e-governance.

---

## ✨ Key Features

* **📰 News & Public Notices:** Real-time updates on village announcements, scheduled power outages, and local events.
* **🏛️ Government Schemes Tracker:** Automatically fetches and displays the latest state and central welfare schemes (like PM-KISAN, MGNREGA) using an automated Node.js Web Scraper.
* **💰 Youth Contribution Ledger:** A transparent financial dashboard tracking monthly community welfare funds, youth contributions, and village festival/pooja expenditures.
* **💳 Digital Payments:** Integrated mock payment gateway for residents to securely pay their pending village contributions via UPI (Dynamic QR Code generation), Credit/Debit Cards, or Net Banking.
* **🗣️ Grievance Redressal (Complaint Box):** A digital ticketing system for residents to report local infrastructure or utility issues, complete with admin status tracking (Pending → Investigation Started → Resolved).
* **🖼️ Cultural Gallery Archive:** A community gallery to upload, auto-compress, and view photos from local festivals, development projects, and scenic landscapes. Features a built-in image lightbox.
* **📞 Emergency Directory Helpdesk:** Quick access to vital regional contacts like health centers, electricity boards, and agricultural advisories.
* **🔐 Role-Based Access Control:** Dual-mode portal with separate privileges for "Residents" (View/Pay/Submit) and "Admins" (Edit/Delete/Resolve). Supports Firebase Auth with a secure Local Storage fallback.

---

## 📸 Screenshots

> **Note:** Create a folder named `docs` or `assets` in your repo and replace these placeholder URLs with paths to your actual screenshots (e.g., `assets/dashboard.png`).

| Dashboard Overview | Grievance Redressal |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250?text=Dashboard+Screenshot" alt="Dashboard"> | <img src="https://via.placeholder.com/400x250?text=Complaint+System" alt="Complaints"> |

| Youth Contribution Ledger | Government Schemes |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250?text=Financial+Ledger" alt="Ledger"> | <img src="https://via.placeholder.com/400x250?text=Schemes+Tracker" alt="Schemes"> |

---

## �️ Tech Stack

**Frontend:**  
!HTML5 !CSS3 !JavaScript

**Backend & Automation:**  
!NodeJS !Express.js !Puppeteer

**Additional Libraries & Tools:**
- **Storage:** Browser LocalStorage (Firebase Firestore ready)
- **Charts:** Chart.js
- **Icons & PDFs:** Lucide Icons, jsPDF

---

## 🚀 Installation & Setup

Follow these steps to get the GramSeva portal running on your local machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/GramSeva-Portal.git
cd GramSeva-Portal/prototype
```
*(Note: Replace `your-username` with your actual GitHub username once uploaded)*

### 2. Install Dependencies
The Node.js server requires a few packages (like Express and Puppeteer) to run the automated scheme scraper.
```bash
npm install
```

### 3. Start the Local Server
Run the server script to start the backend and serve the application:
```bash
node server.js
```
You should see a message in the terminal:
`🌱 GramSeva Dev Server is running!`  
`👉 Access the portal here: http://localhost:3000`

### 4. Open in Browser
Open your web browser and navigate to http://localhost:3000.

---

## 🛡️ Admin Access (Local Testing)

By default, the application runs a Local Storage fallback if Firebase is not connected. 

To test Admin features (like adding news, deleting complaints, marking payments as paid):
1. Click on the **"Resident"** role badge in the sidebar or header.
2. Enter the default local administrator passcode: **`admin2026`**
3. You will now have Admin privileges. To change this passcode, click the "Admin" badge again while logged in.

---

## 📁 Project Structure

```text
GramSeva/prototype/
│
├── index.html           # Main entry point & Application Shell
├── css/                 # Stylesheets (UI, Layout, Theming)
├── app.js               # Application initialization & routing
├── core.js              # Core UI logic, Theme toggling, Admin auth
├── data.js              # LocalStorage helpers & Default dummy data seeding
├── ledger.js            # Financial logic & Chart.js rendering
├── news.js              # News and Notice board logic
├── schemes.js           # Government schemes UI & auto-sync handling
├── complaints.js        # Grievance ticketing system
├── gallery.js           # Image uploads, compression, and lightbox
├── payment.js           # Dynamic UPI QR & Card mock-payment gateway
└── server.js            # Express backend & Puppeteer Web Scraper
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📜 License
This project is licensed under the MIT License.