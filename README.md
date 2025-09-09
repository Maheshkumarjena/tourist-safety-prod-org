# Smart Tourist Safety Monitoring & Incident Response System (PWA)

A comprehensive Progressive Web Application (PWA) designed to enhance tourist safety and security through real-time monitoring, emergency response, and AI-powered threat detection.

## 🎯 Project Overview

The Smart Tourist Safety System is a technology-driven solution developed to enhance the safety and security of tourists, particularly in regions like Northeast India. The system leverages modern web technologies, AI, and blockchain concepts to provide real-time monitoring, rapid incident response, secure identity verification, and data privacy compliance.

## ✨ Key Features

### 🚨 Emergency Response
- **Panic Button**: One-touch SOS with 5-second countdown
- **Real-time Location Sharing**: GPS tracking with emergency services
- **Voice & Photo Evidence**: Record messages and capture photos during emergencies
- **Automatic Alerts**: Notify authorities and emergency contacts instantly

### 🛡️ Safety Monitoring
- **AI Safety Score**: Dynamic assessment based on location and behavior patterns
- **Geo-fence Alerts**: Warnings when entering restricted or high-risk areas
- **Real-time Tracking**: Optional location monitoring for family and authorities
- **Offline Mode**: Critical features work without internet connectivity

### 🔐 Digital Identity
- **Blockchain-Verified ID**: Secure digital tourist identification (QR Code)
- **KYC Integration**: Aadhaar/Passport verification for identity confirmation
- **Trip Management**: Itinerary tracking and validation

### 👮 Authority Dashboard
- **Real-time Monitoring**: Tourist clusters and safety heat maps
- **Incident Management**: Alert response and case tracking
- **Analytics**: Safety insights and reporting tools

### 🌐 Accessibility
- **Multi-language Support**: 10+ Indian languages plus English
- **Voice Interface**: Speech recognition for elderly/disabled users
- **Offline Capabilities**: Core features available without internet

## 🛠️ Technology Stack

### Frontend (PWA)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios with interceptors
- **Maps**: Google Maps API / Leaflet
- **Offline Storage**: IndexedDB (via Dexie)
- **PWA Features**: Service Workers, Web Push API, Background Sync
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

### Backend Integration
- **API Base**: RESTful services with JWT authentication
- **Real-time**: WebSocket connections for live updates
- **File Upload**: Multi-part form data for KYC and media
- **Push Notifications**: Web Push API integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Modern web browser with PWA support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-tourist-safety-pwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key_here
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:3000`

## 📱 PWA Features

### Installation
- **Add to Home Screen**: Install as native app on mobile/desktop
- **Offline Mode**: Core functionality available without internet
- **Background Sync**: Queue emergency alerts when offline
- **Push Notifications**: Real-time safety alerts and updates

### Performance
- **Service Worker**: Aggressive caching for instant loading
- **Code Splitting**: Lazy load components for faster initial render
- **Image Optimization**: Progressive loading and compression
- **Bundle Size**: Optimized for mobile networks

## 🎨 Design System

### Color Palette
- **Primary**: Government Blue (#4285f4) - Trust and authority
- **Secondary**: Teal (#14B8A6) - Safety and positive status
- **Emergency**: Red (#DC2626) - Critical alerts and panic states
- **Warning**: Amber (#F59E0B) - Caution and alerts
- **Success**: Green (#059669) - Confirmed safe states

### Typography
- **Font Family**: Inter (system fallback)
- **Responsive**: Mobile-first scaling
- **Accessibility**: WCAG AA compliant contrast ratios

### Components
All UI components follow the design system with semantic color tokens and consistent spacing.

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Secure API authentication
- **Biometric**: Fingerprint/Face ID support (where available)
- **Session Management**: Auto-logout and token refresh

### Privacy
- **Consent Management**: GDPR/DPDP Act compliance
- **Data Encryption**: End-to-end encryption for sensitive data
- **Location Privacy**: Opt-in tracking with granular controls

## 🌍 Multi-language Support

### Supported Languages
- English (en)
- Hindi (hi) - हिन्दी
- Bengali (bn) - বাংলা
- Telugu (te) - తెలుగు
- Marathi (mr) - मराठी
- Tamil (ta) - தமிழ்
- Gujarati (gu) - ગુજરાતી
- Kannada (kn) - ಕನ್ನಡ
- Malayalam (ml) - മലയാളം
- Punjabi (pa) - ਪੰਜਾਬੀ
- Assamese (as) - অসমীয়া

### Implementation
- **Dynamic Loading**: Language files loaded on demand
- **RTL Support**: Right-to-left text direction where needed
- **Voice Interface**: Speech recognition in selected languages

## 🚨 Emergency Features

### Panic Button
```typescript
// Activation Flow:
1. Long press (1 second) → Countdown starts
2. 5-second countdown → Cancel option available
3. Auto-send → Location + user data + media to authorities
4. Confirmation → Help dispatch notification
```

### Emergency Contacts
- **Government Services**: Police (100), Medical (108), Fire (101)
- **Tourism Helpline**: Ministry helpline (1363)
- **Personal Contacts**: User-defined emergency contacts
- **Auto-dial**: Direct calling from emergency interface

## 📊 Analytics & Monitoring

### User Metrics
- **Safety Score**: AI-computed risk assessment
- **Location History**: GPS tracking with consent
- **Alert Response**: Emergency response times
- **User Engagement**: Feature usage analytics

### Authority Dashboard
- **Real-time Map**: Tourist density and risk zones
- **Alert Management**: Incident tracking and resolution
- **Reporting**: Safety statistics and trends

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### PWA Audit
```bash
npm run audit:pwa
```

### Performance Testing
```bash
npm run test:performance
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### PWA Deployment Checklist
- [ ] HTTPS enabled
- [ ] Service worker registered
- [ ] Manifest.json configured
- [ ] Icons generated (192x192, 512x512)
- [ ] Lighthouse PWA score > 90
- [ ] Push notifications configured
- [ ] Offline functionality tested

### Hosting Platforms
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative with edge functions
- **Government Cloud**: For official deployment

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Submit pull request with detailed description

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## 📜 License

This project is developed for the Government of India - Ministry of Tourism. All rights reserved.

## 📞 Support

### Technical Support
- **Email**: tech-support@tourist-safety.gov.in
- **Phone**: 1800-XXX-XXXX (Toll-free)
- **Documentation**: [docs.tourist-safety.gov.in](https://docs.tourist-safety.gov.in)

### Emergency Contacts
- **Police**: 100
- **Medical Emergency**: 108
- **Tourist Helpline**: 1363

## 🔄 Version History

### v1.0.0 (Current)
- Initial PWA release
- Core emergency features
- Multi-language support
- Authority dashboard
- Offline capabilities

### Planned Features (v1.1.0)
- IoT device integration
- Advanced AI threat detection
- Blockchain identity verification
- Enhanced offline maps
- Video calling with authorities

---

**Built with ❤️ for Tourist Safety in India**

*This system is designed to protect and assist tourists while respecting privacy and ensuring data security. Always prioritize real emergency services (Police: 100, Medical: 108) in critical situations.*