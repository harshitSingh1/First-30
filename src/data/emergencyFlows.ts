import { EmergencyFlow, DispatcherCase, NearbyService } from '@/types/emergency';

export const emergencyFlows: EmergencyFlow[] = [
  {
    id: 'bleeding',
    category: 'Accident / Bleeding',
    icon: 'droplets',
    description: 'Cuts, wounds, and severe bleeding',
    priorityHint: 'P2',
    steps: [
      {
        id: 'bleeding-1',
        title: 'Ensure Safety',
        instruction: 'Make sure the area is safe for you and the victim. Wear gloves if available.',
        warning: 'Do not put yourself in danger.',
      },
      {
        id: 'bleeding-2',
        title: 'Call Emergency Services',
        instruction: 'If bleeding is severe, call emergency services immediately (911).',
      },
      {
        id: 'bleeding-3',
        title: 'Apply Direct Pressure',
        instruction: 'Press firmly on the wound with a clean cloth or bandage. Do not remove it.',
        warning: 'Do not remove the cloth if blood soaks through. Add more layers on top.',
      },
      {
        id: 'bleeding-4',
        title: 'Elevate the Wound',
        instruction: 'If possible, raise the injured area above the level of the heart.',
        alternatives: ['Skip if moving causes more pain', 'Skip if spinal injury suspected'],
      },
      {
        id: 'bleeding-5',
        title: 'Keep Pressure',
        instruction: 'Maintain pressure for at least 10-15 minutes without checking.',
      },
      {
        id: 'bleeding-6',
        title: 'Watch for Shock',
        instruction: 'Look for pale skin, rapid breathing, confusion. Keep person warm and calm.',
      },
    ],
    nextQuestions: [
      'Is the bleeding controlled?',
      'Is the person conscious?',
      'How deep is the wound?',
      'What caused the injury?',
    ],
    summaryTemplate: {
      fields: ['Wound location', 'Bleeding severity', 'Cause of injury', 'Time pressure applied'],
      recommendations: ['Continue pressure until help arrives', 'Keep person still and calm'],
    },
  },
  {
    id: 'unconscious',
    category: 'Breathing / Unconscious',
    icon: 'wind',
    description: 'Person not breathing or unresponsive',
    priorityHint: 'P1',
    steps: [
      {
        id: 'unconscious-1',
        title: 'Check Response',
        instruction: 'Tap their shoulders firmly and shout "Are you okay?"',
      },
      {
        id: 'unconscious-2',
        title: 'Call for Help',
        instruction: 'Call 911 immediately or ask someone nearby to call.',
        warning: 'Put phone on speaker so you can continue helping.',
      },
      {
        id: 'unconscious-3',
        title: 'Check Breathing',
        instruction: 'Tilt head back, lift chin. Look, listen, and feel for breathing for 10 seconds.',
      },
      {
        id: 'unconscious-4',
        title: 'If Not Breathing - Start CPR',
        instruction: 'Place heel of hand on center of chest. Push hard and fast (100-120/min).',
        warning: 'Push at least 2 inches deep. Let chest fully rise between compressions.',
      },
      {
        id: 'unconscious-5',
        title: 'Continue CPR',
        instruction: '30 compressions, then 2 rescue breaths. Repeat until help arrives.',
        alternatives: ['Compression-only CPR is also effective if uncomfortable with breaths'],
      },
      {
        id: 'unconscious-6',
        title: 'Use AED if Available',
        instruction: 'Turn on AED, follow voice prompts. Attach pads to bare chest.',
      },
    ],
    nextQuestions: [
      'Is the person breathing now?',
      'How long has the person been unconscious?',
      'Did you witness what happened?',
      'Is there an AED nearby?',
    ],
    summaryTemplate: {
      fields: ['Duration unconscious', 'CPR provided', 'AED used', 'Breathing restored'],
      recommendations: ['Continue CPR until EMS arrives', 'Do not stop unless person recovers or you are exhausted'],
    },
  },
  {
    id: 'chest-pain',
    category: 'Chest Pain / Stroke',
    icon: 'heart',
    description: 'Heart attack or stroke symptoms',
    priorityHint: 'P1',
    steps: [
      {
        id: 'chest-1',
        title: 'Call 911 Immediately',
        instruction: 'Time is critical. Call emergency services right away.',
        warning: 'Do not drive yourself to the hospital.',
      },
      {
        id: 'chest-2',
        title: 'Sit or Lie Down',
        instruction: 'Have the person sit in a comfortable position, usually semi-upright.',
      },
      {
        id: 'chest-3',
        title: 'Loosen Tight Clothing',
        instruction: 'Unbutton shirt, loosen belt, remove tie or scarf.',
      },
      {
        id: 'chest-4',
        title: 'Aspirin if Available',
        instruction: 'If not allergic, chew one regular aspirin (325mg) or 4 baby aspirins.',
        warning: 'Do not give aspirin if allergic or if doctor advised against it.',
      },
      {
        id: 'chest-5',
        title: 'Check FAST for Stroke',
        instruction: 'Face drooping? Arm weakness? Speech difficulty? Time to call 911.',
      },
      {
        id: 'chest-6',
        title: 'Stay Calm and Monitor',
        instruction: 'Keep person calm. Note time symptoms started. Be ready to do CPR.',
      },
    ],
    nextQuestions: [
      'When did the pain start?',
      'Does the pain radiate to arm, jaw, or back?',
      'Is there any facial drooping or speech problems?',
      'Any history of heart problems?',
    ],
    summaryTemplate: {
      fields: ['Symptom onset time', 'Pain description', 'FAST assessment results', 'Aspirin given'],
      recommendations: ['Keep noting any changes', 'Be prepared for CPR'],
    },
  },
  {
    id: 'burns',
    category: 'Burns',
    icon: 'flame',
    description: 'Thermal, chemical, or electrical burns',
    priorityHint: 'P2',
    steps: [
      {
        id: 'burns-1',
        title: 'Stop the Burning',
        instruction: 'Remove from heat source. Remove clothing near burn (unless stuck to skin).',
        warning: 'Do not remove clothing stuck to the burn.',
      },
      {
        id: 'burns-2',
        title: 'Cool the Burn',
        instruction: 'Run cool (not cold) water over the burn for 10-20 minutes.',
        warning: 'Do not use ice, butter, or toothpaste on burns.',
      },
      {
        id: 'burns-3',
        title: 'Assess Severity',
        instruction: 'Check size and depth. Burns larger than palm or on face/joints need emergency care.',
      },
      {
        id: 'burns-4',
        title: 'Cover the Burn',
        instruction: 'Use a clean, dry, non-fluffy dressing or cling film.',
        alternatives: ['Use a clean plastic bag for hand burns'],
      },
      {
        id: 'burns-5',
        title: 'Watch for Shock',
        instruction: 'Large burns can cause shock. Keep person warm (not the burn area).',
      },
      {
        id: 'burns-6',
        title: 'Pain Relief',
        instruction: 'Over-the-counter pain relief can help. Keep burn elevated if possible.',
      },
    ],
    nextQuestions: [
      'What caused the burn?',
      'How large is the burned area?',
      'Is the burn on face, hands, feet, or genitals?',
      'Any signs of smoke inhalation?',
    ],
    summaryTemplate: {
      fields: ['Burn cause', 'Body area affected', 'Burn size estimate', 'Cooling time'],
      recommendations: ['Seek medical care for serious burns', 'Watch for infection signs'],
    },
  },
  {
    id: 'choking',
    category: 'Choking',
    icon: 'alert-circle',
    description: 'Airway obstruction in adults or children',
    priorityHint: 'P1',
    steps: [
      {
        id: 'choking-1',
        title: 'Assess the Situation',
        instruction: 'Ask "Are you choking?" If they can cough or speak, encourage coughing.',
        warning: 'If they cannot speak, cough, or breathe - act immediately.',
      },
      {
        id: 'choking-2',
        title: 'Call for Help',
        instruction: 'Have someone call 911 while you help.',
      },
      {
        id: 'choking-3',
        title: 'Give Back Blows',
        instruction: 'Stand behind, lean person forward. Give 5 sharp blows between shoulder blades.',
      },
      {
        id: 'choking-4',
        title: 'Abdominal Thrusts',
        instruction: 'Stand behind, wrap arms around waist. Make fist above navel, thrust inward and upward.',
        warning: 'Do not do abdominal thrusts on pregnant women or infants.',
      },
      {
        id: 'choking-5',
        title: 'Repeat Cycle',
        instruction: 'Alternate 5 back blows and 5 abdominal thrusts until object is expelled.',
      },
      {
        id: 'choking-6',
        title: 'If Unconscious',
        instruction: 'Lower person to ground, begin CPR. Check mouth for visible object before breaths.',
      },
    ],
    nextQuestions: [
      'Is the person still choking?',
      'Did the object come out?',
      'Is the person breathing normally now?',
      'Is this an infant or adult?',
    ],
    summaryTemplate: {
      fields: ['Object that caused choking', 'Number of thrust cycles', 'Object expelled', 'CPR required'],
      recommendations: ['Seek medical check even after successful removal', 'Watch for breathing difficulties'],
    },
  },
  {
    id: 'seizure',
    category: 'Seizure',
    icon: 'zap',
    description: 'Convulsions and seizure episodes',
    priorityHint: 'P2',
    steps: [
      {
        id: 'seizure-1',
        title: 'Protect from Injury',
        instruction: 'Clear the area of hard or sharp objects. Do not restrain the person.',
        warning: 'Do not put anything in their mouth.',
      },
      {
        id: 'seizure-2',
        title: 'Cushion the Head',
        instruction: 'Place something soft under their head - a jacket, pillow, or your hands.',
      },
      {
        id: 'seizure-3',
        title: 'Time the Seizure',
        instruction: 'Note when the seizure started. Call 911 if it lasts more than 5 minutes.',
      },
      {
        id: 'seizure-4',
        title: 'Recovery Position',
        instruction: 'Once seizure stops, turn person on their side to keep airway clear.',
      },
      {
        id: 'seizure-5',
        title: 'Stay and Reassure',
        instruction: 'Stay with person until fully recovered. They may be confused - speak calmly.',
      },
      {
        id: 'seizure-6',
        title: 'When to Call 911',
        instruction: 'Call if: first seizure, lasts 5+ min, person is injured, pregnant, or diabetic.',
        warning: 'Always call 911 if you are unsure.',
      },
    ],
    nextQuestions: [
      'How long did the seizure last?',
      'Is this the first seizure?',
      'Does the person have a seizure history?',
      'Is the person conscious now?',
    ],
    summaryTemplate: {
      fields: ['Seizure duration', 'First seizure', 'Known epilepsy', 'Injuries sustained'],
      recommendations: ['Stay with person until fully alert', 'Note seizure details for medical team'],
    },
  },
];

