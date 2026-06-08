// ════════════════════════════════════════════════════════
//  dashboard.js — Sidebar + all section renderers
//  buildSidebar and showSection defined ONCE each.
//  Admin sections handled inside the same switch block.
// ════════════════════════════════════════════════════════

var ROLE_LABELS = {
  student:'Student', class_incharge:'Class Incharge',
  mentor:'Mentor', hod:'HOD', staff:'Staff', admin:'Admin'
};

// ── Init dashboard topbar + sidebar ──────────────────
function initDashboard() {
  var u = getUser();
  if (!u) return;
  document.getElementById('topbar-name').textContent   = u.name;
  document.getElementById('topbar-role').textContent   = ROLE_LABELS[u.role] || u.role;
  document.getElementById('topbar-avatar').textContent = u.name.charAt(0).toUpperCase();
  buildSidebar();
}

// ── Build sidebar (single definition) ────────────────
function buildSidebar() {
  var u = getUser();
  var sidebar = document.getElementById('dash-sidebar');
  var items = [];

  if (u.role === 'student') {
    items = [
      { icon:'📊', label:'Dashboard',      fn:"showSection('student-home')" },
      { icon:'📅', label:'My Attendance',  fn:"showSection('my-attendance')" },
      { icon:'📝', label:'Apply OD/Leave', fn:"openModal('modal-od')" },
      { icon:'📋', label:'My Requests',    fn:"showSection('my-requests')" },
      { icon:'👤', label:'My Profile',     fn:"showSection('my-profile')" },
    ];
  } else if (u.role === 'class_incharge') {
    items = [
      { icon:'📊', label:'Dashboard',          fn:"showSection('ci-dashboard')" },
      { icon:'✅', label:'Mark Attendance',    fn:"openAttModal()" },
      { icon:'📅', label:'Attendance Records', fn:"showSection('ci-records')" },
      { icon:'📋', label:'OD/Leave Approvals', fn:"showSection('od-approvals')" },
      { icon:'👥', label:'My Students',        fn:"showSection('my-students')" },
    ];
  } else if (u.role === 'mentor') {
    items = [
      { icon:'📊', label:'Dashboard',          fn:"showSection('mentor-dashboard')" },
      { icon:'📋', label:'OD/Leave Approvals', fn:"showSection('od-approvals')" },
      { icon:'👥', label:'My Students',        fn:"showSection('my-students')" },
    ];
  } else if (u.role === 'hod') {
    items = [
      { icon:'📊', label:'Dept Overview',      fn:"showSection('hod-dashboard')" },
      { icon:'📋', label:'OD/Leave Approvals', fn:"showSection('od-approvals')" },
      { icon:'📅', label:'All Attendance',     fn:"showSection('dept-attendance')" },
      { icon:'👥', label:'All Students',       fn:"showSection('all-students')" },
      { icon:'🏫', label:'All Staff',          fn:"showSection('all-staff')" },
    ];
  } else if (u.role === 'admin') {
    items = [
      { icon:'📊', label:'Overview',       fn:"showSection('admin-home')" },
      { icon:'👥', label:'All Students',   fn:"showSection('admin-students')" },
      { icon:'🏫', label:'All Staff',      fn:"showSection('admin-staff')" },
      { icon:'📅', label:'All Attendance', fn:"showSection('admin-attendance')" },
      { icon:'📋', label:'All OD / Leave', fn:"showSection('admin-od')" },
      { icon:'➕', label:'Add Student',    fn:"openAdminAddStudentModal()" },
      { icon:'➕', label:'Add Staff',      fn:"openAdminAddStaffModal()" },
    ];
  } else {
    items = [
      { icon:'📊', label:'Overview',     fn:"showSection('hod-dashboard')" },
      { icon:'📅', label:'Attendance',   fn:"showSection('dept-attendance')" },
      { icon:'📋', label:'OD / Leave',   fn:"showSection('view-od')" },
      { icon:'👥', label:'Students',     fn:"showSection('all-students')" },
      { icon:'🏫', label:'Staff',        fn:"showSection('all-staff')" },
    ];
  }

  sidebar.innerHTML = items.map(function(it) {
    return '<div class="sidebar-item" onclick="' + it.fn + '">' +
           '<span class="si-icon">' + it.icon + '</span>' + it.label + '</div>';
  }).join('');

  var defaults = {
    student:'student-home', class_incharge:'ci-dashboard',
    mentor:'mentor-dashboard', hod:'hod-dashboard',
    staff:'hod-dashboard', admin:'admin-home'
  };
  showSection(defaults[u.role] || 'student-home');
}

// ── Section dispatcher (single definition) ───────────
async function showSection(name) {
  document.querySelectorAll('.sidebar-item').forEach(function(i) { i.classList.remove('active'); });
  var mc = document.getElementById('dash-main');
  mc.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  try {
    var html = '';
    switch (name) {
      // Student
      case 'student-home':     html = await renderStudentHome();    break;
      case 'my-attendance':    html = await renderMyAttendance();   break;
      case 'my-requests':      html = await renderMyRequests();     break;
      case 'my-profile':       html = await renderMyProfile();      break;
      // Class Incharge
      case 'ci-dashboard':     html = await renderCIDashboard();    break;
      case 'ci-records':       html = await renderCIRecords();      break;
      // Mentor
      case 'mentor-dashboard': html = await renderMentorDash();     break;
      // HOD / Staff
      case 'hod-dashboard':    html = await renderHODDashboard();   break;
      case 'dept-attendance':  html = await renderDeptAttendance(); break;
      case 'view-od':          html = await renderViewOD();         break;
      // Shared
      case 'od-approvals':     html = await renderODApprovals();    break;
      case 'my-students':      html = await renderMyStudents();     break;
      case 'all-students':     html = await renderAllStudents();    break;
      case 'all-staff':        html = await renderAllStaff();       break;
      // Admin
      case 'admin-home':       html = await renderAdminHome();       break;
      case 'admin-students':   html = await renderAdminStudents();   break;
      case 'admin-staff':      html = await renderAdminStaff();      break;
      case 'admin-attendance': html = await renderAdminAttendance(); break;
      case 'admin-od':         html = await renderAdminOD();         break;
      default:
        html = '<div class="empty-state"><div class="empty-icon">🚧</div><p>Section not found</p></div>';
    }
    mc.innerHTML = html;
  } catch (e) {
    mc.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>' + esc(e.message) + '</p></div>';
    toast(e.message, 'error');
  }
  mc.scrollTop = 0;
}

