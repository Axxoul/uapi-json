const airServiceInternal = require('./AirServiceInternal');
const moment = require('moment');

module.exports = (settings) => {
  const { auth, debug, production } = settings;
  return {
    shop(options) {
      const AirService = airServiceInternal(auth, debug, production);
      return AirService.searchLowFares(options);
    },

    toQueue(options) {
      const AirService = airServiceInternal(auth, debug, production);
      return AirService.gdsQueue(options);
    },

    book(options) {
      const AirService = airServiceInternal(auth, debug, production);
      return AirService.airPricePricingSolutionXML(options).then(data => {
        const bookingParams = Object.assign({}, {
          passengers: options.passengers,
          rule: options.rule,
          ticketingPcc: auth.pcc.toUpperCase(),
          ticketDate: moment().add(1, 'day').format(),
          ActionStatusType: 'TAW',
        }, data);
        return AirService.createReservation(bookingParams);
      });
    },

    importPNR(options) {
      const AirService = airServiceInternal(auth, debug, production);
      return AirService.importPNR(options);
    },

    ticket(options) {
      const AirService = airServiceInternal(auth, debug, production);
      return AirService.importPNR(options).then(data => {
        const ticketParams = Object.assign({}, options, {
          ReservationLocator: data[0].uapi_pnr_locator,
        });
        return AirService.ticket(ticketParams);
      });
    },
  };
};
