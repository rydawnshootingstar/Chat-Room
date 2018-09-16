var generateMessage = (from, text) => {
  return {
      from,
      text,
      createdAt: new Date().getTime()
  };
};

var generateLocationMessage = (lat, lng)=> {
  return {
      url: `https://www.google.com/maps?q=${lat},${lng}`,
      createdAt: new Date().getTime()
  }  ;
};

module.exports = {generateMessage, generateLocationMessage};