// ════════════════ STUDENT SECTIONS ════════════════════

async function renderStudentHome() {
  var u = getUser();
  var results = await Promise.all([API.getMe(), API.getMyAttendance(), API.getMyOD()]);
  var me = results[0], att = results[1], od = results[2];
  var pct = parseFloat(me.attendancePct || 100).toFixed(1);
  var col = pct >= 75 ? 'var(--accent)' : pct >= 60 ? 'var(--warn)' : 'var(--accent2)';
  var pending  = od.filter(function(r) { return r.status === 'pending'; }).length;
  var approved = od.filter(function(r) { return r.status === 'approved'; }).length;
  var recent   = att.slice(0, 10);
  return '' +
    '<h2 class="pg-title">My Dashboard</h2>' +
    '<p class="pg-sub">' + esc(u.department) + ' · Year ' + u.assignedYear + ' · Section ' + esc(u.assignedSection) + '</p>' +
    '<div class="stat-grid">' +
      '<div class="stat-card"><div class="stat-label">Attendance %</div><div class="stat-value" style="color:' + col + '">' + pct + '%</div><div class="stat-sub ' + (pct>=75?'up':'down') + '">' + (pct>=75?'✓ On track':'⚠ Below 75%') + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Classes Attended</div><div class="stat-value">' + me.attendedClasses + '</div><div class="stat-sub">of ' + me.totalClasses + ' total</div></div>' +
      '<div class="stat-card"><div class="stat-label">Pending Requests</div><div class="stat-value">' + pending + '</div><div class="stat-sub">OD / Leave</div></div>' +
      '<div class="stat-card"><div class="stat-label">Approved Leaves</div><div class="stat-value">' + approved + '</div><div class="stat-sub">This semester</div></div>' +
    '</div>' +
    '<div class="two-col">' +
      '<div class="card"><div class="card-header"><span class="card-title">Recent Attendance</span></div>' +
        '<table><thead><tr><th>Date</th><th>Status</th></tr></thead><tbody>' +
        (recent.length ? recent.map(function(r) { return '<tr><td>' + fmtDate(r.attendanceDate) + '</td><td>' + badge(r.status) + '</td></tr>'; }).join('') : emptyRow(2, 'No records yet')) +
        '</tbody></table></div>' +
      '<div class="card"><div class="card-header"><span class="card-title">My OD/Leave</span>' +
        '<button class="btn-sm btn-sm-primary" onclick="openModal(\'modal-od\')">+ Apply</button></div>' +
        '<table><thead><tr><th>Type</th><th>From</th><th>Status</th><th></th></tr></thead><tbody>' +
        (od.length ? od.slice(0,6).map(function(r) {
          return '<tr><td>' + esc(r.type) + '</td><td>' + fmtDate(r.fromDate) + '</td><td>' + badge(r.status) + '</td>' +
                 '<td><button class="btn-sm" onclick="showODDetail(' + r.id + ')">View</button></td></tr>';
        }).join('') : emptyRow(4, 'No requests')) +
        '</tbody></table></div>' +
    '</div>';
}

async function renderMyAttendance() {
  var results = await Promise.all([API.getMe(), API.getMyAttendance()]);
  var me = results[0], att = results[1];
  var pct = parseFloat(me.attendancePct || 100).toFixed(1);
  var col = pct >= 75 ? 'var(--accent)' : pct >= 60 ? 'var(--warn)' : 'var(--accent2)';
  return '<h2 class="pg-title">My Attendance</h2>' +
    '<p class="pg-sub">Overall: <strong style="color:' + col + '">' + pct + '%</strong> &nbsp;·&nbsp; ' + me.attendedClasses + ' / ' + me.totalClasses + ' classes</p>' +
    '<div class="card"><div class="card-header"><span class="card-title">All Records (' + att.length + ')</span></div>' +
    '<table><thead><tr><th>Date</th><th>Status</th><th>Marked By</th></tr></thead><tbody>' +
    (att.length ? att.map(function(r) {
      return '<tr><td>' + fmtDate(r.attendanceDate) + '</td><td>' + badge(r.status) + '</td><td class="muted">' + esc(r.markedBy) + '</td></tr>';
    }).join('') : emptyRow(3, 'No records yet')) +
    '</tbody></table></div>';
}

async function renderMyRequests() {
  var od = await API.getMyOD();
  return '<h2 class="pg-title">My OD / Leave Requests</h2>' +
    '<p class="pg-sub">Track approval status through the chain</p>' +
    '<div style="margin-bottom:16px;"><button class="btn-primary" style="padding:10px 22px;" onclick="openModal(\'modal-od\')">+ New Request</button></div>' +
    '<div class="card"><div class="card-header"><span class="card-title">All Requests (' + od.length + ')</span></div>' +
    '<div class="table-scroll"><table><thead><tr><th>Type</th><th>From</th><th>To</th><th>Mentor</th><th>CI</th><th>HOD</th><th>Status</th><th></th></tr></thead><tbody>' +
    (od.length ? od.map(function(r) {
      return '<tr><td>' + esc(r.type) + '</td><td>' + fmtDate(r.fromDate) + '</td><td>' + fmtDate(r.toDate) + '</td>' +
        '<td>' + badge(r.mentorStatus) + '</td><td>' + badge(r.ciStatus) + '</td><td>' + badge(r.hodStatus) + '</td><td>' + badge(r.status) + '</td>' +
        '<td><button class="btn-sm" onclick="showODDetail(' + r.id + ')">View</button></td></tr>';
    }).join('') : emptyRow(8, 'No requests yet')) +
    '</tbody></table></div></div>';
}

