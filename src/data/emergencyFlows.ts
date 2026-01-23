import { EmergencyFlow, DispatcherCase, NearbyService } from '@/types/emergency';

export const emergencyFlows: EmergencyFlow[] = [
  {
    id: 'bleeding',
    category: 'Accident / Bleeding',
    icon: 'droplets',
    description: 'Cuts, wounds, and severe bleeding',
    priorityHint: 'P2',
    initialQuestions: [
      {
        id: 'bleeding-age',
        question: 'What is the age group of the injured person?',
        options: [
          { label: 'Infant (0-1)', value: 'infant' },
          { label: 'Child (1-12)', value: 'child' },
          { label: 'Adult (12-65)', value: 'adult' },
          { label: 'Elderly (65+)', value: 'elderly' },
        ],
      },
    ],
    steps: [
      {
        id: 'bleeding-1',
        title: 'Ensure Your Safety First',
        instruction: 'Check the area is safe. Put on gloves if available. Do not touch blood with bare hands if possible.',
        warning: 'Your safety comes first. Do not put yourself in danger.',
      },
      {
        id: 'bleeding-2',
        title: 'Call Emergency Services',
        instruction: 'If bleeding is severe or won\'t stop, call 911 immediately. Put phone on speaker.',
        actionButton: { label: 'Call 911 Now', action: 'call911' },
        quickQuestion: {
          id: 'bleeding-severe',
          question: 'Is the bleeding severe?',
          options: [
            { label: 'Yes, blood is spurting or pooling', value: 'severe' },
            { label: 'Moderate, steady flow', value: 'moderate' },
            { label: 'Minor, small amount', value: 'minor' },
          ],
        },
      },
      {
        id: 'bleeding-3',
        title: 'Apply Direct Pressure',
        instruction: 'Press firmly on the wound with a clean cloth, bandage, or clothing. Use both hands if needed.',
        warning: 'Press hard! Firm pressure is essential to stop bleeding.',
      },
      {
        id: 'bleeding-4',
        title: 'Do NOT Remove the Cloth',
        instruction: 'If blood soaks through, add more layers on top. Never remove the first cloth.',
        warning: 'Removing the cloth can restart bleeding and remove forming clots.',
      },
      {
        id: 'bleeding-5',
        title: 'Check for Embedded Objects',
        instruction: 'If there is an object in the wound (glass, knife), do NOT remove it. Apply pressure around it.',
        warning: 'Removing an embedded object can cause severe bleeding.',
        quickQuestion: {
          id: 'bleeding-embedded',
          question: 'Is there an object stuck in the wound?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ],
        },
      },
      {
        id: 'bleeding-6',
        title: 'Elevate if Possible',
        instruction: 'If the wound is on an arm or leg, raise it above heart level while maintaining pressure.',
        alternatives: ['Skip if moving causes pain', 'Skip if you suspect a broken bone', 'Skip if there may be spinal injury'],
      },
      {
        id: 'bleeding-7',
        title: 'Keep Pressure for 10-15 Minutes',
        instruction: 'Maintain firm, constant pressure. Do not peek or check the wound during this time.',
        actionButton: { label: 'Start 15-Minute Timer', action: 'timer' },
      },
      {
        id: 'bleeding-8',
        title: 'Watch for Signs of Shock',
        instruction: 'Look for: pale/cold skin, rapid breathing, confusion, weakness. Keep person lying down and warm.',
        quickQuestion: {
          id: 'bleeding-shock',
          question: 'Is the person showing signs of shock?',
          options: [
            { label: 'Yes, showing symptoms', value: 'yes' },
            { label: 'No, seems stable', value: 'no' },
            { label: 'Unsure', value: 'unsure' },
          ],
        },
      },
      {
        id: 'bleeding-9',
        title: 'Keep Person Calm and Warm',
        instruction: 'Cover with a blanket if available. Talk calmly. Do not give food or water.',
      },
      {
        id: 'bleeding-10',
        title: 'Wait for Help',
        instruction: 'Stay with the person. Continue pressure until emergency services arrive.',
      },
    ],
    nextQuestions: ['Is bleeding controlled?', 'Is the person conscious?', 'How deep is the wound?'],
    summaryTemplate: {
      fields: ['Wound location', 'Bleeding severity', 'Pressure applied duration'],
      recommendations: ['Continue pressure until help arrives', 'Keep person still and warm'],
    },
  },
  {
    id: 'unconscious',
    category: 'Breathing / Unconscious',
    icon: 'wind',
    description: 'Person not breathing or unresponsive',
    priorityHint: 'P1',
    initialQuestions: [
      {
        id: 'unconscious-age',
        question: 'What is the age group?',
        options: [
          { label: 'Infant (0-1)', value: 'infant' },
          { label: 'Child (1-12)', value: 'child' },
          { label: 'Adult', value: 'adult' },
        ],
      },
    ],
    steps: [
      {
        id: 'unconscious-1',
        title: 'Check for Danger',
        instruction: 'Make sure the area is safe for you to approach. Look for hazards like traffic, fire, or electrical wires.',
      },
      {
        id: 'unconscious-2',
        title: 'Check for Response',
        instruction: 'Tap their shoulders firmly and shout "Are you okay? Can you hear me?" Check for any movement or sound.',
        quickQuestion: {
          id: 'unconscious-response',
          question: 'Did they respond?',
          options: [
            { label: 'Yes, they responded', value: 'yes' },
            { label: 'No response at all', value: 'no' },
          ],
        },
      },
      {
        id: 'unconscious-3',
        title: 'Call for Help Immediately',
        instruction: 'Call 911 now or ask someone nearby to call. Put phone on speaker so you can continue helping.',
        actionButton: { label: 'Call 911 Now', action: 'call911' },
        warning: 'Time is critical. Call immediately if there is no response.',
      },
      {
        id: 'unconscious-4',
        title: 'Open the Airway',
        instruction: 'Tilt their head back gently by lifting the chin. This opens the airway.',
        warning: 'If you suspect neck injury, move the jaw forward without tilting the head.',
      },
      {
        id: 'unconscious-5',
        title: 'Check for Breathing',
        instruction: 'Look at the chest for movement. Listen for breath sounds. Feel for air on your cheek. Do this for 10 seconds.',
        quickQuestion: {
          id: 'unconscious-breathing',
          question: 'Is the person breathing normally?',
          options: [
            { label: 'Yes, breathing normally', value: 'yes' },
            { label: 'No breathing or only gasping', value: 'no' },
            { label: 'Unsure', value: 'unsure' },
          ],
        },
      },
      {
        id: 'unconscious-6',
        title: 'If Breathing: Recovery Position',
        instruction: 'If breathing normally, roll them onto their side (recovery position). This keeps airway clear.',
        alternatives: ['Skip to CPR if not breathing'],
      },
      {
        id: 'unconscious-7',
        title: 'If NOT Breathing: Start CPR',
        instruction: 'Begin CPR immediately. Place heel of hand on center of chest. Push hard and fast.',
        actionButton: { label: 'Start CPR Mode', action: 'cpr' },
        warning: 'Every second counts. Start compressions now if not breathing.',
      },
      {
        id: 'unconscious-8',
        title: 'Look for an AED',
        instruction: 'Ask someone to find an AED (Automated External Defibrillator). Common in malls, gyms, offices.',
        quickQuestion: {
          id: 'unconscious-aed',
          question: 'Is an AED available?',
          options: [
            { label: 'Yes, someone is getting it', value: 'yes' },
            { label: 'No AED available', value: 'no' },
            { label: 'Don\'t know', value: 'unknown' },
          ],
        },
      },
      {
        id: 'unconscious-9',
        title: 'Continue Until Help Arrives',
        instruction: 'Keep performing CPR or monitoring breathing until emergency services take over.',
        warning: 'Do not stop CPR unless the person starts breathing or you are too exhausted to continue.',
      },
    ],
    nextQuestions: ['Is the person breathing now?', 'How long unconscious?', 'Is there an AED?'],
    summaryTemplate: {
      fields: ['Duration unconscious', 'CPR provided', 'AED used', 'Breathing status'],
      recommendations: ['Continue CPR until EMS arrives', 'Do not stop unless person recovers'],
    },
  },
  {
    id: 'chest-pain',
    category: 'Chest Pain / Stroke',
    icon: 'heart',
    description: 'Heart attack or stroke symptoms',
    priorityHint: 'P1',
    initialQuestions: [
      {
        id: 'chest-age',
        question: 'Patient age group?',
        options: [
          { label: 'Adult (18-65)', value: 'adult' },
          { label: 'Elderly (65+)', value: 'elderly' },
          { label: 'Young adult (under 18)', value: 'young' },
        ],
      },
    ],
    steps: [
      {
        id: 'chest-1',
        title: 'Call 911 Immediately',
        instruction: 'Heart attacks and strokes are medical emergencies. Call 911 right now.',
        actionButton: { label: 'Call 911 Now', action: 'call911' },
        warning: 'Do NOT drive the person to the hospital yourself. Wait for ambulance.',
      },
      {
        id: 'chest-2',
        title: 'Help Them Sit Down',
        instruction: 'Have the person sit in a comfortable position, usually half-sitting with knees bent. Support their back.',
        quickQuestion: {
          id: 'chest-conscious',
          question: 'Is the person conscious and alert?',
          options: [
            { label: 'Yes, conscious', value: 'yes' },
            { label: 'Drowsy/confused', value: 'confused' },
            { label: 'Unconscious', value: 'no' },
          ],
        },
      },
      {
        id: 'chest-3',
        title: 'Loosen Tight Clothing',
        instruction: 'Unbutton their shirt, loosen belt, remove tie or scarf. Help them breathe easier.',
      },
      {
        id: 'chest-4',
        title: 'Ask About Pain',
        instruction: 'Ask: Where is the pain? Does it spread to arm, jaw, or back? When did it start?',
        quickQuestion: {
          id: 'chest-pain-location',
          question: 'Where is the pain spreading?',
          options: [
            { label: 'Left arm', value: 'arm' },
            { label: 'Jaw or neck', value: 'jaw' },
            { label: 'Back', value: 'back' },
            { label: 'Nowhere, just chest', value: 'chest-only' },
          ],
        },
      },
      {
        id: 'chest-5',
        title: 'Check FAST for Stroke',
        instruction: 'F-Face: Ask them to smile. Is one side drooping?\nA-Arms: Raise both arms. Does one drift down?\nS-Speech: Ask them to repeat a phrase. Is it slurred?\nT-Time: Note the time symptoms started.',
        quickQuestion: {
          id: 'chest-fast',
          question: 'Any FAST warning signs?',
          options: [
            { label: 'Yes, face drooping', value: 'face' },
            { label: 'Yes, arm weakness', value: 'arm' },
            { label: 'Yes, speech problems', value: 'speech' },
            { label: 'None of these', value: 'none' },
          ],
        },
      },
      {
        id: 'chest-6',
        title: 'Aspirin (If Appropriate)',
        instruction: 'If the person is NOT allergic and has no history of bleeding problems, they can chew one regular aspirin (325mg).',
        warning: 'Do NOT give aspirin if: allergic, bleeding disorder, already on blood thinners, or doctor advised against it.',
        quickQuestion: {
          id: 'chest-aspirin',
          question: 'Did you give aspirin?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No, allergic/contraindicated', value: 'no-allergy' },
            { label: 'No, not available', value: 'no-unavailable' },
          ],
        },
      },
      {
        id: 'chest-7',
        title: 'Keep Them Calm',
        instruction: 'Stress makes heart problems worse. Speak calmly, reassure them help is coming.',
      },
      {
        id: 'chest-8',
        title: 'Monitor Breathing',
        instruction: 'Watch their breathing. If they become unconscious or stop breathing, be ready to start CPR.',
        quickQuestion: {
          id: 'chest-breathing',
          question: 'How is their breathing?',
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Rapid/shallow', value: 'rapid' },
            { label: 'Difficult/labored', value: 'labored' },
            { label: 'Not breathing', value: 'none' },
          ],
        },
      },
      {
        id: 'chest-9',
        title: 'Be Ready for CPR',
        instruction: 'If they become unconscious and stop breathing, start CPR immediately.',
        actionButton: { label: 'Go to CPR Mode', action: 'cpr' },
      },
      {
        id: 'chest-10',
        title: 'Note Time and Details',
        instruction: 'Tell paramedics: when symptoms started, medications taken, medical history if known.',
      },
    ],
    nextQuestions: ['When did pain start?', 'Any FAST symptoms?', 'History of heart problems?'],
    summaryTemplate: {
      fields: ['Symptom onset time', 'Pain description', 'FAST results', 'Aspirin given'],
      recommendations: ['Keep monitoring', 'Be prepared for CPR'],
    },
  },
  {
    id: 'burns',
    category: 'Burns',
    icon: 'flame',
    description: 'Thermal, chemical, or electrical burns',
    priorityHint: 'P2',
    initialQuestions: [
      {
        id: 'burns-type',
        question: 'What type of burn?',
        options: [
          { label: 'Heat/Fire', value: 'thermal' },
          { label: 'Chemical', value: 'chemical' },
          { label: 'Electrical', value: 'electrical' },
          { label: 'Sunburn', value: 'sun' },
        ],
      },
    ],
    steps: [
      {
        id: 'burns-1',
        title: 'Remove from Heat Source',
        instruction: 'Get away from the heat source. Put out flames by "Stop, Drop, and Roll" if clothes are on fire.',
        warning: 'For electrical burns, do NOT touch the person until power source is off.',
      },
      {
        id: 'burns-2',
        title: 'Remove Clothing Near Burn',
        instruction: 'Carefully remove clothing and jewelry near the burn area. They retain heat.',
        warning: 'Do NOT remove anything stuck to the burn. Cut around it if needed.',
      },
      {
        id: 'burns-3',
        title: 'Cool with Running Water',
        instruction: 'Hold the burned area under cool (not cold) running water for 10-20 minutes.',
        warning: 'Do NOT use ice, iced water, butter, oil, or toothpaste. These cause more damage.',
      },
      {
        id: 'burns-4',
        title: 'Assess the Burn Size',
        instruction: 'The palm of the burned person\'s hand = about 1% of body. Burns larger than 3 palms need emergency care.',
        quickQuestion: {
          id: 'burns-size',
          question: 'How large is the burn?',
          options: [
            { label: 'Smaller than palm', value: 'small' },
            { label: '1-3 palms size', value: 'medium' },
            { label: 'Larger than 3 palms', value: 'large' },
          ],
        },
      },
      {
        id: 'burns-5',
        title: 'Check Burn Location',
        instruction: 'Burns on face, hands, feet, genitals, or joints are more serious and need medical attention.',
        quickQuestion: {
          id: 'burns-location',
          question: 'Where is the burn located?',
          options: [
            { label: 'Face/neck', value: 'face' },
            { label: 'Hands/feet', value: 'extremities' },
            { label: 'Arms/legs (not joints)', value: 'limbs' },
            { label: 'Torso', value: 'torso' },
          ],
        },
      },
      {
        id: 'burns-6',
        title: 'Remove Tight Items',
        instruction: 'Remove rings, watches, tight clothing. Burned areas may swell.',
      },
      {
        id: 'burns-7',
        title: 'Cover the Burn',
        instruction: 'Use a clean, dry, non-fluffy dressing. Cling film works well. Do NOT wrap tightly.',
        alternatives: ['Use a clean plastic bag for hand burns'],
      },
      {
        id: 'burns-8',
        title: 'Do NOT Pop Blisters',
        instruction: 'Blisters protect the healing skin underneath. Leave them intact.',
        warning: 'Popping blisters increases infection risk.',
      },
      {
        id: 'burns-9',
        title: 'Watch for Shock',
        instruction: 'Large burns can cause shock. Keep person lying down and warm (not the burn). Elevate legs if possible.',
        quickQuestion: {
          id: 'burns-shock',
          question: 'Signs of shock present?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ],
        },
      },
      {
        id: 'burns-10',
        title: 'Call 911 if Severe',
        instruction: 'Call emergency services if: large burn, on face/joints, chemical/electrical, or person is in shock.',
        actionButton: { label: 'Call 911', action: 'call911' },
      },
    ],
    nextQuestions: ['What caused the burn?', 'How large is the burned area?', 'Any smoke inhalation?'],
    summaryTemplate: {
      fields: ['Burn type', 'Body area', 'Burn size', 'Cooling time'],
      recommendations: ['Seek medical care for serious burns', 'Watch for infection'],
    },
  },
  {
    id: 'choking',
    category: 'Choking',
    icon: 'alert-circle',
    description: 'Airway obstruction in adults or children',
    priorityHint: 'P1',
    initialQuestions: [
      {
        id: 'choking-age',
        question: 'Who is choking?',
        options: [
          { label: 'Adult or child over 1 year', value: 'adult' },
          { label: 'Infant (under 1 year)', value: 'infant' },
          { label: 'Pregnant woman', value: 'pregnant' },
          { label: 'Very obese person', value: 'obese' },
        ],
      },
    ],
    steps: [
      {
        id: 'choking-1',
        title: 'Confirm Choking',
        instruction: 'Ask "Are you choking?" Look for: hands at throat, inability to speak, cough, or breathe.',
        quickQuestion: {
          id: 'choking-confirm',
          question: 'Can they speak or cough?',
          options: [
            { label: 'Yes, coughing forcefully', value: 'mild' },
            { label: 'No, silent or weak cough', value: 'severe' },
          ],
        },
      },
      {
        id: 'choking-2',
        title: 'If Coughing: Encourage It',
        instruction: 'If they can cough, encourage them to keep coughing. Stay with them but let them try to clear it.',
      },
      {
        id: 'choking-3',
        title: 'Call for Help',
        instruction: 'If coughing doesn\'t work or they can\'t cough, have someone call 911 while you help.',
        actionButton: { label: 'Call 911', action: 'call911' },
      },
      {
        id: 'choking-4',
        title: 'Give 5 Back Blows',
        instruction: 'Stand behind them. Lean them forward. Give 5 sharp blows between the shoulder blades with heel of your hand.',
      },
      {
        id: 'choking-5',
        title: 'Give 5 Abdominal Thrusts',
        instruction: 'Stand behind, wrap arms around waist. Make a fist just above the navel. Thrust inward and upward firmly.',
        warning: 'For pregnant/obese: do chest thrusts instead (around the chest, not abdomen).',
      },
      {
        id: 'choking-6',
        title: 'Repeat: 5 Back Blows + 5 Thrusts',
        instruction: 'Alternate between 5 back blows and 5 abdominal thrusts until the object comes out.',
        quickQuestion: {
          id: 'choking-cleared',
          question: 'Did the object come out?',
          options: [
            { label: 'Yes, cleared', value: 'yes' },
            { label: 'No, still choking', value: 'no' },
          ],
        },
      },
      {
        id: 'choking-7',
        title: 'If They Become Unconscious',
        instruction: 'Lower them carefully to the ground. Begin CPR immediately.',
        actionButton: { label: 'Start CPR Mode', action: 'cpr' },
        warning: 'Check mouth for visible object before giving rescue breaths.',
      },
      {
        id: 'choking-8',
        title: 'After Object is Out',
        instruction: 'Even if successful, seek medical attention. There may be internal injuries or remaining blockage.',
        quickQuestion: {
          id: 'choking-breathing',
          question: 'Are they breathing normally now?',
          options: [
            { label: 'Yes, breathing normally', value: 'yes' },
            { label: 'Still having difficulty', value: 'no' },
          ],
        },
      },
    ],
    nextQuestions: ['Is person still choking?', 'Object expelled?', 'Breathing normally?'],
    summaryTemplate: {
      fields: ['Choking object', 'Cycles performed', 'Object expelled', 'CPR required'],
      recommendations: ['Seek medical check even after clearance', 'Watch breathing'],
    },
  },
  {
    id: 'seizure',
    category: 'Seizure',
    icon: 'zap',
    description: 'Convulsions and seizure episodes',
    priorityHint: 'P2',
    initialQuestions: [
      {
        id: 'seizure-history',
        question: 'Does this person have a seizure history?',
        options: [
          { label: 'Yes, known epilepsy', value: 'known' },
          { label: 'No / First time', value: 'first' },
          { label: 'Don\'t know', value: 'unknown' },
        ],
      },
    ],
    steps: [
      {
        id: 'seizure-1',
        title: 'Stay Calm',
        instruction: 'Most seizures end on their own within 1-2 minutes. Your role is to keep them safe.',
      },
      {
        id: 'seizure-2',
        title: 'Time the Seizure',
        instruction: 'Note when the seizure started. This is important information for medical responders.',
        actionButton: { label: 'Start Timer', action: 'timer' },
        quickQuestion: {
          id: 'seizure-duration',
          question: 'How long has it been going?',
          options: [
            { label: 'Just started', value: '0-1min' },
            { label: '1-3 minutes', value: '1-3min' },
            { label: 'More than 5 minutes', value: '5+min' },
          ],
        },
      },
      {
        id: 'seizure-3',
        title: 'Protect from Injury',
        instruction: 'Clear away hard or sharp objects. Move furniture if possible.',
        warning: 'Do NOT restrain them or hold them down.',
      },
      {
        id: 'seizure-4',
        title: 'Cushion Their Head',
        instruction: 'Place something soft under their head - jacket, pillow, your hands if nothing else available.',
      },
      {
        id: 'seizure-5',
        title: 'Do NOT Put Anything in Mouth',
        instruction: 'They will not swallow their tongue. Putting objects in mouth can cause injury.',
        warning: 'Never put fingers, spoons, or other objects in their mouth.',
      },
      {
        id: 'seizure-6',
        title: 'Call 911 If Needed',
        instruction: 'Call 911 if: first seizure, lasts 5+ minutes, person is injured, pregnant, diabetic, or doesn\'t wake up.',
        actionButton: { label: 'Call 911', action: 'call911' },
        quickQuestion: {
          id: 'seizure-call911',
          question: 'Do any of these apply?',
          options: [
            { label: 'First seizure', value: 'first' },
            { label: 'Lasting 5+ minutes', value: 'long' },
            { label: 'Person is injured', value: 'injured' },
            { label: 'None of these', value: 'none' },
          ],
        },
      },
      {
        id: 'seizure-7',
        title: 'After Seizure Stops',
        instruction: 'Gently roll them onto their side (recovery position) to keep airway clear.',
      },
      {
        id: 'seizure-8',
        title: 'Stay and Reassure',
        instruction: 'They may be confused or tired after. Stay with them, speak calmly, explain what happened.',
        quickQuestion: {
          id: 'seizure-conscious',
          question: 'Are they responsive now?',
          options: [
            { label: 'Yes, awake but confused', value: 'confused' },
            { label: 'Yes, fully alert', value: 'alert' },
            { label: 'Not responsive', value: 'unresponsive' },
          ],
        },
      },
      {
        id: 'seizure-9',
        title: 'Check for Injuries',
        instruction: 'Once they\'re alert, check for any injuries from the seizure.',
      },
      {
        id: 'seizure-10',
        title: 'Wait for Full Recovery',
        instruction: 'Do not leave them alone until fully recovered. This may take 5-30 minutes.',
      },
    ],
    nextQuestions: ['How long did seizure last?', 'First seizure?', 'Person conscious now?'],
    summaryTemplate: {
      fields: ['Seizure duration', 'First seizure', 'Known epilepsy', 'Injuries'],
      recommendations: ['Stay until fully alert', 'Note details for medical team'],
    },
  },
];

