1. Users
* username - string, primary
* avatar_url - string, not nullable
* name - string, not nullable

2. Topics
* slug - string, primary
* description - string, not nullable

3. Articles
* article_id - increment, primary
* title - string, not nullable
* body - text, not nullable
* votes - integer, default 0
* topic - string, refs topics.slug
* author - string, refs users.username
* created_at - timestamp (e.g. 2019-06-24 16:25:53.629092+01)

4. Comments

* comment_id - increment, primary
* author - string, refs users.username
* article_id - integer, refs articles.article_id
* votes - integer, default 0
* created_at - timestamp
* body - text