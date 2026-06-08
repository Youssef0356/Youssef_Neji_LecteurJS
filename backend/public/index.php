<?php

require_once __DIR__ . '/../config/database.php';

$uri    = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

if ($uri === '/api/songs' && $method === 'GET') {

    $stmt  = $pdo->query("SELECT id, title, filename FROM songs ORDER BY created_at DESC");
    $songs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($songs as &$song) {
        $song['url'] = '/uploads/music/' . $song['filename'];
    }

    header('Content-Type: application/json');
    echo json_encode($songs);
    exit;
}

if ($uri === '/api/songs/upload' && $method === 'POST') {

    header('Content-Type: application/json');

    if (empty($_FILES['file'])) {
        echo json_encode(['error' => 'No file sent']);
        exit;
    }

    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'Upload failed']);
        exit;
    }

    $filename = $_FILES['file']['name'];
    $title    = pathinfo($filename, PATHINFO_FILENAME);

    $dest = __DIR__ . '/uploads/music/' . $filename;
    move_uploaded_file($_FILES['file']['tmp_name'], $dest);

    $stmt = $pdo->prepare("INSERT INTO songs (title, filename) VALUES (?, ?)");
    $stmt->execute([$title, $filename]);
    $id = $pdo->lastInsertId();

    echo json_encode([
        'id'    => (int)$id,
        'title' => $title,
        'url'   => '/uploads/music/' . $filename
    ]);
    exit;
}

if ($uri === '/api/songs/delete' && $method === 'POST') {

    header('Content-Type: application/json');

    $id = $_POST['id'] ?? null;

    if (!$id) {
        echo json_encode(['error' => 'No song ID given']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT filename FROM songs WHERE id = ?");
    $stmt->execute([$id]);
    $song = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$song) {
        echo json_encode(['error' => 'Song not found']);
        exit;
    }

    $filepath = __DIR__ . '/uploads/music/' . $song['filename'];
    if (file_exists($filepath)) {
        unlink($filepath);
    }

    $stmt = $pdo->prepare("DELETE FROM songs WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
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

    <div id="upload-container">
        <h3>Upload a song</h3>
        <input type="file" id="fileInput" accept="audio/*">
        <button id="uploadBtn">Upload</button>
        <p id="uploadStatus"></p>
    </div>

    <div id="song-list">
        <h3>Playlist</h3>
        <ul id="playlist"></ul>
    </div>

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
