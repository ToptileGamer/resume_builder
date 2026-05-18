// =============================
// DASHBOARD & RESUME BUILDER
// =============================

// Check authentication on page load
window.addEventListener('DOMContentLoaded', function() {
  const user = getStoredUser();

  if (!user) {
    window.location.href = 'auth.html';
    return;
  }

  // Display user email
  document.getElementById('userEmail').textContent = user.email;

  // Load saved resume data
  loadResumeData();

  // Setup real-time preview updates
  setupPreviewUpdates();
});

// =============================
// LOAD SAVED DATA
// =============================

function loadResumeData() {
  const user = getStoredUser();
  const resumeData = localStorage.getItem(`resume_${user.id}`);

  if (resumeData) {
    const data = JSON.parse(resumeData);

    for (let key in data) {
      const element = document.getElementById(key);
      if (element) {
        element.value = data[key];
        // Update preview immediately
        updatePreview(key, data[key]);
      }
    }
  }
}

// =============================
// SAVE RESUME
// =============================

function saveResume() {
  const user = getStoredUser();
  if (!user) {
    alert('Please login first');
    return;
  }

  const fields = [
    'name',
    'title',
    'phone',
    'email',
    'address',
    'profile',
    'education',
    'experience',
    'languages',
    'hobbies',
    'skills',
    'tech',
    'projects'
  ];

  let data = {};
  fields.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      data[id] = element.value;
    }
  });

  localStorage.setItem(`resume_${user.id}`, JSON.stringify(data));
  showNotification('Resume saved successfully!', 'success');
}

// =============================
// PREVIEW & DOWNLOAD
// =============================

function goToPreview() {
  saveResume();
  window.location.href = 'resume.html';
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const resume = document.getElementById('resume');

  if (!resume) {
    alert('Resume preview not found');
    return;
  }

  try {
    const canvas = await html2canvas(resume, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('resume.pdf');
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Error generating PDF');
  }
}

// =============================
// REAL-TIME PREVIEW
// =============================

function setupPreviewUpdates() {
  const fields = [
    'name',
    'title',
    'phone',
    'email',
    'address',
    'profile',
    'experience',
    'skills',
    'education',
    'tech',
    'languages',
    'projects',
    'hobbies'
  ];

  fields.forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.addEventListener('input', function() {
        updatePreview(fieldId, this.value);
      });
    }
  });
}

function updatePreview(fieldId, value) {
  const previewId = 'p-' + fieldId;
  const previewElement = document.getElementById(previewId);

  if (!previewElement) return;

  // Special handling for skills (comma-separated list)
  if (fieldId === 'skills') {
    const skillsList = value.split(',').map(s => s.trim()).filter(s => s);
    previewElement.innerHTML = '';
    skillsList.forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      previewElement.appendChild(li);
    });
  } else {
    previewElement.textContent = value || `Add your ${fieldId}`;
  }
}

// =============================
// LOGOUT
// =============================

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
  }
}

// =============================
// HELPER FUNCTIONS
// =============================

function getStoredUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
