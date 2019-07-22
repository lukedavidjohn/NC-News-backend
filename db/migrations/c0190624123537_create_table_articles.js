exports.up = function(knex, Promise) {
  // console.log('creating articles table...');
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    // .foreign("article_id")
    // .inTable("comments")
    // .onDelete("CASCADE");
    articlesTable.string("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable
      .string("topic")
      .references("topics.slug")
      .notNullable();
    articlesTable
      .string("author")
      .references("users.username")
      .notNullable();
    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  // console.log('removing articles table...');
  return knex.schema.dropTable("articles");
};