export const mockDispatcherCases: DispatcherCase[] = [
  {
    id: 'case-001',
    category: 'Chest Pain / Stroke',
    priority: 'P1',
    reportedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    location: '123 Main Street, Downtown',
    summary: '65-year-old male, crushing chest pain radiating to left arm. History of hypertension.',
    status: 'active',
    suggestedActions: [
      'Dispatch ambulance with ALS',
      'Advise aspirin if not contraindicated',
      'Prepare for potential cardiac arrest',
    ],
    suggestedQuestions: [
      'Has the person taken nitroglycerin?',
      'Any changes in consciousness?',
      'Is there an AED available on scene?',
    ],
    stepsCompleted: ['Called 911', 'Person seated', 'Aspirin given'],
  },
  {
    id: 'case-002',
    category: 'Breathing / Unconscious',
    priority: 'P1',
    reportedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    location: '456 Oak Avenue, Residential',
    summary: 'Adult female found unresponsive. Bystander performing CPR. No AED available.',
    status: 'active',
    suggestedActions: [
      'Dispatch with lights and sirens',
      'Guide bystander through CPR',
      'Locate nearest AED',
    ],
    suggestedQuestions: [
      'Is CPR being performed correctly?',
      'Any signs of life?',
      'What was the person doing before collapse?',
    ],
    stepsCompleted: ['Response check', 'Called 911', 'CPR started'],
  },
  {
    id: 'case-003',
    category: 'Accident / Bleeding',
    priority: 'P2',
    reportedAt: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    location: '789 Industrial Blvd, Factory District',
    summary: 'Workplace accident, deep laceration to forearm. Bleeding controlled with pressure.',
    status: 'pending',
    suggestedActions: [
      'Dispatch ambulance',
      'Maintain pressure on wound',
      'Monitor for shock',
    ],
    suggestedQuestions: [
      'Is bleeding still controlled?',
      'Any numbness or tingling?',
      'Is the wound contaminated?',
    ],
    stepsCompleted: ['Safety ensured', 'Called 911', 'Pressure applied', 'Wound elevated'],
  },
  {
    id: 'case-004',
    category: 'Seizure',
    priority: 'P3',
    reportedAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    location: '321 Park Lane, Community Center',
    summary: 'Known epileptic, seizure lasted 3 minutes, now in recovery position. Alert and oriented.',
    status: 'pending',
    suggestedActions: [
      'Monitor for additional seizures',
      'Confirm person has medication',
      'Arrange transport if needed',
    ],
    suggestedQuestions: [
      'Has person taken their medication today?',
      'Any injuries from the seizure?',
      'Does person want medical transport?',
    ],
    stepsCompleted: ['Protected from injury', 'Timed seizure', 'Recovery position'],
  },
];

