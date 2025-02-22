document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    const specificDiseaseBtn = document.getElementById('specific-disease-btn');
    const generalHealthBtn = document.getElementById('general-health-btn');
    const specificDiseaseSection = document.getElementById('specific-disease-section');

    // Disease selection elements
    const diseaseCards = document.querySelectorAll('.disease-card');
    const inputSection = document.getElementById('input-forms');
    const diseaseForms = document.querySelectorAll('.disease-form');

    // File input elements
    const fileInputs = document.querySelectorAll('.file-input');

    // Maximum file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Allowed file types
    const ALLOWED_IMAGE_TYPES = [
        'image/jpeg',
        'image/png'
    ];

    // Navigation handling
    if (specificDiseaseBtn && generalHealthBtn) {
        specificDiseaseBtn.addEventListener('click', () => {
            specificDiseaseBtn.classList.add('active');
            generalHealthBtn.classList.remove('active');
            specificDiseaseSection.classList.remove('hidden');
        });

        generalHealthBtn.addEventListener('click', () => {
            generalHealthBtn.classList.add('active');
            specificDiseaseBtn.classList.remove('active');
            specificDiseaseSection.classList.add('hidden');
        });
    }

    // Disease card selection
    diseaseCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            diseaseCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');

            // Show input section
            inputSection.classList.remove('hidden');

            // Hide all forms
            diseaseForms.forEach(form => form.classList.add('hidden'));

            // Show the selected disease form
            const diseaseType = card.getAttribute('data-disease');
            const selectedForm = document.getElementById(`${diseaseType}-form`);
            if (selectedForm) {
                selectedForm.classList.remove('hidden');
                // Scroll to the form
                selectedForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Validate file
    function validateFile(file) {
        const errors = [];

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            errors.push('File size exceeds 5MB limit');
        }

        // Check file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            errors.push('Invalid file type. Allowed types: JPG, PNG');
        }

        return errors;
    }

    // Show error message
    function showError(input, message) {
        const container = input.closest('.file-upload-container');
        const existingError = container.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        container.appendChild(errorDiv);
    }

    // Clear error message
    function clearError(input) {
        const container = input.closest('.file-upload-container');
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // Handle image preview
    function handleImagePreview(input, previewId, previewImageId) {
        const file = input.files[0];
        const preview = document.getElementById(previewId);
        const previewImage = document.getElementById(previewImageId);
        const fileInfo = input.parentElement.querySelector('.file-info');

        if (file) {
            // Validate file
            const errors = validateFile(file);
            if (errors.length > 0) {
                showError(input, errors.join('. '));
                input.value = '';
                fileInfo.textContent = 'No file chosen';
                preview.classList.add('hidden');
                return;
            }

            // Clear previous errors
            clearError(input);

            // Update file info
            fileInfo.textContent = `Selected: ${file.name}`;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                preview.classList.remove('hidden');
            };
            reader.onerror = () => {
                showError(input, 'Error reading file');
                preview.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            fileInfo.textContent = 'No file chosen';
            preview.classList.add('hidden');
            clearError(input);
        }
    }

    // Set up file input handlers
    const fracturefile = document.getElementById('fracture-file');
    if (fracturefile) {
        fracturefile.addEventListener('change', (e) => {
            handleImagePreview(e.target, 'fracture-preview', 'fracture-preview-image');
        });
    }

    const brainTumorFile = document.getElementById('brain-tumor-file');
    if (brainTumorFile) {
        brainTumorFile.addEventListener('change', (e) => {
            handleImagePreview(e.target, 'brain-tumor-preview', 'brain-tumor-preview-image');
        });
    }

    // Handle form submissions
    diseaseForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const diseaseType = form.id.replace('-form', '');
            
            try {
                // Validate required fields
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });

                if (!isValid) {
                    alert('Please fill in all required fields');
                    return;
                }

                // Here you would typically send the data to your backend
                console.log(`Processing ${diseaseType} assessment:`, Object.fromEntries(formData));
                
                // Show success message
                alert(`${diseaseType.replace('-', ' ')} assessment completed! This is a demo version.`);
                
            } catch (error) {
                console.error(`Error processing ${diseaseType} assessment:`, error);
                alert(`Error processing the ${diseaseType.replace('-', ' ')} assessment. Please try again.`);
            }
        });
    });
});