export const mockDispatcherCases: DispatcherCase[] = [
  {
    id: 'case-001',
    category: 'Chest Pain / Stroke',
    priority: 'P1',
    reportedAt: new Date(Date.now() - 5 * 60 * 1000),
    location: '123 Main Street, Downtown',
    summary: '65-year-old male, crushing chest pain radiating to left arm. History of hypertension.',
    status: 'active',
    suggestedActions: ['Dispatch ambulance with ALS', 'Advise aspirin if not contraindicated', 'Prepare for potential cardiac arrest'],
    suggestedQuestions: ['Has the person taken nitroglycerin?', 'Any changes in consciousness?', 'Is there an AED available on scene?'],
    stepsCompleted: ['Called 911', 'Person seated', 'Aspirin given'],
  },
  {
    id: 'case-002',
    category: 'Breathing / Unconscious',
    priority: 'P1',
    reportedAt: new Date(Date.now() - 2 * 60 * 1000),
    location: '456 Oak Avenue, Residential',
    summary: 'Adult female found unresponsive. Bystander performing CPR. No AED available.',
    status: 'active',
    suggestedActions: ['Dispatch with lights and sirens', 'Guide bystander through CPR', 'Locate nearest AED'],
    suggestedQuestions: ['Is CPR being performed correctly?', 'Any signs of life?', 'What was the person doing before collapse?'],
    stepsCompleted: ['Response check', 'Called 911', 'CPR started'],
  },
  {
    id: 'case-003',
    category: 'Accident / Bleeding',
    priority: 'P2',
    reportedAt: new Date(Date.now() - 12 * 60 * 1000),
    location: '789 Industrial Blvd, Factory District',
    summary: 'Workplace accident, deep laceration to forearm. Bleeding controlled with pressure.',
    status: 'pending',
    suggestedActions: ['Dispatch ambulance', 'Maintain pressure on wound', 'Monitor for shock'],
    suggestedQuestions: ['Is bleeding still controlled?', 'Any numbness or tingling?', 'Is the wound contaminated?'],
    stepsCompleted: ['Safety ensured', 'Called 911', 'Pressure applied', 'Wound elevated'],
  },
];

export const mockNearbyServices: NearbyService[] = [
  { id: 'hosp-1', name: 'City General Hospital', type: 'hospital', address: '100 Medical Center Drive', distance: '1.2 mi', eta: '5 min', phone: '(555) 123-4567', isOpen24h: true },
  { id: 'hosp-2', name: 'St. Mary Medical Center', type: 'hospital', address: '250 Healthcare Blvd', distance: '2.8 mi', eta: '10 min', phone: '(555) 234-5678', isOpen24h: true },
  { id: 'pharm-1', name: 'CVS Pharmacy', type: 'pharmacy', address: '55 Main Street', distance: '0.3 mi', eta: '2 min', phone: '(555) 345-6789', isOpen24h: true },
  { id: 'police-1', name: 'Central Police Station', type: 'police', address: '1 Police Plaza', distance: '0.5 mi', eta: '3 min', phone: '911', isOpen24h: true },
  { id: 'fire-1', name: 'Fire Station #7', type: 'fire', address: '75 Firefighter Way', distance: '0.7 mi', eta: '3 min', phone: '911', isOpen24h: true },
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
