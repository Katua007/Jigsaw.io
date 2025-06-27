const jobListingsSection = document.getElementById('job-listings-section');
const jobDetailsSection = document.getElementById('job-details-section');
const postJobSection = document.getElementById('post-job-section');
const jobListingsContainer = document.getElementById('job-listings-container');
const loadingIndicator = document.getElementById('loading-indicator');
const jobDetailContent = document.getElementById('job-detail-content');
const navPostJobButton = document.getElementById('navPostJob');
const backToJobsBtn = document.getElementById('backToJobsBtn');
const skillFilter = document.getElementById('skill-filter');
const jobPostForm = document.getElementById('job-post-form');
const postJobMessage = document.getElementById('post-job-message');
const API_BASE_URL = 'http://localhost:3000';
let allJobs = [];

function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden-section');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden-section');
        targetSection.classList.add('active-section');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function createJobCard(job) {
    const jobCard = document.createElement('div');
    jobCard.classList.add('job-card');
    jobCard.dataset.jobId = job.id;
    const companyLogoHtml = job.companyLogo ? `<img src="${job.companyLogo}" alt="${job.companyName} logo" class="company-logo" onerror="this.onerror=null;this.src='https://placehold.co/100x40/D3D3D3/000000?text=Logo';">` : '';
    jobCard.innerHTML = `
        <div class="card-header">
            ${companyLogoHtml}
            <h3>${job.jobTitle}</h3>
        </div>
        <p><strong>Company:</strong> ${job.companyName}</p>
        <p><strong>Location:</strong> ${job.jobGeo}</p>
        <p class="excerpt">${job.jobExcerpt}</p>
        <div class="job-meta">
            ${job.jobType ? `<span class="badge badge-type">${job.jobType}</span>` : ''}
            ${job.jobLevel ? `<span class="badge badge-level">${job.jobLevel}</span>` : ''}
        </div>
    `;
    jobCard.addEventListener('click', () => displayJobDetails(job.id));
    return jobCard;
}

function renderJobListings(jobsToDisplay) {
    jobListingsContainer.innerHTML = '';
    if (jobsToDisplay.length === 0) {
        jobListingsContainer.innerHTML = '<p class="message-box active">No jobs found matching your criteria.</p>';
        return;
    }
    jobsToDisplay.forEach(job => {
        const jobCard = createJobCard(job);
        jobListingsContainer.appendChild(jobCard);
    });
}

function displayMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message-box active';
    element.classList.add(type + '-message');
    setTimeout(() => {
        element.classList.remove('active');
        element.textContent = '';
        element.className = 'message-box';
    }, 5000);
}

async function fetchJobs() {
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jobs = await response.json();
        allJobs = jobs;
        renderJobListings(allJobs);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        return jobs;
    } catch (error) {
        displayMessage(jobListingsContainer, 'Failed to load jobs. Please try again later.', 'error');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        throw error;
    }
}

