// Reusable Heritage Game Data Store: States, Locations, Lore, Mini-Games, and Quizzes

export const ALL_STATES = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    tagline: 'Land of Kings, Forts & Desert Legends',
    era: '8th – 18th Century CE',
    capital: 'Jaipur',
    status: 'unlocked', // active playable state
    landmarkCount: 4,
    badge: 'Royal Falcon Crest',
    accentColor: '#e6b325',
    themeGradient: 'linear-gradient(135deg, #e6b325 0%, #c2593f 100%)',
    description: 'Explore the golden sands of the Thar, impregnable hill fortresses, celestial stone observatories, and mirror palaces of Rajputana.',
    monumentsPreview: ['Amer Fort', 'Jantar Mantar', 'Mehrangarh Fort', 'Kumbhalgarh']
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    tagline: 'Realm of Dravidian Temples & Living Chola Art',
    era: '3rd Century BCE – 13th Century CE',
    capital: 'Chennai',
    status: 'locked',
    landmarkCount: 5,
    badge: 'Chola Royal Tiger',
    accentColor: '#10b981',
    themeGradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    description: 'Home to soaring Gopurams, Brihadeeswarar Temple, and the UNESCO coastal shore marvels of Mahabalipuram.',
    monumentsPreview: ['Thanjavur Big Temple', 'Mahabalipuram', 'Meenakshi Amman', 'Gangaikonda Cholapuram']
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    tagline: 'Rock-Cut Caves & Maratha Sea Citadels',
    era: '2nd Century BCE – 17th Century CE',
    capital: 'Mumbai',
    status: 'locked',
    landmarkCount: 4,
    badge: 'Shivaji Golden Hoof',
    accentColor: '#f97316',
    themeGradient: 'linear-gradient(135deg, #f97316 0%, #b45309 100%)',
    description: 'Marvel at Ajanta-Ellora cave frescoes, Kailasa temple carved from a single mountain, and Raigad mountain strongholds.',
    monumentsPreview: ['Ellora Caves', 'Ajanta Frescoes', 'Raigad Fort', 'Sindhudurg']
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    tagline: 'Cradle of Civilizations & Ganga Heritage',
    era: '6th Century BCE – 17th Century CE',
    capital: 'Lucknow',
    status: 'locked',
    landmarkCount: 4,
    badge: 'Vedic Sacred Conch',
    accentColor: '#8b5cf6',
    themeGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    description: 'Varanasi Ghats, Sarnath Dhamek Stupa, and the architectural symmetry of Fatehpur Sikri and Agra.',
    monumentsPreview: ['Varanasi Ghats', 'Sarnath Stupa', 'Fatehpur Sikri', 'Agra Fort']
  }
];

