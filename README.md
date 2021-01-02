# Roam Research Block for WordPress

This block let's you search and embed Roam Research blocks inside WordPress block editor.
WordPress Block editor and Roam are a match made in heaven!

This WordPress plugin provides a "roam-block" Gutenberg block.
## Important features

#### The block are embedded

Once you insert a block into your post, it stays connected to the source **Roam block**.
If you upload a new Roam export, all the blocks will update on your site. For example - if you have a few "evergreen" pages in Roam, you can embed them in WordPress as your "mind garden" and they will stay updated whenever you upload a new copy of your Roam graph.

If you delete a block in Roam and update Roam export in WordPress, the blocks you inserted will use a cached copy created at the time of writing the post for the first time.
So you don't have to worry about empty pages.

### WordPress embed functionality

You can also paste links like `https://roamresearch.com/#/app/graph/page/ratars73` into a WordPress post and they will resolve into an embed of the block

### Why do I have to manually upload the roam graph?

Roam is still working in providing a proper API. Please harass @Conaw

#### How do I upload the graph?

- Click ( ... ) in the right-top corner of Roam
- Click Export All
- Choose `JSON`
- Unzip the file
- Insert "Roam Block" into Gutenberg in WordPress
- Click "Upload" in sidebar
- Choose the unzipped json
- Observe magic

