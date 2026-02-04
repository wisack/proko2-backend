/*
* Populate DB in index.js using groupcontroller.createDefaultCardSets()
*/

//tässä malli miten rakenteen tulee olla, että kortit näkyvät oikein. ohjetekstiin voi laittaa hyperlinkkejä ja ne näkyvät ohjauskorteissa klikattavana.
//muuttujat tulee olla nimeltään kummi_cards tai pro_cards jotta ne tunnistetaan oikein. pro_cards on kandivaiheeen ohjauskorteille ja kummi_cards vaiheen maisterivaiheen korteille.
    //jos kortit on laitettu jo kerran tietokantaan ja halutaan tehdä muutoksia, tulee vanhat kortit poistaa tietokannasta. 
    //tämä tapahtuu manuaalisesti poistamalla tietokannasta defaultoccasioncardsets kummatkin kyseisen vuoden dokumentit ja käynnistämällä palvelin uudestaan jolloin se syöttää kortit uudestaan tietokantaan.
const template = [
    {
        vuosi: 2023,
        otsikko: "",
        aiheet:[
            {
                alaotsikko: "",
                aiheet: [
                    {
                        aihe: "",
                        ohje: "",
                    },
                ]
            },
        ]

    },
]

const kummi_cards = [
    {
        vuosi: 2025,
        otsikko: "ARRIVAL",
        aiheet:[
            {
                alaotsikko: "Please mark in the attendance list who you picked up keys for or met upon arrival",
                aiheet: [
                    {
                        aihe: "Key pick-up from PSOAS",
                        ohje: "Arrange with PSOAS and your students when you are going to pick up their keys. It’s good to arrange key pick up for all/several of your students at the same time.",
                    },
                    {
                        aihe: "Meeting students upon arrival to Oulu",
                        ohje: "Meet your students at the bus stop at the university, train station, etc. Arrange this with your students in advance.",
                    },
                    {
                        aihe: "Transportation upon arrival",
                        ohje: "Guiding students how to get from the airport to the city/University of Oulu."
                    }
                ]
            },
        ]
    },
    {
        vuosi: 2025,
        otsikko: "PRE-ARRIVAL COMMUNICATION",
        aiheet:[
            {
                alaotsikko: "Please write here what topics you have discussed with your students during pre-arrival tutoring. Please also mark the total hours for pre-arrival guidance.",
                aiheet: [
                    {
                        aihe: "",
                        ohje: "",
                    },
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "GET TO KNOW YOUR OWN GROUP AND UNIVERSITY",
        aiheet:[
            {
                alaotsikko: "Grouping and Introductory meetings",
                aiheet: [
                    {
                        aihe: "Presentation of Student tutor and the aim and general content of tutor activities",
                        ohje: "Explain to your group what student tutors do and how you would implement your group tutoring.",
                    },
                    {
                        aihe: "Get to know each other",
                        ohje: "",
                    },
                ]
            },
            {
                alaotsikko: "Study",
                aiheet: [
                    {
                        aihe: "Tutor Teacher",
                        ohje: "Explain the concept of Tutor Teacher and that the students will meet them to plan their PSP within the first few weeks of their studies.",
                    },
                    {
                        aihe: "User IDs",
                        ohje: "Check with your students that everyone has a working student ID. Tell about how to get the IDs and what students need them for. Office365, @student.oulu.fi, Panoulu (public network), Eduroam (secured network).",
                    },
                    {
                        aihe: "Student cards and benefits, 24/7",
                        ohje: "Show e.g. your own student card and tell them how to get one. https://www.oyy.fi/en/for-members/membership/",
                    },
                    {
                        aihe: "Tuudo: map, class schedule, courses",
                        ohje: "Let's install Tuudo and get to know it.  Show students how to follow the news in Tuudo. Show what can be found in Tuudo (e.g. lunch menus, schedules, library card).",
                    },
                    {
                        aihe: "Teaching modes",
                        ohje: "Introduce what different teaching modes are used in courses in the Faculty of ITEE. Talk about your own experiences with different teaching modes (online, onsite, hybrid).",
                    },
                    {
                        aihe: "Safety on campus",
                        ohje: "Go through the University of Oulu safety instructions found here: https://www.oulu.fi/en/university/campuses/procedures-cases-accident-or-danger"
                    }
                ]
            },
            {
                alaotsikko: "Communication and information",
                aiheet: [
                    {
                        aihe: "WhatsApp, Telegram, email, Tuudo, social media channels, mailing lists, IRC, Slack",
                        ohje: "Let's exchange contact information and create the necessary groups. Let's discuss about the other channels and, if necessary, return to them later. (Also Teacher Tutor).",
                    },
                    {
                        aihe: "Event calendars",
                        ohje: "Let's go together and check out the event calendar for the selected organization. (in Tuudo, University of Oulu website or Patio).",
                    },
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "LIFE IN FINLAND",
        aiheet:[
            {
                alaotsikko: "Practical matters",
                aiheet: [
                    {
                        aihe: "Finnish calendar",
                        ohje: "Go through the Finnish calendar introducing the Finnish public holidays.",
                    },
                    {
                        aihe: "Academic calendar",
                        ohje: "Show the students where to find information on the Academic Calendar and go through it together. https://www.oulu.fi/en/students/studying-university/teaching-periods"
                    },
                    {
                        aihe: "City of Oulu website",
                        ohje: "Show the student where they can find information on important topics regarding living in Oulu https://www.ouka.fi/oulu/english"
                    }
                ]
            },
            {
                alaotsikko: "Everyday life",
                aiheet: [
                    {
                        aihe: "Opening a bank account",
                        ohje: "Tell how to open a Finnish bank account."
                    },
                    {
                        aihe: "Grocery store",
                        ohje: "Show where the closest grocery shop is, where to find oriental food. How to shop in a Finnish grocery store (e.g. weigh the fruits and vegetables). Introduce different price range grocery stores (e.g. K-market vs. Lidl/Prisma).",
                    },
                    {
                        aihe: "Pharmacy",
                        ohje: "Where to find a pharmacy, how they are open."
                    },
                    {
                        aihe: "Clothes, furniture",
                        ohje: "Present options, where to find new or used clothes and furniture (shops, second-hand stores and online stores/groups). "
                    },
                    {
                        aihe: "Recycling",
                        ohje: "Explain the recycling principles. Explain “pantti” (money you get when returning empty bottles to stores)."
                    },
                    {
                        aihe: "Transportation",
                        ohje: "Present different transport methods (how to find a bicycle, how to get a bus card). Introduce the Finnish driving culture: https://www.expat-finland.com/pdf/driving_in_finland.pdf"
                    },
                    {
                        aihe: "Finnish PIC",
                        ohje: "Explain about PIC and remind the students that they need to deliver the PIC to the Faculty of ITEE Study Services so that they can have access for FSHS services."
                    }
                ]
            },
            {
                alaotsikko: "Finland",
                aiheet: [
                    {
                        aihe: "Weather, how to dress..",
                        ohje: "Introduce the four seasons in Finland and how to dress on each to survive"
                    },
                    {
                        aihe: "Authorities, official websites, GDPR",
                        ohje: "Explain that authorities in Finland are trustworthy. Introduce emergency number (112). Finnish Immigration Service https://migri.fi/en/home, Police https://poliisi.fi/en/frontpage, Digital and Population Data Services Agency https://dvv.fi/en/individuals, Data privacy notice https://www.oulu.fi/en/data-privacy-notice/data-privacy-notice-student-councelling-services"
                    },
                    {
                        aihe: "A finn is..",
                        ohje: "Tell your students what cultural differences you have noticed. Explain what to expect from communication with Finns (Funny Finnish comics that explain the stereotypical Finn: Instagram account @finnishnightmaresofficial)."
                    }
                ]
            }
        ]
    },
    {
        vuosi: 2025,
        otsikko: "START OF STUDIES",
        aiheet:[
            {
                alaotsikko: "Study planning",
                aiheet: [
                    {
                        aihe: "Peppi",
                        ohje: "Introduce Peppi. Show them the Peppi guide. https://opas.peppi.oulu.fi/en/index?period=2024-2025 - Show how to download documents from Peppi (Atomi).",
                    },
                    {
                        aihe: "Course registrations",
                        ohje: "Tell about the enrollment of the courses in the first period. Also remind students of the importance of enrollment to courses and exams.",
                    },
                    {
                        aihe: "Recognition of Prior Learning",
                        ohje: "View the site: https://www.oulu.fi/en/for-students/completing-studies/recognition-learning",
                    },
                    {
                        aihe: "Study planning + PSP",
                        ohje: "Tell students about these and how important they are. (PSP = Personal Study Plan)",
                    },
                    {
                        aihe: "More specifically about Tuudo",
                        ohje: "Show how to register for courses in Tuudo and how to view the schedule.",
                    },
                ]
            },
            {
                alaotsikko: "Teaching and studying",
                aiheet: [
                    {
                        aihe: "Forms of teaching",
                        ohje: "About university studies e.g.: a) Lectures, exams, exercises, assignments, essays. (b) Self study, teamwork, time management. c) Thesis (bachelor's degree, master's thesis) Materials for finding tools for studying: https://www.oulu.fi/en/for-students/supporting-your-studies-and-contact-information-students/study-skills-and-competences, https://www.oulu.fi/en/for-students/supporting-your-studies-and-contact-information-students/study-skills-and-competences/studying-university",
                    },
                    {
                        aihe: "Time planning and monitoring",
                        ohje: "Think together about good practices and you discuss the below link: https://www.oulu.fi/en/for-students/supporting-your-studies-and-contact-information-students/study-skills-and-competences/time-management",
                    },
                    {
                        aihe: "Goal-oriented studying",
                        ohje: "Setting and monitoring goals. Self-management and motivation: https://www.oulu.fi/en/for-students/supporting-your-studies-and-contact-information-students/study-skills-and-competences/goal-setting-and-planning",
                    },
                    {
                        aihe: "Study groups",
                        ohje: "Set up study groups for those who want to join them.",
                    },
                    {
                        aihe: "Tools of teaching",
                        ohje: "Introduce Moodle and other relevant tools that are used in teaching in the Faculty.",
                    },
                    {
                        aihe: "Finnish studying culture",
                        ohje: "Talk about Finnish studying culture (emphasis on self-responsibility).",
                    },
                    {
                        aihe: "Ethical studying (cheating, plagiarism)",
                        ohje: "Explain to your students that cheating and plagiarism are taken very seriously at the University of Oulu and getting caught for cheating/plagiarism has consequences. Talk about the ethical guidelines found: https://www.oulu.fi/en/students/studying-university/ethical-principles-education-and-code-conduct-prevention-and-processing-misconduct-studies",
                    }
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "UNIVERSITY TOUR",
        aiheet:[
            {
                alaotsikko: "Inside university building",
                aiheet: [
                    {
                        aihe: "MazeMap",
                        ohje: "Introduce MazeMap app for finding classrooms and locations and booking spaces for group work. Show your students where students can download the MazeMap app and advice how to use it.",
                    },
                    {
                        aihe: "Restaurants",
                        ohje: "Show student restaurants on campus and go eat with your students. Advice students about rush hours, self-service cashiers etc. Explain how to take food and read the labels (lactose free L, gluten free G, milk free M, Vegan Vg..)."
                    },
                    {
                        aihe: "Meeting places",
                        ohje: "Green/orange coat racks, common studying areas. Set up a meeting place for your group.",
                    },
                    {
                        aihe: "Lecture halls, classrooms and computer rooms, student laboratories",
                        ohje: "Show them to the students as part of the university tour."
                    },
                    {
                        aihe: "ICT service point",
                        ohje: "Show students the ICT service point and advise them to go there with ICT related issues. If your student doesn’t have UniOulu credentials, take them to ICT Service Point to get the matter sorted."
                    },
                    {
                        aihe: "Tellus",
                        ohje: "Show Tellus and show how students can reserve a glass cube for themselves if needed"
                    },
                    {
                        aihe: "Study Service Point, Kompassi",
                        ohje: "Show Kompassi/Compass Service Point to students. Share the opening hours and tell them what matters are handled here. Find the opening hours choosing your Degree Programme https://www.oulu.fi/en/for-students/supporting-your-studies-and-contact-information-for-students/faculty-study-services"
                    },
                    {
                        aihe: "Examinarium",
                        ohje: "Show the location and explain the concept of Examinarium. https://ict.oulu.fi/5330/?page&lang=en"
                    },
                    {
                        aihe: "Library (Pegasus)",
                        ohje: "Show students where to find Pegasus library. Explain how to get a library card."
                    },
                    {
                        aihe: "Printers",
                        ohje: "Show how the printers work"
                    },
                    {
                        aihe: "OYY office",
                        ohje: ""
                    },
                    {
                        aihe: "FabLab",
                        ohje: ""
                    },
                    {
                        aihe: "Laptop vendors",
                        ohje: ""
                    },
                    {
                        aihe: "Student lockers",
                        ohje: "Show lockers and how to use them."
                    },
                    {
                        aihe: "PSOAS office",
                        ohje: ""
                    }
                ]
            },
            {
                alaotsikko: "Outside university building",
                aiheet: [
                    {
                        aihe: "Emergency meeting spots",
                        ohje: "Show the students the emergency meeting spots from this map: https://pelsu-files-production-eu-west-1.s3.eu-west-1.amazonaws.com/uploads/b93d088b-e121-4b11-82e1-54b074276b97/Kokoontumispaikat%20Linnanmaa%20v%201.2.pdf"
                    },
                    {
                        aihe: "Bus stops",
                        ohje: "Go to the physical location of the one that is closest to Tietotalo, show the closest bus stops."
                    },
                    {
                        aihe: "Botanical garden",
                        ohje: "Take your students on tour and explain how they can visit the gardens."
                    },
                    {
                        aihe: "FSHS",
                        ohje: "Show where FSHS is located."
                    }
                ]
            }
        ]

    },
    {
        vuosi: 2025,
        otsikko: "FREETIME ACTIVITIES",
        aiheet:[
            {
                alaotsikko: "Guilds and organizations for students",
                aiheet: [
                    {
                        aihe: "Guilds",
                        ohje: "Introduce the of guilds to the students. Information Processing: Blanko Ry https://blanko.fi/in-english/, Computer Science and Engineering https://www.otit.fi/en/, Electrical engineering https://www.sik.fi/?lang=en, Biomedical Engineering https://www.olto.fi/en/home/ - Tell the students that they will be invited to a  guild introduction event (tutors will bring the students to the event).",
                    },
                    {
                        aihe: "OTY Oulun Teekkariyhdistys",
                        ohje: "Oulun Teekkariyhdistys ry or OTY is the association that acts as a link between the students and guilds of engineering and architecture at the University of Oulu https://www.oty.fi/en/frontpage/"
                    },
                    {
                        aihe: "OYY",
                        ohje: "Tell students about the role of OYY (Student Union of University of Oulu) and about the events it organizes https://www.oyy.fi/en/",
                    },
                    {
                        aihe: "TEK",
                        ohje: "Introduce the trade union for academic engineers and architects in Finland https://www.tek.fi/en - This is important for those students who want to work in Finland in the future."
                    }
                ]
            },
            {
                alaotsikko: "Events and activities in Oulu",
                aiheet: [
                    {
                        aihe: "Wappu",
                        ohje: "Tell students about the May Day events and how to participate in them.",
                    },
                    {
                        aihe: "General events at the University",
                        ohje: "Tell students where to get information about the university general open events. In the students page there is a section for Events, tell students to follow those.",
                    },
                    {
                        aihe: "Oulu events",
                        ohje: "Show the students event calendar for the city of Oulu https://tapahtumat.munoulu.fi/fi-FI - Ideas on what do in Oulu: https://visitoulu.fi/en/"
                    },
                    {
                        aihe: "Villa Victor",
                        ohje: "Villa Victor is an organization by the city of Oulu that organizes free event and Finnish language courses https://www.ouka.fi/oulu/villavictor-english/"
                    },
                    {
                        aihe: "Cafe Lingua",
                        ohje: "Café Lingua is a weekly event to practice different languages https://www.oulu.fi/en/students/completing-studies/languages-and-communication/discover-your-way-study-languages/cafe-lingua"
                    },
                    {
                        aihe: "ITEE Meets the Companies",
                        ohje: "Tell the students about the ITEE Meets Companies events (info on these posted to student email addresses and Tuudo) A great change to meet company representatives. "
                    },
                    {
                        aihe: "Sport events",
                        ohje: "ell your students about local teams in various sports e.g. Oulun Kärpät (ice hockey), AC Oulu (football), Oulun Lippo (Finnish baseball)."
                    },
                    {
                        aihe: "Culture events",
                        ohje: "Museum and science centre Luuppi: https://www.ouka.fi/oulu/luuppi-english, Cinema, e.g.: https://www.finnkino.fi/en/"
                    }
                ]
            },
            {
                alaotsikko: "Hobby organisations and sports facilities",
                aiheet: [
                    {
                        aihe: "UniMove app",
                        ohje: "Tell your students about the UniMove app and how to get the benefits. Take a look at what's on offer. https://unimoveoulu.fi/?lang=en-gb&langmenu=1",
                    },
                    {
                        aihe: "Other university and guild activities and clubs",
                        ohje: "Sports (e.g. Finnish skittles, Frisbee, jogging), choirs and music clubs (e.g. ÖRMY), role-playing games (CRYO), etc. Talk about the group's interests and the opportunity to get to know different clubs together. Show your students where to find information on interest societies https://www.oyy.fi/en/community/student-societies/",
                    },
                    {
                        aihe: "Sports facilities by the City of Oulu",
                        ohje: "Tell your students where to find information on the City of Oulu sports facilities (swimming pools, exercise halls, sports centers, skiing trains, ice-skating fields etc.) https://www.ouka.fi/oulu/english/sports-and-exercise - Tell the students that the City of Oulu offers student prices for most sports.",
                    },
                    {
                        aihe: "Other sports opportunity examples",
                        ohje: "Bowling: https://www.spacebowling.fi/english/, Laser tag: https://www.pelibunkkeri.fi/etusivu, Disc golf: https://udisc.com/places/oulu-finland"
                    },
                    {
                        aihe: "Kummi family",
                        ohje: "Tell your students about the kummi family programme and show them where they can join https://www.oulu.fi/en/kummi-family-programme"
                    }
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "WELLBEING IN STUDIES",
        aiheet:[
            {
                alaotsikko: "Things that new students might face and where to find help",
                aiheet: [
                    {
                        aihe: "Culture shock",
                        ohje: "Discuss with your students that feeling culture shock is normal. https://www.oulu.fi/en/for-students/student-wellbeing-and-everyday-life/culture-shock-and-homesickness - Introduce group support possibilities: https://www.oulu.fi/en/for-students/supporting-your-studies-and-contact-information-students/groups",
                    },
                    {
                        aihe: "Stress",
                        ohje: "Groups organized by FSHS: https://www.yths.fi/en/services/groups-and-virtual-courses/mental-health/"
                    },
                    {
                        aihe: "Coping with darkness",
                        ohje: "Share your experience on coping with darkness during winter months."
                    },
                    {
                        aihe: "Combining work and studying",
                        ohje: "Let's talk about different ways of combining work life with studying. Sharing experiences and questions. You can get good tips from other students and your tutor teacher."
                    },
                    {
                        aihe: "Harrassment",
                        ohje: "The University of Oulu has zero tolerance for bullying or harassment. If you experience harassment and want to report it: https://www.oulu.fi/en/for-students/student-wellbeing-and-everyday-life/prevention-bullying-and-harassment-university-oulu"
                    }
                ]
            },
            {
                alaotsikko: "Where to find more information and support",
                aiheet: [
                    {
                        aihe: "FSHS (YTHS)",
                        ohje: "Let's visit where FSHS (YTHS, student health care) is located and how services are booked. Remind the students to pay the student health care fee to Kela"
                    },
                    {
                        aihe: "Study psychologist",
                        ohje: "You can contact the Study Psychologist about things that have to do with learning and study related problems. Take a look at the contact information: https://www.oulu.fi/en/for-students/supporting-your-studies-and-contact-information-students/study-psychologists"
                    },
                    {
                        aihe: "Career centre",
                        ohje: "Help for different issues related to job searching: https://www.oulu.fi/en/students/working-life/career-centre"
                    },
                    {
                        aihe: "Moodle courses on studying skills etc.",
                        ohje: "https://www.oulu.fi/en/for-students/supporting-your-studies-and-contact-information-students/groups"
                    }
                ]
            }
        ]
    },
    {
        vuosi: 2025,
        otsikko: "CITY OF OULU TOUR",
        aiheet:[
            {
                alaotsikko: "TOPICS",
                aiheet: [
                    {
                        aihe: "",
                        ohje: "",
                    },
                ]
            },
        ]
    },
    {
        vuosi: 2025,
        otsikko: "JOINT MEETING FOR STUDENTS",
        aiheet:[
            {
                alaotsikko: "Freetime meeting with another student tutor group",
                aiheet: [
                    {
                        aihe: "Joint event",
                        ohje: "Organize a fun freetime activity, where students from different tutoring groups get to meet each other. Think and agree together on a possible date well in advance and inform the groups.",
                    },
                ],
            },
            {
                alaotsikko: "Suggested options",
                aiheet: [
                    {
                        aihe: "Go together to a freetime event organized by university of the city of Oulu",
                        ohje: ""
                    },
                    {
                        aihe: "Something fun to do together (bowling, croquet, laser tag, paintball, escape room etc.)",
                        ohje: ""
                    },
                    {
                        aihe: "Visit a place in Oulu",
                        ohje: "For example Nallikari, Pikisaari."
                    },
                    {
                        aihe: "Organize a game night",
                        ohje: ""
                    }
                ]
            },
        ]
    },
    {
        vuosi: 2025,
        otsikko: "GUILDS",
        aiheet:[
            {
                alaotsikko: "Feedback collection",
                aiheet: [
                    {
                        aihe: "Introduction to guild",
                        ohje: "Take your students to the guild room. Find out if there are any guild events for international students and share these events with your students or attend the events with your students.",
                    },
                    {
                        aihe: "Feedback",
                        ohje: "Use the feedback tool to collect anonymous feedback from your students about the event."
                    }
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "CAREER SERVICES AND STUDENT EXCHANGE",
        aiheet:[
            {
                alaotsikko: "Topics",
                aiheet: [
                    {
                        aihe: "Student exchange",
                        ohje: "Tell your students that there are info events regarding exchange studies. Show them where to find information regarding exchange studies on the Uni Oulu website.",
                    },
                    {
                        aihe: "Career Centre",
                        ohje: "Take your students to the Career Centre and share with them your experiences of how to look for a job in Finland. Tell your students that there is an info event about traineeships."
                    }
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "CATCH-UP MEETING",
        aiheet:[
            {
                alaotsikko: "Things that have not been dealt with in the past",
                aiheet: [
                    {
                        aihe: "Possible questions and current issues",
                        ohje: "Is there anything left unclear? Is there something you need to be advised about?",
                    },
                ]
            },
            {
                alaotsikko: "Subject, if necessary",
                aiheet: [
                    {
                        aihe: "Here you could move topics which have not yet been addressed from one of the previous meetings, or new things that have come up which students want to get information. This meeting can be arranged at a time when the student tutor thinks it is suitable. This meeting can also be arranged together with another group.",
                        ohje: "",
                    },
                ]
            },
            {
                alaotsikko: "Feedback on small group activities",
                aiheet: [
                    {
                        aihe: "Collect feedback about what was nice, what you would have liked more. What didn't work or what could be developed and how?",
                        ohje: "",
                    },
                ]
            },
        ]

    },
]

const pro_cards = [

    {
        vuosi: 2025,
        otsikko: "OMA RYHMÄ TUTUKSI",
        aiheet:[
            {
                alaotsikko: "Ryhmäytyminen",
                aiheet: [
                    {
                        aihe: "Tuutorin esittely",
                        ohje: "Voit keksiä omaperäisen hauskan tavan esittäytyä.",
                    },
                    {
                        aihe: "Ryhmäläisten esittely",
                        ohje: "Esim. ringissä yksi kysyy keksimänsä kysymyksen viereiseltä ja vastaa siihen ensin itse.",
                    },
                    {
                        aihe: "Tuutoritoiminnan esittely",
                        ohje: "Kerro miksi, mitä, kenelle, miten, milloin.",
                    },
                    {
                        aihe: "Varmista että perusasiat ovat kunnossa",
                        ohje: "Onhan kaikilla ulkopaikkakuntalaisilla asunto yms. Avusta tarvittaessa."
                    },
                    {
                        aihe: "Ruokailu",
                        ohje: "Tarvittaessa käykää yhdessä syömässä tai kahvilla."
                    }
                ]
            },
            {
                alaotsikko: "Yhteydenpito ja tiedotus",
                aiheet: [
                    {
                        aihe: "WhatsApp, Telegram, email, Tuudo, some-kanavat, postituslistat, IRC, Slack",
                        ohje: "Vaihdetaan yhteystiedot ja luodaan tarvittavat ryhmät. Kerrotaan muista kanavista ja tarvittaessa palataan niihin myöhemmin. (Omaope – tuutori – tuutoriryhmän opiskelijat). Erilaiset fuksilistat yms. Kaikki eivät ole kaikille tarpeen/käytössä. ",
                    },
                    {
                        aihe: "Tapahtumakalenterit",
                        ohje: "Käydään yhdessä katsomassa valitun järjestön tapahtumakalenterista.",
                    },
                    {
                        aihe: "Mieti tähän lisää yhteydenpito- ja tiedotuskanavia tarvittaessa",
                        ohje: ""
                    }
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "YLIOPISTO TUTUKSI",
        aiheet:[
            {
                alaotsikko: "Yliopistokierros",
                aiheet: [
                    {
                        aihe: "Syömäpaikat, ruuhka-ajat",
                        ohje: "Yhdessä syömään. Ravintoloiden sijaintien katsominen.",
                    },
                    {
                        aihe: "Tietotalo, tutkimusryhmien sijainnit, Omaopen huone",
                        ohje: "Yhdessä kierros tiloissa. Ainakin omaopettajan ja ensimmäisen vuoden opettajien ovien luona voisi käydä tutustumassa.",
                    },
                    {
                        aihe: "Kiltahuone",
                        ohje: "Yhdessä vierailu kiltahuoneella. Sähköinsinöörikilta SIK ry: https://www.sik.fi/, Oulun Tietoteekkarit OTiT ry: https://www.otit.fi/, Oulun yliopiston tietojenkäsittelijöiden kilta Blanko ry: https://www.blanko.fi/, Oulun lääketieteen tekniikan opiskelijat OLTO ry: https://www.olto.fi/ - Painotetaan vielä kulkukorttien tärkeyttä, esim. kiltikselle ei välttämättä pääse ilman.",
                    },
                    {
                        aihe: "Kohtaamispaikat",
                        ohje: "Vihreät/oranssit-naulakot, vapaat työskentelyalueet. Sopikaa ryhmälle oma kohtaamispaikka.",
                    },
                    {
                        aihe: "Luentosalit + mikroluokat, tenttiakvaario (EXAM-järjestelmä), Tiedekunnan opintopalvelut ja Kompassi-palvelupiste, Career Centre, OYY toimisto",
                        ohje: "Tutustutaan näihin osana yliopistokierrosta. Tämän voi ottaa pienenä rastitehtävänä. Tiedekunnan opintopalvelut: https://www.oulu.fi/fi/opiskelijalle/opiskelun-tuki-ja-yhteystiedot-opiskelijalle/tiedekunnan-opintopalvelut, Career Centre: https://www.oulu.fi/fi/opiskelijalle/tyoelamaan/Career-Centre, OYY toimisto: https://www.oyy.fi/yhteystiedot/",
                    },
                    {
                        aihe: "Tulostaminen, läppärin lainaus, pistorasiat (puute)",
                        ohje: "Käydään tutustumassa tulostimen ja lainaamojen toimintaan. Luentosaleissa ei välttämättä voi ladata läppäriä yms.",
                    },
                    {
                        aihe: "Tellus",
                        ohje: "Tellus-info on erikseen, mutta hyvä tutustua paikkaa muutenkin, esim. rauhoittumistilaan (Nest).",
                    },
                    {
                        aihe: "Muita mielenkiintoisia",
                        ohje: "Labrat, FabLab, Kirjasto yms.",
                    },
                    {
                        aihe: "Ulkoiset maamerkit",
                        ohje: "Pääovi, Mikä ovi on vastassa, kun tulet bussista, AMK:n pallo, kyykkästadion yms.",
                    },
                    {
                        aihe: "Ulkopuolella ja lähellä",
                        ohje: "Lähimmät kaupat yms., Teekkaritalo, YOK22 grillikatos, YTHS sijainti, Linnanmaan liikuntakeskus: https://unimoveoulu.fi/fi-fi/article/etusivu/linnanmaan-liikuntakeskus/12896/",
                    },
                    {
                        aihe: "Turvallisuus kampuksella",
                        ohje: "Toimintaohjeet onnettomuus- ja vaaratilanteissa: https://www.oulu.fi/fi/yliopisto/kampukset/toimintaohjeet-onnettomuus-ja-vaaratilanteissa, Järjestyssäännöt: https://www.oulu.fi/fi/yliopisto/kampukset/jarjestyssaannot, Pelastussuunnitelma: https://syk.pelsu.fi/dokumentti/52307-linnanmaan-kampus/ - Näiden läpikäynti. Lisäksi vähintään kokoontumispaikka palohälytyksen sattuessa, sen selvittäminen ja siellä käynti. Nämä käydään etukäteen läpi, jotta hätätilanteessa on riittävä käsitys oikeasta toiminnasta (silloin ei ehdi lukemaan). Kampusvartijan puhelinnumero ylös."
                    },
                    {
                        aihe: "Yliopiston aukioloajat ja avoimet ovet",
                        ohje: "Kerro yliopiston aukioloajoista ja mistä ovista pääsee kulkukortilla klo 19.00 jälkeen (päivällä ulko-ovet ovat auki)."
                    }
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "OPINNOT ALKUUN",
        aiheet:[
            {
                alaotsikko: "Opintojen suunnittelu",
                aiheet: [
                    {
                        aihe: "Käyttäjätunnukset",
                        ohje: "Kerro, miten saa ja mihin niitä tarvitsee. Office365, @student.oulu.fi, panoulu, edu-roam, Moodle, Peppi, Zoom, Pysäköintijärjestelmä."
                    },
                    {
                        aihe: "Tuudo: kartta, lukkari, kurssit",
                        ohje: "Asennetaan Tuudo ja tutustutaan siihen. Opiskelijakortti ruokailua varten. Käykää yhdessä läpi Tuudoa, miten ja mihin sitä voi käyttää."
                    },
                    {
                        aihe: "Peppi (kirjautumalla)",
                        ohje: "Näytä opiskelijan näkymä ja esittele tarpeen mukaan."
                    },
                    {
                        aihe: "Peppi Opinto-opas",
                        ohje: "Näytä UUSIN Peppi-opinto-opas: https://opas.peppi.oulu.fi/fi/index?period=2025-2026 (päivitetään vuosittain; yllättävistä muutoksista tiedottaa mm. omaope)."
                    },
                    {
                        aihe: "Kurssi-ilmoittautumiset",
                        ohje: "Kerro ensimmäisen periodin kurssien ilmoittautumisesta. Muistuta myös periodien 2 ja 3 ilmoittautumisista.",
                    },
                    {
                        aihe: "Osaamisen tunnustaminen (OT)",
                        ohje: "Näytä sivusto: https://www.oulu.fi/fi/opiskelijalle/opintojen-suorittaminen/osaamisen-tunnustaminen - Kerro ylioppilastutkinnon hyvien arvosanojen, aiempien yliopisto-opintojen ja työkokemuksen osaamisen tunnustamisesta (OT). Kerro varusmiespalveluksen johtajakoulutuksesta (5 op.).",
                    },
                    {
                        aihe: "Opintojen suunnittelu + HOPS",
                        ohje: "Kerro näistä ja niiden tärkeydestä.",
                    },
                    {
                        aihe: "Vapaavalintaiset opinnot",
                        ohje: "Kerro esimerkkejä, mitä vapaavalintaisia opintoja voi ottaa.",
                    },
                    {
                        aihe: "KELA",
                        ohje: "Tutustukaa Kelan opintopistevaatimuksiin opintotuelle yms.",
                    },
                    {
                        aihe: "Työnhaku",
                        ohje: "Career centre: https://www.oulu.fi/fi/opiskelijalle/tyoelamaan/Career-Centre/, PESTI päivät, Tuudossa mainostetut yritysvierailut, LinkedIn profiilin luominen, killan omat yritysvierailut."
                    }
                ]
            },
            {
                alaotsikko: "Opetus ja opiskelu",
                aiheet: [
                    {
                        aihe: "Opetusmuodot",
                        ohje: "Kerro yliopisto-opiskelusta esim.: Yliopisto-opintojen idea ei ole vain kouluttaa tiettyyn työtehtävään, vaan pääpaino on riittävän tietopohjan varmistaminen sekä opettaminen itsenäiseen ajatteluun ja tiedon soveltamiseen. a) Luennot, tentit, harkat, tehtävät, esseet. b) Itsenäinen opiskelu, ryhmätyöskentely, ajanhallinta. c) Opinnäytetyö (kandi, gradu, diplomityö).  d) Etäopiskelu - Etäopiskelun haasteet ja hyvät puolet – keskustelua aiheesta. Voit myös näyttää opintojen tukemiseen tehtyjä videoita: https://www.oulu.fi/opiskelijalle/opiskelutaidot ja https://www.oulu.fi/opiskelijalle/yliopisto-opiskelu"
                    },
                    {
                        aihe: "Opiskelijakortit ja -edut, 24/7, kiltahuone",
                        ohje: "Näytä esim. omia kortteja ja kerro, miten sellaiset saa. Tuudo (samassa on myös kirjastokortti). Kerro mistä 24/7 kortti tilataan, miten kiltahuoneelle haetaan kulkuoikeudet ja mitä prosessiin tarvitaan"
                    },
                    {
                        aihe: "Muita hyödyllisiä",
                        ohje: "MazeMap (kartta, huonehaku, reittihaku, sijainnin jako, tilojen varaaminen vaikkapa ryhmätöihin). Kide.app (myydään lippuja tapahtumiin yms.). Ohjelmistolisenssit: https://ict.oulu.fi/21545/, Oulun yliopiston eettiset periaatteet: https://www.oulu.fi/fi/yliopisto/eettiset-periaatteet, toimintaohjeita epäasiallisen kohtelun varalta: https://www.oulu.fi/fi/opiskelijalle/hyvinvointi-ja-arki/epaasiallinen-kohtelu-oulun-yliopistossa, vinkkejä vastuulliseen vuorovaikutukseen: https://www.oulu.fi/fi/yliopisto/tasa-arvo-ja-yhdenvertaisuus-oulun-yliopistossa#accordion-control-vastuullinen-vuorovaikutus-ja-inklusiivinen-kieli, sekä muutakin asiaa tasa-arvo- ja yhdenvertaisuustyöstä Oulun yliopistossa: https://www.oulu.fi/fi/yliopisto/tasa-arvo-ja-yhdenvertaisuus-oulun-yliopistossa",
                    },
                    {
                        aihe: "Opintotuki, -laina & -pisteet",
                        ohje: "Kerro, mistä löytyy tietoa (KELA) ja kannusta huolehtimaan asioista ajoissa."
                    },
                    {
                        aihe: "Ajankäytön suunnittelu ja seuranta",
                        ohje: "Pohtikaa yhdessä hyviä käytänteitä ja voit antaa/näyttää linkin: https://www.oulu.fi/opiskelijalle/ajanhallinta, Outlook kalenterin käyttö.",
                    },
                    {
                        aihe: "Tavoitteellisuus",
                        ohje: "Tavoitteiden asettaminen ja seuranta. Itsensä johtaminen ja motivointi: https://www.oulu.fi/opiskelijalle/tavoitteet-ja-suunnittelu EDELLISET KAKSI (erityisesti videot) voi jättää pois, jos ne tulevat käsittelyyn esim. omaopettajan toimesta.",
                    },
                    {
                        aihe: "Ryhmätyöskentely",
                        ohje: "Esittele yhdessä opiskelu mahdollisuuksia ja kannusta yhdessä opiskeluun esimerkiksi kiltahuoneella, Telluksessa tai varatussa tilassa (MazeMap). Kannusta kommunikaatioon fuksien omassa ryhmässä (HUOM! yhdessä opiskelu ei tarkoita esim. harjoitustöissä saman vastauksen antamista, vaan jokainen tekee sen omin sanoin).",
                    },
                    {
                        aihe: "Omaopettaja",
                        ohje: "Kerro Omaopettajatoiminnasta sekä milloin ja miten voi olla yhteydessä omaopettajaan.",
                    },
                    {
                        aihe: "Palautekanavan esittely",
                        ohje: "Opintojaksopalautteen keruussa käytetään Oulun yliopiston sähköistä Palaute-järjestelmää, joka löytyy Pepistä: https://www.oulu.fi/fi/peppi - Palautekanavan käyttäminen on MYÖS tulonlähde tiedekunnalle. Kehota antamaan palautetta! Palautetta voi myös antaa suoraan omaopettajalle ja killan opintovastaavalle.",
                    },
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "FUKSINA KILLASSA",
        aiheet:[
            {
                alaotsikko: "Kiltatoiminta (paljon kiltakohtaista)",
                aiheet: [
                    {
                        aihe: "Hallitus",
                        ohje: "Toiminnan esittely (tuutori voi esitellä tai pyytää hallituksesta henkilön esittelemään) ja miten hallitukseen saa yhteyden. Esitellään häirintäyhdyshenkilöt ja miten heihin saa yhteyden. Jos hallitukselle on jaettu omat kummiryhmät, sovi oman hallituskummin kanssa tämä tapaaminen.",
                    },
                    {
                        aihe: "Toimintaan mukaan",
                        ohje: "Kerro, miten hallituksen ja toimihenkilöiden toimintaan pääsee mukaan ja mitä hyötyjä.",
                    },
                    {
                        aihe: "OYY, TEK, Teekkarilupi, OTY yms. järjestöt",
                        ohje: "Kerro tapahtumista, toiminnasta ja niihin osallistumisesta. Milloin ja miksi kannattaa osallistua.",
                    },
                    {
                        aihe: "Kiltahuoneen esittely",
                        ohje: "Käykää katsomassa mitä kaikkea kiltahuoneelta löytyy. Käydään läpi kiltahuoneen säännöt.",
                    },
                    {
                        aihe: "Killan tapahtumat",
                        ohje: "Kerro killan avoimista tapahtumista. Helppo tapa tutustua muihin kiltalaisiin."
                    },
                    {
                        aihe: "Killan kotisivut, säännöt, ja palautekanava",
                        ohje: "Käy läpi killan kotisivut, muistuta kiltaan liittymisestä (tärkeää sähköpostilistojen kannalta), killan säännöt sekä palautekanava. Kerro tärkeimmät killan säännöt."
                    },
                    {
                        aihe: "Killan somet",
                        ohje: "Kerro killan Telegram- ja Discord-kanavista. Muistutellaan kanaviin liittymisestä."
                    }
                ]
            },
            {
                alaotsikko: "Fuksiasiat ja tempaukset",
                aiheet: [
                    {
                        aihe: "Fuksipassi",
                        ohje: "Kerro fuksipassista ja varatkaa vaikka oma aika Fuksipassin rakentamiseen.",
                    },
                    {
                        aihe: "Fuksisauna/fuksisitsit/fuksiexcursio",
                        ohje: "Kerro Killan fuksitapahtumista (esim. pyöräily, fuksisitsit yms.) ja tuutori voi mahdollisesta kulkea sinne ryhmän kanssa.",
                    },
                    {
                        aihe: "Wappu",
                        ohje: "Kerro fuksipistekilpailusta, jonka tulokset julkistetaan wappuna.",
                    },
                    {
                        aihe: "Kaverista huolehtiminen",
                        ohje: "Voisitte yhdessä sopia ja asettaa tavoitteeksi, että jokainen huolehtii fuksi-kaverista. Esim. on kohteliasta moikata ja ottaa muutenkin huomioon.",
                    },
                    {
                        aihe: "Tempaukset",
                        ohje: "Kerro mahdollisista tempauksista. Esimerkkinä Äänestystempaus (kuntavaalit -25), Renkaanvaihtotempaus, Verenluovutustempaus, Palautetempaus. Voitte toteuttaa esimerkiksi verenluovutuskilpailun tuutoriryhmien kesken ja käydä ryhmänä luovuttamassa. Voitte esim. tuutoriryhmien kesken keksiä erilaisia tempauksia.",
                    },
                    {
                        aihe: "Erityispiirteet",
                        ohje: "Käydään yhdessä sovittamassa lakkeja, ja tehdään yhdessä Lakkitilaus (ja Teekkarilakitus), OTYn jäseneksi liittyminen JA/TAI haalaritilaus.",
                    },
                    {
                        aihe: "Laulukulttuuri",
                        ohje: "Kerro laulukulttuurista mm: sanoitusillat ja sanoituskilpailu."
                    }
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "VAPAALLA VÄLILLÄ",
        aiheet:[
            {
                alaotsikko: "Harrastejärjestöt",
                aiheet: [
                    {
                        aihe: "Unimove (Korkeakoululiikunta)",
                        ohje: "Kerro urheiluvuoroista ja tapahtumista. Voit näyttää kuvia erilaisista tapahtumista. Kerro Unimovesta: https://unimoveoulu.fi ja killan liikuntavuoroista.",
                    },
                    {
                        aihe: "Muut yliopiston ja killan harrastusmahdollisuudet ja kerhot",
                        ohje: "Urheilu (esim. kyykkä, frisbee, lenkki, sähly), kuorot (esim. TeeKu, Cassiopeia) ja musiikkikerhot (esim. ÖRMY, Teekkaritorvet), lauta- ja roolipelit (CRYO), jne. OTYn lenkki joka maanantai, OAMK ry (kyykkä), AFK ry (Frisbeegolf), Tapiiri, Cafe Lingua, YKHS (laskettelu). Killoilla on erilaista kulttuuritoimintaa, jota esitellään/kerrataan. https://www.oyy.fi/jarjestoopas/ - Jutelkaa ryhmän mielenkiinnoista ja mahdollisuudesta yhdessä tutustua eri kerhoihin.",
                    },
                    {
                        aihe: "Yhteinen aktiviteetti",
                        ohje: "Urheilua ja/tai pientä kilpailua."
                    },
                    {
                        aihe: "Harrastejärjestön perustaminen",
                        ohje: "Miten tiloja varataan (Tellus, Outlook, Virastomestari), OYY järjestää koulutuksia tähän liittyen, yliopisto-opiskelijana on hyvä hetki lähteä perustamaan ja tätä kautta voi löytää poikkitieteellisesti samasta asiasta kiinnostuneita kavereita."
                    },
                    {
                        aihe: "Muuta",
                        ohje: "Esitelkää/kerrataan killan mahdollisesti organisoimia tapahtumia ja aktiviteetteja."
                    }
                ]
            },
            {
                alaotsikko: "Liikuntapaikat",
                aiheet: [
                    {
                        aihe: "Linnanmaa",
                        ohje: "Voitte kiertää paikat kävellen/pyöräillen: Palloiluhalli, jäähalli, pururata/ladut, kyykkästadion, kentät, jne.",
                    },
                    {
                        aihe: "Oulun seutu",
                        ohje: "Liikuntapaikat, uimahallit, frisbeegolf-radat  yms. https://www.ouka.fi/liikunta",
                    },
                ]
            },
            {
                alaotsikko: "Tempaukset (TÄHÄN VOITTE LISÄTÄ TARVITTAESSA!)",
                aiheet: [
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "TERVEENÄ OPINNOISSA",
        aiheet:[
            {
                alaotsikko: "Opiskeluun positiivisesti vaikuttavat asiat",
                aiheet: [
                    {
                        aihe: "Kuulumiset",
                        ohje: "Jutellaan, miten on mennyt. Ongelmia tai epäselvyyksiä? Ilon aiheita ja onnistumisia?",
                    },
                    {
                        aihe: "Kaverit",
                        ohje: "Jutellaan kavereiden ja muiden ihmissuhteiden merkityksestä opiskeluun.",
                    },
                    {
                        aihe: "Terveelliset elämäntavat",
                        ohje: "Jutellaan ruoan, unen ja liikunnan merkityksestä opiskeluun.",
                    },
                    {
                        aihe: "Aktiivinen/positiivinen asenne",
                        ohje: "Jutellaan, kuinka omalla aktiivisella ja positiivisella asenteella voi vaikuttaa opiskeluun.",
                    },
                ]
            },
            {
                alaotsikko: "Opiskeluun negatiivisesti vaikuttavat asiat",
                aiheet: [
                    {
                        aihe: "Vuorokausirytmi",
                        ohje: "Jutellaan, miten poikkeava vuorokausirytmi vaikuttaa opiskeluun.",
                    },
                    {
                        aihe: "Eristäytyminen",
                        ohje: "Jutellaan, miten eristäytyminen ja yksin jättäytyminen vaikuttaa opiskeluun.",
                    },
                    {
                        aihe: "Stressi",
                        ohje: "Jutellaan, mikä voi aiheuttaa stressiä ja miten sitä voi hallita.",
                    },
                    {
                        aihe: "Pelaaminen",
                        ohje: "Jutellaan, miten liika pelaaminen voi vaikuttaa opintojen edistymiseen.",
                    },
                    {
                        aihe: "Päihteet",
                        ohje: "Jutellaan päihteiden käytön vaikutuksesta opiskeluun. Jutellaan päihteettömyyteen suhtautumisesta (esim. että ei saa painostaa toista käyttämään päihteitä, jos itse käyttää ja että tapahtumiin kannattaa tulla ilman päihteitäkin). Tapahtumiin voi osallistua ilman alkoholia.",
                    },
                    {
                        aihe: "Häirintä",
                        ohje: "Tuutorille voi kertoa, jos on nähnyt tai kokenut häirintäkäytöstä. Tuutori vie asian eteenpäin. Mainitse ja esittele myös killan ja kattokillan häirintäyhdyshenkilöt.",
                    },
                    {
                        aihe: "Kiusaaminen, häirintä, syrjintä, ja epäasiallinen kohtelu",
                        ohje: "Näiden ennaltaehkäisy sekä Tasa-arvo ja yhdenvertaisuus: https://www.oyy.fi/yhteiso/yhdenvertaisuus/, https://www.oulu.fi/fi/yliopisto/tasa-arvo-ja-yhdenvertaisuus-oulun-yliopistossa"
                    },
                    {
                        aihe: "Passiivinen/negatiivinen asenne",
                        ohje: "Kerro miten passiivinen ja/tai negatiivinen asenne voi vaikuttaa opiskeluun."
                    }
                ]
            },
            {
                alaotsikko: "YTHS ja opintopsykologi, yms.",
                aiheet: [
                    {
                        aihe: "YTHS",
                        ohje: "Käydään tutustumassa, missä sijaitsee ja miten palveluita varataan. Kannustetaan käyttämään esim. YTHS:n etuna ilmainen hammastarkastus. Terveyskyselyn täyttämisen merkityksen painottaminen.",
                    },
                    {
                        aihe: "Opintopsykologi",
                        ohje: "Katsotaan yhdessä opintopsykologin yhteystiedot ja kannustetaan tutustumaan ja otta-maan yhteyttä opintopsykologiin matalan kynnyksen periaatteella. https://www.oulu.fi/fi/opintopsykologin-ohjauspalvelut",
                    },
                    {
                        aihe: "Opintopalvelut",
                        ohje: "Opintoneuvojat ja koulutussuunnittelijat, myös apua opintojen suunnitteluun, etenemiseen, jaksamiseen, alanvalintaongelmiin jne."
                    }
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "KAIKKI FUKSIT YHDESSÄ",
        aiheet:[
            {
                alaotsikko: "Kaikkien ryhmien kokoontuminen",
                aiheet: [
                    {
                        aihe: "Yhteistapahtuma (tai jos fukseja on paljon, niin vaikkapa kaksi ryhmää)",
                        ohje: "Supertuutorin yhdessä tuutorien kanssa ideoima hauska yhteistekeminen.",
                    },
                    {
                        aihe: "(Voi olla myös yhteinen tapaaminen toisen tutkinto-ohjelman fuksien kanssa)",
                        ohje: "Valitkaa sopia alla olevista vaihtoehdoista tai ideoikaa jotain muuta. Miettikää ja sopikaa yhdessä mahdollinen ajankohta jo hyvissä ajoin ja tiedottakaa ryhmiä."
                    }
                ]
            },
            {
                alaotsikko: "Ehdotettuja vaihtoehtoja",
                aiheet: [
                    {
                        aihe: "Ennen fuksilauluiltaa tapaaminen jossain yliopistolla.",
                        ohje: "",
                    },
                    {
                        aihe: "Hurmos (tai vastaava) yhteydessä vapaamuotoista palloilua yliopiston lähialueella.",
                        ohje: "",
                    },
                    {
                        aihe: "Jotain yhteistä hauskaa tekemistä, esim. Fuksikeilaus, Fuksikyykkä, Fuksipiknik, pihaleikkejä, Fuksilanit, Ultimate, Norsupallo, patikkaretki Letonniemen kodalle, pyöräretki yms.",
                        ohje: "",
                    },
                    {
                        aihe: "Haalarimerkkikisa. Fuksit suunnittelevat haalarimerkin vuosikurssilleen ja se toteutetaan.",
                        ohje: ""
                    },
                    {
                        aihe: "Fuksicursio tai kaupunkikierros/ kaupunkisuunnistus (pyörillä/bussilla?)",
                        ohje: "",
                    },
                    {
                        aihe: "Voi kysyä myös fukseilta alkutapaamisilla, mitä haluaisivat tehdä.",
                        ohje: "",
                    },
                    {
                        aihe: "Lautapeli-ilta",
                        ohje: ""
                    },
                    {
                        aihe: "TEK-esittely, Ainejärjestön hallitukseen ja toimihenkilöihin tutustuminen, järjestöjen esittelyä, hallitusvisa.",
                        ohje: "",
                    }
                ]
            },
            {
                alaotsikko: "Palaute ja uudelleentoteutus",
                aiheet: [
                    {
                        aihe: "Kerätkää kokemuksia yhteiskokoontumisesta ja miettikää voisiko tällaisen järjestää toisenkin kerran (hyödyt/haasteet?)",
                        ohje: "",
                    },
                ]
            }
        ]

    },
    {
        vuosi: 2025,
        otsikko: "TOINEN TUUTORIRYHMÄ TUTUKSI",
        aiheet:[
            {
                alaotsikko: "Kokoontuminen toisen ryhmän kanssa",
                aiheet: [
                    {
                        aihe: "Tarkoituksena on tehdä jotain kivaa yhdessä toisen tuutoriryhmän=(pienryhmä) kanssa, ei siis pelkästään kalvosulkeisia luokassa istuen! Miettikää mihin tapahtumaan tämän voisi yhdistää (Hurmos tai vastaava)). Voi toki olla oma erillinen tapaaminenkin.",
                        ohje: "",
                    },
                    {
                        aihe: "Miettikää miten tämä eroaisi kaikkien ryhmien tapaamisesta. Mitä voisi tehdä kahden ryhmän kesken pienemmällä porukalla. Valitkaa alla olevista vaihtoehdoista tai ideoikaa itse tapaamisen sisältö.",
                        ohje: "",
                    },
                    {
                        aihe: "Miettikää, pitäisikö tämä olla ennen kaikkien ryhmien tapaamista.",
                        ohje: "",
                    },
                    {
                        aihe: "Miettikää, voisiko tapaamisessa käydä läpi aiemmilta kerroilta käsittelemättä jääneitä asioita vai mikä olisi tämän tapaamisen tärkeä tavoite ja sisältö. Ryhmien yhteisiä tapahtumia on toivottu paljon, joten tämä on tärkeä kokoontumiskerta moneltakin kannalta tarkasteltuna.",
                        ohje: "",
                    },
                    {
                        aihe: "Voisi olla jokin peli tai tekeminen, jonka avulla tullaan tutuiksi toisen ryhmän kanssa. Miettikää ja sopikaa yhdessä mahdollinen ajankohta jo hyvissä ajoin ja tiedottakaa ryhmiä.",
                        ohje: "",
                    }
                ]
            },
            {
                alaotsikko: "Ehdotettuja vaihtoehtoja",
                aiheet: [
                    {
                        aihe: "Ensimmäisen päivän tai viikon piknik.",
                        ohje: "",
                    },
                    {
                        aihe: "Frisbeegolf",
                        ohje: "",
                    },
                    {
                        aihe: "Kaupunkikierros pyöräillen (voisi yhdistää johonkin tapahtumaan).",
                        ohje: "",
                    },
                    {
                        aihe: "Lähialuekierros (tässä voisi hyödyntää tutustumisen tiettyihin kohteisiin (harrastepaikat, yms.))",
                        ohje: "",
                    },
                    {
                        aihe: "Hauskaa yhteistä tekemistä / ryhmäytymistä.",
                        ohje: "",
                    },
                    {
                        aihe: "Tutustumisharjoituksia",
                        ohje: "",
                    },
                ]
            },
            {
                alaotsikko: "Palaute ja uudelleentoteutus",
                aiheet: [
                    {
                        aihe: "Kerätkää kokemuksia yhteiskokoontumisesta ja miettikää voisiko tällaisen järjestää toisenkin kerran (hyödyt/haasteet?).",
                        ohje: "",
                    },
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "KERTAUS JA KUULUMISET",
        aiheet:[
            {
                alaotsikko: "Aiemmilta kerroilta käsittelemättä jääneitä asioita ja kertausta",
                aiheet: [
                    {
                        aihe: "Kertausta",
                        ohje: "Onko jotakin jäänyt epäselväksi. Tarvitseeko jossakin asiassa neuvoa. Tarpeita voisi selvittää jo ennen tätä kertaa ja valmistautua tapaamisen sen mukaan.",
                    },
                    {
                        aihe: "Ryhmäytymistä",
                        ohje: "Ryhmäytymisen vahvistamista tarpeen mukaan.",
                    },
                    {
                        aihe: "Kuulumisia",
                        ohje: "Tässä välissä voisi kysellä kuulumisista rennossa tunnelmassa toisen ryhmän kanssa vaikka pienissä ryhmissä tai pareittain toimien tai paria vaihtaen.",
                    },
                ]
            },
            {
                alaotsikko: "Aihe tarpeen mukaan",
                aiheet: [
                    {
                        aihe: "Tänne voi esim. siirtää aiheita, mitä on jäänyt käymättä läpi tai jos on tullut uusia asioita esille, mistä opiskelijat haluavat tietoa. Tämän kerran tapaamisen voi toteuttaa, milloin tuutori katsoo tarpeelliseksi. Tämän voi toteuttaa myös yhdessä toisen ryhmän kanssa.",
                        ohje: "",
                    },
                ]
            },
            {
                alaotsikko: "Palaute tuutoriryhmän toiminnoista",
                aiheet: [
                    {
                        aihe: "Kerää palautetta, mikä oli kivaa, mitä olisi toivonut lisää. Mikä ei toiminut tai mitä voisi kehittää?",
                        ohje: "",
                    },
                ]
            },
        ]

    },
    {
        vuosi: 2025,
        otsikko: "SELF-HACK",
        aiheet:[
            {
                alaotsikko: "SELF-HACK",
                aiheet: [
                    {
                        aihe: "Vie opiskelijat Self-Hack-tapahtumaan",
                        ohje: "Hankkikaa etukäteen työkirja yhdessä yms. ja tutustukaa nykyiseen ohjelmaan ja toteutukseen https://www.oulu.fi/fi/self-hack - Osallistukaa tuutorin johdolla Self-Hack-tapahtumaan, joka on perinteisesti ensimmäisen viikon perjantaina.",
                    },
                ]
            },
        ]

    },
        {
        vuosi: 2025,
        otsikko: "KAUPUNKIKIERROS",
        aiheet:[
            {
                alaotsikko: "Tutustuminen Ouluun (sopikaa tapaaminen ja toteutus hyvin); toteutus sopivaa hetkeen tuutoroinnin alkupuolelle",
                aiheet: [
                    {
                        aihe: "Järjestä opiskelijoille tapaaminen keskustaan",
                        ohje: "Kierretään keskustassa opiskelijoille tärkeitä paikkoja, kuten opiskelijaravintolat, puistot ja yleiset opiskelijatapahtumapaikat.",
                    },
                    {
                        aihe: "Yhteisiä ryhmäytymisharjoituksia",
                        ohje: "Kokoonnutaan yhteen ja ryhmäytetään opiskelijoita erilaisilla yhteisillä harjoituksilla kuten peleillä."
                    }
                ]
            },
        ]

    },
]

module.exports = {
    pro_cards,
    kummi_cards,
}
