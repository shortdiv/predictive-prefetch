const moment = require('moment');

moment.locale('en');

module.exports = config => {
  config.addLayoutAlias('default', 'layouts/base.njk');

  config.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });

  config.addFilter('dateReadable', date => {
    return moment(date).format('LL'); // E.g. May 31, 2019
  });

  config.addShortcode('excerpt', article => extractExcerpt(article));

  config.addPassthroughCopy("./src/images");
  config.addPassthroughCopy("./src/styles");

  return {
    dir: {
      input: "src",
      output: "dist"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  }
};

//https://github.com/JonUK/eleventy-blog/blob/afe7120ffbf86008175698ec0acfe31ce4f60c23/.eleventy.js
function extractExcerpt(article) {
  if (!article.hasOwnProperty('templateContent')) {
    console.warn('Failed to extract excerpt: Document has no property "templateContent".');
    return null;
  }

  let excerpt = null;
  const content = article.templateContent;

  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
    { start: '<p>', end: '</p>' }
  ];

  separatorsList.some(separators => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.lastIndexOf(separators.end);

    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
      return true; // Exit out of array loop on first match
    }
  });

  return excerpt;
}