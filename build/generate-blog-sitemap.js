const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS
AWS.config.update({ region: 'us-east-1' });
const docClient = new AWS.DynamoDB.DocumentClient();

async function generateBlogSitemap() {
    try {
        // Get all blog posts from DynamoDB
        const params = {
            TableName: 'blog_posts'
        };
        
        const data = await docClient.scan(params).promise();
        
        // Generate sitemap XML
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Add blog index page
        sitemap += '  <url>\n';
        sitemap += '    <loc>https://ciphergram.io/blog/</loc>\n';
        sitemap += '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n';
        sitemap += '    <changefreq>weekly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '  </url>\n';
        
        // Add individual blog posts
        data.Items.forEach(item => {
            if (item.link) {
                const date = new Date(parseInt(item.date));
                sitemap += '  <url>\n';
                sitemap += '    <loc>https://ciphergram.io/' + item.link + '</loc>\n';
                sitemap += '    <lastmod>' + date.toISOString().split('T')[0] + '</lastmod>\n';
                sitemap += '    <changefreq>monthly</changefreq>\n';
                sitemap += '    <priority>0.6</priority>\n';
                sitemap += '  </url>\n';
            }
        });
        
        sitemap += '</urlset>';
        
        // Write to file
        fs.writeFileSync('build/blog-sitemap.xml', sitemap);
        console.log('Blog sitemap generated successfully!');
        
    } catch (error) {
        console.error('Error generating blog sitemap:', error);
    }
}

generateBlogSitemap(); 