import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Calendar, User, Tag, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { getApprovedPosts, type BlogPost } from "../services/api";

export default function BlogList() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [dateSort, setDateSort] = useState("newest");
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const posts = await getApprovedPosts();
      setAllPosts(posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = useMemo(() => {
    return Array.from(new Set(allPosts.map(post => post.department)));
  }, [allPosts]);

  const authors = useMemo(() => {
    return Array.from(new Set(allPosts.map(post => post.author)));
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(post => post.department === departmentFilter);
    }

    // Author filter
    if (authorFilter) {
      filtered = filtered.filter(post => 
        post.author.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }

    // Topic filter
    if (topicFilter) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => tag.toLowerCase().includes(topicFilter.toLowerCase()))
      );
    }

    // Date sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [allPosts, searchQuery, departmentFilter, authorFilter, topicFilter, dateSort]);

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("all");
    setAuthorFilter("");
    setTopicFilter("");
    setDateSort("newest");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2">Academic Blogs</h1>
        <p className="text-gray-600">Explore research papers and articles from our community</p>
      </div>

      {/* Filters Section */}
      <Card className="mb-8 bg-gray-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-[#1E3A8A]"
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Department Filter */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Author Filter */}
            <Input
              placeholder="Filter by author..."
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            />

            {/* Topic Filter */}
            <Input
              placeholder="Filter by topic..."
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            />

            {/* Date Sort */}
            <Select value={dateSort} onValueChange={setDateSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-[#1E3A8A]">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
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
      ) : (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-gray-500 text-lg">No blogs found matching your filters.</p>
            <Button 
              onClick={clearFilters} 
              className="mt-4 bg-[#1E3A8A] hover:bg-blue-800"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}