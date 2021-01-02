=== Roam Research Block ===
Contributors:      artpi
Tags:              block
Requires at least: 5.6.0
Tested up to:      5.6.0
Stable tag:        0.1.0
Requires PHP:      7.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Embed Roam Blocks in WordPress, just as you would in Roam Research.

== Description ==

This block let's you search and embed [Roam Research](https://roamresearch.com/) blocks inside WordPress block editor.
WordPress Block editor and Roam are a match made in heaven!

= The blocks are embedded =

Once you insert a block into your post, it stays connected to the source **Roam block**.
If you upload a new Roam export, all the blocks will update on your site. For example - if you have a few "evergreen" pages in Roam, you can embed them in WordPress as your "mind garden" and they will stay updated whenever you upload a new copy of your Roam graph.

If you delete a block in Roam and update Roam export in WordPress, the blocks you inserted will use a cached copy created at the time of writing the post for the first time.
So you don't have to worry about empty pages.

= WordPress embed functionality =

You can also paste links like `https://roamresearch.com/#/app/graph/page/ratars73` into a WordPress post and they will resolve into an embed of the block

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/roam-block` directory, or install the plugin through the WordPress plugins screen directly.
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

== Frequently Asked Questions ==


= What is Roam Research? =

Roam Research is a tool for networked thought - a note-taking tool that is block-based.
Since blocks are a conceptual unit of both Gutenberg and Roam - I created this plugin.

= Why do I have to manually upload the roam graph? =

Roam is still working in providing a proper API. Please harass @Conaw

= How do I upload the graph? =

- Click ( ... ) in the right-top corner of Roam
- Click Export All
- Choose `JSON`
- Unzip the file
- Insert "Roam Block" into Gutenberg in WordPress
- Click "Upload" in sidebar
- Choose the unzipped json
- Observe magic

== Screenshots ==

== Changelog ==

= 0.1.0 =
* Release
