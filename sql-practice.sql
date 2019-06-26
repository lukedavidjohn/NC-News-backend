\c nc_news_test;

UPDATE articles SET votes = 123 WHERE article_id = 1;
SELECT * FROM articles WHERE article_id = 1;