async function renderMyProfile() {
  var u  = getUser();
  var me = await API.getMe();
  return '<h2 class="pg-title">My Profile</h2>' +
    '<div class="hod-banner"><div class="hod-avatar">' + esc(u.name.charAt(0)) + '</div>' +
    '<div class="hod-info"><h3>' + esc(u.name) + '</h3>' +
    '<p>' + esc(u.id) + ' · ' + esc(u.department) + ' · Year ' + u.assignedYear + ' Sec ' + esc(u.assignedSection) + '</p>' +
    '<div class="hod-tags"><span class="hod-tag">Student</span>' +
    '<span class="hod-tag">' + parseFloat(me.attendancePct||100).toFixed(1) + '% Attendance</span></div></div></div>' +
    '<div class="profile-grid">' +
    '<div class="profile-card"><div class="p-avatar av-green">' + esc(u.name.charAt(0)) + '</div>' +
    '<div class="p-info"><div class="p-name">Contact Info</div>' +
    '<div class="p-detail">📧 ' + esc(me.email) + '<br>📱 ' + esc(me.phone) + '</div></div></div>' +
    '<div class="profile-card"><div class="p-avatar av-blue">📊</div>' +
    '<div class="p-info"><div class="p-name">Attendance</div>' +
    '<div class="p-detail">' + me.attendedClasses + ' / ' + me.totalClasses + ' classes<br>' +
    parseFloat(me.attendancePct||100).toFixed(1) + '% overall</div></div></div></div>';
}

// ════════════════ CI SECTIONS ══════════════════════════

async function renderCIDashboard() {
  var u = getUser();
  var results = await Promise.all([
    API.getStudentsByClass(u.department, u.assignedYear, u.assignedSection),
    API.getClassAttendance(u.department, u.assignedYear, u.assignedSection),
  ]);
  var students = results[0], attRecords = results[1];
  var todayStr = today();
  var todayAtt = attRecords.filter(function(a) { return a.attendanceDate && a.attendanceDate.indexOf(todayStr) === 0; });
  var present  = todayAtt.filter(function(a) { return a.status === 'Present'; }).length;
  var absent   = todayAtt.filter(function(a) { return a.status === 'Absent';  }).length;
  var od       = todayAtt.filter(function(a) { return a.status === 'OD';      }).length;
  return '<h2 class="pg-title">Class Incharge Dashboard</h2>' +
    '<p class="pg-sub">' + esc(u.department) + ' · Year ' + u.assignedYear + ' · Section ' + esc(u.assignedSection) + '</p>' +
    '<div class="stat-grid">' +
      '<div class="stat-card"><div class="stat-label">Total Students</div><div class="stat-value">' + students.length + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Present Today</div><div class="stat-value up">' + present + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Absent Today</div><div class="stat-value down">' + absent + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">On OD Today</div><div class="stat-value warn">' + od + '</div></div>' +
    '</div>' +
    '<div style="margin-bottom:20px;"><button class="btn-primary" style="padding:11px 28px;" onclick="openAttModal()">✅ Mark Today\'s Attendance</button></div>' +
    studentTable(students, todayAtt);
}

async function renderCIRecords() {
  var u = getUser();
  var recs = await API.getClassAttendance(u.department, u.assignedYear, u.assignedSection);
  return '<h2 class="pg-title">Attendance Records</h2>' +
    '<p class="pg-sub">' + esc(u.department) + ' · Year ' + u.assignedYear + ' · Sec ' + esc(u.assignedSection) + '</p>' +
    '<div class="card"><div class="card-header"><span class="card-title">Records (' + recs.length + ')</span></div>' +
    '<table><thead><tr><th>Date</th><th>Student</th><th>Reg No</th><th>Status</th></tr></thead><tbody>' +
    (recs.length ? recs.map(function(r) {
      return '<tr><td>' + fmtDate(r.attendanceDate) + '</td><td>' + esc(r.studentName) + '</td><td class="muted">' + esc(r.regNo) + '</td><td>' + badge(r.status) + '</td></tr>';
    }).join('') : emptyRow(4, 'No records')) +
    '</tbody></table></div>';
}

// ════════════════ MENTOR SECTION ══════════════════════

async function renderMentorDash() {
  var u = getUser();
  var results = await Promise.all([
    API.getStudentsByClass(u.department, u.assignedYear, u.assignedSection),
    API.getPendingOD(u.assignedYear, u.assignedSection),
  ]);
  var students = results[0], pending = results[1];
  var alert = pending.length ?
    '<div class="info-alert">⚠️ <strong>' + pending.length + '</strong> OD/Leave request(s) awaiting your approval. ' +
    '<a href="#" onclick="showSection(\'od-approvals\');return false" class="link">Review now →</a></div>' : '';
  return '<h2 class="pg-title">Mentor Dashboard</h2>' +
    '<p class="pg-sub">' + esc(u.department) + ' · Year ' + u.assignedYear + ' · Sec ' + esc(u.assignedSection) + '</p>' +
    '<div class="stat-grid">' +
      '<div class="stat-card"><div class="stat-label">My Students</div><div class="stat-value">' + students.length + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Pending Approvals</div><div class="stat-value warn">' + pending.length + '</div></div>' +
    '</div>' + alert + studentTable(students);
}

// ════════════════ HOD SECTION ══════════════════════════

