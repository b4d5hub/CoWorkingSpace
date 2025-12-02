import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Calendar,
  MapPin,
  Users,
  Wifi,
  Monitor,
  Coffee,
  Video,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Building2,
  ChevronDown,
  Play,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

type HomepageProps = {
  onGetStarted: () => void;
  onNavigateToLocation: (location: string) => void;
  isLoggedIn?: boolean;
};

export function Homepage({ onGetStarted, onNavigateToLocation, isLoggedIn = false }: HomepageProps) {
  const locationsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const roomTypesRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <Building2 className="w-5 h-5 text-foreground" />
              <span className="text-foreground">CoWorkingSpace</span>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => scrollToSection(featuresRef)}
                className="text-foreground hover:text-foreground/70"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection(locationsRef)}
                className="text-foreground hover:text-foreground/70"
              >
                Locations
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection(roomTypesRef)}
                className="text-foreground hover:text-foreground/70"
              >
                Rooms
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection(faqRef)}
                className="text-foreground hover:text-foreground/70"
              >
                FAQ
              </Button>
            </nav>

            {/* CTA Button */}
            <Button
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-0"
            >
              {isLoggedIn ? 'Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-foreground mb-6 max-w-4xl mx-auto text-5xl font-bold">
              Connect and Create in Our Vibrant Coworking Ecosystem
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Work alongside like-minded professionals in our dynamic coworking space.
              Whether you're dropping in for a hot desk or securing a space of your own.
            </p>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-full px-8"
            >
              Get a Price Quote
            </Button>
          </div>

          {/* Hero Image with circular mask effect */}
          <div className="relative max-w-5xl mx-auto">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1623679799634-841494762b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGludGVyaW9yfGVufDF8fHx8MTc2MjA5MTUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern co-working space"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="text-red-600 text-5xl">140K</div>
              <div>
                <p className="text-muted-foreground text-sm">Global members</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Growing network of professionals worldwide accessing premium workspaces
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-red-600 text-5xl">24/7</div>
              <div>
                <p className="text-muted-foreground text-sm">Access anytime</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Round-the-clock availability with instant booking confirmations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Solutions Section - Beige Background */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5EDE4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">
              Workspace Solutions for All Your Needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-foreground mb-2">Flexible Booking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Book by the hour, day, or month. Scale up or down based on your team's needs.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                  Learn more <ArrowRight className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-foreground mb-2">Premium Locations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Strategic locations across Morocco with modern amenities and inspiring environments.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                  Learn more <ArrowRight className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-foreground mb-2">Community Access</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join a vibrant community of entrepreneurs, freelancers, and innovators.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                  Learn more <ArrowRight className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Feature Card 4 */}
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-foreground mb-2">Professional Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Secure, reliable infrastructure with professional support staff available.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                  Learn more <ArrowRight className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>

            {/* Feature Card 5 */}
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-foreground mb-2">Fast & Simple</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Instant booking confirmations and real-time availability across all locations.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                  Learn more <ArrowRight className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>

            {/* Feature Card 6 */}
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center mb-4">
                  <Coffee className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-foreground mb-2">All-Inclusive Amenities</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  High-speed WiFi, coffee, printing, and meeting rooms included in every booking.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                  Learn more <ArrowRight className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Locations Gallery */}
      <section ref={locationsRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-foreground mb-4">We have buildings in Morocco</h2>
            <p className="text-muted-foreground text-lg">
              Quiet desks, warm light, and coffee in every corner.
            </p>
            <p className="text-muted-foreground">
              Book your fully equipped room and work in peace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location 1 - Agadir */}
            <div className="relative group cursor-pointer" onClick={() => onNavigateToLocation('Agadir')}>
              <div className="aspect-[4/5] overflow-hidden rounded-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1575886876763-10ea19d18fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYyMjAwMjQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Agadir location"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-foreground mb-1">Agadir</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>8 rooms</span>
                </div>
              </div>
            </div>

            {/* Location 2 - Marrakech */}
            <div className="relative group cursor-pointer" onClick={() => onNavigateToLocation('Marrakech')}>
              <div className="aspect-[4/5] overflow-hidden rounded-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1631248119882-c30225ac9904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwbWVldGluZyUyMHJvb218ZW58MXx8fHwxNzYyMjAwMjQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Marrakech location"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-foreground mb-1">Marrakech</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>12 rooms</span>
                </div>
              </div>
            </div>

            {/* Location 3 - Casablanca */}
            <div className="relative group cursor-pointer" onClick={() => onNavigateToLocation('Casablanca')}>
              <div className="aspect-[4/5] overflow-hidden rounded-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1636646931278-cf779e5acaac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBkZXNrJTIwc2V0dXB8ZW58MXx8fHwxNzYyMjAwMjQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Casablanca location"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-foreground mb-1">Casablanca</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>15 rooms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types Section - Dark Background */}
      <section ref={roomTypesRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a2332]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4">The right coworking for you</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Private Space Card */}
            <Card className="bg-white border-0">
              <CardContent className="p-8">
                <h3 className="text-foreground mb-6">Private Space</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Dedicated private office with lockable door
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Customizable space for your team (2-20 people)
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Premium furniture and high-speed internet included
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Access to meeting rooms and common areas
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      24/7 access with secure entry system
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={onGetStarted}
                  className="w-full bg-[#1a2332] hover:bg-[#1a2332]/90 text-white border-0"
                >
                  Book Private Space
                </Button>
              </CardContent>
            </Card>

            {/* Shared Desk Card */}
            <Card className="bg-white border-0">
              <CardContent className="p-8">
                <h3 className="text-foreground mb-6">Shared Desk</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Flexible hot-desking in vibrant open spaces
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Choose any available desk each day
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Network with diverse community of professionals
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Access to all shared amenities and lounges
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Most affordable coworking option
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={onGetStarted}
                  className="w-full bg-[#1a2332] hover:bg-[#1a2332]/90 text-white border-0"
                >
                  Book Shared Desk
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section - Light Beige Background */}
      <section ref={faqRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5EDE4]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">Find answers to questions about coworking</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white border-0 rounded-lg px-6">
              <AccordionTrigger className="text-foreground hover:no-underline">
                What is included in a coworking membership?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our coworking membership includes high-speed WiFi, unlimited coffee and tea, printing services,
                access to meeting rooms, 24/7 building access, and a vibrant community of professionals.
                All utilities and amenities are included in your monthly rate.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white border-0 rounded-lg px-6">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Can I book a room for just one day?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! We offer flexible booking options including hourly, daily, weekly, and monthly plans.
                You can book a private office or meeting room for as little as one hour or as long as you need.
                Perfect for remote workers, traveling professionals, or teams hosting meetings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white border-0 rounded-lg px-6">
              <AccordionTrigger className="text-foreground hover:no-underline">
                How does room availability work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our platform shows real-time availability across all locations. You can instantly see which rooms
                are available at your preferred time and location. Book online in seconds and receive immediate
                confirmation. Our distributed RMI architecture ensures accurate, up-to-date information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white border-0 rounded-lg px-6">
              <AccordionTrigger className="text-foreground hover:no-underline">
                What if I need to cancel my booking?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We understand plans change. You can cancel or modify your reservation through our platform.
                Cancellations made 24 hours before your booking receive a full refund. Last-minute cancellations
                may be subject to a fee. Contact our support team for assistance with any changes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white border-0 rounded-lg px-6">
              <AccordionTrigger className="text-foreground hover:no-underline">
                Are there different pricing options?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! We offer various pricing tiers: hourly rates for meeting rooms, daily passes for hot desks,
                monthly memberships for dedicated desks, and private office packages. Prices vary by location
                and room capacity. Volume discounts available for teams and long-term commitments.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* About/Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-foreground mb-4">
                Today's workforce and community are increasingly decentralized
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                We believe that work is an activity, not a place. Our coworking spaces are designed to support
                this new way of working, providing flexible environments that adapt to your needs.
              </p>
              <p className="text-muted-foreground mb-8">
                Whether you're a freelancer looking for a productive space, a startup team needing room to grow,
                or an enterprise seeking distributed office solutions, we have the right workspace for you.
              </p>
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-0"
              >
                Join Our Community
              </Button>
            </div>

            {/* Video/Image Placeholder */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1651608671719-fcccf959672f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcm9vbSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjIyMDAyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Coworking community"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
                  <Play className="w-6 h-6 text-foreground ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-foreground mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of professionals who have found their perfect workspace with us.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 px-12"
          >
            Book Your Space Now
          </Button>
        </div>
      </section>
    </div>
  );
}
