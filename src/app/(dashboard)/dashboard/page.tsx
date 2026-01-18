'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnimatedButton } from '@/components/ui/animated-button';
import { 
  Calendar, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Plus,
  Eye,
  Search,
  Settings,
  BarChart3,
  Target,
  Zap,
  Star,
  ArrowRight,
  Bell,
  Activity,
  DollarSign,
  Award,
  Code2,
  Building2,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock data for demonstration - in production this would come from your API
const mockUser = {
  name: "Alex Johnson",
  role: "engineer" as const, // or "business_owner"
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
};

const mockStats = {
  engineer: {
    totalProjects: 12,
    activeProjects: 3,
    completedProjects: 9,
    earnings: 45000,
    rating: 4.9,
    reviews: 127,
    pendingApplications: 5,
    upcomingInterviews: 2
  },
  business_owner: {
    totalProjects: 8,
    activeProjects: 2,
    pendingApplications: 15,
    totalSpent: 85000,
    avgRating: 4.7,
    completedHires: 6,
    upcomingInterviews: 3
  }
};

const mockRecentActivity = [
  { id: 1, type: "project_applied", title: "Applied to E-commerce Platform", time: "2 hours ago", status: "pending" },
  { id: 2, type: "interview_scheduled", title: "Interview with TechCorp", time: "1 day ago", status: "scheduled" },
  { id: 3, type: "project_completed", title: "Mobile App Development", time: "3 days ago", status: "completed" },
  { id: 4, type: "payment_received", title: "Payment for API Integration", time: "5 days ago", status: "completed" }
];

const mockProjects = [
  {
    id: 1,
    title: "E-commerce Mobile App",
    company: "TechStart Inc.",
    status: "in_progress",
    progress: 75,
    deadline: "2024-02-15",
    budget: "$15,000"
  },
  {
    id: 2,
    title: "AI Analytics Dashboard",
    company: "DataFlow Solutions",
    status: "pending",
    progress: 0,
    deadline: "2024-03-01",
    budget: "$25,000"
  },
  {
    id: 3,
    title: "Blockchain DeFi Platform",
    company: "CryptoVentures",
    status: "completed",
    progress: 100,
    deadline: "2024-01-20",
    budget: "$40,000"
  }
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user] = useState(mockUser);
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activityRef, activityInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentStats = user.role === 'engineer' ? mockStats.engineer : mockStats.business_owner;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_applied': return <FileText className="w-4 h-4" />;
      case 'interview_scheduled': return <Calendar className="w-4 h-4" />;
      case 'project_completed': return <CheckCircle className="w-4 h-4" />;
      case 'payment_received': return <DollarSign className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'scheduled': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-xl text-muted-foreground">
                Here's what's happening with your {user.role === 'business_owner' ? 'projects' : 'opportunities'} today.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-1">
                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {user.role === 'engineer' ? (
            <>
              <Card className="hover-lift glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Total Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">{currentStats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">Projects worked on</p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{currentStats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently working</p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">${currentStats.earnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{currentStats.rating}</div>
                  <p className="text-xs text-muted-foreground mt-1">{currentStats.reviews} reviews</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="hover-lift glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Total Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">{currentStats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">Projects posted</p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{currentStats.pendingApplications}</div>
                  <p className="text-xs text-muted-foreground mt-1">Pending review</p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">${currentStats.totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">On projects</p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{currentStats.avgRating}</div>
                  <p className="text-xs text-muted-foreground mt-1">Average rating</p>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          ref={activityRef}
          initial={{ opacity: 0, y: 30 }}
          animate={activityInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={activityInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Current Projects
              </CardTitle>
              <CardDescription>Your active project portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={activityInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{project.title}</h4>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{project.company}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress: {project.progress}%</span>
                      <span className="font-medium gradient-text">{project.budget}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get things done faster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnimatedButton animation="glow" className="h-auto p-6 flex-col space-y-2" asChild>
                  <Link href="/projects">
                    <Search className="w-6 h-6" />
                    <span className="font-medium">Browse Projects</span>
                  </Link>
                </AnimatedButton>
                
                <AnimatedButton animation="scale" className="h-auto p-6 flex-col space-y-2" asChild>
                  <Link href="/engineers">
                    <Users className="w-6 h-6" />
                    <span className="font-medium">Find Engineers</span>
                  </Link>
                </AnimatedButton>
                
                <AnimatedButton animation="bounce" className="h-auto p-6 flex-col space-y-2" asChild>
                  <Link href="/profile">
                    <Settings className="w-6 h-6" />
                    <span className="font-medium">Update Profile</span>
                  </Link>
                </AnimatedButton>
                
                <AnimatedButton animation="pulse" className="h-auto p-6 flex-col space-y-2" asChild>
                  <Link href="/contact">
                    <MessageSquare className="w-6 h-6" />
                    <span className="font-medium">Get Support</span>
                  </Link>
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
