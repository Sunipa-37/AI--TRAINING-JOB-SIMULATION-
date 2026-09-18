-- ============================================================
-- Seed data: sample projects, quiz questions, community posts
-- Company names below are fictional examples for demo purposes.
-- ============================================================

INSERT INTO projects (code, company, trust_badge, category, location, remote, title, description, pay_range, tags, applicants_count) VALUES
('A104', 'Lumora AI Labs', 'Verified Partner', 'Conversational AI', 'Bengaluru, Karnataka', true,
 'AI Chatbot Response Trainer',
 'Review sample chatbot conversations and rate which responses sound most natural and helpful. No coding required — just good judgement and attention to detail.',
 '₹450–₹600/hr', ARRAY['Remote','Flexible Hours','No Experience Needed'], 128),

('B227', 'Nimbus Vision Technologies', 'Verified Partner', 'Computer Vision', 'Pune, Maharashtra', true,
 'Image Data Labeling Associate',
 'Tag objects in photos to help train computer vision models. Great first project for students curious about how AI "sees" the world.',
 '₹350–₹500/hr', ARRAY['Remote','Beginner Friendly'], 214),

('C310', 'Voicebridge Systems', 'Trusted Employer', 'Speech & Audio', 'Gurugram, Haryana', true,
 'Voice Assistant Quality Tester',
 'Listen to short voice-assistant clips and flag ones that misunderstood the speaker. Flexible, self-paced work.',
 '₹400–₹550/hr', ARRAY['Remote','Self-Paced'], 96),

('D188', 'Bhasha Translate Labs', 'Verified Partner', 'Natural Language Processing', 'Chennai, Tamil Nadu', false,
 'English–Regional Language AI Translator',
 'Help an AI model learn to translate everyday phrases between English and a regional language. Hybrid role, occasional office visits.',
 '₹500–₹700/hr', ARRAY['Hybrid','Language Skills'], 61),

('E118', 'Cognivia Research Collective', 'Verified Partner', 'Reasoning & Logic', 'Hyderabad, Telangana', true,
 'AI Reasoning & Logic Dataset Creator',
 'Write short logic puzzles that are used to test how well an AI model can reason. Perfect for students who enjoy brain teasers.',
 '₹450–₹650/hr', ARRAY['Remote','Flexible Hours'], 143),

('F452', 'Pathfinder Learning AI', 'Trusted Employer', 'Education AI', 'Remote (Pan India)', true,
 'AI Homework-Helper Feedback Reviewer',
 'Try out an AI study-assistant and tell us where it explains things well and where it gets confusing. No prior experience needed.',
 '₹400–₹600/hr', ARRAY['Remote','No Experience Needed'], 187),

('G519', 'Artemis Generative Studio', 'Verified Partner', 'Generative AI', 'Mumbai, Maharashtra', true,
 'Image Prompt & Output Evaluator',
 'Rate AI-generated images against the prompts that created them, flagging mismatches or unwanted artifacts. Helps improve a text-to-image model.',
 '₹500–₹650/hr', ARRAY['Remote','Creative'], 172),

('H630', 'Sentinel Robotics Labs', 'Trusted Employer', 'Robotics & Autonomous Systems', 'Coimbatore, Tamil Nadu', false,
 'Robot Navigation Data Annotator',
 'Label sensor and camera footage from a warehouse robot to help it learn to avoid obstacles more reliably. On-site training provided.',
 '₹450–₹600/hr', ARRAY['On-Site','Training Provided'], 54),

('I741', 'Clarity Data Ops', 'Verified Partner', 'Data Operations', 'Kolkata, West Bengal', true,
 'Dataset Quality Checker',
 'Spot-check labeled datasets for errors and inconsistencies before they''re used to train a model. Detail-oriented students thrive here.',
 '₹350–₹450/hr', ARRAY['Remote','Beginner Friendly'], 205),

('J852', 'Horizon NLP Collective', 'Trusted Employer', 'Natural Language Processing', 'Noida, Uttar Pradesh', true,
 'Text Sentiment & Tone Labeler',
 'Read short snippets of text and label the tone (happy, frustrated, neutral, etc.) to help a model understand human emotion in writing.',
 '₹400–₹550/hr', ARRAY['Remote','Flexible Hours'], 118),

