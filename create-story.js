// GitHub Configuration
const GITHUB_OWNER = 'Kabalikabalo';
const GITHUB_REPO = 'BourneToTranslate';
const GITHUB_BRANCH = 'main';

// Language configuration
const LANGUAGE_CONFIG = {
    spanish: {
        storiesDir: 'SpanishStories',
        catalogueFile: 'spanish-stories.html',
        useYearGroup: true,
        backLink: '../../spanish-stories.html'
    },
    french: {
        storiesDir: 'FrenchStories',
        catalogueFile: 'french-stories.html',
        useYearGroup: false,
        backLink: '../../french-stories.html'
    }
};

// Handle language selection change
document.getElementById('language').addEventListener('change', function() {
    const language = this.value;
    const yearGroupContainer = document.getElementById('yearGroupContainer');
    const difficultyContainer = document.getElementById('difficultyContainer');
    const yearGroupSelect = document.getElementById('yearGroup');
    const difficultySelect = document.getElementById('difficulty');

    if (language === 'spanish') {
        yearGroupContainer.style.display = 'block';
        difficultyContainer.style.display = 'none';
        yearGroupSelect.required = true;
        difficultySelect.required = false;
    } else if (language === 'french') {
        yearGroupContainer.style.display = 'none';
        difficultyContainer.style.display = 'block';
        yearGroupSelect.required = false;
        difficultySelect.required = true;
    } else {
        yearGroupContainer.style.display = 'none';
        difficultyContainer.style.display = 'none';
        yearGroupSelect.required = false;
        difficultySelect.required = false;
    }
});

// Parse story text into blocks
function parseStory(storyText) {
    const lines = storyText.split('\n').map(l => l.trim()).filter(l => l);
    const blocks = [];
    let firstImage = null;
    let i = 0;

    while (i < lines.length) {
        if (lines[i].startsWith('(') && lines[i].endsWith(')')) {
            const imgPath = lines[i].slice(1, -1).trim();
            if (!firstImage) {
                firstImage = imgPath;
            }
            blocks.push({ type: 'img', path: imgPath });
            i++;
        } else {
            const sentence = lines[i];
            const translation = (i + 1) < lines.length ? lines[i + 1] : '';
            blocks.push({ type: 'text', sentence, translation });
            i += 2;
        }
    }

    return { blocks, firstImage: firstImage || 'placeholder.png' };
}

