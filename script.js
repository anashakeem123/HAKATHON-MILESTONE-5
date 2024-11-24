
var form = document.getElementById('resume-form');
var resumeDisplayElement = document.getElementById('resume-display');
var editButton;
var saveButton;
var shareButton;

// Handle form submission
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input values
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var education = document.getElementById('education').value.trim();
    var experience = document.getElementById('experience').value.trim();
    var skills = document.getElementById('skills').value.trim();
    var profilePicInput = document.getElementById('profilePic');

    // Basic validation
    if (!name || !email || !phone || !education || !experience || !skills) {
        alert("Please fill in all the fields.");
        return;
    }

    // Get profile picture (if uploaded)
    var profilePicURL = '';
    if (profilePicInput.files && profilePicInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            profilePicURL = e.target.result; // Store the image URL
            generateResume(name, email, phone, education, experience, skills, profilePicURL);
        };
        reader.readAsDataURL(profilePicInput.files[0]); // Read image file
    } else {
        // If no profile picture uploaded, call the function with an empty string
        generateResume(name, email, phone, education, experience, skills, profilePicURL);
    }
});

function generateResume(name, email, phone, education, experience, skills, profilePicURL) {
    // Generate resume HTML
    var resumeHTML = `
        <h2><b>Resume</b></h2>
        <h3>Personal Information</h3>
        ${profilePicURL ? `<img src="${profilePicURL}" alt="Profile Picture" style="width: 150px; height: 150px; border-radius: 50%;">` : ''}
        <p><b>Name:</b><span id="name-span" contenteditable="false">${name}</span></p>
        <p><b>Email:</b><span id="email-span" contenteditable="false">${email}</span></p>
        <p><b>Phone:</b><span id="phone-span" contenteditable="false">${phone}</span></p>

        <h3>Education</h3>
        <p id="education-span" contenteditable="false">${education}</p>

        <h3>Experience</h3>
        <p id="experience-span" contenteditable="false">${experience}</p>

        <h3>Skills</h3>
        <p id="skills-span" contenteditable="false">${skills}</p>

        <button id="edit-resume">Edit</button>
        <button id="save-resume" style="display: none;">Save</button>
        <button id="share-resume">Share Resume</button> <!-- Share Resume button -->
    `;

    // Display the resume
    if (resumeDisplayElement) {
        resumeDisplayElement.innerHTML = resumeHTML;
    } else {
        console.error('The resume display element is missing');
    }

    // Show the "Edit" button and handle editing
    editButton = document.getElementById('edit-resume');
    saveButton = document.getElementById('save-resume');
    shareButton = document.getElementById('share-resume'); // Add reference to share button

    editButton.style.display = 'block'; // Show "Edit" button
    saveButton.style.display = 'none'; // Hide "Save" button initially
    shareButton.style.display = 'block'; // Show the "Share" button

    editButton.addEventListener('click', function () {
        // Make resume editable
        document.querySelectorAll('[contenteditable="false"]').forEach(function (element) {
            element.contentEditable = "true"; // Make the content editable
        });
        editButton.style.display = 'none'; // Hide "Edit" button after clicking it
        saveButton.style.display = 'block'; // Show "Save" button
    });

    saveButton.addEventListener('click', function () {
        // Make the resume content non-editable after saving
        document.querySelectorAll('[contenteditable="true"]').forEach(function (element) {
            element.contentEditable = "false"; // Make the content non-editable
        });
        editButton.style.display = 'block'; // Show "Edit" button again
        saveButton.style.display = 'none'; // Hide "Save" button after saving
    });

    shareButton.addEventListener('click', function () {
        var resumeData = {
            name: name,
            email: email,
            phone: phone,
            education: education,
            experience: experience,
            skills: skills,
            profilePicURL: profilePicURL
        };
    
        // Convert resumeData to JSON and encode it in the URL
        var resumeDataURL = encodeURIComponent(JSON.stringify(resumeData));
    
        // Construct the shareable URL
        var shareURL = window.location.href.split('?')[0] + '?resume=' + resumeDataURL;
    
        // Create an alert box with "Copy" and "Download as PDF" buttons
        var alertMessage = `
            <p>Share this link to view the resume:</p>
            <input type="text" id="shareable-link" value="${shareURL}" readonly style="width: 100%; margin: 10px 0;">
            <button id="copy-link-btn">Copy Link</button>
            <button id="download-pdf-btn">Download as PDF</button> <!-- PDF Button -->
        `;
    
        // Display the alert
        var alertContainer = document.createElement('div');
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '50%';
        alertContainer.style.left = '50%';
        alertContainer.style.transform = 'translate(-50%, -50%)';
        alertContainer.style.padding = '20px';
        alertContainer.style.backgroundColor = 'white';
        alertContainer.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        alertContainer.style.borderRadius = '10px';
        alertContainer.style.textAlign = 'center';
        alertContainer.style.zIndex = '1000';
    
        alertContainer.innerHTML = alertMessage;
    
        document.body.appendChild(alertContainer);
    
        // Copy link functionality using Clipboard API
        document.getElementById('copy-link-btn').addEventListener('click', function () {
            navigator.clipboard.writeText(shareURL)
                .then(() => {
                    alertContainer.innerHTML = '<p>Link copied to clipboard!</p><button id="close-alert">OK</button>';
    
                    // Close the alert when "OK" is clicked
                    document.getElementById('close-alert').addEventListener('click', function () {
                        document.body.removeChild(alertContainer);
                    });
                })
                .catch(err => {
                    console.error('Failed to copy link:', err);
                    alert('Failed to copy the link. Please try manually copying it.');
                });
        });
    
        // Download resume as PDF functionality
        document.getElementById('download-pdf-btn').addEventListener('click', function () {
            const { jsPDF } = window.jspdf; // Import jsPDF
            const pdf = new jsPDF();
    
            // Add content to the PDF
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.text("Resume", 20, 20);
    
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
    
            // Add resume content
            pdf.text(`Name: ${resumeData.name}`, 20, 40);
            pdf.text(`Email: ${resumeData.email}`, 20, 50);
            pdf.text(`Phone: ${resumeData.phone}`, 20, 60);
            pdf.text(`Education: ${resumeData.education}`, 20, 70);
            pdf.text(`Experience: ${resumeData.experience}`, 20, 80);
            pdf.text(`Skills: ${resumeData.skills}`, 20, 90);
    
            // If profile picture exists, add it
            if (resumeData.profilePicURL) {
                var img = new Image();
                img.src = resumeData.profilePicURL;
                img.onload = function () {
                    pdf.addImage(img, "JPEG", 150, 40, 40, 40); // Add image to the PDF
                    pdf.save("Resume.pdf"); // Save the PDF
                };
            } else {
                // Save the PDF if no image is uploaded
                pdf.save("Resume.pdf");
            }
        });
    });
};


