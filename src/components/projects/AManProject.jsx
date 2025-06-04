import React, { useState } from 'react';
import "./projects.css";

const AManProject = () => {
  const [expandedTrait, setExpandedTrait] = useState(null);
  const [activeSection, setActiveSection] = useState('social');
  const [expandedPhysicalSection, setExpandedPhysicalSection] = useState(null);
  const [expandedFinancialRule, setExpandedFinancialRule] = useState(null);
  const [expandedCareerRule, setExpandedCareerRule] = useState(null);

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
        signed: "June 5, 2025",
        effective: "June 5, 2025"
      },
      physical: {
        signed: "June 4, 2025",
        effective: "June 15, 2025"
      },
      career: {
        signed: "June 4, 2025",
        effective: "June 15, 2025"
      },
      financial: {
        signed: "June 4, 2025",
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
      background: 'linear-gradient(135deg, rgba(16,20,30,0.95) 0%, rgba(8,17,38,0.95) 100%)',
      color: '#fff',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(64,87,255,0.05) 0%, rgba(64,87,255,0) 70%)',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l7.9-7.9h-.83L25.172 0h-2.83zM32 0l-7.9 7.9 1.415 1.415 7.9-7.9h-1.414L34.828 0H32zm-3.656 0l-7.9 7.9 1.415 1.415 7.9-7.9H25.172L27.828 0h-2.83zM32 0l1.414 1.414 1.415-1.415L34.828 0H32zm21.172 0l-7.9 7.9 1.415 1.415 7.9-7.9h-2.83zM27.828 0l7.9 7.9-1.415 1.415-7.9-7.9h2.83zM22.344 0L30.2 7.9l-1.415 1.415-7.9-7.9h2.83zM16.686 0l7.9 7.9-1.415 1.415-7.9-7.9h2.83zM11.03 0l7.9 7.9-1.415 1.415-7.9-7.9h2.83zM5.373 0l7.9 7.9-1.415 1.415-7.9-7.9h2.83z\' fill=\'rgba(64,87,255,0.03)\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        opacity: 0.5,
        zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="section__title" style={{
          color: '#fff',
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          textShadow: '0 0 20px rgba(64,87,255,0.3)'
        }}>A-Man Project</h2>
        
        <div className="container" style={{ padding: "2rem" }}>
          {/* Navigation Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            {['social', 'physical', 'career', 'financial'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: activeSection === section 
                    ? 'linear-gradient(135deg, rgba(64,87,255,0.9) 0%, rgba(64,87,255,0.7) 100%)'
                    : 'rgba(255,255,255,0.05)',
                  color: activeSection === section ? '#fff' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontWeight: activeSection === section ? 'bold' : 'normal',
                  textTransform: 'capitalize',
                  backdropFilter: 'blur(5px)',
                  boxShadow: activeSection === section 
                    ? '0 4px 15px rgba(64,87,255,0.3)'
                    : 'none'
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '1rem',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              color: '#fff',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '0.5rem',
              textTransform: 'capitalize'
            }}>{activeSection}</h3>
            
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