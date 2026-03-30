import { GraduationCap, Award, Users, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Kings Cornerstone International College
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering minds, transforming futures, and building global leaders since our inception
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 border-[#1E3A8A]">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-2">
                <Award className="w-6 h-6" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                To provide world-class education that nurtures intellectual curiosity, 
                critical thinking, and ethical leadership. We are committed to creating 
                an inclusive learning environment where every student can achieve their 
                full potential and contribute meaningfully to society.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#1E3A8A]">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-2">
                <Globe className="w-6 h-6" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                To be a globally recognized institution of higher learning, distinguished 
                by academic excellence, innovative research, and a commitment to developing 
                leaders who will shape the future. We envision a world where education 
                transcends boundaries and creates lasting positive change.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1E3A8A] text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-[#1E3A8A]" />
                </div>
                <h3 className="font-bold text-lg text-[#1E3A8A] mb-2">Excellence</h3>
                <p className="text-sm text-gray-600">
                  Striving for the highest standards in teaching, research, and student achievement
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#1E3A8A]" />
                </div>
                <h3 className="font-bold text-lg text-[#1E3A8A] mb-2">Integrity</h3>
                <p className="text-sm text-gray-600">
                  Upholding honesty, transparency, and ethical conduct in all our endeavors
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-[#1E3A8A]" />
                </div>
                <h3 className="font-bold text-lg text-[#1E3A8A] mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">
                  Embracing creativity and forward-thinking approaches to education
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#1E3A8A]" />
                </div>
                <h3 className="font-bold text-lg text-[#1E3A8A] mb-2">Diversity</h3>
                <p className="text-sm text-gray-600">
                  Celebrating and respecting diverse perspectives, backgrounds, and cultures
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* About KCIC */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-[#1E3A8A] mb-6">About KCIC</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Kings Cornerstone International College (KCIC) is a premier institution of higher 
              learning dedicated to academic excellence, research innovation, and the holistic 
              development of students. Our college brings together distinguished faculty, 
              cutting-edge facilities, and a diverse student body to create a vibrant learning 
              community.
            </p>
            <p>
              With programs spanning multiple disciplines including Computer Science, Business 
              Administration, Engineering, Health Sciences, and Liberal Arts, KCIC offers 
              comprehensive educational pathways that prepare students for successful careers 
              and meaningful contributions to society.
            </p>
            <p>
              Our academic blog platform represents our commitment to knowledge sharing and 
              intellectual discourse. Students are encouraged to publish their research findings, 
              insights, and scholarly work, fostering a culture of academic excellence and peer 
              learning. Each submission undergoes a rigorous review process by department heads, 
              ensuring the highest quality of academic content.
            </p>
            <p>
              At KCIC, we believe in the transformative power of education. Our state-of-the-art 
              facilities, dedicated faculty members, and comprehensive support services ensure 
              that every student has the resources they need to succeed academically, 
              professionally, and personally.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-[#1E3A8A] text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">KCIC By The Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">5,000+</div>
              <div className="text-blue-200">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">300+</div>
              <div className="text-blue-200">Faculty Members</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Degree Programs</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-200">Graduate Employment Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[#1E3A8A] text-center mb-12">Our Departments</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Computer Science</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Cutting-edge programs in AI, software engineering, cybersecurity, and data science
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Business Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive business education covering management, finance, marketing, and entrepreneurship
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Engineering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Innovative programs in mechanical, electrical, civil, and chemical engineering
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Health Sciences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                World-class education in nursing, public health, and medical sciences
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Liberal Arts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Diverse programs in humanities, social sciences, languages, and creative arts
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Natural Sciences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Research-focused programs in biology, chemistry, physics, and environmental science
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
