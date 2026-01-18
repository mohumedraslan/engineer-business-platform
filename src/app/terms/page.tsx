'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, FileText, Users, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileText className="w-5 h-5" />,
      content: `By accessing and using rabt, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: 'services',
      title: 'Use of Services',
      icon: <Users className="w-5 h-5" />,
      content: `rabt provides a platform connecting engineers with business owners for project collaboration. You may use our services for lawful purposes only. You agree not to use the service to conduct any business or activity that would violate any law.`
    },
    {
      id: 'accounts',
      title: 'User Accounts',
      icon: <Shield className="w-5 h-5" />,
      content: `You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.`
    },
    {
      id: 'content',
      title: 'User Content',
      icon: <FileText className="w-5 h-5" />,
      content: `You retain ownership of content you submit to rabt. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content in connection with the service.`
    },
    {
      id: 'payments',
      title: 'Payments and Fees',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `rabt may charge fees for certain services. All fees are non-refundable unless otherwise stated. You are responsible for paying all applicable taxes.`
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `We may terminate or suspend your account at any time for violations of these terms. You may terminate your account at any time by contacting us.`
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <Shield className="w-5 h-5" />,
      content: `rabt shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.`
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      icon: <FileText className="w-5 h-5" />,
      content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use constitutes acceptance of the modified terms.`
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
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our platform
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
                <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/privacy">Privacy Policy</Link>
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