('K963', 'Northstar Autonomy', 'Verified Partner', 'Robotics & Autonomous Systems', 'Ahmedabad, Gujarat', false,
 'Self-Driving Simulation Reviewer',
 'Watch simulated driving scenarios and flag moments where the AI made a questionable decision. No driving license needed — it''s all in simulation.',
 '₹500–₹700/hr', ARRAY['On-Site','High Impact'], 77),

('L074', 'Quill Generative Writing Lab', 'Trusted Employer', 'Generative AI', 'Remote (Pan India)', true,
 'AI Story & Essay Feedback Writer',
 'Read AI-generated short stories and essays, then write brief feedback on clarity, creativity, and factual accuracy.',
 '₹450–₹600/hr', ARRAY['Remote','Creative','Writing Skills'], 152);

INSERT INTO questions (category, prompt, options, correct_index, sort_order) VALUES
('Maths', 'A train travels 60 km in 45 minutes. What is its speed in km/h?', '["90","75","80","60"]', 2, 1),
('Maths', 'What is the value of 15% of 240?', '["36","32","40","24"]', 0, 2),
('Maths', 'Simplify: (3/4) + (1/2)', '["5/4","1","5/6","4/6"]', 0, 3),
('Maths', 'If the perimeter of a square is 36 cm, what is the length of one side?', '["6 cm","9 cm","12 cm","18 cm"]', 1, 4),
('Maths', 'What comes next in the series: 2, 6, 12, 20, 30, ?', '["36","40","42","44"]', 2, 5),

('Science', 'Which gas do plants absorb from the air for photosynthesis?', '["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"]', 2, 6),
('Science', 'The force that pulls objects toward the Earth is called:', '["Friction","Gravity","Magnetism","Tension"]', 1, 7),
('Science', 'Which of these is a renewable source of energy?', '["Coal","Petroleum","Solar energy","Natural gas"]', 2, 8),
('Science', 'The powerhouse of the cell is the:', '["Nucleus","Ribosome","Mitochondria","Cell wall"]', 2, 9),
('Science', 'Sound travels fastest through:', '["Air","Water","Vacuum","Steel"]', 3, 10),

('SST', 'Which of these is a fundamental duty of Indian citizens?', '["Paying taxes only","Respecting the National Flag","Voting in elections only","Owning property"]', 1, 11),
('SST', 'The Tropic of Cancer passes through how many Indian states?', '["6","8","10","12"]', 1, 12),
('SST', 'Which movement was launched by Mahatma Gandhi in 1930 to protest the salt tax?', '["Quit India Movement","Non-Cooperation Movement","Dandi March","Swadeshi Movement"]', 2, 13),
('SST', 'The largest continent by area is:', '["Africa","Asia","Europe","North America"]', 1, 14),

('Conceptual', 'All cats are animals. Some animals are pets. Which statement must be true?', '["All cats are pets","Some cats may be pets","No cats are pets","All pets are cats"]', 1, 15),
('Conceptual', 'Doctor is to Hospital as Teacher is to ___', '["Book","School","Student","Class"]', 1, 16),
('Conceptual', '"Machine learning" is best described as:', '["Manually programming every rule by hand","A way for computers to learn patterns from data","A type of computer hardware","A programming language"]', 1, 17),
('Conceptual', 'Find the odd one out:', '["Apple","Banana","Carrot","Mango"]', 2, 18),

('Descriptive', 'Which word best completes: "She showed great ___ by finishing the marathon despite the injury."', '["Indifference","Perseverance","Negligence","Hesitation"]', 1, 19),
('Descriptive', 'Choose the sentence that is grammatically correct:', '["Neither of the boys were ready.","Neither of the boys was ready.","Neither of the boys are ready.","Neither of the boy was ready."]', 1, 20);

INSERT INTO community_posts (handle, body) VALUES
('riya_2027', 'Just finished my first labeling batch for the Nimbus Vision project — took about an hour and the guidelines were really clear.'),
('arjun.codes', 'Anyone else doing the AI reasoning puzzles for Cognivia? Genuinely fun to write, doesn''t feel like "work."'),
('sneha_writes', 'Tip: read the project description fully before applying, the pay range and hours differ a lot between listings.'),
('kabir_p', 'Got my first payout after the Voicebridge audio review project. Whole process from apply to paid was under 2 weeks.');
