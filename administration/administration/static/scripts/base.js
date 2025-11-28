let isSidebarOpen = true;
let currentTheme = 'light';
let activeModule = 'dashboard';
let openMenu = null;
let isSettingsOpen = false;
const body = document.body;
const menuToggle = document.getElementById('menu-toggle');
const menuIcon = menuToggle ? menuToggle.querySelector('i'):null;
const sidebar = document.getElementById('sidebar');
const mainItems= document.querySelectorAll('.main-item');


const settingsBtn =document.getElementById('settings-btn');
const settingsPanel =document.getElementById('settings-panel');
const settingsCloseBtn =document.getElementById('settings-close-btn');

const themeToggleBtn =document.getElementById('theme-toggle-btn');
const fullscreenBtn=document.getElementById('fullscreen-btn');
const fullscreenIcon=document.querySelector('i');

const navLinks = document.querySelectorAll('.sidebar .main-item , .sidebar .sub-menu a');
const mobileOverlay = document.getElementById('overlay');
function toggleSidebar() {
    if(!sidebar) return;
    isSidebarOpen = !isSidebarOpen;
    if(window.innerWidth <= 200) {
        sidebar.classList.toggle('open',isSidebarOpen);
        if(mobileOverlay) mobileOverlay.classList.toggle('active',isSidebarOpen);
        sidebar.classList.remove('collapsed');
    }
    else {
        sidebar.classList.toggle('collapsed', !isSidebarOpen);
        content.classList.toggle('collapsed', !isSidebarOpen);
        if(menuIcon) menuIcon.className = isSidebarOpen? 'fa fa-chevron-left' : 'fa fa-bars';
    }
}
function toggleSettings() {
  isSettingsOpen = !isSettingsOpen;
  settingsPanel.classList.toggle('show');
}

function toggleTheme() {
  body.classList.remove(currentTheme + '-theme');
  currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
  body.classList.add(currentTheme + '-theme');
  themeToggleBtn.textContent = (currentTheme === 'light') ? 'Switch to Dark' : 'Switch to Light';
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenIcon.className = 'fa-solid fa-compress';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      fullscreenIcon.className = 'fa-solid fa-expand';
    }
  }
}

function handleNavigate(targetModule){
    if (!targetModule) return;
    activeModule = targetModule;

    if(history.pushState) {
        history.pushState(null,null,'#' + targetModule);
    } else {
        window.location.hash = targetModule;
    }
    if(moduleDisplay) {
        moduleDisplay.textContent= `#${targetModule}`;
    }
    navLinks.forEach(link => {
        link.classList.remove('active');

        if(link.CDATA_SECTION_NODE.menu === targetModule){
            link.classList.add('active');
        }
        const linkId =link.id;
        let linkMod = null;
        if(linkId === 'addstudent') linkMod ='admisson';
        if(linkId === 'viewstudent') linkMod ='student-list';
        if(['summary','quickedit','academicedit'].includes(linkId)){ 
            linkMod = linkId
        }

        if(linkMod && linkMod === targetModule){
            link.classList.add('active');
            const parentMenu = link.closest('li').parentElement.previousElementSibling;
            if(parentMenu) {
                parentMenu.classList.add('active');
            }
        }
    });
    if (window.innerWidth <= 200 && isSidebarOpen) {
        toggleSidebar();
    }
}
function handleAccordion(e){
    
    const item = e.currentTarget;
    if(item.tagName === 'A') {
        mainItems.forEach (i => i.classList.remove('active'));
        item.classList.add('active');
        handleNavigate(item.dataset.menu);
        return;
    }

    const subMenu = item.nextElementSibling;

    if (openMenu && openMenu !== subMenu) {
        openMenu.style.display ='none';
    }

    if(subMenu && subMenu.style.display === 'grid') {
        subMenu.style.display = 'none';
        openMenu = null;
    } else if (subMenu) {
        subMenu.style.display ='grid';
        openMenu =subMenu;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    menuToggle.addEventListener('click',toggleSidebar);
    mobileOverlay.addEventListener('click',toggleSidebar);
    settingsBtn.addEventListener('click', toggleSettings);
    settingsCloseBtn.addEventListener('click', toggleSettings);
    themeToggleBtn.addEventListener('click', toggleTheme);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    mainItems.forEach(item => {item.addEventListener('click',handleAccordion);

    });
    
        if(sidebar) {
            if(window.innerWidth <=768) {
                isSidebarOpen =false;
                sidebar.classList.remove('open');
                if (menuIcon) menuIcon.className ='fa fa bars' ;
            }
            else {
                isSidebarOpen = true;
                sidebar.classList.remove('collapsed');
                if (menuIcon) menuIcon.className = 'fa fa-chevron-left';
            }
        }
        
        const hash = window.location.hash.substring(1);
        if(hash) {
            handleNavigate(hash);
        } else {
            handleNavigate('dashboard');
        }

        window.addEventListener('hashchange', ()=> {
            if(hash){
                handleNavigate(hash);
            }
        });
    });