async function renderHODDashboard() {
  var u = getUser();
  var results = await Promise.all([
    API.getStudentsByDept(u.department),
    API.getStaffByDept(u.department),
    API.getDeptStats(u.department),
  ]);
  var students = results[0], staff = results[1], stats = results[2];
  var avgPct = parseFloat(stats.avgAttendance||100).toFixed(1);
  var icon = (window.selectedDept && window.selectedDept.icon) ? window.selectedDept.icon : '🏢';
  var cols = ['av-green','av-orange','av-blue','av-purple','av-gray'];
  return '<div class="hod-banner">' +
    '<div class="hod-avatar">' + icon + '</div>' +
    '<div class="hod-info"><h3>' + esc(u.department) + ' Department</h3>' +
    '<p>HOD: ' + esc(u.name) + '</p>' +
    '<div class="hod-tags"><span class="hod-tag">' + students.length + ' Students</span>' +
    '<span class="hod-tag">' + staff.length + ' Staff</span>' +
    '<span class="hod-tag">' + avgPct + '% Avg</span></div></div></div>' +
    '<div class="stat-grid">' +
      '<div class="stat-card"><div class="stat-label">Total Students</div><div class="stat-value">' + stats.totalStudents + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Avg Attendance</div><div class="stat-value up">' + avgPct + '%</div></div>' +
      '<div class="stat-card"><div class="stat-label">Pending (HOD)</div><div class="stat-value warn">' + stats.pendingOD + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Below 75%</div><div class="stat-value down">' + stats.below75 + '</div></div>' +
    '</div>' +
    '<h3 class="section-title">Department Staff</h3>' +
    '<div class="profile-grid" style="margin-bottom:24px;">' +
    staff.map(function(s, i) {
      return '<div class="profile-card"><div class="p-avatar ' + cols[i%5] + '">' + s.name.charAt(0) + '</div>' +
        '<div class="p-info"><div class="p-name">' + esc(s.name) + '</div>' +
        '<div class="p-detail">' + esc(s.staffId) + '<br>' + (ROLE_LABELS[s.role]||s.role) + '</div>' +
        '<div class="p-tags">' + badge(s.role) + (s.assignedYear ? ' <span class="badge badge-gray">Y' + s.assignedYear + '/' + s.assignedSection + '</span>' : '') + '</div>' +
        '</div></div>';
    }).join('') + '</div>' +
    '<h3 class="section-title">Students</h3>' +
    studentTable(students.slice(0,15)) +
    (students.length > 15 ? '<p style="text-align:center;margin-top:12px;"><a href="#" onclick="showSection(\'all-students\');return false" class="link">View all ' + students.length + ' students →</a></p>' : '');
}

// ════════════════ SHARED SECTIONS ══════════════════════

async function renderODApprovals() {
  var u    = getUser();
  var year = u.assignedYear || 1;
  var sec  = u.assignedSection || 'A';
  var reqs = await API.getPendingOD(year, sec);
  if (!reqs.length) {
    return '<h2 class="pg-title">OD / Leave Approvals</h2>' +
      '<div class="empty-state"><div class="empty-icon">✅</div><p>No pending approvals — you\'re all caught up!</p></div>';
  }
  return '<h2 class="pg-title">OD / Leave Approvals</h2>' +
    '<p class="pg-sub">' + reqs.length + ' request(s) awaiting your action</p>' +
    reqs.map(function(r) {
      return '<div class="card" style="margin-bottom:14px;"><div style="padding:20px 22px;">' +
        '<div class="approval-row"><div>' +
        '<div class="appr-name">' + esc(r.studentName) + ' <span class="muted">' + esc(r.regNo) + '</span></div>' +
        '<div class="muted" style="font-size:13px;margin-top:3px;">' + esc(r.departmentCode) + ' · Year ' + r.year + ' · Sec ' + esc(r.section) + '</div>' +
        '<div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' + badge(r.type) +
        ' <span style="font-size:13px;">' + fmtDate(r.fromDate) + ' → ' + fmtDate(r.toDate) + '</span></div>' +
        '<div class="reason-box">' + esc(r.reason) + '</div></div>' +
        '<div class="appr-btns">' +
        '<button class="btn-sm btn-sm-primary" onclick="processOD(' + r.id + ',\'approve\')">✓ Approve</button>' +
        '<button class="btn-sm btn-sm-danger"  onclick="processOD(' + r.id + ',\'reject\')">✗ Reject</button>' +
        '<button class="btn-sm" onclick="showODDetail(' + r.id + ')">Details</button>' +
        '</div></div></div></div>';
    }).join('');
}

async function processOD(id, action) {
  var note = prompt(action === 'approve' ? 'Approval note (optional):' : 'Reason for rejection:') || '';
  try {
    await API.processOD(id, action, note);
    toast(action === 'approve' ? 'Approved!' : 'Rejected.', action === 'approve' ? 'success' : 'info');
    showSection('od-approvals');
  } catch (e) { toast(e.message, 'error'); }
}

