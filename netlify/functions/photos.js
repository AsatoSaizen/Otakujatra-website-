const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const photosPath = path.join(process.cwd(), '..', 'public', 'photos.json');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(path.dirname(photosPath))) {
      fs.mkdirSync(path.dirname(photosPath), { recursive: true });
    }
    
    // Return existing photos or create default structure
    if (fs.existsSync(photosPath)) {
      const photosData = JSON.parse(fs.readFileSync(photosPath, 'utf8'));
      return {
        statusCode: 200,
        body: JSON.stringify(photosData)
      };
    } else {
      const defaultData = {
        "event1": [
          "https://via.placeholder.com/400x400/FF2D74/FFFFFF?text=Event+1",
          "https://via.placeholder.com/400x400/FF2D74/FFFFFF?text=Event+2"
        ],
        "event2": [
          "https://via.placeholder.com/400x400/03a9f4/FFFFFF?text=Cosplay+1",
          "https://via.placeholder.com/400x400/03a9f4/FFFFFF?text=Cosplay+2"
        ]
      };
      fs.writeFileSync(photosPath, JSON.stringify(defaultData, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify(defaultData)
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load photos' })
    };
  }
};