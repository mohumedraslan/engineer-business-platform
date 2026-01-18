'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Database, Lock, Cookie, UserCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const sections = [
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: <Database className="w-5 h-5" />,
      content: `We collect information you provide directly to us, such as when you create an account, update your profile, or contact us. This includes your name, email address, professional information, and project details.`
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: <Eye className="w-5 h-5" />,
      content: `We use your information to provide, maintain, and improve our services, facilitate connections between engineers and business owners, process transactions, and communicate with you about our services.`
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: <UserCheck className="w-5 h-5" />,
      content: `We may share your information with other users as part of our platform functionality, with service providers who assist us, and when required by law. We never sell your personal information to third parties.`
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: <Lock className="w-5 h-5" />,
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.`
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: <Cookie className="w-5 h-5" />,
      content: `We use cookies and similar tracking technologies to collect and use personal information about you. You can control cookies through your browser settings, but disabling cookies may affect the functionality of our service.`
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: <Database className="w-5 h-5" />,
      content: `We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account at any time.`
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: <Shield className="w-5 h-5" />,
      content: `You have the right to access, update, or delete your personal information. You may also object to certain processing activities or request data portability. Contact us to exercise these rights.`
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      icon: <Mail className="w-5 h-5" />,
      content: `We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "last updated" date.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 animated-gradient opacity-5" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 30 }}
          animate={contentInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass border-border/50 hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {section.icon}
                    </div>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <Card className="glass border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Privacy Questions?</h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about this Privacy Policy or our data practices, we're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/terms">Terms of Service</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
