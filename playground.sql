\c nc_news_test

SELECT * FROM articles;
SELECT * FROM comments;
SELECT * FROM users;
SELECT * FROM topics;

<<<<<<< HEAD
SELECT articles.article_id,title,topic,articles.author,articles.created_at,articles.votes,article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;
=======
SELECT article_id,title,topic,author,created_at,votes,article_img_url FROM articles ORDER BY created_at DESC;

--  SELECT article_id AS articles_article_id,
--   FROM articles 
--   LEFT JOIN comments 
--   ON articles_article_id = article_id 
--   ORDER BY created_at DESC;
-- need a COUNT
SELECT articles.article_id,title,topic,articles.author,articles.created_at,articles.votes,article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;

-- SELECT
--     articles.article_id,
--     articles.title,
--     articles.created_at,
--     articles.votes,
--     articles.article_img_url,
--     articles.topic,
--     articles.author,
--     COUNT(comments.comment_id) AS comment_count
--     FROM articles
--     LEFT JOIN comments ON articles.article_id = comments.article_id
--     GROUP BY articles.article_id
--     ORDER BY articles.created_at DESC
>>>>>>> main
