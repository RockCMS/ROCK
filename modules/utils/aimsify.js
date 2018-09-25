// AIMS image resizing.

const aimsify = (fullImage, flavor = '.today-front-large') => {
  if (typeof fullImage !== 'undefined') {
    const splitter = 'nbcnews.com/i/';
    const firstPart = fullImage.split(splitter);
    const extension = firstPart[1].substr(firstPart[1].length - 4);
    const mainFile = firstPart[1].split(extension);
    const fullAimsImage = firstPart[0] + 'nbcnews.com/j/' + mainFile[0] + flavor + extension;
    return fullAimsImage;
  }
  return false;
};

module.exports = aimsify;
