<?php

require_once __DIR__ . '/../config/database.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Fetch all songs
if ($uri === '/api/songs' && $method === 'GET') {
    $stmt = $pdo->query("SELECT id, title, filename FROM songs ORDER BY created_at DESC");
    $songs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $songs = array_map(function ($s) {
        $s['url'] = '/uploads/music/' . rawurlencode($s['filename']);
        return $s;
    }, $songs);
    header('Content-Type: application/json');
    echo json_encode($songs);
    exit;
}

// Upload a song
if ($uri === '/api/songs/upload' && $method === 'POST') {
    header('Content-Type: application/json');

    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file sent']);
        exit;
    }

    $error = $_FILES['file']['error'];
    if ($error !== UPLOAD_ERR_OK) {
        $messages = [
            UPLOAD_ERR_INI_SIZE => 'File too large (PHP limit)',
            UPLOAD_ERR_FORM_SIZE => 'File too large (form limit)',
            UPLOAD_ERR_PARTIAL => 'Partial upload',
            UPLOAD_ERR_NO_FILE => 'No file selected',
        ];
        http_response_code(400);
        echo json_encode(['error' => $messages[$error] ?? 'Upload failed']);
        exit;
    }

    $file = $_FILES['file'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $title = pathinfo($file['name'], PATHINFO_FILENAME);
    $filename = $title . '.' . $ext;
    $dest = __DIR__ . '/uploads/music/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        http_response_code(500);
        echo json_encode(['error' => 'Save failed']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO songs (title, filename) VALUES (?, ?)");
    $stmt->execute([$title, $filename]);

    echo json_encode([
        'title' => $title,
        'url' => '/uploads/music/' . rawurlencode($filename)
    ]);
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audio Player</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <h1>Audio Player</h1>

    <!-- Upload section -->
    <div id="upload-container">
        <h3>Upload a song</h3>
        <input type="file" id="fileInput" accept="audio/*">
        <button id="uploadBtn">Upload</button>
        <p id="uploadStatus"></p>
    </div>

    <!-- Song list -->
    <div id="song-list">
        <h3>Playlist</h3>
        <ul id="playlist"></ul>
    </div>

    <!-- Audio player -->
    <div id="player">
        <h2 id="playing-title">Now Playing</h2>
        <p id="title">No song selected</p>
        <audio id="audio"></audio>

        <div class="progress-container">
            <input type="range" id="progress" min="0" max="100" value="0">
        </div>

        <div class="controls">
            <button id="prev">Prev</button>
            <button id="play">Play/Pause</button>
            <button id="next">Next</button>
        </div>

        <div id="volume-container">
            <span>Vol:</span>
            <input type="range" id="volume" min="0" max="1" step="0.1" value="0.5">
        </div>
    </div>
</body>
</html>
