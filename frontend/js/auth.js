// ════════════════════════════════════════════════════════
//  auth.js — Login, register, logout
//  SINGLE definition of switchLoginTab — do not redefine elsewhere
// ════════════════════════════════════════════════════════

// ── Tab switching ─────────────────────────────────────
function switchLoginTab(tab) {
  ['student', 'staff', 'register', 'staff-register'].forEach(function(t) {
    var el = document.getElementById('login-' + t + '-form');
    if (el) el.classList.add('hidden');
  });
  document.querySelectorAll('.login-tab').forEach(function(b) {
    b.classList.remove('active');
  });
  var target = document.getElementById('login-' + tab + '-form');
  if (target) target.classList.remove('hidden');

  var tabs = document.querySelectorAll('.login-tab');
  if (tab === 'student'  || tab === 'register')       { if (tabs[0]) tabs[0].classList.add('active'); }
  if (tab === 'staff'    || tab === 'staff-register')  { if (tabs[1]) tabs[1].classList.add('active'); }
}

// ── Show/hide year+section for CI/Mentor roles ────────
function toggleStaffClassFields() {
  var role = document.getElementById('sr-role').value;
  var show = (role === 'class_incharge' || role === 'mentor');
  var el   = document.getElementById('sr-class-fields');
  if (el) el.style.display = show ? 'grid' : 'none';
}

// ── Login ─────────────────────────────────────────────
async function doLogin(type) {
  var btn = document.getElementById('btn-login-' + type);
  btnLoading(btn, true);
  try {
    var id, dob, role;
    if (type === 'student') {
      id   = document.getElementById('l-regno').value.trim();
      dob  = document.getElementById('l-dob').value;
      role = 'student';
    } else {
      id   = document.getElementById('l-staffid').value.trim();
      dob  = document.getElementById('l-staff-dob').value;
      role = document.getElementById('l-role').value;
    }
    if (!id || !dob) { toast('Fill all fields', 'error'); return; }

    var dept = window.selectedDept ? window.selectedDept.code : '';
    var data = await API.login(id, dob, role, dept);

    setSession(data.token, {
      name:            data.name,
      role:            data.role,
      id:              data.id,
      department:      data.department,
      assignedYear:    data.assignedYear,
      assignedSection: data.assignedSection,
    });

    toast('Welcome, ' + data.name + '!', 'success');
    initDashboard();
    goTo('dashboard');
  } catch (e) {
    toast(e.message || 'Login failed', 'error');
  } finally {
    btnLoading(btn, false);
  }
}

// ── Register student ──────────────────────────────────
async function doRegister() {
  var btn = document.getElementById('btn-register');
  btnLoading(btn, true);
  try {
    var dept = window.selectedDept ? window.selectedDept.code : null;
    if (!dept) { toast('No department selected', 'error'); return; }
    var data = {
      name:           document.getElementById('r-name').value.trim(),
      regNo:          document.getElementById('r-regno').value.trim(),
      dob:            document.getElementById('r-dob').value,
      email:          document.getElementById('r-email').value.trim(),
      phone:          document.getElementById('r-phone').value.trim(),
      departmentCode: dept,
      year:           parseInt(document.getElementById('r-year').value),
      section:        document.getElementById('r-section').value,
    };
    if (!data.name || !data.regNo || !data.dob) { toast('Fill all required fields', 'error'); return; }
    await API.registerStudent(data);
    toast('Registered! You can now sign in.', 'success');
    switchLoginTab('student');
    document.getElementById('l-regno').value = data.regNo;
  } catch (e) {
    toast(e.message || 'Registration failed', 'error');
  } finally {
    btnLoading(btn, false);
  }
}

// ── Register staff ────────────────────────────────────
async function doStaffRegister() {
  var btn = document.getElementById('btn-staff-register');
  if (btn) { btn.textContent = 'Registering...'; btn.disabled = true; }
  try {
    var dept = window.selectedDept ? window.selectedDept.code : null;
    if (!dept) { toast('No department selected', 'error'); return; }
    var role    = document.getElementById('sr-role').value;
    var yearEl  = document.getElementById('sr-year');
    var secEl   = document.getElementById('sr-section');
    var yearVal = yearEl ? yearEl.value : '';
    var secVal  = secEl  ? secEl.value  : '';
    var data = {
      name:            document.getElementById('sr-name').value.trim(),
      staffId:         document.getElementById('sr-staffid').value.trim(),
      dob:             document.getElementById('sr-dob').value,
      email:           document.getElementById('sr-email').value.trim(),
      phone:           document.getElementById('sr-phone').value.trim(),
      departmentCode:  dept,
      role:            role,
      assignedYear:    yearVal ? parseInt(yearVal) : null,
      assignedSection: secVal  || null,
    };
    if (!data.name || !data.staffId || !data.dob) { toast('Fill all required fields', 'error'); return; }
    await API.registerStaff(data);
    toast('Staff account created! You can now sign in.', 'success');
    switchLoginTab('staff');
    document.getElementById('l-staffid').value = data.staffId;
  } catch (e) {
    toast(e.message || 'Registration failed', 'error');
  } finally {
    if (btn) { btn.textContent = 'Register Staff Account'; btn.disabled = false; }
  }
}

// ── Logout (clears this tab's session only) ───────────
function doLogout() {
  clearSession();
  pageHistory = [];
  window.selectedDept = null;
  goTo('home', false);
  toast('Signed out', 'info');
}