export const RAJASTHAN_STATE_DATA = {
  id: 'rajasthan',
  name: 'Rajasthan',
  fullName: 'Rajasthan: Realm of Forts & Stargazers',
  motto: 'Padharo Mhare Des (Welcome to Our Land)',
  totalRelics: 4,
  overview: 'Spanning the Aravalli mountain spine and the Great Indian Desert, Rajasthan holds a thousand years of architectural brilliance, strategic defense planning, and celestial science.',
  
  // Interactive Map Regions
  regions: [
    { id: 'dhundhar', name: 'Dhundhar (Jaipur & Amer)', desc: 'Seat of Kachhwaha rulers, stone observatories, and mirror palaces.' },
    { id: 'marwar', name: 'Marwar (Jodhpur & Thar)', desc: 'Sun City deserts defended by Mehrangarh on sheer volcanic cliffs.' },
    { id: 'mewar', name: 'Mewar (Udaipur & Kumbhalgarh)', desc: 'Valley of heroic resistance, lake palaces, and the 36km Great Wall.' }
  ],

  locations: [
    {
      id: 'amer-fort',
      name: 'Amer Fort & Sheesh Mahal',
      subtitle: 'The Mirror Citadel of Amber',
      region: 'Dhundhar (Jaipur)',
      era: '1592 CE (Raja Man Singh I)',
      coordinates: { x: 74, y: 38 }, // Percentage on state SVG map
      bgTheme: 'from-amber-900 to-amber-950',
      status: 'unlocked', // playable immediately
      difficulty: 'Novice Trial',
      estTime: '3-4 mins',
      shortDesc: 'A hilltop fortress blending Rajput and Mughal elegance, housing the famed Palace of Mirrors.',
      heroImage: '/assets/monuments/amer-fort/amer-fort-panorama.jpg',
      gallery: [
        {
          id: 'panorama',
          url: '/assets/monuments/amer-fort/amer-fort-panorama.jpg',
          title: 'Amer Fort & Maota Lake',
          caption: 'Panoramic view of Amer Fort overlooking Maota Lake and the star-shaped Kesar Kyari garden in Jaipur.'
        },
        {
          id: 'sheesh-mahal',
          url: '/assets/monuments/amer-fort/sheesh-mahal-interior.jpg',
          title: 'Sheesh Mahal (Hall of Mirrors)',
          caption: 'The celebrated Hall of Mirrors decorated with thousands of convex imported glass facets and marble arches.'
        }
      ],
      guide: {
        name: 'Acharya Vikram',
        role: 'Royal Chronicler & Archeologist of Amer',
        avatarText: 'AV',
        introDialogue: [
          'Khamma Ghani, traveler! Welcome to Amer Fort, crowned high upon the rugged Aravalli crest overlooking Maota Lake.',
          'You are entering the Sheesh Mahal—the Hall of Mirrors. Crafted with convex Belgian mirrors set in delicate plaster, even a single candle can illuminate the entire pavilion like a galaxy of stars.',
          'The morning sunlight has just struck the eastern threshold. Align the brass optical prisms to channel the light beam and illuminate the Royal Chandelier!'
        ]
      },
      highlights: [
        {
          title: 'Convex Mirror Inlays',
          description: 'Mirrors imported from Aleppo and Venice, cut into teardrop and floral patterns that refract light without generating excess heat.'
        },
        {
          title: 'Maota Lake & Kesar Kyari',
          description: 'A floating star-shaped saffron garden set within the lake, engineered to cool the summer breeze blowing into the fort.'
        },
        {
          title: 'Ingenious Rehat Water Lift',
          description: 'A 5-tier mechanical Persian wheel pulley system powered by bullocks that raised lake water 400 feet up to royal reservoirs.'
        }
      ],
      minigame: {
        type: 'MIRROR_PUZZLE',
        title: 'Sheesh Mahal: Optical Light Alignment',
        instructions: 'Tap or click the brass mirror prisms to rotate them. Reflect the golden sunbeam around stone pillars to strike the Royal Chandelier at the center!',
        laserStart: { row: 0, col: 0, direction: 'RIGHT' }, // Starts going right from top-left
        target: { row: 3, col: 3 }
      },
      quiz: [
        {
          id: 'amer_q1',
          question: 'What optical property allowed the Sheesh Mahal (Mirror Palace) to be illuminated with just one or two oil lamps?',
          options: [
            'Thousands of concave & convex glass mirrors angled to multiply focal points',
            'Hidden fluorescent minerals extracted from the Aravalli rock beds',
            'Subterranean copper reflection tubes channeling volcanic heat',
            'High-altitude diamond crystal domes capturing moonlight'
          ],
          correctIndex: 0,
          explanation: 'Thousands of convex and concave glass mirrors were set inside stucco floral patterns. Curved mirror facets disperse and multiply light rays repeatedly, illuminating the entire chamber.'
        },
        {
          id: 'amer_q2',
          question: 'How did Rajput engineers supply water to the high citadel of Amer Fort from the lake below?',
          options: [
            'Relying solely on seasonal monsoon rainwater collected in buckets',
            'A multi-tier Persian wheel (Rehat) mechanism lifting water sequentially across 5 levels',
            'Manual transport on royal elephant caravans every morning',
            'Siphon pipes connected directly to the Yamuna river 200 km away'
          ],
          correctIndex: 1,
          explanation: 'Engineers designed a series of Persian wheels (Rehat/Araghatta) driven by bullocks. Water was hoisted in clay pots from Maota Lake step-by-step into 5 elevated reservoirs.'
        },
        {
          id: 'amer_q3',
          question: 'Which lake sits directly beneath Amer Fort, cradling the world-famous Kesar Kyari garden?',
          options: [
            'Maota Lake',
            'Pichola Lake',
            'Fateh Sagar Lake',
            'Pushkar Sacred Lake'
          ],
          correctIndex: 0,
          explanation: 'Maota Lake cradles the Kesar Kyari (Saffron Garden) at the foot of Amer Fort and acted as the fort’s primary defensive moat and water reservoir.'
        }
      ],
      relic: {
        id: 'relic_amer_mirror',
        name: 'Sun Mirror of Amer',
        tier: 'Legendary Relic',
        xpReward: 350,
        lore: 'A masterfully engraved brass mirror prism bearing the solar crest of Amer. It represents ancient India’s mastery of optical physics and architectural luxury.',
        iconType: 'mirror'
      }
    },

    {
      id: 'mehrangarh-fort',
      name: 'Mehrangarh Fort',
      subtitle: 'The Citadel of the Sun in the Blue City',
      region: 'Marwar (Jodhpur)',
      era: '1459 CE (Rao Jodha)',
      coordinates: { x: 38, y: 56 },
      bgTheme: 'from-blue-950 to-slate-950',
      status: 'locked',
      difficulty: 'Warrior Trial',
      estTime: '3 mins',
      shortDesc: 'A colossal fort rising 400 feet above the blue city of Jodhpur on sheer volcanic cliffs.',
      heroImage: '/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg',
      gallery: [
        {
          id: 'panorama',
          url: '/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg',
          title: 'Mehrangarh Fort & Jodhpur',
          caption: 'Historic panoramic view of the 15th-century sandstone fortress towering on volcanic cliffs above the Blue City.'
        }
      ],
      guide: {
        name: 'Acharya Vikram',
        role: 'Royal Chronicler & Archeologist',
        avatarText: 'AV',
        introDialogue: [
          'Another chapter of Rajasthan awaits.',
          'Mehrangarh rises above Jodhpur like a fortress carved from the landscape.',
          'Somewhere within these walls lies an ancient story waiting to be decoded.'
        ]
      },
      quest: {
        title: 'THE HIDDEN INSCRIPTION',
        objective: 'Find the inscription fragments hidden within the fort.',
        totalFragments: 3
      },
      inscriptionFragments: [
        {
          id: 'frag_foundation',
          title: 'Foundation Inscription (1459 CE)',
          subtitle: 'Rao Jodha’s Founding of the Sun Citadel',
          order: 1,
          area: 'Foundation Bastion (Bhakurcheeria Cliff)',
          x: 480,
          y: 420,
          shortTag: '1459 CE Foundation',
          ancientScript: '१४५९ संवत् राव जोधा निर्मित मिहिरगढ़ प्राकार',
          transcription: '1459 CE — Rao Jodha establishes the Sun Citadel upon the volcanic cliff of Bhakurcheeria.',
          description: 'The foundation stone marks the relocation of the Marwar capital from Mandore to the impregnable 122-meter volcanic ridge. Named Mihirgarh (Fort of the Sun), it was later known in the Marwari tongue as Mehrangarh.',
          vikramQuote: 'Look closely at the weathered stone! In 1459 CE, Rao Jodha laid this foundation high above the desert sands, carving the fortress straight into the rock face.',
          discoveryXP: 25
        },
        {
          id: 'frag_gates',
          title: 'Jayapol Victory Inscription',
          subtitle: 'Seven Gates of Impregnable Defense',
          order: 2,
          area: 'Great Ramparts (Jayapol Gateway)',
          x: 1950,
          y: 390,
          shortTag: 'Seven Great Gates',
          ancientScript: 'सप्त महाद्वार रक्षित जयपोल विजय स्तम्भ',
          transcription: 'Seven monumental gates rise to defend Marwar, crowned by the victorious Jayapol portal.',
          description: 'Built to commemorate victories over invading forces, the Jayapol is one of seven successive defensive gateways designed with sharp 90-degree angles to prevent elephant rams from gaining momentum.',
          vikramQuote: 'Notice the steep, angled ramps between these massive gateways. No siege engine could gather speed on these narrow turns—a masterstroke of medieval military architecture.',
          discoveryXP: 25
        },
        {
          id: 'frag_water',
          title: 'Ranisar & Solar Inscription',
          subtitle: 'Desert Water Engineering & Solar Crest',
          order: 3,
          area: 'Deep Cistern Terrace (Ranisar Stepwell)',
          x: 1880,
          y: 1250,
          shortTag: 'Desert Stepwells',
          ancientScript: 'रानीसर पद्मसर जल संचयन सूर्य वंश ध्वज',
          transcription: 'Ranisar and Padamsar stepwells capture every drop of monsoon rain to sustain the Sun Citadel.',
          description: 'Commissioned by Queen Jasmade Hadi in 1459 CE, the subterranean Ranisar and Padamsar reservoirs collected mountain runoff from the rocky slopes, ensuring Mehrangarh never surrendered due to lack of water.',
          vikramQuote: 'Water was life in the Thar. By sculpting stone channels into the volcanic rock, Mehrangarh held millions of liters of pristine rainwater through years of drought.',
          discoveryXP: 25
        }
      ],
      highlights: [
        {
          title: 'Volcanic Cliff Foundation',
          description: 'Constructed on a 122-meter-high sheer rock cliff known as the Mountain of Birds (Bhakurcheeria).'
        },
        {
          title: 'Intricate Sandstone Jharokhas',
          description: 'Over 250 latticed stone screen designs that allowed cool air to circulate while providing privacy.'
        },
        {
          title: 'Legendary Cannons & Ramparts',
          description: 'The ramparts house historic cannons such as the Kilkila and Bhavani, commanding a 360-degree desert vista.'
        }
      ],
      minigame: {
        type: 'INSCRIPTION_DECODER',
        title: 'Decode the Ancient Inscription',
        instructions: 'Arrange the 3 recovered inscription fragments in chronological and historical sequence to reveal Mehrangarh’s epic story!'
      },
      relic: {
        id: 'relic_mehrangarh_inscription',
        name: 'Mehrangarh Inscription Relic',
        tier: 'Legendary Relic',
        xpReward: 150,
        lore: 'An engraved red sandstone tablet bearing the founding seal of Rao Jodha and the solar crest of Marwar. It symbolizes the indomitable spirit of Rajasthan’s cliffside architecture.',
        iconType: 'relic'
      }
    },

    {
      id: 'jaisalmer-fort',
      name: 'Jaisalmer Fort',
      subtitle: 'The Living Golden Citadel (Sonar Qila)',
      region: 'Thar Desert (Jaisalmer)',
      era: '1156 CE (Rawal Jaisal)',
      coordinates: { x: 18, y: 48 },
      bgTheme: 'from-amber-950 to-yellow-950',
      status: 'locked',
      difficulty: 'Master Trial',
      estTime: '3 mins',
      shortDesc: 'The world-famous Sonar Qila sculpted from golden yellow sandstone, standing amid the Thar dunes.',
      heroImage: '/assets/monuments/jaisalmer-fort/jaisalmer-fort-panorama.jpg',
      guide: {
        name: 'Acharya Vikram',
        role: 'Royal Chronicler & Archeologist',
        avatarText: 'AV',
        introDialogue: [
          'Welcome to Jaisalmer, Explorer.',
          'This golden fortress stood along important routes connecting people, goods and ideas.',
          'Your task is to piece together the journey.'
        ]
      },
      quest: {
        title: 'THE GOLDEN ROUTE',
        objective: 'Find the 3 trade-route clues.',
        totalClues: 3
      },
      tradeRouteClues: [
        {
          id: 'clue_caravan',
          title: 'Caravan Route',
          subtitle: 'Silk, Spice & Desert Waypoints',
          order: 1,
          area: 'Dune Gate Approach (Akhai Pol)',
          x: 480,
          y: 420,
          shortTag: 'Caravan Route',
          description: 'Positioned strategically in the heart of the Great Thar Desert, Jaisalmer was the primary crossroads for camel caravans travelling between India, Persia, Arabia, and Central Asia.',
          vikramQuote: 'Look across the desert sands! Merchant caravans with hundreds of camels would travel for weeks across treacherous dunes, guided by stars to reach the safety of Jaisalmer.',
          discoveryXP: 25
        },
        {
          id: 'clue_trade',
          title: 'Desert Trade',
          subtitle: 'Silk, Spices, Opium & Stonecraft',
          order: 2,
          area: 'Central Bazaar Square (Manak Chowk)',
          x: 1950,
          y: 390,
          shortTag: 'Desert Trade',
          description: 'Merchants exchanged fine silks, precious gemstones, desert salt, saffron, and fragrant spices. The fort collected transit duties that funded palatial architecture and municipal stepwells.',
          vikramQuote: 'The bazaars echoed with dozens of languages. Wealth flowed through these stone corridors, allowing master masons to sculpt palaces like delicate lace.',
          discoveryXP: 25
        },
        {
          id: 'clue_living_heritage',
          title: 'Jaisalmer\'s Living Heritage',
          subtitle: 'Sonar Qila & The Living Community',
          order: 3,
          area: 'Royal Haveli Courtyard (Patwon Ki Haveli)',
          x: 1880,
          y: 1250,
          shortTag: 'Living Heritage',
          description: 'Constructed in 1156 CE by Rawal Jaisal from yellow Jurassic sandstone, Sonar Qila remains one of the world\'s few functioning "living forts", where thousands of families, craftsmen, and merchants still reside.',
          vikramQuote: 'Observe the bustling houses and intricately carved jali stone screens! Heritage here is not a quiet relic—it is a vibrant, continuous way of life spanning eight centuries.',
          discoveryXP: 25
        }
      ],
      highlights: [
        {
          title: 'Living Citadel of Sonar Qila',
          description: 'A thriving medieval city within fortress walls, housing centuries-old families, bazaars, and palaces.'
        },
        {
          title: 'Carved Sandstone Haveli Windows',
          description: 'Intricate filigree stone jali work on Patwon Ki Haveli and Salim Singh Ki Haveli.'
        },
        {
          title: 'Ancient Jain Temple Libraries',
          description: 'Houses 7 interconnected medieval Jain shrines preserving ancient palm-leaf manuscripts.'
        }
      ],
      minigame: {
        type: 'ROUTE_RECONSTRUCTION',
        title: 'Reconstruct the Golden Route',
        instructions: 'Arrange the trade journey milestones into the correct logical sequence to reveal Jaisalmer’s trade heritage!'
      },
      relic: {
        id: 'relic_jaisalmer_route',
        name: 'Golden Route Relic',
        tier: 'Legendary Relic',
        xpReward: 200,
        lore: 'A masterfully sculpted golden sandstone merchant seal bearing the caravan compass of the Thar Desert and the royal crest of Rawal Jaisal.',
        iconType: 'compass'
      }
    },

    {
      id: 'chittorgarh-fort',
      name: 'Chittorgarh Fort',
      subtitle: 'The Monumental Bastion of Rajput Valor',
      region: 'Mewar (Chittorgarh)',
      era: '7th Century CE (Mori Dynasty / Bappa Rawal)',
      coordinates: { x: 56, y: 82 },
      bgTheme: 'from-red-950 to-slate-950',
      status: 'locked',
      difficulty: 'Legendary Trial',
      estTime: '4 mins',
      shortDesc: 'A colossal 700-acre hilltop bastion crowned by the 9-story Vijay Stambha (Tower of Victory).',
      heroImage: '/assets/monuments/chittorgarh-fort/chittorgarh-fort-panorama.jpg',
      guide: {
        name: 'Acharya Vikram',
        role: 'Royal Chronicler & Archeologist',
        avatarText: 'AV',
        introDialogue: [
          'You have travelled far, Explorer.',
          'Chittorgarh carries centuries of stories within its walls.',
          'But discovering heritage is only the beginning.',
          'Can you decide how it should be protected?'
        ]
      },
      quest: {
        title: 'THE PRESERVATION CHALLENGE',
        objective: 'Explore Chittorgarh and help identify how its heritage should be protected.',
        totalChallenges: 3
      },
      preservationChallenges: [
        {
          id: 'challenge_weathering',
          order: 1,
          title: 'Weathered Architecture',
          subtitle: 'Vijay Stambha Carvings & Natural Weathering',
          area: 'Tower of Victory (Vijay Stambha)',
          x: 550,
          y: 450,
          scenario: 'Ancient 15th-century sculptures and ornamental friezes on the exterior of Vijay Stambha are exposed to harsh monsoon rains, thermal expansion, and frequent physical visitor contact. How should these fragile surfaces be protected?',
          options: [
            {
              id: 'A',
              text: 'Install gentle protective perimeter barriers with clear viewing sightlines and informative tactile replicas nearby.',
              isBest: true,
              consequenceTitle: 'EXEMPLARY PRESERVATION DECISION',
              consequenceText: 'Reducing direct contact shields delicate 500-year-old stone carvings from natural oils and abrasion, while tactile replicas keep the site fully inclusive, accessible, and educational for all visitors.',
              vikramInsight: 'Conservation succeeds when we protect the original monument while keeping its knowledge alive and accessible.'
            },
            {
              id: 'B',
              text: 'Allow unrestricted touching and rubbing by all visitors for a hands-on tactile experience.',
              isBest: false,
              consequenceTitle: 'CONSERVATION HAZARD',
              consequenceText: 'Unrestricted touch rapidly wears away intricate chisel marks and transfers acidic skin oils that cause stone flaking and micro-fissures over time.',
              vikramInsight: 'Hands-on engagement is great, but delicate centuries-old stone cannot endure continuous physical abrasion.'
            },
            {
              id: 'C',
              text: 'Cover the entire tower permanently in opaque solid metal siding.',
              isBest: false,
              consequenceTitle: 'IMPAIRED HERITAGE ACCESS',
              consequenceText: 'Enclosing the monument in solid casing completely prevents visual appreciation, traps damaging condensation inside, and disfigures historical architecture.',
              vikramInsight: 'Preservation should never obliterate the visual beauty and educational value of the site itself.'
            }
          ],
          discoveryXP: 50
        },
        {
          id: 'challenge_crowding',
          order: 2,
          title: 'Visitor Impact',
          subtitle: 'Gateway Foot Traffic & Rampart Conservation',
          area: 'Ram Pol Gateway & Main Ramparts',
          x: 1850,
          y: 420,
          scenario: 'High visitor density during peak holiday seasons causes congestion along narrow medieval stairwells, creating physical foot-traffic friction and destabilizing unpaved rampart slopes. How should visitor flow be managed?',
          options: [
            {
              id: 'A',
              text: 'Design designated one-way walking pathways, clear interpretive signage, and timed visitor group entry.',
              isBest: true,
              consequenceTitle: 'BALANCED VISITOR FLOW RESTORED',
              consequenceText: 'Timed group dispersal and designated walking routes prevent bottleneck congestion and wear on ancient staircases, offering every visitor a safe, dignified, and serene educational journey.',
              vikramInsight: 'When visitors move along guided heritage trails, the monument breathes and stays protected for generations.'
            },
            {
              id: 'B',
              text: 'Allow visitors to freely climb across unpaved earthen slopes and fragile parapet ruins.',
              isBest: false,
              consequenceTitle: 'EROSION & INSTABILITY RISK',
              consequenceText: 'Unregulated climbing across unpaved slopes causes severe soil erosion and destabilizes ancient stone foundation footings during monsoon rains.',
              vikramInsight: 'Unmarked shortcuts degrade slope stability and put both the ruins and visitors at risk.'
            },
            {
              id: 'C',
              text: 'Barricade the entire fort and permanently close the site to the public.',
              isBest: false,
              consequenceTitle: 'LOSS OF LIVING CONNECTION',
              consequenceText: 'Shutting down public access permanently disconnects communities from their own cultural heritage and halts public education.',
              vikramInsight: 'A monument locked away loses its living voice. Heritage lives through responsible public stewardship.'
            }
          ],
          discoveryXP: 50
        },
        {
          id: 'challenge_water',
          order: 3,
          title: 'Water Heritage',
          subtitle: 'Gaumukh Kund Spring Reservoir Conservation',
          area: 'Gaumukh Kund Natural Spring',
          x: 1750,
          y: 1200,
          scenario: 'The historic Gaumukh Kund subterranean natural spring and its carved stone runoff channels face seasonal silt accumulation and surface debris. How should this ancient hydraulic engineering system be conserved?',
          options: [
            {
              id: 'A',
              text: 'Clean stone channels gently using eco-friendly heritage techniques and engage visitors in keeping water bodies pristine.',
              isBest: true,
              consequenceTitle: 'SUSTAINABLE WATER HERITAGE PRESERVED',
              consequenceText: 'Gentle periodic maintenance preserves medieval masonry joints and restores the natural spring flow, demonstrating how ancient Rajput water engineering enabled centuries of hilltop self-sufficiency.',
              vikramInsight: 'Traditional water systems are marvels of ecological engineering. Preserving Gaumukh Kund honors Mewar’s water wisdom.'
            },
            {
              id: 'B',
              text: 'Drain the spring completely and replace the stone channels with modern PVC plastic pipes.',
              isBest: false,
              consequenceTitle: 'DESTRUCTION OF HISTORIC HYDRAULICS',
              consequenceText: 'Replacing authentic hand-carved stone reservoirs with plastic piping permanently destroys irreplaceable medieval engineering heritage.',
              vikramInsight: 'Modern materials should not destroy historical craftsmanship when traditional restorative methods are available.'
            },
            {
              id: 'C',
              text: 'Leave the reservoir unmaintained without any cleaning or community guidance.',
              isBest: false,
              consequenceTitle: 'SILTATION & BIOLOGICAL DECAY',
              consequenceText: 'Neglecting natural springs leads to heavy silt build-up, unchecked root intrusion, and structural cracking of centuries-old retaining walls.',
              vikramInsight: 'Water bodies require proactive care. Inaction leads to irreversible structural collapse.'
            }
          ],
          discoveryXP: 50
        }
      ],
      highlights: [
        {
          title: 'Vijay Stambha (Tower of Victory)',
          description: 'A 9-story, 37-meter-tall tower adorned with hundreds of intricate stone carvings of Hindu deities.'
        },
        {
          title: 'Gaumukh Kund Reservoir',
          description: 'A natural subterranean spring emerging from a carved cow’s mouth, supplying fresh water across centuries.'
        },
        {
          title: 'Padmini’s Island Palace',
          description: 'A three-storied white palace pavilion surrounded by a cooling moat water reservoir.'
        }
      ],
      relic: {
        id: 'relic_chittorgarh_crest',
        name: 'Guardian of Chittorgarh',
        tier: 'Mythic Relic',
        xpReward: 250,
        lore: 'A sacred golden Mewari seal crowned with the Tower of Victory and the sunburst crest, awarded to true guardians of India’s living heritage.',
        iconType: 'flame'
      }
    }
  ]
};

