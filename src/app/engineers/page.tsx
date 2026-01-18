'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Code2, 
  Users,
  Briefcase,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const engineers = [
  {
    id: 1,
    name: "Alex Chen",
    title: "Full Stack Developer",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 127,
    hourlyRate: "$85/hr",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    experience: "5+ years",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    description: "Experienced full-stack developer specializing in modern web applications with React and Node.js."
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "AI/ML Engineer",
    location: "New York, NY",
    rating: 5.0,
    reviews: 89,
    hourlyRate: "$120/hr",
    skills: ["Python", "TensorFlow", "PyTorch", "Docker"],
    experience: "7+ years",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    description: "AI/ML expert with deep learning expertise, helping businesses implement intelligent solutions."
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    title: "DevOps Engineer",
    location: "Austin, TX",
    rating: 4.8,
    reviews: 156,
    hourlyRate: "$95/hr",
    skills: ["Kubernetes", "AWS", "Terraform", "Jenkins"],
    experience: "6+ years",
    availability: "Busy",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "DevOps specialist focused on scalable infrastructure and CI/CD pipeline optimization."
  },
  {
    id: 4,
    name: "Emily Davis",
    title: "Mobile Developer",
    location: "Seattle, WA",
    rating: 4.9,
    reviews: 203,
    hourlyRate: "$90/hr",
    skills: ["React Native", "Swift", "Kotlin", "Firebase"],
    experience: "4+ years",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    description: "Mobile app developer creating beautiful, performant applications for iOS and Android."
  },
  {
    id: 5,
    name: "David Kim",
    title: "Blockchain Developer",
    location: "Remote",
    rating: 4.7,
    reviews: 74,
    hourlyRate: "$110/hr",
    skills: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts"],
    experience: "3+ years",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    description: "Blockchain developer specializing in DeFi applications and smart contract development."
  },
  {
    id: 6,
    name: "Lisa Wang",
    title: "UI/UX Designer & Developer",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviews: 145,
    hourlyRate: "$75/hr",
    skills: ["Figma", "React", "CSS", "Design Systems"],
    experience: "5+ years",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    description: "Designer-developer hybrid creating beautiful, user-centered digital experiences."
  }
];

const filters = [
  { label: "All", value: "all", active: true },
  { label: "Available", value: "available", active: false },
  { label: "Full Stack", value: "fullstack", active: false },
  { label: "Frontend", value: "frontend", active: false },
  { label: "Backend", value: "backend", active: false },
  { label: "Mobile", value: "mobile", active: false },
  { label: "DevOps", value: "devops", active: false }
];

export default function EngineersPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [filtersRef, filtersInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [engineersRef, engineersInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 animated-gradient opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                <Code2 className="w-4 h-4 mr-2" />
                Find Top Engineers
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              Discover Talented
              <span className="gradient-text block mt-2">Engineers</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with skilled engineers from around the world. Browse profiles, check ratings, 
              and find the perfect match for your next project.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    placeholder="Search by skills, location, or name..." 
                    className="pl-10 h-12 text-lg glass border-border/50"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Search
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section ref={filtersRef} className="py-8 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={filtersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Filter by:</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {engineers.length} engineers found
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={filtersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {filters.map((filter, index) => (
              <motion.div
                key={filter.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={filtersInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Badge 
                  variant={filter.active ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm hover:bg-primary/10 transition-colors ${
                    filter.active ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''
                  }`}
                >
                  {filter.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Engineers Grid */}
      <section ref={engineersRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {engineers.map((engineer, index) => (
              <motion.div
                key={engineer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={engineersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="hover-lift glass border-border/50 h-full">
                  <CardHeader className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="relative mx-auto mb-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-1">
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                          <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background ${
                        engineer.availability === 'Available' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    </motion.div>

                    <CardTitle className="text-xl">{engineer.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {engineer.title}
                    </CardDescription>

                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{engineer.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{engineer.rating} ({engineer.reviews})</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {engineer.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {engineer.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span>{engineer.experience}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className={engineer.availability === 'Available' ? 'text-green-600' : 'text-yellow-600'}>
                          {engineer.availability}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-lg font-bold gradient-text">
                        {engineer.hourlyRate}
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link href={`/engineers/${engineer.id}`}>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            View Profile
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" className="hover-lift">
              Load More Engineers
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
