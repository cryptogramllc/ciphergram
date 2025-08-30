// Schema markup for blog posts
function generateBlogSchema(post) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
        "author": {
            "@type": "Organization",
            "name": "Ciphergram",
            "url": "https://ciphergram.io"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Ciphergram",
            "logo": {
                "@type": "ImageObject",
                "url": "https://ciphergram.io/images/logo.png"
            }
        },
        "datePublished": new Date(parseInt(post.date)).toISOString(),
        "dateModified": new Date(parseInt(post.date)).toISOString(),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ciphergram.io/${post.link}`
        },
        "image": post.image || "https://ciphergram.io/images/og-image.jpg",
        "url": `https://ciphergram.io/${post.link}`,
        "articleSection": "Technology",
        "keywords": "cybersecurity, software development, IT consulting, AI, technology"
    };
}

module.exports = { generateBlogSchema }; 