// Generate story HTML
function generateStoryHTML(title, blocks, bannerImage, language) {
    const config = LANGUAGE_CONFIG[language];
    const navbarColor = language === 'spanish' ? '#DD1F25' : '#0055A4';
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="images/favicon.png">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        * { -webkit-tap-highlight-color: transparent; }
        body { 
            font-family: Georgia, 'Times New Roman', serif;
            background: #f5f5f5; 
            color: #2a2a2a;
            line-height: 1.8;
        }

        /* Navigation Bar */
        .navbar {
            background-color: ${navbarColor};
            height: 65px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .back-button {
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            padding: 8px 18px;
            border-radius: 6px;
            transition: all 0.3s ease;
            background-color: rgba(255, 255, 255, 0.1);
        }
        .back-button:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateX(-5px);
        }
        .back-arrow { font-size: 1.3rem; }

        /* Toggle Container */
        .toggle-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .toggle-label { color: white; font-size: 0.95rem; font-weight: 400; }
        .toggle-switch {
            position: relative;
            width: 55px;
            height: 28px;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 30px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .toggle-switch.active { background-color: rgba(255, 255, 255, 0.5); }
        .toggle-slider {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 22px;
            height: 22px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .toggle-switch.active .toggle-slider { transform: translateX(27px); }

        /* Hero Banner */
        .hero-banner {
            position: relative;
            width: 100%;
            height: 320px;
            background-image: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${bannerImage}');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 50px;
        }
        .story-title {
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
            font-size: 3.5rem;
            font-weight: 400;
            color: white;
            text-align: center;
            text-shadow: 0 4px 12px rgba(0,0,0,0.4);
            letter-spacing: 1px;
        }

        /* Story Content */
        .container { 
            max-width: 750px; 
            margin: 0 auto; 
            padding: 20px 30px 60px 30px; 
        }
        .story-block { 
            margin-bottom: 1.8em;
            position: relative;
        }
        .sentence { 
            font-size: 1.25rem;
            font-weight: 400;
            color: #1a1a1a;
            display: inline;
        }
        .translate-btn {
            display: inline-block;
            margin-left: 8px;
            font-size: 0.75rem;
            color: ${navbarColor};
            background: transparent;
            border: 1px solid ${navbarColor};
            padding: 2px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 500;
            opacity: 0.7;
        }
        .translate-btn:hover {
            opacity: 1;
            background: ${navbarColor};
            color: white;
        }
        .translation { 
            color: #666;
            font-size: 1.05rem;
            display: none;
            margin-top: 6px;
            font-style: italic;
            padding-left: 20px;
            border-left: 2px solid ${navbarColor};
        }
        .translation.show { display: block; }
        .story-image { 
            display: block; 
            margin: 3em auto; 
            max-width: 100%; 
            height: auto;
            border-radius: 8px; 
            box-shadow: 0 6px 24px rgba(0,0,0,0.12); 
        }

        @media (max-width: 768px) {
            .navbar { height: 60px; padding: 0 20px; }
            .hero-banner { height: 250px; }
            .story-title { font-size: 2.5rem; }
            .container { padding: 20px 20px 50px 20px; }
            .sentence { font-size: 1.15rem; }
        }
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <a href="${config.backLink}" class="back-button">
            <span class="back-arrow">←</span>
            <span>Back</span>
        </a>
        <div class="toggle-container">
            <span class="toggle-label">Show All Translations</span>
            <div class="toggle-switch" id="toggleSwitch" onclick="toggleAllTranslations()">
                <div class="toggle-slider"></div>
            </div>
        </div>
    </nav>

    <!-- Hero Banner with Story Title -->
    <div class="hero-banner">
        <h1 class="story-title">${title}</h1>
    </div>

    <!-- Story Content -->
    <div class="container">
`;

    let sentenceId = 0;
    blocks.forEach(block => {
        if (block.type === 'img') {
            html += `        <img src="${block.path}" class="story-image" alt="Story illustration" loading="lazy">\n`;
        } else {
            html += `        <div class="story-block">
            <span class="sentence">${block.sentence}</span>
            <button class="translate-btn" onclick="toggleTranslation(${sentenceId})">TRANSLATE</button>
            <div class="translation" id="trans-${sentenceId}">${block.translation}</div>
        </div>
`;
            sentenceId++;
        }
    });

    html += `    </div>

    <script>
        let allTranslationsVisible = false;

        function toggleTranslation(id) {
            const trans = document.getElementById('trans-' + id);
            trans.classList.toggle('show');
        }

        function toggleAllTranslations() {
            const toggle = document.getElementById('toggleSwitch');
            const translations = document.querySelectorAll('.translation');

            allTranslationsVisible = !allTranslationsVisible;
            toggle.classList.toggle('active');

            translations.forEach(translation => {
                if (allTranslationsVisible) {
                    translation.classList.add('show');
                } else {
                    translation.classList.remove('show');
                }
            });
        }
    </script>
</body>
</html>`;

    return html;
}

// GitHub API: Get the latest commit SHA for a branch
async function getLatestCommitSHA(token) {
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
        {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) {
        throw new Error('Failed to get latest commit');
    }

    const data = await response.json();
    return data.object.sha;
}

// GitHub API: Get the tree SHA from a commit
async function getTreeSHA(token, commitSHA) {
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${commitSHA}`,
        {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) {
        throw new Error('Failed to get tree');
    }

    const data = await response.json();
    return data.tree.sha;
}

// GitHub API: Create a blob (for file content)
async function createBlob(token, content, isBase64 = false) {
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`,
        {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content,
                encoding: isBase64 ? 'base64' : 'utf-8'
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create blob');
    }

    const data = await response.json();
    return data.sha;
}

// GitHub API: Create a new tree with multiple files
async function createTree(token, baseTreeSHA, files) {
    const tree = files.map(file => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: file.blobSHA
    }));

    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`,
        {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                base_tree: baseTreeSHA,
                tree: tree
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create tree');
    }

    const data = await response.json();
    return data.sha;
}

// GitHub API: Create a commit
async function createCommit(token, message, treeSHA, parentSHA) {
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`,
        {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                tree: treeSHA,
                parents: [parentSHA]
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create commit');
    }

    const data = await response.json();
    return data.sha;
}

// GitHub API: Update branch reference to point to new commit
async function updateBranchReference(token, commitSHA) {
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sha: commitSHA,
                force: false
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update branch');
    }

    return await response.json();
}

// Atomic commit: Create all files in one commit
async function createAtomicCommit(token, files, commitMessage) {
    showStatus('Getting latest repository state...', 'info');
    
    // Get the latest commit and tree
    const latestCommitSHA = await getLatestCommitSHA(token);
    const baseTreeSHA = await getTreeSHA(token, latestCommitSHA);

    showStatus(`Creating ${files.length} file blob(s)...`, 'info');
    
    // Create blobs for all files
    const filesWithBlobs = await Promise.all(
        files.map(async (file) => ({
            path: file.path,
            blobSHA: await createBlob(token, file.content, file.isBase64)
        }))
    );

    showStatus('Creating new tree...', 'info');
    
    // Create new tree with all files
    const newTreeSHA = await createTree(token, baseTreeSHA, filesWithBlobs);

    showStatus('Creating commit...', 'info');
    
    // Create commit
    const newCommitSHA = await createCommit(token, commitMessage, newTreeSHA, latestCommitSHA);

    showStatus('Updating branch...', 'info');
    
    // Update branch to point to new commit
    await updateBranchReference(token, newCommitSHA);

    return newCommitSHA;
}

// Get and update catalogue HTML content with new story
async function getUpdatedCatalogueHTML(token, language, title, intro, metadata, yearGroupOrDifficulty, firstImage) {
    const config = LANGUAGE_CONFIG[language];
    const filePath = config.catalogueFile;
    
    showStatus(`Reading ${filePath}...`, 'info');
    
    // Get current file
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
        {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}`);
    }

    const fileData = await response.json();
    const content = decodeURIComponent(escape(atob(fileData.content)));

    // Find stories array
    const storiesMatch = content.match(/const stories = \[(.*?)\];/s);
    if (!storiesMatch) {
        throw new Error(`Could not find stories array in ${filePath}`);
    }

    const storiesContent = storiesMatch[1];

    // Create new story entry based on language
    let newStory;
    if (config.useYearGroup) {
        // Spanish: uses yearGroup
        newStory = `,
        {
            title: "${title}",
            intro: "${intro}",
            image: "${config.storiesDir}/${title}/${firstImage}",
            url: "${config.storiesDir}/${title}/index.html",
            yearGroup: ${yearGroupOrDifficulty}${metadata ? `,
            metadata: "${metadata}"` : ''}
        }`;
    } else {
        // French: uses difficulty
        newStory = `,
        {
            title: "${title}",
            intro: "${intro}",
            image: "${config.storiesDir}/${title}/${firstImage}",
            url: "${config.storiesDir}/${title}/index.html",
            difficulty: ${yearGroupOrDifficulty}${metadata ? `,
            metadata: "${metadata}"` : ''}
        }`;
    }

    // Insert new story
    const updatedContent = content.replace(
        `const stories = [${storiesContent}];`,
        `const stories = [${storiesContent}${newStory}
    ];`
    );

    return updatedContent;
}

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Remove the data URL prefix to get just the base64 string
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Handle image upload preview
const imageUploadInput = document.getElementById('imageUpload');
const imagePreviewDiv = document.getElementById('imagePreview');
let uploadedImages = [];

imageUploadInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        // Check if already uploaded
        if (!uploadedImages.find(img => img.name === file.name)) {
            uploadedImages.push(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <button class="remove-btn" onclick="removeImage('${file.name}')" type="button">×</button>
                    <img src="${event.target.result}" alt="${file.name}">
                    <div class="filename">${file.name}</div>
                `;
                imagePreviewDiv.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        }
    });
});

// Remove image from upload list
function removeImage(filename) {
    uploadedImages = uploadedImages.filter(img => img.name !== filename);
    
    // Remove preview
    const previewItems = imagePreviewDiv.querySelectorAll('.image-preview-item');
    previewItems.forEach(item => {
        if (item.querySelector('.filename').textContent === filename) {
            item.remove();
        }
    });
}

// Make removeImage available globally
window.removeImage = removeImage;

// Prepare images for atomic commit
async function prepareImageFiles(language, storyTitle) {
    const uploadedCount = uploadedImages.length;
    
    if (uploadedCount === 0) {
        return [];
    }

    showStatus(`Preparing ${uploadedCount} image(s)...`, 'info');

    const config = LANGUAGE_CONFIG[language];
    const imageFilePromises = uploadedImages.map(async (file) => {
        const base64Content = await fileToBase64(file);
        return {
            path: `${config.storiesDir}/${storyTitle}/${file.name}`,
            content: base64Content,
            isBase64: true,
            name: file.name
        };
    });

    return await Promise.all(imageFilePromises);
}

// Main form submission handler
document.getElementById('storyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Creating story...';
        
        // Get form values
        const token = document.getElementById('githubToken').value.trim();
        const language = document.getElementById('language').value;
        const title = document.getElementById('storyTitle').value.trim();
        const intro = document.getElementById('storyIntro').value.trim();
        const metadata = document.getElementById('storyMetadata').value.trim();
        const storyText = document.getElementById('storyText').value.trim();

        // Get year group or difficulty based on language
        let yearGroupOrDifficulty;
        if (language === 'spanish') {
            yearGroupOrDifficulty = parseInt(document.getElementById('yearGroup').value);
        } else if (language === 'french') {
            yearGroupOrDifficulty = parseInt(document.getElementById('difficulty').value);
        }

        if (!token || !language || !title || !intro || !yearGroupOrDifficulty || !storyText) {
            throw new Error('Please fill in all required fields');
        }

        showStatus('Parsing story...', 'info');

        // Parse story
        const { blocks, firstImage } = parseStory(storyText);

        if (blocks.length === 0) {
            throw new Error('No valid story content found');
        }

        // Prepare image files
        const imageFiles = await prepareImageFiles(language, title);
        const uploadedImageNames = imageFiles.map(f => f.name);

        // Verify all images referenced in story are uploaded
        const referencedImages = blocks
            .filter(b => b.type === 'img')
            .map(b => b.path);
        
        const missingImages = referencedImages.filter(
            imgName => !uploadedImageNames.includes(imgName)
        );

        if (missingImages.length > 0) {
            throw new Error(
                `Missing images: ${missingImages.join(', ')}. Please upload all images referenced in your story.`
            );
        }

        // Generate story HTML
        const config = LANGUAGE_CONFIG[language];
        const storyHTML = generateStoryHTML(title, blocks, firstImage, language);
        const storyPath = `${config.storiesDir}/${title}/index.html`;

        // Get updated catalogue HTML
        const updatedCatalogueHTML = await getUpdatedCatalogueHTML(token, language, title, intro, metadata, yearGroupOrDifficulty, firstImage);

        // Prepare all files for atomic commit
        const allFiles = [
            // Story HTML file
            {
                path: storyPath,
                content: storyHTML,
                isBase64: false
            },
            // Updated catalogue
            {
                path: config.catalogueFile,
                content: updatedCatalogueHTML,
                isBase64: false
            },
            // All image files
            ...imageFiles
        ];

        // Create one atomic commit with all files
        const languageLabel = language.charAt(0).toUpperCase() + language.slice(1);
        const commitMessage = `Add ${languageLabel} story: ${title} (${imageFiles.length} image${imageFiles.length !== 1 ? 's' : ''})`;
        await createAtomicCommit(token, allFiles, commitMessage);

        showStatus(
            `✓ Story "${title}" created successfully!\n\n` +
            `Created ${allFiles.length} file(s) in one atomic commit:\n` +
            `- 1 story HTML\n` +
            `- 1 catalogue update\n` +
            `- ${imageFiles.length} image(s)\n\n` +
            `View at: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/${GITHUB_BRANCH}/${config.storiesDir}/${encodeURIComponent(title)}\n\n` +
            `Redirecting in 3 seconds...`,
            'success'
        );

        // Reset form and reload after delay
        setTimeout(() => {
            window.location.href = config.catalogueFile;
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        showStatus(`✗ Error: ${error.message}`, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Helper: Show required images based on story text
document.getElementById('storyText').addEventListener('input', (e) => {
    const text = e.target.value;
    const imageMatches = text.match(/\([^)]+\)/g);
    
    if (imageMatches && imageMatches.length > 0) {
        const images = imageMatches.map(match => match.slice(1, -1).trim());
        const helpText = document.querySelector('#storyText + .help-text');
        helpText.innerHTML = `Format: Spanish sentence, English translation, blank line, repeat. Use (image.png) for images.<br><strong style="color: #DD1F25;">Images needed: ${images.join(', ')}</strong>`;
    }
});
