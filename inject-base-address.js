const fs = require('fs');
const Logger = require('./lib/utils/logger');
const logger = Logger.getLogger('info');

main()

function main() {
    const baseAddress = getBaseAddressFromEnvironmentVariable();
    logger.info(`found base address: ${baseAddress}`);

    const template = getConfigTemplate();
    const config = replaceBaseAddressInTemplate({ baseAddress, template });
    saveConfig(config);
}

function getBaseAddressFromEnvironmentVariable() {
    const baseAddress = process.env.LC_BASE;
    if (!baseAddress) {
        logger.error('missing environment variable LC_BASE');
        process.exit(-1);
    }
    return baseAddress;
}

function getConfigTemplate() {
    logger.info('load config template');
    return fs.readFileSync('datasets_config-template.json', 'utf8');
}

function replaceBaseAddressInTemplate({ baseAddress, template }) {
    logger.info(`replace {base_address} by ${baseAddress} in template`);
    return template.replace(/\{base_address\}/g, baseAddress);
}

function saveConfig(config) {
    logger.info(`save config`);
    fs.writeFileSync('datasets_config.json', config);
}