export const mockNearbyServices: NearbyService[] = [
  {
    id: 'hosp-1',
    name: 'City General Hospital',
    type: 'hospital',
    address: '100 Medical Center Drive',
    distance: '1.2 mi',
    eta: '5 min',
    phone: '(555) 123-4567',
    isOpen24h: true,
  },
  {
    id: 'hosp-2',
    name: 'St. Mary Medical Center',
    type: 'hospital',
    address: '250 Healthcare Blvd',
    distance: '2.8 mi',
    eta: '10 min',
    phone: '(555) 234-5678',
    isOpen24h: true,
  },
  {
    id: 'pharm-1',
    name: 'CVS Pharmacy',
    type: 'pharmacy',
    address: '55 Main Street',
    distance: '0.3 mi',
    eta: '2 min',
    phone: '(555) 345-6789',
    isOpen24h: true,
  },
  {
    id: 'pharm-2',
    name: 'Walgreens',
    type: 'pharmacy',
    address: '120 Oak Avenue',
    distance: '0.8 mi',
    eta: '4 min',
    phone: '(555) 456-7890',
    isOpen24h: false,
  },
  {
    id: 'police-1',
    name: 'Central Police Station',
    type: 'police',
    address: '1 Police Plaza',
    distance: '0.5 mi',
    eta: '3 min',
    phone: '911',
    isOpen24h: true,
  },
  {
    id: 'fire-1',
    name: 'Fire Station #7',
    type: 'fire',
    address: '75 Firefighter Way',
    distance: '0.7 mi',
    eta: '3 min',
    phone: '911',
    isOpen24h: true,
  },
];

export const getEmergencyFlowById = (id: string): EmergencyFlow | undefined => {
  return emergencyFlows.find((flow) => flow.id === id);
};

export const getEmergencyCategories = () => {
  return emergencyFlows.map((flow) => ({
    id: flow.id,
    category: flow.category,
    icon: flow.icon,
    description: flow.description,
    priorityHint: flow.priorityHint,
  }));
};
