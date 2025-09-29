"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AuroraText } from "@/components/ui/aurora-text";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Play } from "lucide-react";
import { testimonials, faqs, features, appleCardsData } from "@/constants/hero";

const Hero = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Create cards for Apple Cards Carousel
  const cards = appleCardsData.map((card, index) => (
    <Card
      key={index}
      card={{
        ...card,
        content: (
          <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-10 md:p-16 rounded-3xl mb-4 min-h-[600px]">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
                {card.category}
              </span>
              <h3 className="text-neutral-800 dark:text-neutral-100 text-2xl md:text-4xl font-bold mb-6">
                {card.title}
              </h3>
            </div>

            <div className="mb-8">
              <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl leading-relaxed max-w-4xl">
                {card.content}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={card.src}
                alt={card.title}
                height={600}
                width={800}
                className="w-full h-72 md:h-96 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        ),
      }}
      index={index}
    />
  ));

  return (
    <>
      <div className="relative w-full overflow-hidden">
        {/* Main Hero Section - 80% of screen */}
        <div className="relative z-10 h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Main Headline - Takes up 80% of the screen */}
              <div className="flex-1 flex items-center justify-center">
                <div className="space-y-8 max-w-7xl w-full">
                  <h1 className="text-6xl sm:text-7xl lg:text-[8rem] xl:text-[10rem] font-bold leading-[0.85] tracking-tight">
                    Transform Your
                    <br />
                    <AuroraText className="text-6xl sm:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold leading-[0.85]">
                      Project Management
                    </AuroraText>
                    <br />
                    Experience
                  </h1>
                </div>
              </div>

              {/* CTA Buttons - At the bottom */}
              <div className="pb-20">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="group"
                    onClick={scrollToFeatures}
                  >
                    <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Browse Features
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apple Cards Carousel Section - 80% Coverage */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
            {/* Header - 20% of section */}
            <div className="text-center mb-12 flex-shrink-0">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Powerful Project
                <AuroraText className="text-4xl sm:text-5xl lg:text-6xl font-bold ml-3">
                  Features
                </AuroraText>
              </h2>
              <p className="text-muted-foreground text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
                Discover how Zeera transforms project management with innovative
                tools designed for modern teams
              </p>
            </div>

            {/* Carousel - 80% of section */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-[95vw]">
                <Carousel items={cards} />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          id="features"
          className="relative z-10 py-32"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Essential
                <AuroraText className="text-3xl sm:text-4xl lg:text-5xl font-bold ml-3">
                  Scrum Features
                </AuroraText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the future of project management with advanced
                features designed for modern teams
              </p>
            </div>

            <HoverEffect items={features} />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="relative z-10 py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  Frequently Asked
                  <AuroraText className="text-3xl sm:text-4xl lg:text-5xl font-bold ml-3">
                    Questions
                  </AuroraText>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Everything you need to know about Zeera
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-6">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-border/50 rounded-xl px-8 data-[state=open]:bg-muted/30 shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-8 text-xl">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-8 text-lg leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}

        <div className="relative z-10 py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                What Our
                <AuroraText className="text-3xl sm:text-4xl lg:text-5xl font-bold ml-3">
                  Users Say
                </AuroraText>
              </h2>
              <p className="text-xl text-muted-foreground">
                Trusted by teams worldwide to deliver exceptional results
              </p>
            </div>

            <AnimatedTestimonials testimonials={testimonials} autoplay />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
