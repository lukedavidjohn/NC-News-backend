const { connection } = require("../../db/connection");

exports.checkArticleIdExists = article_id => {
  return connection("articles")
    .select("article_id")
    .where({ article_id });
};

exports.fetchArticles = (
  sort_column,
  sort_order,
  filter_author,
  filter_topic,
  limit_to,
  page
) => {
  if (
    sort_order === "asc" ||
    sort_order === "desc" ||
    sort_order === undefined
  ) {
    let offset = (page - 1) * limit_to;

    const a = connection("articles")
      .select("article_id")
      .where("topic", "like", filter_topic)
      .then(articles => {
        return articles.length;
      });

    const b = connection("articles")
      .select("articles.*")
      .count({ comment_count: "articles.article_id" })
      .where("articles.author", "like", filter_author)
      .andWhere("articles.topic", "like", filter_topic)
      .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_column || "articles.created_at", sort_order || "desc")
      .limit(limit_to)
      .offset(offset);

    return Promise.all([a, b]);
  } else {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
};

exports.postArticle = ({ title, body, topic, author }) => {
  return connection("articles")
    .insert({
      title,
      body,
      topic,
      author
    })
    .returning("*");
};

exports.fetchArticleById = ({ article_id }) => {
  return connection
    .select("articles.*")
    .count({ comment_count: "articles.article_id" })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .where({ "articles.article_id": article_id })
    .groupBy("articles.article_id");
};

exports.patchArticleById = (update_id, update_value) => {
  if (!update_value) {
    return connection("articles")
      .select("*")
      .where({ article_id: update_id });
  } else {
    return connection("articles")
      .where({ article_id: update_id })
      .increment({
        votes: update_value
      })
      .returning("*");
  }
};

exports.deleteArticleById = article_id => {
  return connection("articles")
    .where({ article_id })
    .del()
    .returning("*");
};
