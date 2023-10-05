\c nc_news_test

SELECT * FROM articles;
SELECT * FROM comments;
SELECT * FROM users;
SELECT * FROM topics;

SELECT articles.article_id,title,topic,articles.author,articles.created_at,articles.votes,article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;
