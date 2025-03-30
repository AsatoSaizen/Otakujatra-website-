const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const photosPath = path.join(process.cwd(), '..', 'public', 'photos.json');
    
    let photosData = {};
    if (fs.existsSync(photosPath)) {
      photosData = JSON.parse(fs.readFileSync(photosPath, 'utf8'));
    } else {
      photosData = {
        "event1": [
          "https://via.placeholder.com/400x400/FF2D74/FFFFFF?text=Event+1",
          "https://via.placeholder.com/400x400/FF2D74/FFFFFF?text=Event+2"
        ],
        "event2": [
          "https://via.placeholder.com/400x400/03a9f4/FFFFFF?text=Cosplay+1",
          "https://via.placeholder.com/400x400/03a9f4/FFFFFF?text=Cosplay+2"
        ]
      };
      fs.writeFileSync(photosPath, JSON.stringify(photosData, null, 2));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(photosData)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load photos' })
    };
  }
};