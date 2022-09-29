
const https = require('https');

function getTotalPageCount(url, callback) {
  https.get(url, response => {
    let data = '';

    response.on('data', chunk => data += chunk);

    response.on('end', () => {
      return callback(null, JSON.parse(data).total_pages);
    })
  }).on('error', err => {
    return callback(err, null);
  })
}

function getAggregatedResults(resultPagesUrls, callback) {
  let titles = [];
  let pagesRequested = 1;

  resultPagesUrls.forEach(url => {
    https.get(url, response => {
      let data = '';

      response.on('data', chunk => data += chunk);

      response.on('end', () => {
        const movies = JSON.parse(data).data;

        movies.forEach(movie => titles.push(movie.Title));

        if (pagesRequested === resultPagesUrls.length) {
          return callback(null, titles);
        }
        pagesRequested++;
      })
    }).on('error', err => {
      return callback(err, null);
    })
  })
}

function getMovieTitles(substr) {
  if (substr === '') return null

  const baseURL = 'https://jsonmock.hackerrank.com/api/moviesdata/search/?Title=spiderman&page=1';
  const url = `${baseURL}${substr}`;

  getTotalPageCount(url, (err, totalPages) => {
    if (err) {
      console.log('Error:', err);
    } else {
      const resultPagesUrls = [];
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        resultPagesUrls.push(`${url}&page=${pageNumber}`);
      }
      getAggregatedResults(resultPagesUrls, (err, titles) => {
        if (err) {
          console.log('Error:', err);
        } else {
          console.log("titles.sort(), :", titles.sort());
        }
      })
    }
  })
}

getMovieTitles('spiderman')
