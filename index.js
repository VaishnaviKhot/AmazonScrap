import axios from 'axios';
import cheerio from 'cheerio';
import express from 'express';

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/scrape', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.amazon.in/s?bbn=1968542031&rh=n%3A1571271031%2Cn%3A1953602031%2Cn%3A11400137031%2Cn%3A1968542031%2Cn%3A1968543031&dc&qid=1696588174&rnid=1968542031&ref=lp_1968542031_nr_n_0'
    );

    const htmlData = response.data;
    const $ = cheerio.load(htmlData);
    const articles = [];

    $('.a-list-item').each((index, element) => {
      const title = $(element)
        .children('.a-link-normal octopus-pc-asin-info-section')
        .text()
        .trim();
      const titlePrice = $(element)
        .children('.a-link-normal octopus-pc-asin-info-section')
        .attr('href');

      if (title && titlePrice) {
        articles.push({
          title,
          titlePrice,
        });
      }
    });

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping data.' });
  }
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
