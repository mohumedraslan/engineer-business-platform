# Backend Implementation Prompts for rabt Platform

## Phase 1: Database & Authentication
1. **Database Schema Finalization**
   - Review and optimize existing RLS policies in fix-rls-policies.sql
   - Ensure all tables have proper indexes and constraints
   - Implement database migrations system

2. **Authentication Enhancement**
   - Set up email verification workflow
   - Implement password reset functionality
   - Add social login providers (Google, GitHub)
   - Configure session management and token refresh

## Phase 2: Core API Endpoints
3. **User Management API**
   - CRUD operations for user profiles
   - Role-based access control endpoints
   - User search and filtering capabilities

4. **Project Management API**
   - Create, read, update, delete projects
   - Project search with advanced filters
   - Project application management
   - Project status transitions

5. **Messaging System API**
   - Real-time chat between users
   - Message history and persistence
   - Notification system for new messages

## Phase 3: Business Logic & Integrations
6. **Payment Integration**
   - Stripe integration for subscription payments
   - Payment webhook handlers
   - Invoice generation and management

7. **File Upload Service**
   - AWS S3 or similar cloud storage integration
   - File type validation and size limits
   - Secure signed URLs for file access

8. **Email Service Integration**
   - Transactional email templates
   - Email queue system
   - Open/click tracking

## Phase 4: Performance & Monitoring
9. **Caching Strategy**
   - Redis integration for session storage
   - Query result caching
   - Cache invalidation strategies

10. **Monitoring & Logging**
    - Application performance monitoring
    - Error tracking and alerting
    - Usage analytics endpoints

## Phase 5: Deployment & DevOps
11. **Docker Configuration**
    - Multi-stage Dockerfile optimization
    - Docker Compose for local development
    - Production deployment configuration

12. **CI/CD Pipeline**
    - Automated testing and deployment
    - Environment configuration management
    - Database migration automation

## Phase 6: Security & Compliance
13. **Security Hardening**
    - Rate limiting implementation
    - SQL injection prevention
    - XSS and CSRF protection
    - Data encryption at rest and in transit

14. **Compliance Features**
    - GDPR compliance tools
    - Data export/delete functionality
    - Privacy policy enforcement

## Priority Order:
- High: 1, 2, 3, 4, 13
- Medium: 5, 6, 7, 8, 9
- Low: 10, 11, 12, 14

Each prompt should be addressed sequentially, with testing and documentation completed before moving to the next phase.