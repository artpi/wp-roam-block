This WordPress plugin lets you search and embed Roam Research blocks inside WordPress block editor.

WordPress Block editor and Roam are a match made in heaven - they both use blocks as their core concepts.
[A detailed walkthrough, including a video is published on deliber.at](https://deliber.at/wp-roam-block/)
## Why use WordPress if I have Roam?

Roam is fantastic for drafting, connecting, and downloading concepts from your brain. The way you would usually work is to build knowledge over time, connecting ideas to each other. But not all ideas are ready for distrubution.

- Some of them have parts that are ready to see the light of day
- Many others will evolve over time as your understanding of the underlying concepts does

WordPress on the other hand is the most popular tool for publishing on the market. You can ensure your content is presented in the best possible way on a variety of devices and to people who should see it.

Combining the two plays to each other's strengths.
Using WordPress with Roam is possible without this plugin as well, but is tedious:

- You have to copy-paste
- It makes it especially hard for evergreen content (AKA mind gardens). You have to remember to update them on your site periodically. This plugin fixes this.

## Feature rundown

#### The blocks are embedded

Once you insert a block into your post, it stays connected to the source **Roam block**.
If you upload a new Roam export, all the blocks will update on your site. For example - if you have a few "evergreen" pages in Roam, you can embed them in WordPress as your "mind garden" and they will stay updated whenever you upload a new copy of your Roam graph.

If you delete a block in Roam and update Roam export in WordPress, the blocks you inserted will use a cached copy created at the time of writing the post for the first time.
So you don't have to worry about empty pages.

### WordPress embed functionality

You can also paste links like `https://roamresearch.com/#/app/graph/page/ratars73` into a WordPress post and they will resolve into an embed of the block

### Cleans up your Roam markup

The block with strip `[[]]`. In the future I hope it will link them properly.

## How to start

[Find this plugin in your WordPress plugins section](https://wordpress.org/plugins/roam-block/), install it
1. Activate the plugin through the 'Plugins' screen in WordPress
1. Now you can use "Roam Block" in your posts in the block editor
1. The first time you use the block, you will have to upload your Roam Graph to WordPress.
    - Click ( ... ) in the right-top corner of Roam
    - Click Export All
    - Choose `JSON`
    - Unzip the file
    - Insert "Roam Block" into Gutenberg in WordPress
    - Click "Upload" in sidebar
    - Choose the unzipped json
    - Observe magic
1. Now you can search your Roam graph directly from the "Roam Block" block or paste embed URLs.

### Automatically updating your Roam Graph in WordPress

Roam does not have a REST API on the web you can hook into.
To easily automate using Roam, I have [built Roam Private API](https://deliber.at/roam/roam-api).
This tool runs an invisible browser and copies your Roam database, so it's unfortunately impossible to bundle as a WP plugin. You have to run it on a host that can run node and npm.

Here is how you could use it to keep your WP copy of the Roam Graph updated:

- Insert block to the post, open sidebar and copy "Secret Upload URL". Do not share this with anybody.
- Install Roam-Research-Private-API via `npm install -g roam-research-private-api`
- Running command `roam-api export ~/Desktop http://your-wordpress.com.wp-json/roam/upload-graph?token=secret_token.` will copy the Roam graph content and **upload it to your WordPress**. You can put that in cron for example.



