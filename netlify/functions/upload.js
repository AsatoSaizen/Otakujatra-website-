const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { albumId, photos } = body;

    // Validate input
    if (!albumId || !photos || !Array.isArray(photos)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input' })
      };
    }

    const photosPath = path.join(process.cwd(), '..', 'public', 'photos.json');
    let photosData = {};

    // Load existing data or create new file
    if (fs.existsSync(photosPath)) {
      photosData = JSON.parse(fs.readFileSync(photosPath, 'utf8'));
    }

    // Initialize album if it doesn't exist
    if (!photosData[albumId]) {
      photosData[albumId] = [];
    }

    // Add new photos (store only URLs)
    const newPhotoUrls = photos.map(photo => photo.url);
    photosData[albumId] = [...photosData[albumId], ...newPhotoUrls];

    // Save back to file
    fs.writeFileSync(photosPath, JSON.stringify(photosData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        albumId, 
        addedCount: newPhotoUrls.length,
        totalPhotos: photosData[albumId].length 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to upload photos' })
    };
  }
};