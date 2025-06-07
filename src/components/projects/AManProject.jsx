import React, { useState, useEffect } from 'react';
import "./projects.css";

const AManProject = () => {
  const [expandedTrait, setExpandedTrait] = useState(null);
  const [activeSection, setActiveSection] = useState('social');
  const [expandedPhysicalSection, setExpandedPhysicalSection] = useState(null);
  const [expandedFinancialRule, setExpandedFinancialRule] = useState(null);
  const [expandedCareerRule, setExpandedCareerRule] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const socialTraits = [
    {
      id: 1,
      trait: "Strategic Self-Confidence",
      why: "People trust a quiet, well-reasoned certainty.",
      how: [
        "Keep a 'decision journal' logging predictions vs. outcomes",
        "State conclusions as probabilities ('I'm 80% confident…')—signals rigor, not arrogance"
      ]
    },
    {
      id: 2,
      trait: "Precision-Tuned EQ",
      why: "Reading subtleties offsets the INTJ 'poker face.'",
      how: [
        "Before meetings, forecast emotional undercurrents",
        "In conversation, label the emotion you observe ('Sounds frustrating—')"
      ]
    },
    {
      id: 3,
      trait: "Directed Curiosity",
      why: "An INTJ's deep questions can make others feel profoundly understood.",
      how: [
        "Prep two open-ended prompts per person you'll meet",
        "After each interaction, jot one fascinating thing you learned"
      ]
    },
    {
      id: 4,
      trait: "Purpose-Anchored Presence",
      why: "Clear long-term vision is the INTJ superpower; sharing snippets inspires others.",
      how: [
        "Craft and memorize a 15-second 'mission headline'",
        "When speaking, connect current topic to that big-picture aim"
      ]
    },
    {
      id: 5,
      trait: "Intentional Body Language",
      why: "Minimalist gestures read as poise when posture and eye contact are deliberate.",
      how: [
        "Practice 'engineer stance': shoulders back, hands relaxed at sides",
        "Hold eye contact for a full thought—not the whole time"
      ]
    },
    {
      id: 6,
      trait: "Principled Assertiveness",
      why: "Stating boundaries logically—and kindly—wins respect.",
      how: [
        "Use 'I value X, so I'll need Y' formulations",
        "Script polite refusals for common asks; reuse them"
      ]
    },
    {
      id: 7,
      trait: "Focused Attention Generosity",
      why: "INTJs excel at deep, distraction-free focus—turn it toward people.",
      how: [
        "Treat every 1-on-1 like debugging code: no phone, full screen on them",
        "Summarize their point back in one sentence before replying"
      ]
    },
    {
      id: 8,
      trait: "Dry, Intelligent Humor",
      why: "Wry observations soften the stoic stereotype.",
      how: [
        "Keep a 'quirky analogy' notebook; deploy sparingly",
        "Aim for situational wit, not sarcasm at someone's expense"
      ]
    },
    {
      id: 9,
      trait: "Stoic Resilience",
      why: "Logical framing plus emotional composure makes setbacks look like data-gathering.",
      how: [
        "After any failure, write a bullet list: facts → lesson → next test",
        "Share that framework publicly to model calm problem-solving"
      ]
    },
    {
      id: 10,
      trait: "Reliability Loop",
      why: "INTJs value systems; others value knowing you'll deliver.",
      how: [
        "Track commitments in your project manager, then send brief status pings unprompted",
        "Arrive 5 min early—silently signals respect"
      ]
    },
    {
      id: 11,
      trait: "Adaptive Social Calibration",
      why: "Switching between analytical depth and lighter chat shows range.",
      how: [
        "Mentally tag contexts as 'whiteboard' (technical) or 'coffee' (relational)",
        "Match 5% above the group's energy, never below"
      ]
    },
    {
      id: 12,
      trait: "Concise Storytelling",
      why: "A well-structured narrative turns raw data into persuasive vision.",
      how: [
        "Use 3-beat arc: context → complication → clever resolution",
        "Time yourself—aim for <90 seconds per story"
      ]
    },
    {
      id: 13,
      trait: "Sustainable Vitality",
      why: "Physical discipline reinforces mental discipline—and perceived attractiveness.",
      how: [
        "Schedule workouts like code deploys: fixed, non-negotiable blocks",
        "Track sleep with the same rigor as KPIs"
      ]
    },
    {
      id: 14,
      trait: "Perpetual Growth Mindset",
      why: "Viewing skill gaps as puzzles keeps the INTJ edge sharp.",
      how: [
        "Quarterly 'skill sprints' with clear learning OKRs",
        "Swap 'I know' with 'Current model suggests…' in speech"
      ]
    },
    {
      id: 15,
      trait: "Transparent Integrity",
      why: "Straight-talk + evidence is persuasive currency for analytical types.",
      how: [
        "When you miss a deadline, share root-cause analysis, not excuses",
        "Cite sources casually ('According to…') to show rigor"
      ]
    },
    {
      id: 16,
      trait: "Systematic Networking",
      why: "Curate a high-signal network that fuels your strategic goals.",
      how: [
        "Build a tagged contact database (interests, expertise, last contact)",
        "Offer a resource or whitepaper whenever you reconnect"
      ]
    },
    {
      id: 17,
      trait: "Cross-Cultural Literacy",
      why: "Global empathy future-proofs strategy work.",
      how: [
        "Each quarter, read a book from a culture you'll encounter",
        "Ask, 'How is this usually handled where you're from?'—then listen"
      ]
    },
    {
      id: 18,
      trait: "Explicit Gratitude",
      why: "Verbal acknowledgment counters the INTJ tendency to assume 'it's obvious.'",
      how: [
        "End emails with a specific thank-you line",
        "Publicly credit teammates during retros or demos"
      ]
    },
    {
      id: 19,
      trait: "Servant-Leader Mentality",
      why: "Leading via competence and mentorship multiplies impact.",
      how: [
        "Host 'office hours' for junior colleagues",
        "Ask teammates, 'What blocker can I remove this week?'"
      ]
    },
    {
      id: 20,
      trait: "Balanced Independence",
      why: "Diverse hobbies signal depth and prevent social over-investment in work alone.",
      how: [
        "Schedule a weekly solo pursuit (e.g., astrophotography)",
        "Maintain at least one friend group outside your industry"
      ]
    }
  ];

  const physicalSections = [
    {
      id: 'weight',
      title: 'Weight Management',
      content: [
        'Target Range: 67 kg - 75 kg',
        'Shred Phase: 2 meals/day (light breakfast + lunch, no dinner)',
        'Bulk Phase: 3 meals/day (light breakfast + lunch + dinner)'
      ]
    },
    {
      id: 'workout',
      title: 'Weekly Workout Schedule',
      content: [
        'Sunday: Leg Day + Tricep',
        'Monday: Back Day',
        'Tuesday: Arm Day (Bicep)',
        'Wednesday: Rest Day',
        'Thursday: Shoulder Day',
        'Friday: Rest/Cardio (Rest during bulk, 40min run during shred)',
        'Saturday: Chest Day'
      ]
    },
    {
      id: 'skincare-am',
      title: 'Morning Skincare Routine',
      content: [
        '1. Quick water rinse (or low-pH gel cleanse if woke up oily)',
        '2. Pat on hydrating toner (10 sec)',
        '3. Apply lightweight moisturizing gel (while skin is still damp)',
        '4. Finish with broad-spectrum SPF 50'
      ]
    },
    {
      id: 'skincare-pm',
      title: 'Evening Skincare Routine',
      content: [
        '1. Gentle cleanse (double-cleanse only if wore sunscreen/makeup)',
        '2. Apply richer moisturizing cream — no other actives'
      ]
    }
  ];

  const financialRules = [
    {
      id: 'personal-spending',
      title: 'Personal Spending Limit',
      content: [
        'Maximum $200 per month on materialistic items',
        'Materialistic = anything not essential for goals/survival',
        'Track all non-essential purchases monthly'
      ]
    },
    {
      id: 'necessities',
      title: 'Essential Expenses',
      content: [
        'Food and Water',
        'Shelter and Utilities',
        'Gym Membership',
        'Other goal-oriented investments'
      ]
    },
    {
      id: 'business',
      title: 'Business Investment',
      content: [
        'Prioritize operational expenses for business growth',
        'Focus on revenue-generating activities',
        'Invest in business development'
      ]
    },
    {
      id: 'family',
      title: 'Family Gifts',
      content: [
        'Korea trip gift budget: < 5% of total account balance',
        'Focus on practical, frequently-used items',
        'Prioritize parents and close relatives',
        'Quality over quantity for gift selection'
      ]
    }
  ];

  const careerRules = [
    {
      id: 'work-principles',
      title: 'Work Hours Principles',
      content: [
        'Focus 100% on company goals and success',
        'Be a team player, not a lone wolf',
        'Prioritize organizational success over individual achievement',
        'Maintain professional relationships and network',
        'Build meaningful connections within work context'
      ]
    },
    {
      id: 'social-boundaries',
      title: 'Professional Boundaries',
      content: [
        'Keep relationships professional during work hours',
        'Only engage in outside activities if:',
        '  - Other person initiates the invitation',
        '  - You see clear purpose/value in participating',
        'Avoid social activities that deviate from goals'
      ]
    },
    {
      id: 'career-growth',
      title: 'Career Growth Strategy',
      content: [
        'After 3 months at current company:',
        '  - Apply to minimum 5 positions weekly',
        '  - Focus on upward career moves',
        '  - Track all applications and responses',
        'Continuously assess market opportunities',
        'Stay updated with industry trends'
      ]
    },
    {
      id: 'ampyfin-commitment',
      title: 'AmpyFin Development',
      content: [
        'Weekdays: Minimum 2 hours per day',
        'Friday evenings: Dedicated to AmpyFin',
        'Weekends: Minimum 10 hours per day',
        'Focus exclusively on AmpyFin during designated times',
        'No compromises on AmpyFin development schedule'
      ]
    },
    {
      id: 'time-allocation',
      title: 'Time Management',
      content: [
        'Work Hours: Company focus + professional networking',
        'Weekday Evenings: 2+ hours AmpyFin',
        'Friday Evenings: AmpyFin exclusive',
        'Weekends: 10+ hours/day AmpyFin',
        'No time waste on non-purposeful activities'
      ]
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'social':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {socialTraits.map((item) => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedTrait(expandedTrait === item.id ? null : item.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedTrait === item.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {item.id}. {item.trait}
                  </h4>
                  <span>{expandedTrait === item.id ? '−' : '+'}</span>
                </div>
                
                {expandedTrait === item.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      <strong>Why It Matters:</strong> {item.why}
                    </p>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Practical Ways to Cultivate:</strong>
                      <ul style={{ 
                        listStyle: 'none',
                        padding: '0.5rem 0 0 1rem'
                      }}>
                        {item.how.map((step, index) => (
                          <li key={index} style={{ marginBottom: '0.25rem' }}>
                            • {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'physical':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {physicalSections.map((section) => (
              <div 
                key={section.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedPhysicalSection(expandedPhysicalSection === section.id ? null : section.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedPhysicalSection === section.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {section.title}
                  </h4>
                  <span>{expandedPhysicalSection === section.id ? '−' : '+'}</span>
                </div>
                
                {expandedPhysicalSection === section.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: '0.5rem 0 0 1rem',
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      {section.content.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'career':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {careerRules.map((rule) => (
              <div 
                key={rule.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedCareerRule(expandedCareerRule === rule.id ? null : rule.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedCareerRule === rule.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {rule.title}
                  </h4>
                  <span>{expandedCareerRule === rule.id ? '−' : '+'}</span>
                </div>
                
                {expandedCareerRule === rule.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: '0.5rem 0 0 1rem',
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      {rule.content.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'financial':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {financialRules.map((rule) => (
              <div 
                key={rule.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedFinancialRule(expandedFinancialRule === rule.id ? null : rule.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedFinancialRule === rule.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {rule.title}
                  </h4>
                  <span>{expandedFinancialRule === rule.id ? '−' : '+'}</span>
                </div>
                
                {expandedFinancialRule === rule.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: '0.5rem 0 0 1rem',
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      {rule.content.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderSignature = () => {
    const dates = {
      social: {
        signed: "June 7, 2025",
        effective: "June 9, 2025"
      },
      physical: {
        signed: "June 7, 2025",
        effective: "June 15, 2025"
      },
      career: {
        signed: "June 7, 2025",
        effective: "June 15, 2025"
      },
      financial: {
        signed: "June 7, 2025",
        effective: "June 9, 2025"
      }
    };

    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '1rem',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        textAlign: 'center',
        fontFamily: 'Pinyon Script, cursive',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          marginBottom: '2rem',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          fontFamily: 'serif'
        }}>
          Signed on {dates[activeSection].signed}
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            fontSize: '2.5rem',
            color: '#fff',
            fontFamily: 'Pinyon Script, cursive',
            transform: 'rotate(-5deg)',
            textShadow: '0 0 20px rgba(64,87,255,0.5)',
            padding: '1rem'
          }}>
            Yeon Lee
          </div>
          <div style={{
            width: '250px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(64,87,255,0.5), transparent)',
            margin: '0.5rem 0'
          }}></div>
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.7)',
            fontStyle: 'italic',
            fontFamily: 'serif'
          }}>
            Signed and Sealed
          </div>
        </div>

        <div style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          fontFamily: 'serif',
          marginTop: '2rem'
        }}>
          Effective {dates[activeSection].effective}
        </div>

        <div style={{
          fontSize: '2rem',
          color: 'rgba(64,87,255,0.5)',
          marginTop: '1rem'
        }}>
          ❦
        </div>
      </div>
    );
  };

  return (
    <section className="section" style={{
      background: `
        linear-gradient(135deg, rgba(4,8,16,0.97) 0%, rgba(2,4,12,0.97) 100%),
        radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(64,87,255,0.2) 0%, rgba(64,87,255,0) 50%),
        linear-gradient(${time}deg, rgba(64,87,255,0.08) 0%, rgba(128,0,255,0.08) 100%)
      `,
      color: '#fff',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.3s ease'
    }}>
      {/* Cyber grid background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(64,87,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(64,87,255,0.05) 1px, transparent 1px),
          linear-gradient(rgba(128,0,255,0.03) 2px, transparent 2px),
          linear-gradient(90deg, rgba(128,0,255,0.03) 2px, transparent 2px)
        `,
        backgroundSize: '50px 50px, 50px 50px, 100px 100px, 100px 100px',
        transform: `perspective(1000px) rotateX(60deg) translateY(-50%) scale(3)`,
        opacity: 0.3,
        zIndex: 0,
        animation: 'gridMove 20s linear infinite'
      }}/>

      {/* Enhanced floating particles */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: i % 4 === 0 ? '4px' : i % 3 === 0 ? '3px' : '2px',
            height: i % 4 === 0 ? '4px' : i % 3 === 0 ? '3px' : '2px',
            background: i % 4 === 0 ? 'rgba(128,0,255,0.7)' : i % 3 === 0 ? 'rgba(64,87,255,0.5)' : 'rgba(255,255,255,0.3)',
            boxShadow: i % 4 === 0 
              ? '0 0 15px rgba(128,0,255,0.8), 0 0 30px rgba(128,0,255,0.6)' 
              : i % 3 === 0 
                ? '0 0 10px rgba(64,87,255,0.6), 0 0 20px rgba(64,87,255,0.4)'
                : '0 0 5px rgba(255,255,255,0.3)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 15}s linear infinite`,
            opacity: Math.random() * 0.5 + 0.5
          }}
        />
      ))}

      <style>
        {`
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          @keyframes float {
            0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); }
            25% { transform: translateY(-20px) translateX(10px) rotate(90deg) scale(1.1); }
            50% { transform: translateY(0) translateX(20px) rotate(180deg) scale(1); }
            75% { transform: translateY(20px) translateX(10px) rotate(270deg) scale(0.9); }
            100% { transform: translateY(0) translateX(0) rotate(360deg) scale(1); }
          }
          @keyframes neonPulse {
            0%, 100% { 
              box-shadow: 0 0 10px rgba(64,87,255,0.5),
                         0 0 20px rgba(64,87,255,0.3),
                         0 0 30px rgba(64,87,255,0.2),
                         inset 0 0 15px rgba(64,87,255,0.3);
            }
            50% { 
              box-shadow: 0 0 15px rgba(64,87,255,0.6),
                         0 0 25px rgba(64,87,255,0.4),
                         0 0 35px rgba(64,87,255,0.3),
                         inset 0 0 25px rgba(64,87,255,0.4);
            }
          }
          @keyframes borderFlow {
            0% { border-image-source: linear-gradient(0deg, rgba(64,87,255,0.5), rgba(128,0,255,0.5)); }
            100% { border-image-source: linear-gradient(360deg, rgba(64,87,255,0.5), rgba(128,0,255,0.5)); }
          }
          .nav-button {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(64,87,255,0.3) !important;
            backdrop-filter: blur(10px);
          }
          .nav-button:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(64,87,255,0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s ease, height 0.6s ease;
          }
          .nav-button:hover:before {
            width: 200%;
            height: 200%;
          }
          .nav-button.active {
            animation: neonPulse 2s infinite;
            border: 1px solid rgba(64,87,255,0.5) !important;
          }
          .content-card {
            transition: all 0.3s ease;
            border: 1px solid rgba(64,87,255,0.2);
            position: relative;
          }
          .content-card:before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            border: 1px solid transparent;
            border-radius: 1rem;
            animation: borderFlow 3s linear infinite;
            pointer-events: none;
          }
          .content-card:hover {
            transform: translateY(-2px) scale(1.002);
            box-shadow: 0 12px 40px rgba(64,87,255,0.2);
            border-color: rgba(64,87,255,0.4);
          }
          .content-card:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 1rem;
            background: linear-gradient(45deg, transparent, rgba(64,87,255,0.1), transparent);
            background-size: 200% 200%;
            animation: gradient 3s linear infinite;
            z-index: -1;
          }
          @keyframes gradient {
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 200%; }
          }
          .title-glow {
            animation: titleGlow 3s ease-in-out infinite;
          }
          @keyframes titleGlow {
            0%, 100% { filter: drop-shadow(0 0 15px rgba(64,87,255,0.3)); }
            50% { filter: drop-shadow(0 0 25px rgba(64,87,255,0.5)); }
          }
        `}
      </style>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="section__title" style={{
          color: '#fff',
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <span className="title-glow" style={{
            background: 'linear-gradient(45deg, #fff, rgba(64,87,255,0.8), rgba(128,0,255,0.8))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            padding: '0.5rem 2rem',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(64,87,255,0.2), transparent)',
              filter: 'blur(8px)',
              zIndex: -1
            }}></span>
            A-Man Project
          </span>
          <div style={{
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(64,87,255,0.8), rgba(128,0,255,0.8), transparent)',
            margin: '0.5rem auto',
            boxShadow: '0 0 20px rgba(64,87,255,0.5)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-1px',
              left: '0',
              width: '10px',
              height: '4px',
              background: 'rgba(64,87,255,0.8)',
              boxShadow: '0 0 10px rgba(64,87,255,0.8)',
              animation: 'sliderMove 3s linear infinite'
            }}></div>
          </div>
        </h2>
        
        <div className="container" style={{ padding: "2rem" }}>
          {/* Navigation Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(8,12,24,0.6)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid rgba(64,87,255,0.2)'
          }}>
            {['social', 'physical', 'career', 'financial'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`nav-button ${activeSection === section ? 'active' : ''}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: activeSection === section 
                    ? 'linear-gradient(135deg, rgba(64,87,255,0.3) 0%, rgba(128,0,255,0.3) 100%)'
                    : 'rgba(8,12,24,0.6)',
                  color: activeSection === section ? '#fff' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontWeight: activeSection === section ? 'bold' : 'normal',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(5px)',
                  letterSpacing: '2px',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace'
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div className="content-card" style={{
            background: 'rgba(8,12,24,0.6)',
            borderRadius: '1rem',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(64,87,255,0.5), rgba(128,0,255,0.5), transparent)',
              boxShadow: '0 0 20px rgba(64,87,255,0.5)'
            }}/>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(64,87,255,0.2)',
              paddingBottom: '0.5rem',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'monospace',
              letterSpacing: '2px'
            }}>
              <span style={{
                background: 'linear-gradient(45deg, #fff, rgba(64,87,255,0.8), rgba(128,0,255,0.8))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(64,87,255,0.3))'
              }}>{activeSection}</span>
              <span style={{ 
                fontSize: '0.8rem', 
                opacity: 0.7,
                fontWeight: 'normal'
              }}>
                // ACTIVE MODULE
              </span>
            </h3>
            
            {renderContent()}
          </div>

          {/* Signature Section */}
          {renderSignature()}
        </div>
      </div>
    </section>
  );
}

export default AManProject; 