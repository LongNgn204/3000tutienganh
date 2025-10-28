import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { CEFRLevel, PlacementTestResult, TestAnalysis, LevelPerformance, IncorrectQuestionInfo } from '../types';

interface PlacementTestViewProps {
  onTestSubmit: (result: PlacementTestResult) => void;
}

const ALL_QUESTIONS_BANK = [
  // A1 Level - 25 questions
  { id: 'a1_q1', text: 'She ___ a doctor.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'is', level: 'A1' as CEFRLevel },
  { id: 'a1_q2', text: '___ are you from?', options: ['What', 'Where', 'Who', 'When'], correctAnswer: 'Where', level: 'A1' as CEFRLevel },
  { id: 'a1_q3', text: 'I have ___ apple.', options: ['a', 'an', 'the', 'some'], correctAnswer: 'an', level: 'A1' as CEFRLevel },
  { id: 'a1_q4', text: 'They ___ from Canada.', options: ['is', 'am', 'are', 'be'], correctAnswer: 'are', level: 'A1' as CEFRLevel },
  { id: 'a1_q5', text: 'My brother ___ like coffee.', options: ['not', 'don\'t', 'doesn\'t', 'no'], correctAnswer: 'doesn\'t', level: 'A1' as CEFRLevel },
  { id: 'a1_q6', text: 'What is ___ name?', options: ['you', 'your', 'yours', 'you\'re'], correctAnswer: 'your', level: 'A1' as CEFRLevel },
  { id: 'a1_q7', text: 'There ___ three books on the table.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'are', level: 'A1' as CEFRLevel },
  { id: 'a1_q8', text: 'He ___ English very well.', options: ['speak', 'speaks', 'speaking', 'is speak'], correctAnswer: 'speaks', level: 'A1' as CEFRLevel },
  { id: 'a1_q9', text: 'Can you ___ me?', options: ['help', 'helps', 'helping', 'to help'], correctAnswer: 'help', level: 'A1' as CEFRLevel },
  { id: 'a1_q10', text: 'What time ___ it?', options: ['is', 'are', 'do', 'does'], correctAnswer: 'is', level: 'A1' as CEFRLevel },
  { id: 'a1_q11', text: 'This is my sister. ___ name is Sarah.', options: ['His', 'Her', 'Its', 'Their'], correctAnswer: 'Her', level: 'A1' as CEFRLevel },
  { id: 'a1_q12', text: 'I ___ to the park every day.', options: ['go', 'goes', 'am going', 'went'], correctAnswer: 'go', level: 'A1' as CEFRLevel },
  { id: 'a1_q13', text: 'How ___ brothers do you have?', options: ['much', 'many', 'some', 'any'], correctAnswer: 'many', level: 'A1' as CEFRLevel },
  { id: 'a1_q14', text: 'The cat is ___ the table.', options: ['on', 'in', 'at', 'of'], correctAnswer: 'on', level: 'A1' as CEFRLevel },
  { id: 'a1_q15', text: '___ you like pizza?', options: ['Is', 'Are', 'Do', 'Does'], correctAnswer: 'Do', level: 'A1' as CEFRLevel },
  { id: 'a1_q16', text: 'I am from France. I am ___.', options: ['France', 'French', 'Francais', 'Franch'], correctAnswer: 'French', level: 'A1' as CEFRLevel },
  { id: 'a1_q17', text: 'We ___ to school by bus.', options: ['go', 'goes', 'are going', 'is going'], correctAnswer: 'go', level: 'A1' as CEFRLevel },
  { id: 'a1_q18', text: 'My favorite color ___ blue.', options: ['are', 'is', 'am', 'be'], correctAnswer: 'is', level: 'A1' as CEFRLevel },
  { id: 'a1_q19', text: 'I can ___ a bike.', options: ['ride', 'riding', 'rides', 'to ride'], correctAnswer: 'ride', level: 'A1' as CEFRLevel },
  { id: 'a1_q20', text: 'Where ___ your parents live?', options: ['is', 'are', 'do', 'does'], correctAnswer: 'do', level: 'A1' as CEFRLevel },
  { id: 'a1_q21', text: 'It is a ___ day today.', options: ['sun', 'sunny', 'sunshine', 'suns'], correctAnswer: 'sunny', level: 'A1' as CEFRLevel },
  { id: 'a1_q22', text: 'I would like ___ water, please.', options: ['some', 'any', 'a', 'many'], correctAnswer: 'some', level: 'A1' as CEFRLevel },
  { id: 'a1_q23', text: 'She has two ___.', options: ['child', 'childs', 'children', 'childrens'], correctAnswer: 'children', level: 'A1' as CEFRLevel },
  { id: 'a1_q24', text: 'He is from Italy. He speaks ___.', options: ['Italy', 'Italic', 'Italiano', 'Italian'], correctAnswer: 'Italian', level: 'A1' as CEFRLevel },
  { id: 'a1_q25', text: 'My birthday is ___ March.', options: ['on', 'at', 'in', 'of'], correctAnswer: 'in', level: 'A1' as CEFRLevel },

  // A2 Level - 25 questions
  { id: 'a2_q1', text: 'I saw ___ good film last night.', options: ['a', 'an', 'the', 'any'], correctAnswer: 'a', level: 'A2' as CEFRLevel },
  { id: 'a2_q2', text: 'He ___ to work by bus yesterday.', options: ['go', 'goes', 'went', 'gone'], correctAnswer: 'went', level: 'A2' as CEFRLevel },
  { id: 'a2_q3', text: 'She is ___ than her sister.', options: ['tall', 'taller', 'tallest', 'more tall'], correctAnswer: 'taller', level: 'A2' as CEFRLevel },
  { id: 'a2_q4', text: 'What ___ you do tomorrow?', options: ['are', 'will', 'did', 'do'], correctAnswer: 'will', level: 'A2' as CEFRLevel },
  { id: 'a2_q5', text: 'There isn\'t ___ milk in the fridge.', options: ['some', 'any', 'a', 'many'], correctAnswer: 'any', level: 'A2' as CEFRLevel },
  { id: 'a2_q6', text: 'I ___ my homework right now.', options: ['do', 'does', 'am doing', 'did'], correctAnswer: 'am doing', level: 'A2' as CEFRLevel },
  { id: 'a2_q7', text: 'She is the ___ beautiful girl in the class.', options: ['more', 'much', 'most', 'very'], correctAnswer: 'most', level: 'A2' as CEFRLevel },
  { id: 'a2_q8', text: 'I have to ___ my bed every morning.', options: ['do', 'make', 'clean', 'put'], correctAnswer: 'make', level: 'A2' as CEFRLevel },
  { id: 'a2_q9', text: 'We ___ to the beach if the weather is good.', options: ['will go', 'go', 'went', 'are going'], correctAnswer: 'will go', level: 'A2' as CEFRLevel },
  { id: 'a2_q10', text: 'Have you ever ___ to London?', options: ['be', 'been', 'was', 'being'], correctAnswer: 'been', level: 'A2' as CEFRLevel },
  { id: 'a2_q11', text: 'I often listen ___ music in my free time.', options: ['to', 'for', 'at', 'with'], correctAnswer: 'to', level: 'A2' as CEFRLevel },
  { id: 'a2_q12', text: 'She was born ___ 1995.', options: ['at', 'on', 'in', 'since'], correctAnswer: 'in', level: 'A2' as CEFRLevel },
  { id: 'a2_q13', text: 'We ___ for three hours last night.', options: ['study', 'studies', 'studied', 'were studying'], correctAnswer: 'studied', level: 'A2' as CEFRLevel },
  { id: 'a2_q14', text: 'You ___ eat so much junk food. It\'s unhealthy.', options: ['must', 'shouldn\'t', 'can\'t', 'have to'], correctAnswer: 'shouldn\'t', level: 'A2' as CEFRLevel },
  { id: 'a2_q15', text: 'How ___ does this book cost?', options: ['many', 'long', 'much', 'often'], correctAnswer: 'much', level: 'A2' as CEFRLevel },
  { id: 'a2_q16', text: 'I\'m going to the cinema ___ Saturday.', options: ['in', 'at', 'on', 'with'], correctAnswer: 'on', level: 'A2' as CEFRLevel },
  { id: 'a2_q17', text: 'He is not as ___ as his brother.', options: ['strong', 'stronger', 'strongest', 'more strong'], correctAnswer: 'strong', level: 'A2' as CEFRLevel },
  { id: 'a2_q18', text: 'While I ___ to the radio, the phone rang.', options: ['listened', 'am listening', 'was listening', 'listen'], correctAnswer: 'was listening', level: 'A2' as CEFRLevel },
  { id: 'a2_q19', text: 'She is afraid ___ spiders.', options: ['from', 'of', 'about', 'with'], correctAnswer: 'of', level: 'A2' as CEFRLevel },
  { id: 'a2_q20', text: 'If I have time, I ___ you.', options: ['call', 'called', 'will call', 'am calling'], correctAnswer: 'will call', level: 'A2' as CEFRLevel },
  { id: 'a2_q21', text: 'This is the ___ book I have ever read.', options: ['good', 'better', 'best', 'well'], correctAnswer: 'best', level: 'A2' as CEFRLevel },
  { id: 'a2_q22', text: 'He ___ English for two years.', options: ['learns', 'is learning', 'has learned', 'learned'], correctAnswer: 'has learned', level: 'A2' as CEFRLevel },
  { id: 'a2_q23', text: 'I couldn\'t find my keys ___.', options: ['nowhere', 'anywhere', 'somewhere', 'everywhere'], correctAnswer: 'anywhere', level: 'A2' as CEFRLevel },
  { id: 'a2_q24', text: 'Could you tell me where ___?', options: ['the station is', 'is the station', 'the station', 'is station'], correctAnswer: 'the station is', level: 'A2' as CEFRLevel },
  { id: 'a2_q25', text: 'He is a ___ driver. He drives very ___.', options: ['careful / carefully', 'carefully / careful', 'care / careful', 'careful / care'], correctAnswer: 'careful / carefully', level: 'A2' as CEFRLevel },

  // B1 Level - 25 questions
  { id: 'b1_q1', text: "I haven't seen him ___ last year.", options: ['since', 'for', 'in', 'at'], correctAnswer: 'since', level: 'B1' as CEFRLevel },
  { id: 'b1_q2', text: 'If you ___ harder, you would pass the exam.', options: ['study', 'studied', 'have studied', 'were studying'], correctAnswer: 'studied', level: 'B1' as CEFRLevel },
  { id: 'b1_q3', text: 'This book is not as interesting ___ the last one.', options: ['as', 'than', 'so', 'from'], correctAnswer: 'as', level: 'B1' as CEFRLevel },
  { id: 'b1_q4', text: 'She suggested ___ to the cinema.', options: ['to go', 'going', 'go', 'we to go'], correctAnswer: 'going', level: 'B1' as CEFRLevel },
  { id: 'b1_q5', text: 'The man ___ is talking to Sarah is my boss.', options: ['which', 'who', 'what', 'whose'], correctAnswer: 'who', level: 'B1' as CEFRLevel },
  { id: 'b1_q6', text: 'I\'ve been living here ___ ten years.', options: ['since', 'for', 'from', 'during'], correctAnswer: 'for', level: 'B1' as CEFRLevel },
  { id: 'b1_q7', text: 'You ___ be quiet in the library.', options: ['must', 'can', 'may', 'should have'], correctAnswer: 'must', level: 'B1' as CEFRLevel },
  { id: 'b1_q8', text: 'My phone ___ while I was cooking.', options: ['ring', 'rung', 'was ringing', 'rang'], correctAnswer: 'rang', level: 'B1' as CEFRLevel },
  { id: 'b1_q9', text: 'This is the first time I ___ sushi.', options: ['eat', 'am eating', 'have eaten', 'ate'], correctAnswer: 'have eaten', level: 'B1' as CEFRLevel },
  { id: 'b1_q10', text: 'I\'m looking forward ___ you again.', options: ['to see', 'to seeing', 'seeing', 'see'], correctAnswer: 'to seeing', level: 'B1' as CEFRLevel },
  { id: 'b1_q11', text: 'He enjoys ___ tennis with his friends.', options: ['play', 'to play', 'playing', 'plays'], correctAnswer: 'playing', level: 'B1' as CEFRLevel },
  { id: 'b1_q12', text: 'The hotel ___ we stayed was very nice.', options: ['which', 'that', 'where', 'who'], correctAnswer: 'where', level: 'B1' as CEFRLevel },
  { id: 'b1_q13', text: 'If I ___ a lot of money, I would travel the world.', options: ['have', 'had', 'will have', 'am having'], correctAnswer: 'had', level: 'B1' as CEFRLevel },
  { id: 'b1_q14', text: 'This house ___ in 1950.', options: ['built', 'was built', 'has built', 'was building'], correctAnswer: 'was built', level: 'B1' as CEFRLevel },
  { id: 'b1_q15', text: 'She asked me ___ I was from.', options: ['where', 'that', 'what', 'if'], correctAnswer: 'where', level: 'B1' as CEFRLevel },
  { id: 'b1_q16', text: 'I\'m tired. I think I ___ go to bed.', options: ['am', 'will', 'have', 'would'], correctAnswer: 'will', level: 'B1' as CEFRLevel },
  { id: 'b1_q17', text: 'You should give ___ smoking.', options: ['up', 'on', 'off', 'in'], correctAnswer: 'up', level: 'B1' as CEFRLevel },
  { id: 'b1_q18', text: 'He is interested ___ learning new languages.', options: ['on', 'at', 'in', 'for'], correctAnswer: 'in', level: 'B1' as CEFRLevel },
  { id: 'b1_q19', text: 'Neither my brother ___ my sister can come.', options: ['or', 'and', 'nor', 'but'], correctAnswer: 'nor', level: 'B1' as CEFRLevel },
  { id: 'b1_q20', text: 'We have ___ time, we need to hurry.', options: ['many', 'a few', 'little', 'a little'], correctAnswer: 'little', level: 'B1' as CEFRLevel },
  { id: 'b1_q21', text: 'This cake was made ___ my mother.', options: ['of', 'from', 'with', 'by'], correctAnswer: 'by', level: 'B1' as CEFRLevel },
  { id: 'b1_q22', text: 'I prefer tea ___ coffee.', options: ['than', 'over', 'to', 'from'], correctAnswer: 'to', level: 'B1' as CEFRLevel },
  { id: 'b1_q23', text: 'By this time tomorrow, we ___ on the beach.', options: ['will lie', 'will be lying', 'lie', 'are lying'], correctAnswer: 'will be lying', level: 'B1' as CEFRLevel },
  { id: 'b1_q24', text: 'He forgot ___ the door when he left.', options: ['locking', 'to lock', 'locked', 'lock'], correctAnswer: 'to lock', level: 'B1' as CEFRLevel },
  { id: 'b1_q25', text: 'The book, ___ is on the table, is mine.', options: ['that', 'which', 'who', 'whose'], correctAnswer: 'which', level: 'B1' as CEFRLevel },

  // B2 Level - 25 questions
  { id: 'b2_q1', text: 'By the time the police arrived, the thief ___.', options: ['has escaped', 'had escaped', 'escaped', 'was escaping'], correctAnswer: 'had escaped', level: 'B2' as CEFRLevel },
  { id: 'b2_q2', text: 'I wish I ___ that. It was a mistake.', options: ["didn't say", "hadn't said", "wouldn't say", "haven't said"], correctAnswer: "hadn't said", level: 'B2' as CEFRLevel },
  { id: 'b2_q3', text: 'The report ___ be finished by tomorrow.', options: ['must', 'can', 'should', 'would'], correctAnswer: 'must', level: 'B2' as CEFRLevel },
  { id: 'b2_q4', text: 'He is used to ___ in a noisy environment.', options: ['work', 'working', 'have worked', 'be working'], correctAnswer: 'working', level: 'B2' as CEFRLevel },
  { id: 'b2_q5', text: 'It is recommended that all passengers ___ their seatbelts.', options: ['fasten', 'to fasten', 'fastens', 'fastened'], correctAnswer: 'fasten', level: 'B2' as CEFRLevel },
  { id: 'b2_q6', text: 'I would rather you ___ so loudly.', options: ['don\'t speak', 'not to speak', 'didn\'t speak', 'not speaking'], correctAnswer: 'didn\'t speak', level: 'B2' as CEFRLevel },
  { id: 'b2_q7', text: 'This is the building ___ was designed by a famous architect.', options: ['who', 'which', 'whose', 'where'], correctAnswer: 'which', level: 'B2' as CEFRLevel },
  { id: 'b2_q8', text: 'She has been working on the project, ___?', options: ['has she', 'hasn\'t she', 'does she', 'doesn\'t she'], correctAnswer: 'hasn\'t she', level: 'B2' as CEFRLevel },
  { id: 'b2_q9', text: 'Despite ___ tired, he continued working.', options: ['he was', 'of being', 'being', 'was'], correctAnswer: 'being', level: 'B2' as CEFRLevel },
  { id: 'b2_q10', text: 'The problem was ___ difficult for me to solve.', options: ['so', 'such', 'very', 'too'], correctAnswer: 'too', level: 'B2' as CEFRLevel },
  { id: 'b2_q11', text: 'I\'ll call you as soon as I ___ at the airport.', options: ['arrive', 'will arrive', 'arrived', 'am arriving'], correctAnswer: 'arrive', level: 'B2' as CEFRLevel },
  { id: 'b2_q12', text: 'He denied ___ the money.', options: ['to steal', 'stealing', 'stole', 'to have stolen'], correctAnswer: 'stealing', level: 'B2' as CEFRLevel },
  { id: 'b2_q13', text: 'The movie, ___ I saw last week, was fantastic.', options: ['that', 'which', 'what', 'who'], correctAnswer: 'which', level: 'B2' as CEFRLevel },
  { id: 'b2_q14', text: 'It\'s no use ___ about the past.', options: ['to worry', 'worrying', 'worried', 'worry'], correctAnswer: 'worrying', level: 'B2' as CEFRLevel },
  { id: 'b2_q15', text: 'She got her car ___ last week.', options: ['repair', 'repaired', 'to repair', 'repairing'], correctAnswer: 'repaired', level: 'B2' as CEFRLevel },
  { id: 'b2_q16', text: 'I regret ___ you that your application has been rejected.', options: ['telling', 'to tell', 'tell', 'told'], correctAnswer: 'to tell', level: 'B2' as CEFRLevel },
  { id: 'b2_q17', text: 'He is said ___ a great musician in his youth.', options: ['to be', 'being', 'to have been', 'was'], correctAnswer: 'to have been', level: 'B2' as CEFRLevel },
  { id: 'b2_q18', text: 'We had better ___ before it gets dark.', options: ['leave', 'to leave', 'leaving', 'left'], correctAnswer: 'leave', level: 'B2' as CEFRLevel },
  { id: 'b2_q19', text: 'Hardly ___ the house when it started to rain.', options: ['I had left', 'had I left', 'I left', 'did I leave'], correctAnswer: 'had I left', level: 'B2' as CEFRLevel },
  { id: 'b2_q20', text: 'She takes ___ her mother; they are very similar.', options: ['after', 'on', 'up', 'in'], correctAnswer: 'after', level: 'B2' as CEFRLevel },
  { id: 'b2_q21', text: 'I am not used to ___ so early.', options: ['get up', 'getting up', 'be getting up', 'have gotten up'], correctAnswer: 'getting up', level: 'B2' as CEFRLevel },
  { id: 'b2_q22', text: 'No sooner ___ he arrived than she started crying.', options: ['did', 'has', 'had', 'was'], correctAnswer: 'had', level: 'B2' as CEFRLevel },
  { id: 'b2_q23', text: 'He insisted ___ paying for the meal.', options: ['on', 'in', 'at', 'for'], correctAnswer: 'on', level: 'B2' as CEFRLevel },
  { id: 'b2_q24', text: 'The equipment needs ___ before the next experiment.', options: ['to check', 'check', 'checking', 'be checked'], correctAnswer: 'checking', level: 'B2' as CEFRLevel },
  { id: 'b2_q25', text: 'She went to the party in ___ of her headache.', options: ['spite', 'despite', 'although', 'even though'], correctAnswer: 'spite', level: 'B2' as CEFRLevel },

  // C1 Level - 25 questions
  { id: 'c1_q1', text: '___ the bad weather, the match went ahead.', options: ['Despite', 'Although', 'However', 'In spite'], correctAnswer: 'Despite', level: 'C1' as CEFRLevel },
  { id: 'c1_q2', text: 'Not only ___ the exam, but he also got the highest score.', options: ['he passed', 'did he pass', 'he did pass', 'he has passed'], correctAnswer: 'did he pass', level: 'C1' as CEFRLevel },
  { id: 'c1_q3', text: 'It was a difficult decision, but she finally ___ her mind.', options: ['put up', 'made up', 'came up', 'took up'], correctAnswer: 'made up', level: 'C1' as CEFRLevel },
  { id: 'c1_q4', text: '___ I known you were coming, I would have baked a cake.', options: ['If', 'Should', 'Had', 'Would'], correctAnswer: 'Had', level: 'C1' as CEFRLevel },
  { id: 'c1_q5', text: 'The project, ___ was expected to take two months, is now behind schedule.', options: ['that', 'which', 'it', 'what'], correctAnswer: 'which', level: 'C1' as CEFRLevel },
  { id: 'c1_q6', text: 'He is believed ___ the country last week.', options: ['to leave', 'to be leaving', 'to have left', 'left'], correctAnswer: 'to have left', level: 'C1' as CEFRLevel },
  { id: 'c1_q7', text: 'The new regulations will ___ in January.', options: ['come into force', 'take into effect', 'get into power', 'be in action'], correctAnswer: 'come into force', level: 'C1' as CEFRLevel },
  { id: 'c1_q8', text: 'Her performance was absolutely ___.', options: ['stunning', 'well', 'goodly', 'nice'], correctAnswer: 'stunning', level: 'C1' as CEFRLevel },
  { id: 'c1_q9', text: 'Under no circumstances ___ you leave this room.', options: ['should', 'you should', 'can', 'you can'], correctAnswer: 'should', level: 'C1' as CEFRLevel },
  { id: 'c1_q10', text: 'It\'s high time you ___ taking responsibility for your actions.', options: ['start', 'started', 'to start', 'have started'], correctAnswer: 'started', level: 'C1' as CEFRLevel },
  { id: 'c1_q11', text: 'The company is on the ___ of collapse.', options: ['edge', 'verge', 'side', 'point'], correctAnswer: 'verge', level: 'C1' as CEFRLevel },
  { id: 'c1_q12', text: 'I am not accustomed ___ treated like this.', options: ['to be', 'to being', 'with being', 'for being'], correctAnswer: 'to being', level: 'C1' as CEFRLevel },
  { id: 'c1_q13', text: 'The report highlights the ___ need for investment in education.', options: ['dire', 'deep', 'heavy', 'strong'], correctAnswer: 'dire', level: 'C1' as CEFRLevel },
  { id: 'c1_q14', text: 'All things ___, I think we made the right decision.', options: ['considered', 'considering', 'consider', 'considerable'], correctAnswer: 'considered', level: 'C1' as CEFRLevel },
  { id: 'c1_q15', text: 'He ___ his success to hard work and a little bit of luck.', options: ['describes', 'assigns', 'attributes', 'connects'], correctAnswer: 'attributes', level: 'C1' as CEFRLevel },
  { id: 'c1_q16', text: 'She has a great ___ for detail.', options: ['eye', 'ear', 'nose', 'hand'], correctAnswer: 'eye', level: 'C1' as CEFRLevel },
  { id: 'c1_q17', text: 'The government\'s proposal met with a ___ of criticism.', options: ['storm', 'flood', 'wave', 'river'], correctAnswer: 'storm', level: 'C1' as CEFRLevel },
  { id: 'c1_q18', text: 'I was on the ___ of my seat throughout the movie.', options: ['side', 'edge', 'front', 'back'], correctAnswer: 'edge', level: 'C1' as CEFRLevel },
  { id: 'c1_q19', text: 'Were you ___ of the risks involved?', options: ['aware', 'alert', 'conscious', 'knowing'], correctAnswer: 'aware', level: 'C1' as CEFRLevel },
  { id: 'c1_q20', text: 'It stands to ___ that he will get the promotion.', options: ['reason', 'logic', 'sense', 'fact'], correctAnswer: 'reason', level: 'C1' as CEFRLevel },
  { id: 'c1_q21', text: 'I wish I ___ more time to travel.', options: ['have', 'had', 'would have', 'will have'], correctAnswer: 'had', level: 'C1' as CEFRLevel },
  { id: 'c1_q22', text: '___ being an excellent scientist, she is also a talented musician.', options: ['Apart from', 'Except for', 'In addition', 'Besides that'], correctAnswer: 'Apart from', level: 'C1' as CEFRLevel },
  { id: 'c1_q23', text: 'He couldn\'t help ___ when he heard the joke.', options: ['laugh', 'laughing', 'to laugh', 'but laughing'], correctAnswer: 'laughing', level: 'C1' as CEFRLevel },
  { id: 'c1_q24', text: 'The more you practice, ___ you will become.', options: ['the more confident', 'more confident', 'the most confident', 'confident'], correctAnswer: 'the more confident', level: 'C1' as CEFRLevel },
  { id: 'c1_q25', text: 'What ___ me most is their lack of responsibility.', options: ['annoys', 'is annoying', 'are annoying', 'annoy'], correctAnswer: 'annoys', level: 'C1' as CEFRLevel },
];


const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    level: CEFRLevel;
}

const PlacementTestView: React.FC<PlacementTestViewProps> = ({ onTestSubmit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const questionsPerLevel = 5;

    const sampledQuestions = levels.flatMap(level => {
        const questionsForLevel = ALL_QUESTIONS_BANK.filter(q => q.level === level);
        return shuffleArray(questionsForLevel).slice(0, questionsPerLevel);
    });

    setQuestions(shuffleArray(sampledQuestions));
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const isAllAnswered = questions.length > 0 && answeredCount === questions.length;

  const handleSubmit = async () => {
    if (!isAllAnswered) {
        alert("Vui lòng trả lời tất cả các câu hỏi.");
        return;
    }
    setIsLoading(true);
    setError(null);

    let score = 0;
    const incorrectQuestions: IncorrectQuestionInfo[] = [];
    const performanceByLevel: Partial<Record<CEFRLevel, { correct: number, total: number }>> = {};

    for (const q of questions) {
        const level = q.level;
        if (!performanceByLevel[level]) {
            performanceByLevel[level] = { correct: 0, total: 0 };
        }
        performanceByLevel[level]!.total++;

        if (answers[q.id] === q.correctAnswer) {
            score++;
            performanceByLevel[level]!.correct++;
        } else {
            incorrectQuestions.push({
                questionId: q.id,
                questionText: q.text,
                userAnswer: answers[q.id] ?? 'Chưa trả lời',
                correctAnswer: q.correctAnswer,
                level: level,
            });
        }
    }
    
    const finalPerformance: Partial<Record<CEFRLevel, LevelPerformance>> = {};
    let performanceSummary = '';
    for (const key in performanceByLevel) {
        const level = key as CEFRLevel;
        const data = performanceByLevel[level]!;
        finalPerformance[level] = {
            ...data,
            percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        };
        performanceSummary += `Level ${level}: ${finalPerformance[level]!.correct}/${finalPerformance[level]!.total} correct (${finalPerformance[level]!.percentage}%).\n`;
    }

    const analysis: TestAnalysis = {
        score,
        totalQuestions: questions.length,
        incorrectQuestions,
        performanceByLevel: finalPerformance,
    };
    
    const prompt = `As an expert English language assessor, determine the user's CEFR level (A1, A2, B1, B2, C1, or C2) based on their performance in a placement test. The test included questions from various levels. Here is a summary of their performance:

${performanceSummary}

Based on this performance distribution, what is their most likely CEFR level?
Return ONLY the level designation (e.g., "B1"), and nothing else.`;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        
        const level = response.text.trim().toUpperCase() as CEFRLevel;
        const validLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        
        const finalResult: PlacementTestResult = {
            level: validLevels.includes(level) ? level : 'A2', 
            analysis: analysis,
        };
        onTestSubmit(finalResult);

    } catch (err) {
        console.error("Gemini API Error:", err);
        setError("AI đánh giá đã gặp lỗi. Vui lòng thử lại sau. Sử dụng kết quả phân tích tạm thời.");
        
        let determinedLevel: CEFRLevel = 'A1';
        const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
        for (const lvl of levels) {
            const perf = finalPerformance[lvl];
            if (perf && perf.percentage >= 50) {
                determinedLevel = lvl;
            } else {
                break;
            }
        }

        const fallbackResult: PlacementTestResult = {
            level: determinedLevel, 
            analysis: analysis,
        };
        onTestSubmit(fallbackResult);
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
                 <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-slate-800">AI đang đánh giá bài làm...</h2>
                <p className="text-slate-500 mt-2">Vui lòng chờ trong giây lát.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800">Bài Kiểm Tra Trình Độ</h1>
                <p className="text-slate-600 mt-2 mb-8">Hãy chọn đáp án đúng nhất để AI xác định trình độ của bạn ({questions.length} câu hỏi).</p>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8 sticky top-24 z-10">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">{error}</div>}

            <div className="space-y-8">
                {questions.map((q, index) => (
                    <div key={q.id} className="border-t pt-6">
                        <p className="font-semibold text-lg text-slate-700">
                            <span className="text-blue-600 font-bold mr-2">Câu {index + 1}:</span> 
                            {q.text}
                        </p>
                        <div className="mt-4 space-y-3">
                            {q.options.map(option => (
                                <label key={option} className="flex items-center p-3 rounded-lg border-2 border-slate-200 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 cursor-pointer transition-all duration-200">
                                    <input 
                                        type="radio"
                                        name={q.id}
                                        value={option}
                                        checked={answers[q.id] === option}
                                        onChange={() => handleAnswerChange(q.id, option)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="ml-3 text-slate-800 font-medium">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <button
                    onClick={handleSubmit}
                    disabled={!isAllAnswered || isLoading}
                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Nộp bài và Xem kết quả
                </button>
            </div>
        </div>
    </div>
  );
};

    export default PlacementTestView;