async function showODDetail(id) {
  try {
    var r = await API.getODById(id);
    function stepIcon(s)  { return ({pending:'⏳',approved:'✓',rejected:'✗'})[s] || '⏳'; }
    function stepClass(s) { return ({approved:'step-done',rejected:'step-rej',pending:'step-pend'})[s] || 'step-pend'; }
    var steps = [
      { label:'1. Mentor',        st:r.mentorStatus, note:r.mentorNote, by:r.mentorBy },
      { label:'2. Class Incharge',st:r.ciStatus,     note:r.ciNote,     by:r.ciBy     },
      { label:'3. HOD',           st:r.hodStatus,    note:r.hodNote,    by:r.hodBy    },
    ];
    document.getElementById('od-detail-body').innerHTML =
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;">' + badge(r.type) + ' ' + badge(r.status) + '</div>' +
      '<div class="detail-grid">' +
        '<div><div class="dlabel">Student</div><div class="dval">' + esc(r.studentName) + '</div></div>' +
        '<div><div class="dlabel">Reg No</div><div class="dval">' + esc(r.regNo) + '</div></div>' +
        '<div><div class="dlabel">From</div><div class="dval">' + fmtDate(r.fromDate) + '</div></div>' +
        '<div><div class="dlabel">To</div><div class="dval">' + fmtDate(r.toDate) + '</div></div>' +
      '</div>' +
      '<div class="reason-box" style="margin-bottom:20px;">' + esc(r.reason) + '</div>' +
      '<div class="approval-steps">' +
      steps.map(function(step) {
        return '<div class="step">' +
          '<div class="step-dot ' + stepClass(step.st) + '">' + stepIcon(step.st) + '</div>' +
          '<div class="step-info"><div class="step-label">' + step.label + '</div>' +
          '<div class="muted" style="font-size:12px;">' + (step.st||'pending').toUpperCase() + (step.by ? ' by ' + step.by : '') + '</div>' +
          (step.note ? '<div class="step-note">' + esc(step.note) + '</div>' : '') +
          '</div></div>';
      }).join('') + '</div>';

    var u    = getUser();
    var foot = document.getElementById('od-detail-foot');
    var btns = '';
    if ((u.role==='mentor'        && r.mentorStatus==='pending') ||
        (u.role==='class_incharge'&& r.ciStatus==='pending' && r.mentorStatus==='approved') ||
        (u.role==='hod'           && r.hodStatus==='pending' && r.ciStatus==='approved')) {
      btns =
        '<button class="btn-sm btn-sm-primary" onclick="closeModal(\'modal-od-detail\');processOD(' + id + ',\'approve\')">✓ Approve</button>' +
        '<button class="btn-sm btn-sm-danger"  onclick="closeModal(\'modal-od-detail\');processOD(' + id + ',\'reject\')">✗ Reject</button>';
    }
    foot.innerHTML = '<button class="btn-sm" onclick="closeModal(\'modal-od-detail\')">Close</button>' + btns;
    openModal('modal-od-detail');
  } catch (e) { toast(e.message, 'error'); }
}

async function renderMyStudents() {
  var u = getUser();
  var yr = u.assignedYear || 1, sec = u.assignedSection || 'A';
  var students = await API.getStudentsByClass(u.department, yr, sec);
  return '<h2 class="pg-title">My Students</h2><p class="pg-sub">' + esc(u.department) + ' · Year ' + yr + ' · Sec ' + esc(sec) + '</p>' + studentTable(students);
}

async function renderAllStudents() {
  var u = getUser();
  var students = await API.getStudentsByDept(u.department);
  return '<h2 class="pg-title">All Students</h2><p class="pg-sub">' + esc(u.department) + ' · ' + students.length + ' students</p>' + studentTable(students);
}

async function renderAllStaff() {
  var u    = getUser();
  var staff = await API.getStaffByDept(u.department);
  var cols = ['av-green','av-orange','av-blue','av-purple','av-gray'];
  return '<h2 class="pg-title">All Staff</h2><p class="pg-sub">' + esc(u.department) + ' · ' + staff.length + ' members</p>' +
    '<div class="profile-grid">' +
    staff.map(function(s, i) {
      return '<div class="profile-card"><div class="p-avatar ' + cols[i%5] + '">' + s.name.charAt(0) + '</div>' +
        '<div class="p-info"><div class="p-name">' + esc(s.name) + '</div>' +
        '<div class="p-detail">' + esc(s.staffId) + '<br>📧 ' + esc(s.email) + '</div>' +
        '<div class="p-tags">' + badge(s.role) + (s.assignedYear ? ' <span class="badge badge-gray">Y' + s.assignedYear + '/' + s.assignedSection + '</span>' : '') + '</div>' +
        '</div></div>';
    }).join('') + '</div>';
}

async function renderDeptAttendance() {
  var u    = getUser();
  var recs = await API.getDeptAttendance(u.department);
  return '<h2 class="pg-title">Attendance Records</h2><p class="pg-sub">' + esc(u.department) + ' Department</p>' +
    '<div class="card"><div class="card-header"><span class="card-title">Records (' + recs.length + ')</span></div>' +
    '<div class="table-scroll"><table><thead><tr><th>Date</th><th>Student</th><th>Reg No</th><th>Year</th><th>Sec</th><th>Status</th></tr></thead><tbody>' +
    (recs.length ? recs.slice(0,200).map(function(r) {
      return '<tr><td>' + fmtDate(r.attendanceDate) + '</td><td>' + esc(r.studentName) + '</td><td class="muted">' + esc(r.regNo) + '</td><td>' + (r.year||'') + '</td><td>' + esc(r.section) + '</td><td>' + badge(r.status) + '</td></tr>';
    }).join('') : emptyRow(6, 'No records')) +
    '</tbody></table></div></div>';
}

async function renderViewOD() {
  var u    = getUser();
  var reqs = await API.getDeptOD(u.department);
  return '<h2 class="pg-title">OD / Leave Records</h2><p class="pg-sub">' + esc(u.department) + ' · ' + reqs.length + ' records</p>' +
    '<div class="card"><div class="card-header"><span class="card-title">All Requests</span></div>' +
    '<div class="table-scroll"><table><thead><tr><th>Student</th><th>Type</th><th>From</th><th>To</th><th>Mentor</th><th>CI</th><th>HOD</th><th>Status</th><th></th></tr></thead><tbody>' +
    (reqs.length ? reqs.map(function(r) {
      return '<tr><td><strong>' + esc(r.studentName) + '</strong></td><td>' + esc(r.type) + '</td><td>' + fmtDate(r.fromDate) + '</td><td>' + fmtDate(r.toDate) + '</td>' +
        '<td>' + badge(r.mentorStatus) + '</td><td>' + badge(r.ciStatus) + '</td><td>' + badge(r.hodStatus) + '</td><td>' + badge(r.status) + '</td>' +
        '<td><button class="btn-sm" onclick="showODDetail(' + r.id + ')">View</button></td></tr>';
    }).join('') : emptyRow(9, 'No records')) +
    '</tbody></table></div></div>';
}

// ════════════════ ATTENDANCE MODAL ════════════════════

var attState = {};

