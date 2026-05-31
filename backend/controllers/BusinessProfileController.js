const { listProfiles } = require('../services/businessProfiles');

class BusinessProfileController {
  index(req, res) {
    return res.json(listProfiles());
  }
}

module.exports = new BusinessProfileController();
