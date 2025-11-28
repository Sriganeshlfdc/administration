document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const studentId = urlParams.get('id');
        const modal = document.getElementById('submission-modal');
        const closeBtn = document.getElementById('modal-close-btn');
        const idDisplay = document.getElementById('student-id-display');
        function cleanUrl() {
            if (history.pushState) {
                history.pushState('', document.title, window.location.pathname);
            }
        }

        if (status === 'success' && modal) {
            modal.classList.add('show');
            if (studentId) {
                idDisplay.textContent = studentId;
            }
            
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                cleanUrl();
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    cleanUrl();
                }
            });

        } 
    });