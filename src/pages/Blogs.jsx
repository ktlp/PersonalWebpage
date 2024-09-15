import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

function Blogs() {
  // This is a placeholder. In a real application, you'd fetch blog posts from an API or database
  const blogPosts = [
    { id: 1, title: "My First Blog Post", excerpt: "This is a short excerpt from my first blog post..." },
    { id: 2, title: "Learning React", excerpt: "Here's what I've learned about React so far..." },
    { id: 3, title: "Web Development Tips", excerpt: "Some useful tips for web development..." },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Blog</h1>
      {blogPosts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{post.excerpt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Blogs;