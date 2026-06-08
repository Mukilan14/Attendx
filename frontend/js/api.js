// ════════════════════════════════════════════════════════
//  api.js  — Central HTTP client for AttendX
//  Uses sessionStorage so each browser tab is independent
// ════════════════════════════════════════════════════════

const BASE = 'http://localhost:8080/api';

function getToken() {
  return sessionStorage.getItem('attendx_token');
}

function getUser() {
  var u = sessionStorage.getItem('attendx_user');
  return u ? JSON.parse(u) : null;
}

function setSession(token, user) {
  sessionStorage.setItem('attendx_token', token);
  sessionStorage.setItem('attendx_user', JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem('attendx_token');
  sessionStorage.removeItem('attendx_user');
}

async function request(method, path, body, auth) {
  if (auth === undefined) auth = true;
  var headers = { 'Content-Type': 'application/json' };
  if (auth) {
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
  }
  var opts = { method: method, headers: headers };
  if (body) opts.body = JSON.stringify(body);

  var res  = await fetch(BASE + path, opts);
  var json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

var API = {
  // Auth
  login:           function(id, dob, role, dept) { return request('POST', '/auth/login', { id: id, dob: dob, role: role, department: dept }, false); },
  registerStudent: function(data) { return request('POST', '/auth/register/student', data, false); },
  registerStaff:   function(data) { return request('POST', '/auth/register/staff',   data, false); },

  // Departments
  getDepartments:  function()       { return request('GET', '/departments'); },
  getDeptStats:    function(code)   { return request('GET', '/departments/' + code + '/stats'); },

  // Students
  getMe:              function()                  { return request('GET', '/students/me'); },
  getMyAttendance:    function()                  { return request('GET', '/students/me/attendance'); },
  getStudentsByDept:  function(code)              { return request('GET', '/students/dept/' + code); },
  getStudentsByClass: function(dept, year, sec)   { return request('GET', '/students/class?dept=' + dept + '&year=' + year + '&section=' + sec); },

  // Staff
  getStaffByDept: function(code) { return request('GET', '/staff/dept/' + code); },

  // Attendance
  markAttendance:     function(date, records, year, sec) { return request('POST', '/attendance/mark/class?year=' + year + '&section=' + sec, { date: date, records: records }); },
  getDeptAttendance:  function(code)                     { return request('GET', '/attendance/dept/' + code); },
  getClassAttendance: function(dept, year, sec)          { return request('GET', '/attendance/class?dept=' + dept + '&year=' + year + '&section=' + sec); },

  // OD / Leave
  submitOD:   function(data)             { return request('POST', '/od-leave/submit', data); },
  getMyOD:    function()                 { return request('GET',  '/od-leave/my'); },
  getPendingOD: function(year, sec)      { return request('GET',  '/od-leave/pending/class?year=' + year + '&section=' + sec); },
  getODById:  function(id)              { return request('GET',  '/od-leave/' + id); },
  processOD:  function(id, action, note){ return request('POST', '/od-leave/' + id + '/process', { action: action, note: note }); },
  getDeptOD:  function(code)            { return request('GET',  '/od-leave/dept/' + code); },

  // Admin
  getAdminStats:     function() { return request('GET', '/admin/stats'); },
  getAllStudents:     function() { return request('GET', '/admin/students'); },
  getAllStaff:        function() { return request('GET', '/admin/staff'); },
  getAllOdLeave:      function() { return request('GET', '/admin/od-leave'); },
  getAllAttendance:   function() { return request('GET', '/admin/attendance'); },
  adminAddStudent:   function(data)          { return request('POST',   '/admin/students/add',       data); },
  adminAddStaff:     function(data)          { return request('POST',   '/admin/staff/add',          data); },
  adminDelStudent:   function(regNo)         { return request('DELETE', '/admin/students/' + regNo); },
  adminDelStaff:     function(staffId)       { return request('DELETE', '/admin/staff/'    + staffId); },
  adminResetStudPw:  function(regNo,  newDob){ return request('PUT', '/admin/students/' + regNo  + '/reset-password', { newDob: newDob }); },
  adminResetStaffPw: function(staffId,newDob){ return request('PUT', '/admin/staff/'    + staffId + '/reset-password', { newDob: newDob }); },
};