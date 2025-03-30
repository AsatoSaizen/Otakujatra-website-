const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { albumId, name } = body;

    if (!albumId || !name) {
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

    if (photosData[albumId]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Album already exists' })
      };
    }

    photosData[albumId] = [];

    fs.writeFileSync(photosPath, JSON.stringify(photosData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, albumId, name })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create album' })
    };
  }
};