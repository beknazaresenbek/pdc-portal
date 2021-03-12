const fs = require('fs');
const yaml = require('js-yaml');

var user_cfg = {}
try {
    let config_file = './config/pdc-portal.yml';
    console.log("Loading config: ", config_file);
    let fileContents = fs.readFileSync(config_file, 'utf8');
    user_cfg = yaml.load(fileContents);
} catch (e) {
    console.error("Error loading pdc-portal.yml: ", e);
    process.exit(1)
}

let config = {};

// Default values
config.title = "Packet Delivery Portal";
config.key = "";
config.crt = "";
config.id = "EU.EORI.NLPACKETDEL";
config.port = 7000;
config.url = "http://localhost:7000";
config.redirect_uri_path = "/openid_connect1.0/return";
config.acr_values = "urn:http://eidas.europa.eu/LoA/NotNotified/high";
config.cb_endpoint = "https://localhost/ngsi-ld/v1";
config.idp = {}

// Title
if (user_cfg.title) {
    config.title = user_cfg.title;
}

// Client data
if (user_cfg.client) {
    if (user_cfg.client.id) {
	config.id = user_cfg.client.id;
    }
    config.key = user_cfg.client.key;
    config.crt = user_cfg.client.crt;
}

// External access
if (user_cfg.external && user_cfg.external.host) {
    config.url = user_cfg.external.host;
}

// OIDC
if (user_cfg.oidc) {
    if (user_cfg.oidc.redirect_path) {
	config.redirect_uri_path = user_cfg.oidc.redirect_path;
    }
    if (user_cfg.oidc.acr) {
	config.acr_values = user_cfg.oidc.acr;
    }
}

// Context Broker
if (user_cfg.cb && user_cfg.cb.endpoint) {
    config.cb_endpoint = user_cfg.cb.endpoint;
}

// Web server
if (user_cfg.express && user_cfg.express.port) {
    config.port = user_cfg.express.port;
}

// Build external redirect URI
config.redirect_uri = config.url + config.redirect_uri_path;

// IDP
if (user_cfg.idp) {
    config.idp = user_cfg.idp;
}

module.exports = config;
