import React from 'react';
import type { Scenario } from './AIRolePlayView'; // Assuming the type is defined in the view

export const SCENARIOS: Scenario[] = [
  {
    id: 'order-coffee',
    title: 'Gọi Cà Phê',
    description: 'Luyện tập gọi đồ uống tại một quán cà phê.',
    goal: 'Gọi thành công một ly latte đá cỡ vừa, ít đường.',
    category: 'Đời sống hàng ngày',
    icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M13 10V3L4 14h7v7l9-11h-7z" }) // A coffee cup icon might be better, but this is a lightning bolt as a placeholder
    ),
    systemInstruction: `You are a friendly barista at a coffee shop. Your goal is to take the user's order. The user's task is to successfully order an iced, medium-sized latte with less sugar. Respond naturally to their requests. Start the conversation with "Hi, what can I get for you today?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`
  },
  {
    id: 'hotel-check-in',
    title: 'Check-in Khách sạn',
    description: 'Thực hành các thủ tục nhận phòng tại khách sạn.',
    goal: 'Hoàn thành check-in cho phòng đôi trong 2 đêm.',
    category: 'Du lịch',
    icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" })
    ),
    systemInstruction: `You are a hotel receptionist. The user wants to check in. Their task is to check in for a double room for 2 nights. You may need to ask for their name, reservation details, or a passport. Be helpful and polite. Start the conversation with "Good afternoon, welcome to our hotel. How can I help you?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`
  },
  {
    id: 'job-interview',
    title: 'Phỏng vấn Xin việc',
    description: 'Trải nghiệm một buổi phỏng vấn cho vị trí nhân viên.',
    goal: 'Trả lời 3 câu hỏi phỏng vấn về kinh nghiệm và điểm mạnh.',
    category: 'Công việc',
    icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6a4 4 0 11-8 0 4 4 0 018 0z" })
    ),
    systemInstruction: `You are a hiring manager interviewing the user for a junior position. Their task is to answer 3 questions about their experience and strengths. You must ask at least three questions, such as "Tell me about your previous experience," "What are your greatest strengths?", and "Why do you want to work here?". Evaluate their answers naturally. Start with "Thanks for coming in today. Let's start with a few questions. Could you tell me about yourself?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`
  },
  {
    id: 'asking-directions',
    title: 'Hỏi đường',
    description: 'Luyện tập hỏi và chỉ đường đến một địa điểm.',
    goal: 'Hỏi đường và hiểu chỉ dẫn để đến được bưu điện gần nhất.',
    category: 'Du lịch',
    icon: React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }),
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })
    ),
    systemInstruction: `You are a helpful local person on a street corner. The user is a tourist who is lost. Their goal is to get directions to the nearest post office. You need to provide simple, clear directions. For example: "Go straight for two blocks, then turn left. The post office will be on your right." Start by asking, "Excuse me, can I help you?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`,
  },
  {
    id: 'doctor-appointment',
    title: 'Gặp Bác sĩ',
    description: 'Thực hành mô tả các triệu chứng bệnh cho bác sĩ.',
    goal: 'Mô tả thành công triệu chứng đau đầu và ho để nhận được lời khuyên.',
    category: 'Đời sống hàng ngày',
    icon: React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 00.547-1.806z' }),
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 8V4m0 8v.01' })
    ),
    systemInstruction: `You are a kind and patient doctor. The user is your patient. Their goal is to describe their symptoms (headache and a cough). You should ask clarifying questions like "How long have you had these symptoms?" or "Do you have a fever?". Conclude by giving simple advice. Start with "Hello, what seems to be the problem today?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`,
  },
  {
    id: 'team-meeting',
    title: 'Họp Nhóm',
    description: 'Luyện tập đưa ra ý kiến và cập nhật tiến độ trong một cuộc họp công việc.',
    goal: 'Báo cáo rằng bạn đã hoàn thành nhiệm vụ và đưa ra một ý kiến về bước tiếp theo.',
    category: 'Công việc',
    icon: React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
    ),
    systemInstruction: `You are a project manager leading a team meeting. The user is a team member. Their goal is to report that their task is complete and suggest the next step. You should facilitate the conversation. Start with "Okay team, let's go around and get a status update. [User's Name], how are things on your end?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`,
  }
];