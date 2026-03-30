import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, Calendar, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { getApprovedPosts, getAnnouncements, type BlogPost, type Announcement } from "../services/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [approvedPosts, setApprovedPosts] = useState<BlogPost[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [posts, announcementsData] = await Promise.all([
        getApprovedPosts(),
        getAnnouncements()
      ]);
      setApprovedPosts(posts.slice(0, 3));
      setAnnouncements(announcementsData.slice(0, 2));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to KCIC Academic Portal
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover insightful articles, research papers, and academic discussions 
            from our talented students and faculty members.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-2 flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for blogs, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900"
              />
            </div>
            <Link to={`/blogs${searchQuery ? `?search=${searchQuery}` : ''}`}>
              <Button className="bg-[#1E3A8A] hover:bg-blue-800">
                Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Approved Posts */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1E3A8A] mb-2">Latest Approved Posts</h2>
          <p className="text-gray-600">Recent publications from our academic community</p>
        </div>

        {loading ? (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {approvedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#1E3A8A] line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Tag className="w-4 h-4" />
                        <span>{post.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-100 text-[#1E3A8A]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/blogs">
                <Button className="bg-[#1E3A8A] hover:bg-blue-800">
                  View All Blogs
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Announcements */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1E3A8A] mb-2">Announcements</h2>
            <p className="text-gray-600">Stay updated with the latest news and events</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1E3A8A]">
                    {announcement.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#1E3A8A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Academic Community</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Share your research, insights, and ideas with fellow students and faculty members.
          </p>
          <Link to="/login">
            <Button size="lg" variant="outline" className="bg-white text-[#1E3A8A] hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}