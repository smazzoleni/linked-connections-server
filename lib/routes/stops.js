const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;
const util = require('util');
const express = require('express');
const fs = require('fs');
const request = require('request');
const router = express.Router();
var utils = require('../utils/utils');
const storage = utils.datasetsConfig.storage;
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const delijnStopNames = { "Antwerpen": 1, "Oost-Vlaanderen": 2, "Vlaams-Brabant": 3, "Limburg": 4, "West-Vlaanderen": 5 };

router.get('/delijn/:zone', async (req, res) => {
    let zone = req.params.zone;
    if (!fs.existsSync(storage + '/datasets/delijn/stops')) {
        await init();
    }

    let stops = JSON.parse(await readFile(storage + '/datasets/delijn/stops/' + delijnStopNames[zone] + '.jsonld', { encoding: 'utf8' }));
    res.json(stops);
});

async function init() {
    fs.mkdirSync(storage + '/datasets/delijn/stops');
    let zones = [1, 2, 3, 4, 5];

    await Promise.all(zones.map(async zone => {
        let jsonld = {
            "@context": {
                "name": "http://xmlns.com/foaf/0.1/name",
                "longitude": "http://www.w3.org/2003/01/geo/wgs84_pos#long",
                "latitude": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
                "alternative": "http://purl.org/dc/terms/alternative",
                "country": {
                    "@type": "@id",
                    "@id": "http://www.geonames.org/ontology#parentCountry"
                },
                "avgStopTimes": "http://semweb.mmlab.be/ns/stoptimes#avgStopTimes"
            },

            "@graph": []
        };

        let rawStops = (await getDelijnStopsByZone(zone)).haltes;
        for (let s in rawStops) {

            jsonld['@graph'].push({
                "@id": "https://data.delijn.be/stops/" + rawStops[s]['haltenummer'],
                "country": "http://sws.geonames.org/2802361",
                "latitude": rawStops[s]['geoCoordinaat']['latitude'],
                "longitude": rawStops[s]['geoCoordinaat']['longitude'],
                "name": rawStops[s]['omschrijving']
            });
        }

        await writeFile(storage + '/datasets/delijn/stops/' + zone + '.jsonld', JSON.stringify(jsonld), 'utf8');
    }));
}


function getDelijnStopsByZone(zone) {
    return new Promise((resolve, reject) => {
        let uri = 'https://api.delijn.be/DLKernOpenData/v1/beta/entiteiten/' + zone + '/haltes'

        let options = {
            url: uri,
            headers: { 'Ocp-Apim-Subscription-Key': '32654c63bee6428fab855c1e7027d156' }
        };

        request(options, (error, res, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}
module.exports = router;