async function openAttModal() {
  var u = getUser();
  if (u.role !== 'class_incharge') { toast('Only Class Incharge can mark attendance', 'error'); return; }
  var students = await API.getStudentsByClass(u.department, u.assignedYear, u.assignedSection);
  document.getElementById('att-date').value = today();
  attState = {};
  students.forEach(function(s) { attState[s.regNo] = 'Present'; });
  document.getElementById('att-grid').innerHTML = students.map(function(s) {
    return '<div class="att-card att-p" id="ac-' + s.regNo + '">' +
      '<div class="att-name">' + esc(s.name) + '</div>' +
      '<div class="att-reg">' + esc(s.regNo) + '</div>' +
      '<div class="att-btns">' +
        '<button class="att-btn p-sel" onclick="setAtt(\'' + s.regNo + '\',\'Present\')">P</button>' +
        '<button class="att-btn"       onclick="setAtt(\'' + s.regNo + '\',\'Absent\')">A</button>' +
        '<button class="att-btn"       onclick="setAtt(\'' + s.regNo + '\',\'OD\')">OD</button>' +
      '</div></div>';
  }).join('') || '<div class="muted" style="padding:20px;">No students found.</div>';
  openModal('modal-attendance');
}

function setAtt(regNo, status) {
  attState[regNo] = status;
  var card = document.getElementById('ac-' + regNo);
  if (!card) return;
  card.className = 'att-card att-' + status.toLowerCase();
  card.querySelectorAll('.att-btn').forEach(function(b) { b.classList.remove('p-sel'); });
  var btns = card.querySelectorAll('.att-btn');
  var idx  = { Present:0, Absent:1, OD:2 };
  if (btns[idx[status]]) btns[idx[status]].classList.add('p-sel');
}

async function submitAttendance() {
  var u    = getUser();
  var date = document.getElementById('att-date').value;
  if (!date) { toast('Select a date', 'error'); return; }
  var records = Object.keys(attState).map(function(regNo) { return { regNo: regNo, status: attState[regNo] }; });
  if (!records.length) { toast('No students to mark', 'error'); return; }
  var btn = document.getElementById('btn-save-att');
  btnLoading(btn, true);
  try {
    await API.markAttendance(date, records, u.assignedYear, u.assignedSection);
    toast('Attendance saved for ' + records.length + ' students', 'success');
    closeModal('modal-attendance');
    showSection('ci-dashboard');
  } catch (e) { toast(e.message, 'error'); }
  finally     { btnLoading(btn, false); }
}

// ════════════════ OD SUBMIT ════════════════════════════

async function submitOD() {
  var u = getUser();
  if (u.role !== 'student') { toast('Only students can apply', 'error'); return; }
  var data = {
    type:     document.getElementById('od-type').value,
    fromDate: document.getElementById('od-from').value,
    toDate:   document.getElementById('od-to').value,
    reason:   document.getElementById('od-reason').value.trim(),
  };
  if (!data.fromDate || !data.toDate || !data.reason) { toast('Fill all fields', 'error'); return; }
  if (data.toDate < data.fromDate) { toast('To date must be after From date', 'error'); return; }
  var btn = document.getElementById('btn-submit-od');
  btnLoading(btn, true);
  try {
    await API.submitOD(data);
    toast(data.type + ' request submitted! Awaiting Mentor approval.', 'success');
    closeModal('modal-od');
    showSection('my-requests');
  } catch (e) { toast(e.message, 'error'); }
  finally     { btnLoading(btn, false); }
}

// ════════════════ HELPER FUNCTIONS ════════════════════

function studentTable(students, todayAtt) {
  if (!todayAtt) todayAtt = [];
  var rows = students.map(function(s) {
    var pct = parseFloat(s.attendancePct || 100).toFixed(1);
    var col = pct >= 75 ? 'var(--accent)' : pct >= 60 ? 'var(--warn)' : 'var(--accent2)';
    var todayRec = null;
    for (var i = 0; i < todayAtt.length; i++) { if (todayAtt[i].regNo === s.regNo) { todayRec = todayAtt[i]; break; } }
    return '<tr>' +
      '<td><strong>' + esc(s.name) + '</strong></td>' +
      '<td class="muted">' + esc(s.regNo) + '</td>' +
      '<td>' + s.year + '</td>' +
      '<td>' + esc(s.section) + '</td>' +
      '<td style="color:' + col + ';font-weight:700;">' + pct + '%</td>' +
      '<td class="muted">' + s.attendedClasses + '/' + s.totalClasses + '</td>' +
      (todayAtt.length ? '<td>' + (todayRec ? badge(todayRec.status) : '<span class="muted">Not marked</span>') + '</td>' : '') +
      '</tr>';
  });
  return '<div class="card"><div class="card-header"><span class="card-title">Students (' + students.length + ')</span></div>' +
    '<div class="table-scroll"><table><thead><tr>' +
    '<th>Name</th><th>Reg No</th><th>Year</th><th>Sec</th><th>Attendance %</th><th>Classes</th>' +
    (todayAtt.length ? '<th>Today</th>' : '') +
    '</tr></thead><tbody>' +
    (rows.length ? rows.join('') : emptyRow(6, 'No students found')) +
    '</tbody></table></div></div>';
}

// ════════════════ ADMIN SECTIONS ══════════════════════

async function renderAdminHome() {
  var stats = await API.getAdminStats();
  return '<h2 class="pg-title">Admin Dashboard</h2>' +
    '<p class="pg-sub">Complete system control — manage all students, staff and records</p>' +
    '<div class="stat-grid">' +
      '<div class="stat-card"><div class="stat-label">Total Students</div><div class="stat-value">' + stats.totalStudents + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Total Staff</div><div class="stat-value">' + stats.totalStaff + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Attendance Records</div><div class="stat-value">' + stats.totalAttendance + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">OD / Leave</div><div class="stat-value">' + stats.totalOdLeave + '</div><div class="stat-sub" style="color:var(--warn)">' + stats.pendingOD + ' pending</div></div>' +
    '</div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;">' +
      '<button class="btn-primary" style="padding:10px 22px;" onclick="openAdminAddStudentModal()">➕ Add Student</button>' +
      '<button class="btn-primary" style="padding:10px 22px;background:var(--accent2);" onclick="openAdminAddStaffModal()">➕ Add Staff</button>' +
      '<button class="btn-outline" style="padding:10px 22px;" onclick="showSection(\'admin-students\')">👥 All Students</button>' +
      '<button class="btn-outline" style="padding:10px 22px;" onclick="showSection(\'admin-staff\')">🏫 All Staff</button>' +
    '</div>' +
    '<div class="info-alert">🔐 <span>You are logged in as <strong>System Administrator</strong>. Full read/write access to all records.</span></div>';
}

