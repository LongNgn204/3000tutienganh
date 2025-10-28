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
    ],
};