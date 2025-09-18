const PROXY_CONFIG = [
    {
      context: [
        "/api"
      ],
      target: "http://makri.kmgus.com/agencyqapi/",
      secure: false
    }
  ];
  
  module.exports = PROXY_CONFIG;