async function renderAdminStudents() {
  var students = await API.getAllStudents();
  return '<h2 class="pg-title">All Students</h2><p class="pg-sub">' + students.length + ' students across all departments</p>' +
    '<div style="margin-bottom:16px;"><button class="btn-primary" style="padding:9px 20px;" onclick="openAdminAddStudentModal()">➕ Add Student</button></div>' +
    '<div class="card"><div class="card-header"><span class="card-title">Student Registry</span>' +
    '<input type="text" placeholder="Search name or reg no…" oninput="filterAdminTable(\'admin-stu-tbody\', this.value)" style="padding:7px 12px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;background:var(--surf2);color:var(--ink);outline:none;"></div>' +
    '<div class="table-scroll"><table><thead><tr><th>Name</th><th>Reg No</th><th>Dept</th><th>Year</th><th>Sec</th><th>Attendance %</th><th>Email</th><th>Actions</th></tr></thead>' +
    '<tbody id="admin-stu-tbody">' +
    (students.length ? students.map(function(s) {
      var pct = parseFloat(s.attendancePct||100).toFixed(1);
      var col = pct>=75?'var(--accent)':pct>=60?'var(--warn)':'var(--accent2)';
      return '<tr><td><strong>' + esc(s.name) + '</strong></td><td class="muted">' + esc(s.regNo) + '</td><td>' + esc(s.departmentCode) + '</td><td>' + s.year + '</td><td>' + esc(s.section) + '</td>' +
        '<td style="color:' + col + ';font-weight:700;">' + pct + '%</td><td class="muted">' + esc(s.email) + '</td>' +
        '<td><div style="display:flex;gap:6px;">' +
        '<button class="btn-sm" onclick="adminResetPw(\'student\',\'' + esc(s.regNo) + '\',\'' + esc(s.name) + '\')">🔑 Reset PW</button>' +
        '<button class="btn-sm btn-sm-danger" onclick="adminDeleteStudent(\'' + esc(s.regNo) + '\',\'' + esc(s.name) + '\')">🗑 Delete</button>' +
        '</div></td></tr>';
    }).join('') : emptyRow(8, 'No students found')) +
    '</tbody></table></div></div>';
}

async function renderAdminStaff() {
  var staff = await API.getAllStaff();
  var cols  = ['av-green','av-orange','av-blue','av-purple','av-gray'];
  return '<h2 class="pg-title">All Staff</h2><p class="pg-sub">' + staff.length + ' staff members</p>' +
    '<div style="margin-bottom:16px;"><button class="btn-primary" style="padding:9px 20px;background:var(--accent2);" onclick="openAdminAddStaffModal()">➕ Add Staff</button></div>' +
    '<div class="card"><div class="card-header"><span class="card-title">Staff Registry</span>' +
    '<input type="text" placeholder="Search name or ID…" oninput="filterAdminTable(\'admin-staff-tbody\', this.value)" style="padding:7px 12px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;background:var(--surf2);color:var(--ink);outline:none;"></div>' +
    '<div class="table-scroll"><table><thead><tr><th>Name</th><th>Staff ID</th><th>Dept</th><th>Role</th><th>Yr/Sec</th><th>Email</th><th>Actions</th></tr></thead>' +
    '<tbody id="admin-staff-tbody">' +
    (staff.length ? staff.map(function(s,i) {
      return '<tr><td><div style="display:flex;align-items:center;gap:8px;"><div class="p-avatar ' + cols[i%5] + '" style="width:28px;height:28px;font-size:11px;border-radius:7px;">' + s.name.charAt(0) + '</div><strong>' + esc(s.name) + '</strong></div></td>' +
        '<td class="muted">' + esc(s.staffId) + '</td><td>' + esc(s.departmentCode) + '</td><td>' + badge(s.role) + '</td>' +
        '<td class="muted">' + (s.assignedYear ? s.assignedYear+'/'+s.assignedSection : '—') + '</td><td class="muted">' + esc(s.email) + '</td>' +
        '<td><div style="display:flex;gap:6px;">' +
        '<button class="btn-sm" onclick="adminResetPw(\'staff\',\'' + esc(s.staffId) + '\',\'' + esc(s.name) + '\')">🔑 Reset PW</button>' +
        '<button class="btn-sm btn-sm-danger" onclick="adminDeleteStaff(\'' + esc(s.staffId) + '\',\'' + esc(s.name) + '\')">🗑 Delete</button>' +
        '</div></td></tr>';
    }).join('') : emptyRow(7, 'No staff found')) +
    '</tbody></table></div></div>';
}

async function renderAdminAttendance() {
  var recs = await API.getAllAttendance();
  return '<h2 class="pg-title">All Attendance Records</h2><p class="pg-sub">' + recs.length + ' records system-wide</p>' +
    '<div class="card"><div class="card-header"><span class="card-title">Complete Attendance Log</span>' +
    '<input type="text" placeholder="Search…" oninput="filterAdminTable(\'admin-att-tbody\', this.value)" style="padding:7px 12px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;background:var(--surf2);color:var(--ink);outline:none;"></div>' +
    '<div class="table-scroll"><table><thead><tr><th>Date</th><th>Student</th><th>Reg No</th><th>Dept</th><th>Year</th><th>Sec</th><th>Status</th><th>Marked By</th></tr></thead>' +
    '<tbody id="admin-att-tbody">' +
    (recs.length ? recs.slice(0,500).map(function(r) {
      return '<tr><td>' + fmtDate(r.attendanceDate) + '</td><td><strong>' + esc(r.studentName) + '</strong></td><td class="muted">' + esc(r.regNo) + '</td><td>' + esc(r.departmentCode) + '</td><td>' + (r.year||'—') + '</td><td>' + esc(r.section) + '</td><td>' + badge(r.status) + '</td><td class="muted">' + esc(r.markedBy) + '</td></tr>';
    }).join('') : emptyRow(8, 'No records')) +
    '</tbody></table></div></div>';
}

