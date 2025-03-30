const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const body = JSON.parse(event.body);
    const { albumId, photoIndex } = body;
    
    // Validate input
    if (!albumId || photoIndex === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input' })
      };
    }
    
    const photosPath = path.join(process.cwd(), '..', 'public', 'photos.json');
    
    // Check if file exists
    if (!fs.existsSync(photosPath)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No photos database found' })
      };
    }
    
    const photosData = JSON.parse(fs.readFileSync(photosPath, 'utf8'));
    
    // Check if album exists
    if (!photosData[albumId]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Album not found' })
      };
    }
    
    // Check if photo exists
    if (!photosData[albumId][photoIndex]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Photo not found' })
      };
    }
    
    // Remove photo
    photosData[albumId].splice(photoIndex, 1);
    
    // Save changes
    fs.writeFileSync(photosPath, JSON.stringify(photosData, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        albumId,
        remainingPhotos: photosData[albumId].length
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete photo' })
    };
  }
};