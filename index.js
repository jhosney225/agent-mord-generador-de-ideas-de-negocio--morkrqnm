```javascript
const readline = require('readline');
const fs = require('fs');

// Business idea validator and generator
class BusinessIdeaGenerator {
  constructor() {
    this.ideas = [];
    this.validationRules = {
      marketSize: { min: 1000, max: 1000000000 },
      startupCost: { min: 100, max: 10000000 },
      timeToProfit: { min: 1, max: 120 },
      competitionLevel: ['low', 'medium', 'high'],
      profitMargin: { min: 5, max: 95 }
    };
  }

  // Validate business idea against rules
  validateIdea(idea) {
    const errors = [];
    const warnings = [];

    // Validate market size
    if (idea.marketSize < this.validationRules.marketSize.min) {
      errors.push('Market size is too small (minimum: $1,000)');
    }
    if (idea.marketSize > this.validationRules.marketSize.max) {
      errors.push('Market size exceeds maximum limit');
    }

    // Validate startup cost
    if (idea.startupCost < this.validationRules.startupCost.min) {
      errors.push('Startup cost too low (minimum: $100)');
    }
    if (idea.startupCost > this.validationRules.startupCost.max) {
      errors.push('Startup cost exceeds maximum limit');
    }

    // Validate time to profit
    if (idea.timeToProfit < this.validationRules.timeToProfit.min || 
        idea.timeToProfit > this.validationRules.timeToProfit.max) {
      errors.push('Time to profit must be between 1 and 120 months');
    }

    // Validate competition level
    if (!this.validationRules.competitionLevel.includes(idea.competitionLevel)) {
      errors.push('Invalid competition level. Use: low, medium, or high');
    }

    // Validate profit margin
    if (idea.profitMargin < this.validationRules.profitMargin.min || 
        idea.profitMargin > this.validationRules.profitMargin.max) {
      errors.push('Profit margin must be between 5% and 95%');
    }

    // Business logic warnings
    if (idea.startupCost > idea.marketSize * 0.1) {
      warnings.push('Startup cost is very high relative to market size');
    }

    if (idea.timeToProfit > 60 && idea.competitionLevel === 'high') {
      warnings.push('Long time to profit in highly competitive market - risky');
    }

    if (idea.profitMargin < 20 && idea.competitionLevel === 'high') {
      warnings.push('Low profit margin in competitive market - may not be viable');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateScore(idea)
    };
  }

  // Calculate viability score
  calculateScore(idea) {
    let score = 0;

    // Market size factor (max 20 points)
    const marketScore = Math.min(20, (Math.log10(idea.marketSize) / 10) * 20);
    score += marketScore;

    // ROI factor (max 25 points)
    const roi = ((idea.marketSize - idea.startupCost) / idea.startupCost) * 100;
    const roiScore = Math.min(25, (roi / 1000) * 25);
    score += roiScore;

    // Time to profit factor (max 20 points) - faster is better
    const timeScore = Math.max(0, 20 - (idea.timeToProfit / 6));
    score += timeScore;

    // Competition factor (max 20 points)
    const competitionScores = { low: 20, medium: 12, high: 5 };
    score += competitionScores[idea.competitionLevel];

    // Profit margin factor (max 15 points)
    const marginScore = (idea.profitMargin / 95) * 15;
    score += marginScore;

    return Math.round(score);
  }

  // Generate random business ideas
  generateRandomIdea() {
    const industries = [
      'Technology', 'E-commerce', 'Healthcare', 'Education', 'Finance',
      'Real Estate', 'Food & Beverage', 'Entertainment', 'Fitness', 'Consulting'
    ];

    const services = [
      'consulting', 'marketplace', 'SaaS', 'training', 'content creation',
      'freelance platform', 'subscription box', 'mobile app', 'web platform', 'automation'
    ];

    const competitionLevels = ['low', 'medium', 'high'];

    const industry = industries[Math.floor(Math.random() * industries.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const competition = competitionLevels[Math.floor(Math.random() * competitionLevels.length)];

    const idea = {
      title: `${industry} ${service}`,
      description: `A ${service} solution for the ${industry.toLowerCase()} sector`,
      marketSize: Math.floor(Math.random() * 500000000) + 10000,
      startupCost: Math.floor(Math.random() * 500000) + 1000,
      timeToProfit: Math.floor(Math.random() * 48) + 3,
      competitionLevel: competition,
      profitMargin: Math.floor(Math.random() * 50) + 15
    };

    return idea;
  }

  // Add idea to collection
  addIdea(idea) {
    const validation = this.validateIdea(idea);
    
    const ideaWithValidation = {
      id