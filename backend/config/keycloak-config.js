require('dotenv').config();

var keycloakConfig = {
    clientId: 'notes',
    bearerOnly: true,
    serverUrl: process.env.KC_HOST,
    realm: 'notes',
};

module.exports = {
    keycloakConfig,
};
