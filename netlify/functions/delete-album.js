const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { albumId } = body;

    if (!albumId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input' })
      };
    }

    const photosPath = path.join(process.cwd(), '..', 'public', 'photos.json');
    let photosData = {};

    if (fs.existsSync(photosPath)) {
      photosData = JSON.parse(fs.readFileSync(photosPath, 'utf8'));
    }

    if (!photosData[albumId]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Album not found' })
      };
    }

    delete photosData[albumId];

    fs.writeFileSync(photosPath, JSON.stringify(photosData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, albumId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete album' })
    };
  }
};