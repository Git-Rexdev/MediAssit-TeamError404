document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    const specificDiseaseBtn = document.getElementById('specific-disease-btn');
    const generalHealthBtn = document.getElementById('general-health-btn');
    const specificDiseaseSection = document.getElementById('specific-disease-section');
    const generalHealthSection = document.getElementById('general-health-section');

    // Disease selection elements
    const diseaseCards = document.querySelectorAll('.disease-card');
    const inputSection = document.getElementById('input-forms');
    const diseaseForms = document.querySelectorAll('.disease-form');

    // File input elements
    const fileInputs = document.querySelectorAll('.file-input');

    // Maximum file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Allowed file types
    const ALLOWED_DATA_TYPES = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
    ];
    const ALLOWED_IMAGE_TYPES = [
        'image/jpeg',
        'image/png'
    ];

    // Navigation handling
    specificDiseaseBtn.addEventListener('click', () => {
        specificDiseaseBtn.classList.add('active');
        generalHealthBtn.classList.remove('active');
        specificDiseaseSection.classList.remove('hidden');
        generalHealthSection.classList.add('hidden');
    });

    generalHealthBtn.addEventListener('click', () => {
        generalHealthBtn.classList.add('active');
        specificDiseaseBtn.classList.remove('active');
        generalHealthSection.classList.remove('hidden');
        specificDiseaseSection.classList.add('hidden');
    });

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
            }
        });
    });

    // Validate file
    function validateFile(file, isImage = false) {
        const errors = [];

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            errors.push('File size exceeds 5MB limit');
        }

        // Check file type
        const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_DATA_TYPES;
        if (!allowedTypes.includes(file.type)) {
            errors.push(`Invalid file type. Allowed types: ${isImage ? 'JPG, PNG' : 'CSV, Excel'}`);
        }

        return errors;
    }

    // Show error message
    function showError(input, message) {
        const container = input.parentElement;
        const existingError = container.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc2626';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.textContent = message;

        container.appendChild(errorDiv);
    }

    // Clear error message
    function clearError(input) {
        const container = input.parentElement;
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // File input handling
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const fileInfo = e.target.parentElement.querySelector('.file-info');
            const file = e.target.files[0];
            
            if (file) {
                // Clear previous errors
                clearError(input);

                // Validate file
                const isImage = input.id === 'fracture-file';
                const errors = validateFile(file, isImage);

                if (errors.length > 0) {
                    // Show errors
                    showError(input, errors.join('. '));
                    // Reset file input
                    e.target.value = '';
                    fileInfo.textContent = 'No file chosen';
                    
                    if (isImage) {
                        const preview = document.getElementById('image-preview');
                        preview.classList.add('hidden');
                    }
                    return;
                }

                // Update file info
                fileInfo.textContent = `Selected: ${file.name}`;
                
                // Handle image preview for fracture detection
                if (isImage) {
                    const preview = document.getElementById('image-preview');
                    const previewImage = document.getElementById('preview-image');
                    
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
                }
            } else {
                fileInfo.textContent = 'No file chosen';
                clearError(input);
                
                if (input.id === 'fracture-file') {
                    const preview = document.getElementById('image-preview');
                    preview.classList.add('hidden');
                }
            }
        });
    });

    // Parse CSV/Excel file
    async function parseDataFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    // For CSV files
                    if (file.type === 'text/csv') {
                        const csv = e.target.result;
                        const lines = csv.split('\n');
                        const headers = lines[0].split(',');
                        const data = [];

                        for (let i = 1; i < lines.length; i++) {
                            const values = lines[i].split(',');
                            if (values.length === headers.length) {
                                const entry = {};
                                headers.forEach((header, index) => {
                                    entry[header.trim()] = values[index].trim();
                                });
                                data.push(entry);
                            }
                        }

                        resolve(data);
                    } else {
                        // For Excel files (basic parsing)
                        resolve([{ message: 'Excel parsing would be implemented here' }]);
                    }
                } catch (error) {
                    reject('Error parsing file');
                }
            };

            reader.onerror = () => reject('Error reading file');
            
            if (file.type === 'text/csv') {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    // Handle specific disease form submissions
    diseaseForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            const fileInput = form.querySelector('.file-input');
            
            try {
                if (fileInput && fileInput.files[0]) {
                    // Handle file submission
                    const file = fileInput.files[0];
                    
                    if (file.type.startsWith('image/')) {
                        // Handle image file
                        data.file = file;
                        data.type = 'image';
                    } else {
                        // Handle data file
                        const parsedData = await parseDataFile(file);
                        data.records = parsedData;
                        data.type = 'data';
                    }
                } else {
                    // Handle manual input
                    for (let [key, value] of formData.entries()) {
                        if (!key.includes('file')) {
                            data[key] = value;
                        }
                    }
                    data.type = 'manual';
                }

                // For demo purposes, log the data and show success message
                console.log('Form submitted:', data);
                alert('Assessment submitted successfully! This is a demo version.');
                
            } catch (error) {
                console.error('Submission error:', error);
                alert('Error processing the submission. Please try again.');
            }
        });
    });

    // Handle general health form submission
    const generalHealthForm = document.getElementById('general-health-form');
    generalHealthForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(generalHealthForm);
        const data = {
            basics: {},
            vitals: {},
            lifestyle: {},
            symptoms: []
        };

        // Process checkboxes separately
        const checkedSymptoms = generalHealthForm.querySelectorAll('input[name="symptoms"]:checked');
        checkedSymptoms.forEach(symptom => {
            data.symptoms.push(symptom.value);
        });

        // Process other form fields
        for (let [key, value] of formData.entries()) {
            if (key !== 'symptoms') {
                // Categorize the data
                if (['age', 'gender', 'weight', 'height'].includes(key)) {
                    data.basics[key] = value;
                } else if (['blood-pressure', 'heart-rate', 'temperature', 'oxygen'].includes(key)) {
                    data.vitals[key] = value;
                } else if (['smoking', 'alcohol', 'exercise', 'sleep'].includes(key)) {
                    data.lifestyle[key] = value;
                }
            }
        }

        // For now, just log the data
        console.log('General health form submitted:', data);
        alert('General health assessment submitted successfully! This is a demo version.');
    });
});