async function renderAdminOD() {
  var reqs = await API.getAllOdLeave();
  return '<h2 class="pg-title">All OD / Leave Requests</h2><p class="pg-sub">' + reqs.length + ' total requests</p>' +
    '<div class="card"><div class="card-header"><span class="card-title">Complete OD / Leave Log</span>' +
    '<input type="text" placeholder="Search student…" oninput="filterAdminTable(\'admin-od-tbody\', this.value)" style="padding:7px 12px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;background:var(--surf2);color:var(--ink);outline:none;"></div>' +
    '<div class="table-scroll"><table><thead><tr><th>Student</th><th>Dept</th><th>Type</th><th>From</th><th>To</th><th>Mentor</th><th>CI</th><th>HOD</th><th>Status</th><th></th></tr></thead>' +
    '<tbody id="admin-od-tbody">' +
    (reqs.length ? reqs.map(function(r) {
      return '<tr><td><strong>' + esc(r.studentName) + '</strong></td><td class="muted">' + esc(r.departmentCode) + '</td><td>' + esc(r.type) + '</td><td>' + fmtDate(r.fromDate) + '</td><td>' + fmtDate(r.toDate) + '</td>' +
        '<td>' + badge(r.mentorStatus) + '</td><td>' + badge(r.ciStatus) + '</td><td>' + badge(r.hodStatus) + '</td><td>' + badge(r.status) + '</td>' +
        '<td><button class="btn-sm" onclick="showODDetail(' + r.id + ')">View</button></td></tr>';
    }).join('') : emptyRow(10, 'No requests')) +
    '</tbody></table></div></div>';
}

function filterAdminTable(tbodyId, query) {
  var q = query.toLowerCase();
  document.querySelectorAll('#' + tbodyId + ' tr').forEach(function(row) {
    row.style.display = row.textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none';
  });
}

async function adminDeleteStudent(regNo, name) {
  if (!confirm('Delete student "' + name + '" (' + regNo + ')?\n\nThis cannot be undone.')) return;
  try { await API.adminDelStudent(regNo); toast(name + ' deleted', 'success'); showSection('admin-students'); }
  catch(e) { toast(e.message, 'error'); }
}

async function adminDeleteStaff(staffId, name) {
  if (!confirm('Delete staff "' + name + '" (' + staffId + ')?\n\nThis cannot be undone.')) return;
  try { await API.adminDelStaff(staffId); toast(name + ' deleted', 'success'); showSection('admin-staff'); }
  catch(e) { toast(e.message, 'error'); }
}

async function adminResetPw(type, id, name) {
  var newDob = prompt('Reset password for "' + name + '".\nEnter new Date of Birth (YYYY-MM-DD):');
  if (!newDob) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDob)) { toast('Invalid date format. Use YYYY-MM-DD', 'error'); return; }
  try {
    if (type === 'student') await API.adminResetStudPw(id, newDob);
    else                    await API.adminResetStaffPw(id, newDob);
    toast('Password reset for ' + name + '. New password: ' + newDob, 'success', 5000);
  } catch(e) { toast(e.message, 'error'); }
}

function openAdminAddStudentModal() { openModal('modal-admin-add-student'); }
function openAdminAddStaffModal()   { openModal('modal-admin-add-staff');   }

async function adminAddStudent() {
  var btn = document.getElementById('btn-admin-add-stu');
  btnLoading(btn, true);
  try {
    var data = {
      name: document.getElementById('aas-name').value.trim(),
      regNo: document.getElementById('aas-regno').value.trim(),
      dob: document.getElementById('aas-dob').value,
      email: document.getElementById('aas-email').value.trim(),
      phone: document.getElementById('aas-phone').value.trim(),
      departmentCode: document.getElementById('aas-dept').value,
      year: parseInt(document.getElementById('aas-year').value),
      section: document.getElementById('aas-section').value,
    };
    if (!data.name || !data.regNo || !data.dob || !data.departmentCode) { toast('Fill all required fields', 'error'); return; }
    await API.adminAddStudent(data);
    toast('Student "' + data.name + '" added!', 'success');
    closeModal('modal-admin-add-student');
    showSection('admin-students');
  } catch(e) { toast(e.message, 'error'); }
  finally    { btnLoading(btn, false); }
}

async function adminAddStaff() {
  var btn = document.getElementById('btn-admin-add-staff');
  btnLoading(btn, true);
  try {
    var data = {
      name:            document.getElementById('aastf-name').value.trim(),
      staffId:         document.getElementById('aastf-id').value.trim(),
      dob:             document.getElementById('aastf-dob').value,
      email:           document.getElementById('aastf-email').value.trim(),
      phone:           document.getElementById('aastf-phone').value.trim(),
      departmentCode:  document.getElementById('aastf-dept').value,
      role:            document.getElementById('aastf-role').value,
      assignedYear:    parseInt(document.getElementById('aastf-year').value) || null,
      assignedSection: document.getElementById('aastf-section').value || null,
    };
    if (!data.name || !data.staffId || !data.dob || !data.departmentCode || !data.role) { toast('Fill all required fields', 'error'); return; }
    await API.adminAddStaff(data);
    toast('Staff "' + data.name + '" added!', 'success');
    closeModal('modal-admin-add-staff');
    showSection('admin-staff');
  } catch(e) { toast(e.message, 'error'); }
  finally    { btnLoading(btn, false); }
}