// Initial Player State
export const INITIAL_PLAYER_STATS = {
  xp: 0,
  level: 1,
  rankTitle: 'Novice Explorer',
  unlockedLocations: ['amer-fort'], // Amer Fort is unlocked by default
  completedExplorations: [],        // Array of location IDs where exploration was completed
  completedLocations: [],           // Array of location IDs completed (restoration)
  completedQuizzes: [],             // Array of location IDs where quiz XP was claimed
  unlockedRelics: [],               // Array of Relic objects collected
  quizzesSolved: 0,
  puzzlesSolved: 0,
  activeState: 'rajasthan'
};

// Helper: Determine dynamic progression state for each Rajasthan destination
export function getLocationProgressionState(locationId, playerStats) {
  const completed = playerStats?.completedLocations || [];
  const completedExplorations = playerStats?.completedExplorations || [];
  const relics = playerStats?.unlockedRelics || [];

  const isAmerCompleted = completed.includes('amer-fort') || 
                          completedExplorations.includes('amer-fort') ||
                          relics.some(r => r.id === 'relic_amer_mirror');

  const isMehrangarhCompleted = completed.includes('mehrangarh-fort') ||
                                completedExplorations.includes('mehrangarh-fort') ||
                                relics.some(r => r.id === 'relic_mehrangarh_inscription');

  const isJaisalmerCompleted = completed.includes('jaisalmer-fort') ||
                               completedExplorations.includes('jaisalmer-fort') ||
                               relics.some(r => r.id === 'relic_jaisalmer_route');

  const isChittorgarhCompleted = completed.includes('chittorgarh-fort') ||
                                completedExplorations.includes('chittorgarh-fort') ||
                                relics.some(r => r.id === 'relic_chittorgarh_crest');

  switch (locationId) {
    case 'amer-fort':
      return isAmerCompleted ? 'COMPLETED' : 'UNLOCKED';
    case 'mehrangarh-fort':
      if (isMehrangarhCompleted) return 'COMPLETED';
      if (isAmerCompleted || playerStats?.unlockedLocations?.includes('mehrangarh-fort')) return 'UNLOCKED';
      return 'LOCKED';
    case 'jaisalmer-fort':
      if (isJaisalmerCompleted) return 'COMPLETED';
      if (isMehrangarhCompleted || playerStats?.unlockedLocations?.includes('jaisalmer-fort')) return 'UNLOCKED';
      return 'LOCKED';
    case 'chittorgarh-fort':
      if (isChittorgarhCompleted) return 'COMPLETED';
      if (isJaisalmerCompleted || playerStats?.unlockedLocations?.includes('chittorgarh-fort')) return 'UNLOCKED';
      return 'LOCKED';
    default:
      return 'LOCKED';
  }
}