async function displayJobDetails(jobId) {
    showSection('job-details-section');
    jobDetailContent.innerHTML = '<p class="text-center">Loading job details...</p>';
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const job = await response.json();
        const companyLogoDetail = job.companyLogo ? `<img src="${job.companyLogo}" alt="${job.companyName} logo" class="company-logo-detail">` : '';
        jobDetailContent.innerHTML = `
            <div class="job-detail-header">
                ${companyLogoDetail}
                <h2>${job.jobTitle}</h2>
                <p class="company-name-detail">at ${job.companyName}</p>
            </div>
            <p><span class="detail-label">Location:</span> ${job.jobGeo}</p>
            <p><span class="detail-label">Job Type:</span> ${job.jobType || 'N/A'}</p>
            <p><span class="detail-label">Job Level:</span> ${job.jobLevel || 'N/A'}</p>
            <p><span class="detail-label">Skills:</span> ${job.jobIndustry && job.jobIndustry.length > 0 ? job.jobIndustry.join(', ') : 'N/A'}</p>
            <p><span class="detail-label">Salary:</span> ${job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax} ${job.salaryCurrency || 'USD'} (${job.salaryPeriod || 'yearly'})` : 'Negotiable'}</p>
            <p><span class="detail-label">Posted On:</span> ${new Date(job.pubDate).toLocaleDateString()}</p>
            <h3>Job Description:</h3>
            <div class="job-description-content">${job.jobDescription}</div>
            ${job.url ? `<a href="${job.url}" target="_blank" class="apply-button">Apply Now</a>` : ''}
        `;
    } catch (error) {
        jobDetailContent.innerHTML = '<p class="message-box error-message active text-center">Failed to load job details.</p>';
    }
}

async function handleJobPost(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const newId = (allJobs.length > 0 ? Math.max(...allJobs.map(job => parseInt(job.id))) + 1 : 1).toString();
    
    const newJob = {
        id: newId,
        jobTitle: formData.get('jobTitle').trim(),
        companyName: formData.get('companyName').trim(),
        companyLogo: 'https://placehold.co/100x40/D3D3D3/000000?text=NewLogo',
        jobGeo: "Remote",
        jobExcerpt: formData.get('jobExcerpt').trim(),
        jobDescription: formData.get('jobDescription').trim(),
        jobIndustry: formData.get('jobIndustry').split(',').map(skill => skill.trim()).filter(skill => skill),
        jobType: "full-time",
        jobLevel: formData.get('jobLevel'),
        salaryMin: parseInt(formData.get('salaryMin')) || null,
        salaryMax: parseInt(formData.get('salaryMax')) || null,
        salaryCurrency: formData.get('salaryCurrency').trim() || 'USD',
        salaryPeriod: formData.get('salaryPeriod'),
        pubDate: new Date().toISOString(),
        url: formData.get('applicationUrl').trim() || null
    };
    
    if (!newJob.jobTitle || !newJob.companyName || !newJob.jobExcerpt || !newJob.jobDescription) {
        displayMessage(postJobMessage, 'Please fill in all required fields.', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newJob)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        displayMessage(postJobMessage, 'Job posted successfully!', 'success');
        form.reset();
        allJobs.push(newJob);
        fetchJobs();
    } catch (error) {
        displayMessage(postJobMessage, 'Error posting job. Please try again.', 'error');
    }
}

// Event Listeners
if (navPostJobButton) {
    navPostJobButton.addEventListener('click', () => {
        showSection('post-job-section');
        if (jobPostForm) jobPostForm.reset();
        if (postJobMessage) {
            postJobMessage.classList.remove('active', 'success-message', 'error-message');
            postJobMessage.textContent = '';
        }
    });
}

if (backToJobsBtn) {
    backToJobsBtn.addEventListener('click', () => showSection('job-listings-section'));
}

if (skillFilter) {
    skillFilter.addEventListener('change', () => {
        const selectedSkill = skillFilter.value;
        if (!selectedSkill) {
            renderJobListings(allJobs);
        } else {
            const filteredJobs = allJobs.filter(job => 
                job.jobIndustry && job.jobIndustry.some(skill => 
                    skill.toLowerCase().includes(selectedSkill.toLowerCase())
                )
            );
            renderJobListings(filteredJobs);
        }
    });
}

if (jobPostForm) {
    jobPostForm.addEventListener('submit', handleJobPost);
}

// Skill clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('skill-item') || e.target.closest('.skill-item')) {
        const skillItem = e.target.classList.contains('skill-item') ? e.target : e.target.closest('.skill-item');
        const skill = skillItem.dataset.skill;
        
        showSection('job-listings-section');
        if (skillFilter) skillFilter.value = skill;
        
        const filteredJobs = allJobs.filter(job => 
            job.jobIndustry && job.jobIndustry.some(jobSkill => 
                jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
        );
        
        jobListingsContainer.innerHTML = `<h3>Jobs requiring ${skill}:</h3>`;
        filteredJobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobListingsContainer.appendChild(jobCard);
        });
        
        if (filteredJobs.length > 0) {
            const companiesHeader = document.createElement('h3');
            companiesHeader.textContent = `Companies looking for ${skill}:`;
            companiesHeader.style.marginTop = '2rem';
            jobListingsContainer.appendChild(companiesHeader);
            
            filteredJobs.forEach(job => {
                const companyCard = document.createElement('div');
                companyCard.className = 'job-card company-card';
                companyCard.innerHTML = `
                    <div class="text-center">
                        <img src="${job.companyLogo}" alt="${job.companyName}" class="company-logo mb-3">
                        <h4>${job.companyName}</h4>
                        <p>Hiring for ${job.jobTitle}</p>
                        <div class="skills-tags">
                            ${job.jobIndustry.map(s => `<span class="badge badge-skill">${s}</span>`).join(' ')}
                        </div>
                        ${job.url ? `<a href="${job.url}" target="_blank" class="btn btn-primary btn-sm">View Job</a>` : ''}
                    </div>
                `;
                jobListingsContainer.appendChild(companyCard);
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();
});