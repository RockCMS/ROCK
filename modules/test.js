const fetch = require('node-fetch');
const querystring = require('querystring');

const URL = 'https://feeds.citibikenyc.com/stations/stations.json';

// Manages the requests to '/station'
### inService will be true for getInService and getNotInService
function getFetch(req, res, inService) {
#### Unused
  const params = {
    arguments: req.params,
    path: req.url
  };

  const search = req.params.searchstring;
  const pages = req.query.page;
  fetch(URL)
  .then(res => res.json())
  .then(jsoned => {
    const stations = [];
    const stationsToReturn = pages ? 20 * pages : jsoned.stationBeanList.length;
    let count = 0;

    for (let i = 0; i < jsoned.stationBeanList.length; i += 1) {\
      ### This will fire on every call
      if (jsoned.stationBeanList[i].statusValue === inService || !inService)  {
        if ( !search || search.toLowerCase() === jsoned.stationBeanList[i].stationName || 
            search.toLowerCase() === jsoned.stationBeanList[i].stAddress1.toLowerCase() ) {
          const newStation = {};
          newStation['Station Name'] = jsoned.stationBeanList[i].stationName;
          newStation['Station Address'] = jsoned.stationBeanList[i].stAddress1; 
          newStation['Bikes Available'] = jsoned.stationBeanList[i].availableBikes;
          newStation['Docks'] = jsoned.stationBeanList[i].totalDocks;
          stations.push(newStation);
          count += 1;
        } 
      }
      if (count === stationsToReturn) {
        break;
      }
    }

    if (stations.length) {
      res.send(stations);
    }
    else {
      res.send('No Data Found for the Search filter');
    }

    log('Data transmission completed', 'Ok', params);  
  })
  .catch(error => {
    log(error, 'Error', params);
  })
};

// Manages the requests to '/dockable'
function getFreeDocks(req, res) {
### unused
  const params = {
    arguments: req.params,
    path: req.url
  };

  fetch(URL)
  .then(res => res.json())
  .then(jsoned => {
    let output = {dockable: null,
                  message: null
           };
                
    for (let i = 0; i < jsoned.stationBeanList.length; i += 1) {
      if (jsoned.stationBeanList[i].id == req.params.stationid) {
        if (jsoned.stationBeanList[i].availableDocks >= req.params.bikestoreturn) {
          output.dockable = true;
          output.message = 'You can docks up to ' + jsoned.stationBeanList[i].availableDocks;
          break;
        } 
        else {
          output.dockable = false;
          ### could have pluralizing logic, but this def. works
          output.message = 'Sorry, only ' + jsoned.stationBeanList[i].availableDocks + ' docks available.';
        }
      }
    }

    ### Does not account for no stations exist
    if (!output.message) {
      output.dockable = false;
      output.message = 'Sorry, there is no station with id ' + req.params.stationid;
    }

    res.send(output)
    log('Data transmission completed', 'Ok', params);
  })
  ### could send 204/5xx on error
  .catch(error => {
    log(error, 'Error', params);
  })
}

### Maybe use constants for log type
// Manages log activity and errors of the API
function log(mssg, type, params) {
  const errorMessage = {
    level: type,
    Message: mssg,
    requestParameters: params,
    date: new Date()
  };
  console.log(errorMessage);
}

// Controllers for the server endpoints
module.exports = {

  getStations: (req, res) => {
    getFetch(req, res);
  },
### Maybe use constants for status
  getInService: (req, res) => {
    getFetch(req,res, 'In Service');
  },

  getNotService: (req, res) => {
    getFetch(req, res, 'Not In Service');
  },

  getDocks: (req, res) => {
    getFreeDocks(req, res);
  },

  noRoute: (req, res) => {
    log('Bad request. Route does not Exist.', 'Error');
    throw new Error('Bad request')
  }

}