// Helper: Get total completed locations in Rajasthan (0 to 4)
export function getCompletedRajasthanCount(playerStats) {
  const completed = playerStats?.completedLocations || [];
  const completedExplorations = playerStats?.completedExplorations || [];
  const relics = playerStats?.unlockedRelics || [];

  const isAmerDone = completed.includes('amer-fort') || 
                     completedExplorations.includes('amer-fort') ||
                     relics.some(r => r.id === 'relic_amer_mirror');

  const isMehrangarhDone = completed.includes('mehrangarh-fort') ||
                           completedExplorations.includes('mehrangarh-fort') ||
                           relics.some(r => r.id === 'relic_mehrangarh_inscription');

  const isJaisalmerDone = completed.includes('jaisalmer-fort') ||
                          completedExplorations.includes('jaisalmer-fort') ||
                          relics.some(r => r.id === 'relic_jaisalmer_route');

  const isChittorDone = completed.includes('chittorgarh-fort') ||
                        completedExplorations.includes('chittorgarh-fort') ||
                        relics.some(r => r.id === 'relic_chittorgarh_crest');

  let count = 0;
  if (isAmerDone) count += 1;
  if (isMehrangarhDone) count += 1;
  if (isJaisalmerDone) count += 1;
  if (isChittorDone) count += 1;
  return count;
}
