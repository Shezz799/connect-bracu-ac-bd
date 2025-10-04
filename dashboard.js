// Handles expandable sidebar groups (Advising submenu)
(function(){
  function initSubmenus(){
    document.querySelectorAll('.nav-group.has-sub').forEach(function(group){
      var btn = group.querySelector('.nav-main');
      if(!btn) return;
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var open = group.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    // Auto-collapse all groups when pointer leaves the sidebar
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      function closeAll(){
        document.querySelectorAll('.nav-group.open').forEach(function(g){
          g.classList.remove('open');
          var b = g.querySelector('.nav-main');
          if (b) b.setAttribute('aria-expanded','false');
        });
      }
      sidebar.addEventListener('mouseleave', closeAll);
      // Also collapse when keyboard focus leaves the sidebar
      sidebar.addEventListener('focusout', function(){
        // Delay to allow focus to settle
        setTimeout(function(){
          if (!sidebar.contains(document.activeElement)) {
            closeAll();
          }
        }, 0);
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubmenus);
  } else {
    initSubmenus();
  }

  // Pretty-route navigation: if an anchor has data-route, prefer that path when not running from file://
  function initPrettyRoutes(){
    var protocol = location.protocol;
    var isHttp = protocol === 'http:' || protocol === 'https:';
    var isLocalhost = isHttp && (/^(localhost|127\.0\.0\.1)$/i.test(location.hostname));
    var allowPretty = isHttp && !isLocalhost; // only intercept on real hosts (e.g., Vercel), not file:// or localhost or custom schemes

    document.querySelectorAll('a[data-route]').forEach(function(a){
      a.addEventListener('click', function(e){
        if (!allowPretty) return; // let normal .html link work locally and in editor previews
        var pretty = a.getAttribute('data-route');
        if (pretty) {
          e.preventDefault();
          window.location.assign(pretty);
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrettyRoutes);
  } else {
    initPrettyRoutes();
  }

  // Make the top-left logo act as a Home link to Student Dashboard
  function initLogoHome(){
    var protocol = location.protocol;
    var isHttp = protocol === 'http:' || protocol === 'https:';
    var isLocalhost = isHttp && (/^(localhost|127\.0\.0\.1)$/i.test(location.hostname));
    var allowPretty = isHttp && !isLocalhost;

    document.querySelectorAll('.sidebar-logo').forEach(function(img){
      try { img.style.cursor = 'pointer'; } catch(e) {}
      img.addEventListener('click', function(e){
        e.preventDefault();
        if (allowPretty) {
          window.location.assign('/studentdashboard');
        } else {
          window.location.assign('studentdashboard.html');
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogoHome);
  } else {
    initLogoHome();
  }

  // Notifications popover: toggle on bell click, close on outside click or ESC
  function initNotifications(){
    var bell = document.querySelector('.topbar .icon-btn[title="Notifications"], .topbar .icon-btn[aria-label="Notifications"]');
    if (!bell) return;

    // Create popover once and append to body
    var pop = document.querySelector('.notif-popover');
    if (!pop) {
      pop = document.createElement('div');
      pop.className = 'notif-popover';
      pop.innerHTML = [
        '<div class="notif-header">User Notifications</div>',
        '<div class="notif-body">',
        '  <div class="notif-item">',
        '    <div class="notif-icon">📨</div>',
        '    <div><div class="notif-title">Payment Confirmation Alert</div><div class="notif-time">Jul 3, 2025, 11:37:01 AM</div></div>',
        '  </div>',
        '  <div class="notif-item">',
        '    <div class="notif-icon">📨</div>',
        '    <div><div class="notif-title">Payslip Deadline Alert</div><div class="notif-time">Jun 25, 2025, 8:50:30 AM</div></div>',
        '  </div>',
        '  <div class="notif-item">',
        '    <div class="notif-icon">📨</div>',
        '    <div><div class="notif-title">Payslip Deadline Alert</div><div class="notif-time">Jun 23, 2025, 8:04:41 AM</div></div>',
        '  </div>',
        '  <div class="notif-item">',
        '    <div class="notif-icon">📨</div>',
        '    <div><div class="notif-title">Registration Payslip Alert</div><div class="notif-time">Jun 19, 2025, 2:26:37 PM</div></div>',
        '  </div>',
        '  <div class="notif-item">',
        '    <div class="notif-icon">📨</div>',
        '    <div><div class="notif-title">Payment Confirmation Alert</div><div class="notif-time">Mar 6, 2025, 11:25:03 AM</div></div>',
        '  </div>',
        '</div>'
      ].join('');
      document.body.appendChild(pop);
    }

    function positionPopover(){
      try {
        var rect = bell.getBoundingClientRect();
        pop.style.top = (rect.bottom + 10) + 'px';
        pop.style.right = Math.max(16, window.innerWidth - rect.right) + 'px';
      } catch(e){}
    }

    function openPop(){
      // Close profile menu if open
      try { var pm = document.querySelector('.profile-popover.open'); if (pm) pm.classList.remove('open'); } catch(e){}
      positionPopover();
      pop.classList.add('open');
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onKey);
      window.addEventListener('resize', positionPopover);
      window.addEventListener('scroll', positionPopover, true);
    }
    function closePop(){
      pop.classList.remove('open');
      document.removeEventListener('click', onDocClick, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', positionPopover);
      window.removeEventListener('scroll', positionPopover, true);
    }
    function onDocClick(e){
      if (pop.contains(e.target) || bell.contains(e.target)) return;
      closePop();
    }
    function onKey(e){ if (e.key === 'Escape') closePop(); }

    bell.addEventListener('click', function(e){
      e.preventDefault();
      if (pop.classList.contains('open')) closePop(); else openPop();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
  } else {
    initNotifications();
  }

  // Profile popover (avatar menu)
  function initProfileMenu(){
    var avatarBtn = document.querySelector('.topbar .avatar');
    if (!avatarBtn) return;

    var menu = document.querySelector('.profile-popover');
    if (!menu) {
      menu = document.createElement('div');
      menu.className = 'profile-popover';
      menu.innerHTML = [
        '<div class="profile-header">',
        '  <img src="./assets/me2.png" alt="User"/>',
        '  <div>',
        '    <div class="profile-name">SHEHZAD HAKIM</div>',
        '    <div class="profile-email">shehzad.hakim@g.bracu.ac.bd</div>',
        '  </div>',
        '</div>',
        '<div class="profile-menu">',
        '  <a href="#" class="profile-item" data-action="profile"><span class="profile-dot green"></span><span class="profile-label">My Profile</span></a>',
        '  <a href="#" class="profile-item" data-action="settings"><span class="profile-dot green"></span><span class="profile-label">Account Settings</span></a>',
        '  <div class="profile-sep"></div>',
        '  <a href="#" class="profile-item signout" data-action="logout"><span class="profile-dot red"></span><span class="profile-label">Sign Out</span></a>',
        '</div>'
      ].join('');
      document.body.appendChild(menu);
    }

    function position(){
      try {
        var rect = avatarBtn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 10) + 'px';
        menu.style.right = Math.max(16, window.innerWidth - rect.right) + 'px';
      } catch(e){}
    }
    function open(){
      // Close notifications popover if open
      try { var np = document.querySelector('.notif-popover.open'); if (np) np.classList.remove('open'); } catch(e){}
      position();
      menu.classList.add('open');
      document.addEventListener('click', onDoc, true);
      document.addEventListener('keydown', onKey);
      window.addEventListener('resize', position);
      window.addEventListener('scroll', position, true);
    }
    function close(){
      menu.classList.remove('open');
      document.removeEventListener('click', onDoc, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    }
    function onDoc(e){ if (menu.contains(e.target) || avatarBtn.contains(e.target)) return; close(); }
    function onKey(e){ if (e.key === 'Escape') close(); }

    avatarBtn.addEventListener('click', function(e){
      e.preventDefault();
      if (menu.classList.contains('open')) close(); else open();
    });

    // Wire actions: placeholders for profile/settings; logout returns to login
    menu.addEventListener('click', function(e){
      var a = e.target.closest('a.profile-item');
      if (!a) return;
      e.preventDefault();
      var act = a.getAttribute('data-action');
      if (act === 'logout') {
        // Simple sign-out: navigate back to login page
        window.location.assign('index.html');
      } else if (act === 'profile') {
        // Navigate to My Profile page
        var protocol = location.protocol;
        var isHttp = protocol === 'http:' || protocol === 'https:';
        var isLocalhost = isHttp && (/^(localhost|127\.0\.0\.1)$/i.test(location.hostname));
        if (isHttp && !isLocalhost) {
          window.location.assign('/studentdashboard/myprofile');
        } else {
          window.location.assign('my-profile.html');
        }
      } else if (act === 'settings') {
        var protocol = location.protocol;
        var isHttp = protocol === 'http:' || protocol === 'https:';
        var isLocalhost = isHttp && (/^(localhost|127\.0\.0\.1)$/i.test(location.hostname));
        if (isHttp && !isLocalhost) {
          window.location.assign('/studentdashboard/accountsettings');
        } else {
          window.location.assign('account-settings.html');
        }
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileMenu);
  } else {
    initProfileMenu();
  }
})();
