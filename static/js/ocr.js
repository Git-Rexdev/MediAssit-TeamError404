document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const fileInput = document.getElementById('report-file');
    const preview = document.getElementById('report-preview');
    const previewImage = document.getElementById('preview-image');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');

    // Maximum file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Allowed file types
    const ALLOWED_IMAGE_TYPES = [
        'image/jpeg',
        'image/png'
    ];

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

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const fileInfo = e.target.parentElement.querySelector('.file-info');

        if (file) {
            // Validate file
            const errors = validateFile(file);
            if (errors.length > 0) {
                showError(fileInput, errors.join('. '));
                fileInput.value = '';
                fileInfo.textContent = 'No file chosen';
                preview.classList.add('hidden');
                return;
            }

            // Clear previous errors
            clearError(fileInput);

            // Update file info
            fileInfo.textContent = `Selected: ${file.name}`;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                preview.classList.remove('hidden');
            };
            reader.onerror = () => {
                showError(fileInput, 'Error reading file');
                preview.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            fileInfo.textContent = 'No file chosen';
            preview.classList.add('hidden');
            clearError(fileInput);
        }
    });

    // Mock analysis function
    function analyzeMockReport() {
        return {
            keyFindings: [
                'All major parameters within normal range',
                'Slight elevation in white blood cell count',
                'Optimal hemoglobin levels'
            ],
            abnormalValues: [
                { parameter: 'WBC', value: '11.5 x 10⁹/L', status: 'Slightly High' },
                { parameter: 'Platelets', value: '140 x 10⁹/L', status: 'Low Normal' }
            ],
            recommendations: [
                'Follow up with healthcare provider about elevated WBC count',
                'Maintain current healthy lifestyle',
                'Consider iron-rich diet to support platelet levels',
                'Schedule next blood test in 3 months'
            ]
        };
    }

    // Populate results
    function populateResults(results) {
        // Key Findings
        const keyFindings = document.getElementById('key-findings');
        keyFindings.innerHTML = results.keyFindings
            .map(finding => `<p>• ${finding}</p>`)
            .join('');

        // Abnormal Values
        const abnormalValues = document.getElementById('abnormal-values');
        abnormalValues.innerHTML = results.abnormalValues
            .map(value => `
                <div class="abnormal-value">
                    <p><strong>${value.parameter}:</strong> ${value.value}</p>
                    <p class="status">${value.status}</p>
                </div>
            `)
            .join('');

        // Recommendations
        const recommendations = document.getElementById('recommendations');
        recommendations.innerHTML = results.recommendations
            .map(rec => `<p>• ${rec}</p>`)
            .join('');
    }

    // Handle form submission
    analyzeBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Validate required fields
        const requiredFields = document.querySelectorAll('[required]');
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

        if (!fileInput.files[0]) {
            alert('Please upload a blood report image');
            return;
        }

        // Show loading state
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // Get mock results
            const results = analyzeMockReport();

            // Populate results
            populateResults(results);

            // Show results section
            resultsSection.classList.remove('hidden');

            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Reset button
            analyzeBtn.textContent = 'Analyze Report';
            analyzeBtn.disabled = false;
        }, 2000);
    });

    // Handle download button
    document.querySelector('.download-btn').addEventListener('click', () => {
        alert('Download functionality would be implemented here');
    });

    // Handle share button
    document.querySelector('.share-btn').addEventListener('click', () => {
        alert('Share functionality would be implemented here');
    });
});