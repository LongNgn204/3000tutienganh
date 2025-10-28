import type { ReadingArticle, ListeningExercise } from './types';

interface ContentLibrary {
    reading: ReadingArticle[];
    listening: ListeningExercise[];
}

export const CONTENT_LIBRARY: ContentLibrary = {
    reading: [
        // A1 Level
        {
            id: 'a1-my-pet',
            title: 'My Pet Cat',
            level: 'A1',
            content: `I have a pet cat. Her name is Lily. She is white and very fluffy. Lily has big blue eyes.
Every day, Lily sleeps on my bed. She likes to play with a small ball. When I come home from school, she runs to the door. I love my cat very much. She is my best friend.`,
            questions: [
                {
                    question: 'What is the name of the cat?',
                    options: ['Lucy', 'Lily', 'Lola', 'Luna'],
                    answer: 'Lily',
                },
                {
                    question: 'What color is the cat?',
                    options: ['Black', 'Gray', 'White', 'Brown'],
                    answer: 'White',
                },
                {
                    question: 'What does Lily like to play with?',
                    options: ['A toy mouse', 'A small ball', 'A red string', 'A box'],
                    answer: 'A small ball',
                },
            ],
        },
        {
            id: 'a1-favorite-food',
            title: 'My Favorite Food',
            level: 'A1',
            content: `My favorite food is pizza. I like pizza with cheese and tomato. It is very delicious.
My mother makes good pizza at home. We eat it on weekends. My brother likes pizza too. We eat it together. It is a happy time for my family.`,
            questions: [
                {
                    question: 'What is the favorite food?',
                    options: ['Pasta', 'Burger', 'Pizza', 'Salad'],
                    answer: 'Pizza',
                },
                {
                    question: 'Who makes the pizza?',
                    options: ['Father', 'Mother', 'Brother', 'Sister'],
                    answer: 'Mother',
                },
                {
                    question: 'When do they eat pizza?',
                    options: ['On Mondays', 'Every day', 'On weekends', 'On holidays'],
                    answer: 'On weekends',
                },
            ],
        },
        // A2 Level
        {
            id: 'a2-daily-routine',
            title: 'My Daily Routine',
            level: 'A2',
            content: `My name is Alex, and I am a student. Every morning, I wake up at 7:00 AM. I brush my teeth and wash my face. Then, I have breakfast with my family. I usually eat bread and drink milk.
After breakfast, I get dressed and go to school by bus. My classes start at 8:30 AM. I study many subjects like Math, English, and Science. My favorite subject is English.
I finish school at 4:00 PM. When I get home, I do my homework. In the evening, I have dinner with my family, and we talk about our day. Before I go to bed, I like to read a book. I usually go to sleep at 10:00 PM.`,
            questions: [
                {
                    question: 'What time does Alex wake up?',
                    options: ['7:30 AM', '7:00 AM', '8:00 AM', '8:30 AM'],
                    answer: '7:00 AM',
                },
                {
                    question: 'How does Alex go to school?',
                    options: ['By car', 'By bike', 'He walks', 'By bus'],
                    answer: 'By bus',
                },
                {
                    question: 'What does Alex do before going to bed?',
                    options: ['Watch TV', 'Play games', 'Read a book', 'Listen to music'],
                    answer: 'Read a book',
                },
            ],
        },
        {
            id: 'a2-last-holiday',
            title: 'My Last Holiday',
            level: 'A2',
            content: `Last summer, my family and I went to the beach. We stayed in a small hotel near the sea. The weather was wonderful. It was sunny and warm every day.
In the morning, I went swimming in the sea. My brother and I built big sandcastles. In the afternoon, we visited some interesting places. In the evening, we had dinner at a local restaurant. The food was fresh and very tasty.
I had a great time on my holiday. I took a lot of photos to remember the trip. I hope we can go back there again next year.`,
            questions: [
                {
                    question: 'Where did they go for their holiday?',
                    options: ['To the mountains', 'To the city', 'To the beach', 'To the countryside'],
                    answer: 'To the beach',
                },
                {
                    question: 'What was the weather like?',
                    options: ['Cold and rainy', 'Cloudy and windy', 'Sunny and warm', 'It was snowing'],
                    answer: 'Sunny and warm',
                },
                {
                    question: 'What did they do in the morning?',
                    options: ['Visited museums', 'Went shopping', 'Went swimming', 'Slept late'],
                    answer: 'Went swimming',
                },
            ],
        },
        // B1 Level
        {
            id: 'b1-remote-work',
            title: 'The Rise of Remote Work',
            level: 'B1',
            content: `In recent years, working from home, also known as remote work, has become much more common. Many companies now allow their employees to work from outside the office. This change is largely due to improvements in technology. With a reliable internet connection, people can easily communicate with their colleagues and access company files from anywhere.
There are several advantages to remote work. Employees often have a more flexible schedule and can save time and money by not commuting. However, there are also disadvantages. Some people feel isolated when they don't see their coworkers every day. It can also be difficult to separate work life from home life. Companies need to find a good balance to make remote work successful.`,
            questions: [
                {
                    question: 'What is the main reason for the increase in remote work?',
                    options: ['Companies want to save money', 'Employees prefer flexible schedules', 'Improvements in technology', 'It is a new law'],
                    answer: 'Improvements in technology',
                },
                {
                    question: 'Which of the following is a disadvantage of remote work mentioned in the text?',
                    options: ['Saving money', 'Feeling lonely', 'Having a flexible schedule', 'Communicating easily'],
                    answer: 'Feeling lonely',
                },
                 {
                    question: 'What does the word "commuting" mean in this context?',
                    options: ['Communicating with colleagues', 'Working from home', 'Traveling to and from work', 'Accessing company files'],
                    answer: 'Traveling to and from work',
                },
            ],
        },
        {
            id: 'b1-benefits-exercise',
            title: 'The Benefits of Regular Exercise',
            level: 'B1',
            content: `Regular exercise is one of the most important things you can do for your health. It offers a wide range of benefits, from improving your physical condition to boosting your mental well-being.
Physically, exercise helps to control weight, reduce the risk of heart diseases, and manage blood sugar levels. It also strengthens your bones and muscles. Mentally, physical activity can improve your mood and reduce feelings of anxiety and depression. It can also help you sleep better.
It is recommended to get at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity a week. You can choose activities you enjoy, such as brisk walking, swimming, cycling, or dancing. The key is to be consistent.`,
            questions: [
                {
                    question: 'Which of these is NOT mentioned as a physical benefit of exercise?',
                    options: ['Controlling weight', 'Strengthening bones', 'Improving eyesight', 'Reducing heart disease risk'],
                    answer: 'Improving eyesight',
                },
                {
                    question: 'How can exercise affect your mental health?',
                    options: ['It makes you feel more tired.', 'It can improve your mood.', 'It has no effect on mental health.', 'It increases stress levels.'],
                    answer: 'It can improve your mood.',
                },
                {
                    question: 'What is the key to getting benefits from exercise?',
                    options: ['Doing it only on weekends', 'Choosing very difficult activities', 'Being consistent', 'Exercising for a very long time'],
                    answer: 'Being consistent',
                },
            ],
        },
        // B2 Level
        {
            id: 'b2-ai-impact',
            title: 'The Impact of Artificial Intelligence',
            level: 'B2',
            content: `Artificial intelligence (AI) is transforming our world in numerous ways, from how we work to how we live. One of the most significant impacts of AI is in the field of automation. Repetitive tasks that were once performed by humans can now be done by AI-powered machines, leading to increased efficiency and productivity. For instance, in manufacturing, robots assemble products with a precision that humans cannot match.
However, the rapid advancement of AI also raises concerns. The most prominent issue is the potential for job displacement. As AI becomes more capable, there is a fear that many jobs, particularly those involving routine tasks, will be eliminated. Furthermore, there are ethical considerations regarding data privacy and the potential for bias in AI algorithms. It is crucial that we develop and implement AI responsibly to maximize its benefits while mitigating the risks.`,
            questions: [
                {
                    question: 'According to the text, what is a major benefit of AI in manufacturing?',
                    options: ['It creates new jobs.', 'It increases the speed of production.', 'It performs tasks with high precision.', 'It reduces the cost of products.'],
                    answer: 'It performs tasks with high precision.',
                },
                {
                    question: 'What is the "most prominent issue" related to AI advancement?',
                    options: ['Data privacy problems.', 'The possibility of losing jobs.', 'Biased algorithms.', 'The high cost of AI technology.'],
                    answer: 'The possibility of losing jobs.',
                },
                {
                    question: 'What does the word "mitigating" mean in the last sentence?',
                    options: ['Increasing or amplifying', 'Ignoring or avoiding', 'Reducing the severity of', 'Understanding the cause of'],
                    answer: 'Reducing the severity of',
                },
            ],
        },
        {
            id: 'b2-social-media',
            title: 'The Two Sides of Social Media',
            level: 'B2',
            content: `Social media has fundamentally changed the way we communicate and interact. Platforms like Facebook, Instagram, and Twitter allow us to connect with friends and family across the globe, share our experiences, and access information instantly. They have also become powerful tools for social movements and political change.
However, the pervasive nature of social media also presents significant challenges. Issues such as cyberbullying, the spread of misinformation, and the negative impact on mental health are growing concerns. The curated, often unrealistic, portrayals of life on social media can lead to anxiety and low self-esteem. Furthermore, addiction to these platforms can detract from real-world interactions and responsibilities. Balancing the benefits of connectivity with the potential harms is one of the key challenges of our digital age.`,
            questions: [
                {
                    question: 'Which is mentioned as a positive aspect of social media?',
                    options: ['It helps people feel less anxious.', 'It is a tool for social movements.', 'It guarantees all information is accurate.', 'It promotes real-world interactions.'],
                    answer: 'It is a tool for social movements.',
                },
                {
                    question: 'What is a negative mental health impact mentioned in the text?',
                    options: ['Feeling more connected to family.', 'Becoming more politically active.', 'Gaining access to instant information.', 'Anxiety and low self-esteem.'],
                    answer: 'Anxiety and low self-esteem.',
                },
                {
                    question: 'What does the word "pervasive" mean?',
                    options: ['New and innovative', 'Difficult to use', 'Spreading widely throughout an area', 'Private and secure'],
                    answer: 'Spreading widely throughout an area',
                },
            ],
        },
        // C1 Level
        {
            id: 'c1-globalization',
            title: 'The Nuances of Globalization',
            level: 'C1',
            content: `Globalization, the process of interaction and integration among people, companies, and governments worldwide, is a multifaceted phenomenon with profound consequences. Proponents argue that it has been a catalyst for economic growth, allowing for the free flow of capital and goods, which in turn leads to lower prices for consumers and greater economic efficiency. The proliferation of information technology has further accelerated this process, breaking down geographical barriers and fostering cross-cultural communication.
Conversely, critics of globalization point to its detrimental effects. They argue that it has exacerbated income inequality, as multinational corporations often seek out the cheapest labor, leading to a "race to the bottom" in terms of wages and working conditions. Moreover, the cultural homogenization that can result from the dominance of Western media and brands is seen as a threat to local traditions and identities. Therefore, a nuanced perspective is required to understand that globalization is not inherently good or bad, but a complex force with both positive and negative ramifications.`,
            questions: [
                {
                    question: 'What is the main argument of those who support globalization?',
                    options: ['It preserves local cultures.', 'It reduces income inequality.', 'It promotes economic growth and efficiency.', 'It strengthens government control.'],
                    answer: 'It promotes economic growth and efficiency.',
                },
                {
                    question: 'What does "cultural homogenization" refer to?',
                    options: ['The mixing of different cultures to create new ones.', 'The process of cultures becoming more similar to each other.', 'The protection of local cultural traditions.', 'The study of different global cultures.'],
                    answer: 'The process of cultures becoming more similar to each other.',
                },
                {
                    question: 'What is the overall conclusion of the author regarding globalization?',
                    options: ['It is a purely negative force.', 'It is a complex issue with both benefits and drawbacks.', 'It is a phenomenon that is slowing down.', 'Its benefits far outweigh its negative effects.'],
                    answer: 'It is a complex issue with both benefits and drawbacks.',
                },
            ],
        },
        {
            id: 'c1-lifelong-learning',
            title: 'The Imperative of Lifelong Learning',
            level: 'C1',
            content: `In an era of rapid technological advancement and economic disruption, the concept of lifelong learning has transitioned from a mere ideal to a professional imperative. The notion that education concludes with a formal degree is increasingly obsolete. Today's workforce must continuously acquire new skills and knowledge—a process known as upskilling and reskilling—to remain relevant and competitive.
This continuous educational journey is not solely about professional survival; it also fosters personal growth, cognitive flexibility, and adaptability. Engaging in new learning experiences stimulates the brain and can stave off cognitive decline in later life. Moreover, it cultivates a growth mindset, the belief that abilities can be developed through dedication and hard work. As the half-life of skills continues to shrink, embracing lifelong learning is not just advantageous, it is essential for navigating the complexities of the 21st century.`,
            questions: [
                {
                    question: 'Why is the idea of education ending with a degree considered "obsolete"?',
                    options: ['Because degrees are no longer valuable.', 'Because of the need to continuously learn new skills.', 'Because informal education is cheaper.', 'Because companies prefer employees without degrees.'],
                    answer: 'Because of the need to continuously learn new skills.',
                },
                {
                    question: 'Besides professional benefits, what is another advantage of lifelong learning mentioned?',
                    options: ['It guarantees a higher salary.', 'It fosters cognitive flexibility.', 'It reduces the need for formal education.', 'It is a faster way to get a promotion.'],
                    answer: 'It fosters cognitive flexibility.',
                },
                {
                    question: 'What does the "half-life of skills" shrinking imply?',
                    options: ['Skills are becoming easier to learn.', 'People are learning skills more slowly.', 'Skills are becoming irrelevant more quickly.', 'The number of available skills is decreasing.'],
                    answer: 'Skills are becoming irrelevant more quickly.',
                },
            ],
        },
        // C2 Level
        {
            id: 'c2-cognitive-bias',
            title: 'Cognitive Biases in Decision Making',
            level: 'C2',
            content: `Human cognition, despite its remarkable capabilities, is susceptible to systematic errors in thinking known as cognitive biases. These are not random misjudgments but rather predictable patterns of deviation from rational judgment. One pervasive example is confirmation bias, the tendency to search for, interpret, favor, and recall information in a way that confirms or supports one's preexisting beliefs. This can lead to flawed decision-making, as individuals may disregard evidence that contradicts their initial standpoint.
Another potent bias is the availability heuristic, where people overestimate the importance of information that is readily available to them. A person might argue that smoking is not unhealthy because they know someone who smoked for decades and lived to be 90. This anecdotal evidence is more vivid and easily recalled than statistical data from medical studies. Understanding these inherent biases is the first step toward metacognition—thinking about one's own thinking—and can lead to more objective and rational outcomes.`,
            questions: [
                {
                    question: 'What is the primary characteristic of a cognitive bias?',
                    options: ['It is a random error in judgment.', 'It is a predictable pattern of irrational thinking.', 'It only affects people with low intelligence.', 'It is a conscious choice to ignore facts.'],
                    answer: 'It is a predictable pattern of irrational thinking.',
                },
                {
                    question: 'How does confirmation bias affect an individual?',
                    options: ['It makes them seek out diverse opinions.', 'It helps them change their mind easily.', 'It causes them to favor information that supports their existing views.', 'It improves their memory for all types of information.'],
                    answer: 'It causes them to favor information that supports their existing views.',
                },
                 {
                    question: 'The example of the 90-year-old smoker illustrates which concept?',
                    options: ['Metacognition', 'Confirmation bias', 'Statistical analysis', 'The availability heuristic'],
                    answer: 'The availability heuristic',
                },
            ],
        },
        {
            id: 'c2-minimalism',
            title: 'The Philosophy of Minimalism',
            level: 'C2',
            content: `Minimalism, as a philosophy, extends far beyond the aesthetic of spartan interiors and decluttered spaces. At its core, it is an intentional promotion of the things we most value and the removal of everything that distracts us from them. It is a conscious rebuttal of the compulsory consumption that underpins much of modern society. This is not to say it is an ascetic existence devoid of pleasure, but rather a re-evaluation of what constitutes a rich life.
The minimalist credo posits that by paring down our possessions, commitments, and even digital noise, we can create the space for more meaningful pursuits: relationships, personal growth, and contribution. This intentionality can be profoundly liberating, freeing up not just physical space but also mental and financial resources. However, it is a deeply personal journey; one person's essential is another's superfluity. Therefore, minimalism is not a rigid set of rules, but a versatile framework for designing a more deliberate life.`,
            questions: [
                {
                    question: 'What is the fundamental principle of minimalism according to the text?',
                    options: ['Having as few possessions as possible.', 'Living an ascetic and simple life.', 'Prioritizing what is valuable and removing distractions.', 'Rejecting modern technology and consumption.'],
                    answer: 'Prioritizing what is valuable and removing distractions.',
                },
                {
                    question: 'What does the author mean by "one person\'s essential is another\'s superfluity"?',
                    options: ['Everyone should own the same essential items.', 'Minimalism has strict rules everyone must follow.', 'What is considered necessary varies from person to person.', 'Superfluous items are more valuable than essential ones.'],
                    answer: 'What is considered necessary varies from person to person.',
                },
                {
                    question: 'According to the text, minimalism is best described as...',
                    options: ['a rigid set of rules.', 'an aesthetic style.', 'a financial strategy.', 'a versatile framework.'],
                    answer: 'a versatile framework.',
                },
            ],
        },
    ],
    listening: [
        // A1 Level
        {
            id: 'a1-family-talk',
            title: 'Talking about Family',
            level: 'A1',
            transcript: `A: Do you have any brothers or sisters?
B: Yes, I have one brother.
A: What is his name?
B: His name is Tom. He is older than me.
A: Is he a student?
B: No, he is a doctor.
A: That's great!`,
            questions: [
                {
                    question: 'How many brothers does person B have?',
                    options: ['One', 'Two', 'None', 'One sister'],
                    answer: 'One',
                },
                {
                    question: 'Is Tom younger than person B?',
                    options: ['Yes, he is younger.', 'No, he is older.', 'They are the same age.', 'The text does not say.'],
                    answer: 'No, he is older.',
                },
                {
                    question: 'What is Tom\'s job?',
                    options: ['He is a student.', 'He is a teacher.', 'He is a doctor.', 'He is an engineer.'],
                    answer: 'He is a doctor.',
                },
            ],
        },
        {
            id: 'a1-daily-activities',
            title: 'My Day',
            level: 'A1',
            transcript: `Hello, my name is Maria. I wake up at 7 AM. I eat breakfast. I like toast and juice. Then, I go to school. My school is big. I like my teacher. After school, I play in the park with my friends. In the evening, I do my homework. I go to bed at 9 PM.`,
            questions: [
                {
                    question: 'What does Maria eat for breakfast?',
                    options: ['Toast and juice', 'Eggs and milk', 'Cereal', 'Fruit'],
                    answer: 'Toast and juice',
                },
                {
                    question: 'Where does Maria play after school?',
                    options: ['At home', 'In the park', 'At school', `At her friend's house`],
                    answer: 'In the park',
                },
                {
                    question: 'What time does Maria go to bed?',
                    options: ['7 AM', '9 PM', '8 PM', '10 PM'],
                    answer: '9 PM',
                },
            ],
        },
        // A2 Level
        {
            id: 'a2-ordering-food',
            title: 'Ordering Food at a Restaurant',
            level: 'A2',
            transcript: `Waiter: Hello, are you ready to order?
Customer: Yes, I am. I'd like the chicken soup to start, please.
Waiter: Okay. And for your main course?
Customer: I'll have the grilled fish with vegetables.
Waiter: Excellent choice. Would you like anything to drink?
Customer: Just some water for me, please.
Waiter: Certainly. So that's one chicken soup, one grilled fish, and a water. I'll be right back with your drink.`,
            questions: [
                {
                    question: 'What does the customer order first?',
                    options: ['Grilled fish', 'A drink', 'Chicken soup', 'Vegetables'],
                    answer: 'Chicken soup',
                },
                {
                    question: 'What is the customer\'s main course?',
                    options: ['Chicken soup', 'Grilled fish', 'Steak', 'Pasta'],
                    answer: 'Grilled fish',
                },
                {
                    question: 'What does the customer want to drink?',
                    options: ['Juice', 'Soda', 'Water', 'Coffee'],
                    answer: 'Water',
                },
            ],
        },
         {
            id: 'a2-at-the-airport',
            title: 'At the Airport',
            level: 'A2',
            transcript: `Agent: "Good morning. Where are you flying to today?"
Passenger: "I'm flying to New York."
Agent: "May I see your passport, please?"
Passenger: "Here you are."
Agent: "Thank you. Are you checking any bags?"
Passenger: "Yes, just this one."
Agent: "Okay. Please place it on the scale. Your flight is at gate B7, and it will begin boarding at 10:30 AM. Your seat number is 15A."
Passenger: "Gate B7 at 10:30. Got it. Thank you!"`,
            questions: [
                {
                    question: 'Where is the passenger going?',
                    options: ['London', 'Paris', 'New York', 'Tokyo'],
                    answer: 'New York',
                },
                {
                    question: 'How many bags is the passenger checking?',
                    options: ['None', 'One', 'Two', 'Three'],
                    answer: 'One',
                },
                {
                    question: 'Which gate is the flight from?',
                    options: ['A15', 'B7', '10B', '30A'],
                    answer: 'B7',
                },
                {
                    question: 'What time does boarding begin?',
                    options: ['10:30 AM', '7:00 AM', '15:00', 'B7'],
                    answer: '10:30 AM',
                },
            ],
        },
        // B1 Level
        {
            id: 'b1-planning-trip',
            title: 'Planning a Weekend Trip',
            level: 'B1',
            transcript: `Anna: Hi Ben, do you have any plans for the weekend?
Ben: Not really. I was thinking of just relaxing at home. Why?
Anna: Well, I was wondering if you'd be interested in a short trip. My friends and I are planning to go hiking in the mountains.
Ben: That sounds interesting! I haven't been hiking in a long time. When are you planning to leave?
Anna: We're thinking of leaving early on Saturday morning and coming back on Sunday evening. We've already booked a small cabin to stay in.
Ben: A cabin in the mountains sounds perfect. I'm in! What should I bring?
Anna: Just some comfortable shoes, warm clothes, and maybe a camera. The views are supposed to be amazing.`,
            questions: [
                {
                    question: 'What is Anna planning to do this weekend?',
                    options: ['Relax at home', 'Go hiking', 'Visit her family', 'Go to the cinema'],
                    answer: 'Go hiking',
                },
                {
                    question: 'Where will they stay during the trip?',
                    options: ['In a hotel', 'At a campsite', 'In a cabin', 'With friends'],
                    answer: 'In a cabin',
                },
                 {
                    question: 'What does Anna suggest Ben should bring?',
                    options: ['A book and some games', 'Food and water', 'A tent and a sleeping bag', 'Comfortable shoes and warm clothes'],
                    answer: 'Comfortable shoes and warm clothes',
                },
            ],
        },
        {
            id: 'b1-making-plans',
            title: 'Making Plans for a Movie',
            level: 'B1',
            transcript: `Chris: "Hey, Lisa. Are you free on Friday night? There's a new sci-fi movie I really want to see."
Lisa: "Friday night? I think so. What movie is it?"
Chris: "It's called 'Galaxy Runner'. It's getting great reviews. It's playing at the City Cinema."
Lisa: "Oh, I've heard of that one! What time were you thinking?"
Chris: "There's a showing at 7:00 PM and another at 9:30 PM. I prefer the earlier one, if that works for you."
Lisa: "7:00 PM is perfect. That gives us time to get some dinner beforehand. Do you want to meet at the Italian place next to the cinema around 6:00?"
Chris: "That's a great idea. So, meet at 'Pasta Place' at 6:00, then the movie at 7:00. I'll buy the tickets online now."
Lisa: "Sounds like a plan! See you on Friday."`,
            questions: [
                 {
                    question: 'What type of movie do they plan to watch?',
                    options: ['Comedy', 'Horror', 'Romance', 'Sci-fi'],
                    answer: 'Sci-fi',
                },
                {
                    question: 'Which showtime does Chris prefer?',
                    options: ['6:00 PM', '7:00 PM', '9:30 PM', 'Friday night'],
                    answer: '7:00 PM',
                },
                {
                    question: 'What do they decide to do before the movie?',
                    options: ['Go shopping', 'Get dinner', 'Go for a walk', 'Meet at the cinema'],
                    answer: 'Get dinner',
                },
                {
                    question: 'Who is going to buy the movie tickets?',
                    options: ['Lisa', 'Chris', 'They will buy them at the cinema', 'They already have tickets'],
                    answer: 'Chris',
                },
            ],
        },
        // B2 Level
        {
            id: 'b2-job-interview-feedback',
            title: 'Discussing a Job Interview',
            level: 'B2',
            transcript: `Maria: So, how did your job interview go yesterday, David?
David: I think it went quite well, actually. The hiring manager was friendly, and the questions were challenging but fair. I felt I was able to demonstrate my experience effectively.
Maria: That's great to hear! What kind of questions did they ask?
David: They started with some typical behavioral questions, like "Tell me about a time you had to deal with a difficult colleague." Then, they moved on to more technical questions related to the software we'd be using. I was a bit nervous about that part, but I think I managed.
Maria: It sounds like you were well-prepared. Did they give you any indication of the next steps?
David: Yes, they said they would be in touch within a week. So, it's a waiting game now. I'm trying not to get my hopes up too high, but I'm cautiously optimistic.`,
            questions: [
                {
                    question: 'What is David\'s general feeling about the interview?',
                    options: ['He thinks it went poorly.', 'He is very worried.', 'He feels positive about it.', 'He is unsure how it went.'],
                    answer: 'He feels positive about it.',
                },
                {
                    question: 'Which part of the interview made David a little nervous?',
                    options: ['The behavioral questions.', 'Meeting the hiring manager.', 'The technical questions.', 'Discussing his salary expectations.'],
                    answer: 'The technical questions.',
                },
                 {
                    question: 'What is the meaning of being "cautiously optimistic"?',
                    options: ['Feeling very confident and excited.', 'Feeling hopeful but aware of potential disappointment.', 'Feeling completely pessimistic.', 'Not having any expectations.'],
                    answer: 'Feeling hopeful but aware of potential disappointment.',
                },
            ],
        },
        {
            id: 'b2-environmental-issues',
            title: 'Discussing Environmental Issues',
            level: 'B2',
            transcript: `Emily: "I was just reading an article about plastic waste. It's quite alarming how much ends up in our oceans."
Mark: "I know, it's a huge problem. I've been trying to reduce my own plastic use, but it's difficult when so many things are packaged in it."
Emily: "Exactly. I think the real change has to come from large corporations. They need to be held accountable and invest in sustainable alternatives."
Mark: "I agree, but individual action is still important. It sends a message. For example, I've started using a reusable water bottle and coffee cup. It's a small thing, but it adds up."
Emily: "That's true. I've been trying to do the same. I also think better recycling infrastructure is crucial. In my neighborhood, they don't even collect all types of plastic."
Mark: "It really requires a multi-faceted approach, doesn't it? Government policies, corporate responsibility, and individual effort all have to work together."`,
            questions: [
                {
                    question: 'What is the main topic of the conversation?',
                    options: ['Ocean life', 'Corporate profits', 'Plastic waste', 'Recycling technology'],
                    answer: 'Plastic waste',
                },
                {
                    question: 'Where does Emily believe the most significant change must originate?',
                    options: ['From individuals', 'From large corporations', 'From the government', 'From schools'],
                    answer: 'From large corporations',
                },
                {
                    question: 'What is one individual action Mark has taken?',
                    options: ['Writing to corporations', 'Protesting', 'Using reusable containers', 'Starting a recycling program'],
                    answer: 'Using reusable containers',
                },
                {
                    question: 'What does Mark mean by a "multi-faceted approach"?',
                    options: ['A simple solution', 'A complicated problem', 'An approach involving many different aspects', 'A focus on individual action'],
                    answer: 'An approach involving many different aspects',
                },
            ],
        },
        // C1 Level
        {
            id: 'c1-ai-debate',
            title: 'A Debate on Artificial Intelligence',
            level: 'C1',
            transcript: `Moderator: Welcome. Today's topic is the future of AI. Sarah, your opening statement?
Sarah: Thank you. I believe AI presents an unprecedented opportunity for human progress. It has the potential to solve some of our most intractable problems, from climate change to disease. We should embrace its development.
Tom: I take a more circumspect view. While I concede the potential benefits, the risks are monumental. Unregulated AI development could lead to mass unemployment and unforeseen societal disruptions. The ethical ramifications are staggering.
Sarah: But Tom, isn't that a Luddite fallacy? Every technological revolution has sparked fears of unemployment, yet history shows that new jobs are always created. AI can augment human capabilities, not just replace them.
Tom: The difference is that AI has the potential for autonomous decision-making. We are not just creating a more efficient tool; we are potentially creating a new form of intelligence. The safeguards must be robust and implemented proactively, not reactively.`,
            questions: [
                {
                    question: 'What is Sarah\'s general stance on AI?',
                    options: ['She is deeply concerned about its risks.', 'She believes it will cause mass unemployment.', 'She is optimistic about its potential for progress.', 'She thinks its development should be stopped.'],
                    answer: 'She is optimistic about its potential for progress.',
                },
                {
                    question: 'What does Tom mean by a "circumspect view"?',
                    options: ['An optimistic and enthusiastic view.', 'A cautious and wary view.', 'A completely negative view.', 'A view based on historical precedent.'],
                    answer: 'A cautious and wary view.',
                },
                 {
                    question: 'What is the core of Tom\'s argument against Sarah\'s historical comparison?',
                    options: ['That AI cannot create new jobs.', 'That AI is fundamentally different because it can make its own decisions.', 'That technological revolutions are always harmful.', 'That the ethical issues are not important.'],
                    answer: 'That AI is fundamentally different because it can make its own decisions.',
                },
            ],
        },
        {
            id: 'c1-work-presentation',
            title: 'Feedback on a Work Presentation',
            level: 'C1',
            transcript: `Manager: "Hi, Alex. Do you have a moment? I wanted to give you some feedback on your presentation this morning."
Alex: "Of course. Please, have a seat. I'd appreciate your thoughts."
Manager: "Overall, it was very well-structured. The data was compelling, and your key takeaways were clear. You've clearly put a lot of work into the analysis, and it shows."
Alex: "Thank you. I'm glad the analysis came across clearly."
Manager: "It did. One area for development I'd suggest is your delivery. At times, you seemed to be reading directly from your notes, which made it slightly less engaging. Try to internalize the key points so you can speak more freely and make more eye contact with the audience."
Alex: "That's a fair point. I get a bit nervous and rely on my notes too much. I'll work on that."
Manager: "Also, while the data was excellent, you could perhaps preemptively address potential counterarguments. For example, why our proposed strategy is more cost-effective than the alternative. But these are minor refinements. On the whole, it was a solid piece of work."`,
            questions: [
                {
                    question: "What was the manager's overall impression of the presentation?",
                    options: ['It was poorly structured', 'It was very good', 'It lacked sufficient data', 'It was too long'],
                    answer: 'It was very good',
                },
                {
                    question: "What specific area for improvement did the manager mention regarding Alex's delivery?",
                    options: ['Speaking too quickly', 'Using too much jargon', 'Reading from notes too often', 'Not being loud enough'],
                    answer: 'Reading from notes too often',
                },
                {
                    question: 'What does the manager suggest Alex do to make the content even stronger?',
                    options: ['Use more data', 'Address potential counterarguments', 'Make the slides more colorful', 'Shorten the presentation'],
                    answer: 'Address potential counterarguments',
                },
                {
                    question: 'What does "preemptively address" mean?',
                    options: ['To ignore opposing views', 'To deal with something before it becomes a problem', 'To agree with all arguments', 'To discuss something after it has happened'],
                    answer: 'To deal with something before it becomes a problem',
                },
            ],
        },
        // C2 Level
        {
            id: 'c2-philosophy-discussion',
            title: 'A Short Philosophical Discussion',
            level: 'C2',
            transcript: `Sophia: "I've been contemplating the distinction between pleasure and happiness. They're often used interchangeably, but they seem fundamentally different."
Leo: "An interesting dichotomy. I would posit that pleasure is ephemeral, a fleeting sensory experience, like eating a fine meal. Happiness, conversely, is a more durable state of contentment—what Aristotle might call 'eudaimonia'."
Sophia: "Precisely. So, a life pursuing pleasure—hedonism—might not necessarily culminate in a life of happiness. It could lead to a perpetual, unsatisfying chase."
Leo: "Indeed. Perhaps happiness is less about the accumulation of pleasurable moments and more about living a life of purpose and virtue, even if that involves struggle. The contentment derived from overcoming a challenge, for instance, is a far cry from simple sensory pleasure."
Sophia: "So, happiness is a byproduct, not a goal in itself. It's the result of a life lived meaningfully. That resonates. It reframes the entire pursuit."`,
            questions: [
                {
                    question: 'How does Leo define the primary difference between pleasure and happiness?',
                    options: ['Pleasure is mental, happiness is physical', 'Pleasure is short-lived, happiness is more lasting', 'Pleasure is negative, happiness is positive', 'There is no difference'],
                    answer: 'Pleasure is short-lived, happiness is more lasting',
                },
                {
                    question: 'What is the potential outcome of a life dedicated solely to pursuing pleasure (hedonism)?',
                    options: ['A state of permanent happiness', 'A fulfilling and virtuous life', 'An unsatisfying and continuous search', 'A life free from struggle'],
                    answer: 'An unsatisfying and continuous search',
                },
                {
                    question: 'According to the dialogue, what is happiness a result of?',
                    options: ['Accumulating wealth', 'Living a meaningful life', 'Avoiding all challenges', 'Experiencing constant pleasure'],
                    answer: 'Living a meaningful life',
                },
                {
                    question: 'What does the word "ephemeral" mean?',
                    options: ['Long-lasting and durable', 'Spiritual and profound', 'Lasting for a very short time', 'Causing great satisfaction'],
                    answer: 'Lasting for a very short time',
                },
            ],
        },
    ],
};