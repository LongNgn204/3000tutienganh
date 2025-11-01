import React from 'react';
import type { Scenario } from './AIRolePlayView'; // Assuming the type is defined in the view

export const SCENARIOS: Scenario[] = [
  {
    id: 'order-coffee',
    title: 'Gọi Cà Phê',
    description: 'Luyện tập gọi đồ uống tại một quán cà phê.',
    goal: 'Gọi thành công một ly latte đá cỡ vừa, ít đường.',
    category: 'Đời sống hàng ngày',
    icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", viewBox: "0 0 20 20", fill: "currentColor" },
      React.createElement('path', { d: "M3 1a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V1zM4 0a2 2 0 00-2 2v2a2 2 0 002 2h8a2 2 0 002-2V2a2 2 0 00-2-2H4z" }),
      React.createElement('path', { d: "M3 15a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM4 14a2 2 0 00-2 2v2a2 2 0 002 2h8a2 2 0 002-2v-2a2 2 0 00-2-2H4z" }),
      React.createElement('path', { d: "M13.82 5.252A1 1 0 0115 6.162V13a1 1 0 01-1 1h-1.18a1 1 0 01-1-.983l-.54-4.515a1 1 0 01.98-1.022l1.54-.18z" })
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
    description: 'Trải nghiệm một buổi phỏng vấn cho vị trí trợ lý marketing.',
    goal: 'Trả lời 3 câu hỏi phỏng vấn về kinh nghiệm và điểm mạnh.',
    category: 'Công việc',
    icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6a4 4 0 11-8 0 4 4 0 018 0z' }),
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M20.89 18.405l-2.147-2.147a1 1 0 01-.707-.293H6.964a1 1 0 01-.707.293l-2.147 2.147A1 1 0 013 17.657V9a1 1 0 011-1h16a1 1 0 011 1v8.657a1 1 0 01-1.11 1.048z' })
    ),
    systemInstruction: `You are a hiring manager interviewing the user for a Marketing Assistant position. Their task is to answer 3 questions about their experience and strengths. You must ask at least three questions, such as "Tell me about your previous experience," "What are your greatest strengths?", and "Why do you want to work here?". Evaluate their answers naturally. Start with "Thanks for coming in today. Let's start with a few questions. Could you tell me about yourself?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`
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
    icon: React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', className: 'h-6 w-6', fill: 'currentColor' },
      React.createElement('path', { fillRule: 'evenodd', d: 'M5 5a3 3 0 013-3h4a3 3 0 013 3v1h-1V5a2 2 0 00-2-2H8a2 2 0 00-2 2v1H5V5z' }),
      React.createElement('path', { fillRule: 'evenodd', d: 'M4 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm4 4a1 1 0 100-2H6a1 1 0 100 2h2zm2-2a1 1 0 11-2 0 1 1 0 012 0zm2 2a1 1 0 100-2h-2a1 1 0 100 2h2z', clipRule: 'evenodd' })
    ),
    systemInstruction: `You are a kind and patient doctor. The user is your patient. Their goal is to describe their symptoms (headache and a cough). You should ask clarifying questions like "How long have you had these symptoms?" or "Do you have a fever?". Conclude by giving simple advice. Start with "Hello, what seems to be the problem today?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`,
  },
  {
    id: 'return-item',
    title: 'Trả lại hàng',
    description: 'Thực hành trả lại một sản phẩm bị lỗi tại cửa hàng.',
    goal: 'Giải thích rằng chiếc tai nghe bạn mua bị lỗi và yêu cầu hoàn lại tiền.',
    category: 'Đời sống hàng ngày',
    icon: React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', className: 'h-6 w-6', fill: 'currentColor' },
      React.createElement('path', { d: 'M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' }),
    ),
    systemInstruction: `You are a customer service representative at an electronics store. The user wants to return an item. Their goal is to explain that the headphones they bought yesterday are faulty (one side isn't working) and ask for a full refund. You may need to ask for the receipt. Be professional. Start with "Hi, how can I help you?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`,
  },
  {
    id: 'dinner-reservation',
    title: 'Đặt bàn ăn tối',
    description: 'Luyện tập gọi điện thoại để đặt bàn tại nhà hàng.',
    goal: 'Đặt một bàn cho 2 người vào lúc 7:30 tối và hỏi về các món chay.',
    category: 'Đời sống hàng ngày',
    icon: React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', className: 'h-6 w-6', fill: 'currentColor' },
      React.createElement('path', { d: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' })
    ),
    systemInstruction: `You are a restaurant host answering the phone. The user wants to make a reservation. Their goal is to book a table for two at 7:30 PM tonight and inquire about vegetarian options. Be polite and confirm the details of the reservation. Start the conversation with "Good evening, The Grand Restaurant. How may I help you?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`,
  },
  {
    id: 'airport-security',
    title: 'An ninh sân bay',
    description: 'Thực hành trả lời các câu hỏi của nhân viên an ninh tại sân bay.',
    goal: 'Trả lời các câu hỏi về hành lý và mục đích chuyến đi một cách rõ ràng.',
    category: 'Du lịch',
    icon: React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', className: 'h-6 w-6', fill: 'currentColor' },
      React.createElement('path', { clipRule: 'evenodd', d: 'M10 2a.75.75 0 01.75.75v.25a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM5.002 4.25a.75.75 0 01.75-.75h8.496a.75.75 0 010 1.5H5.752a.75.75 0 01-.75-.75zM11.25 5.5a.75.75 0 00-1.5 0v3.834c.32-.066.653-.1 1-.1s.68.034 1 .1V5.5z', fillRule: 'evenodd' }),
      React.createElement('path', { d: 'M5.05 14.339A6.502 6.502 0 0110 6.5c1.84 0 3.535.75 4.765 1.983A.75.75 0 0015.69 7.42a8 8 0 10-11.38 0 .75.75 0 00.925 1.066 6.5 6.5 0 014.515 5.852zM12 12a2 2 0 10-4 0 2 2 0 004 0z' })
    ),
    systemInstruction: `You are an airport security officer. The user is a passenger passing through security. Their goal is to answer your questions clearly. You must ask questions like "Did you pack this bag yourself?", "Are you carrying any liquids?", and "What is the purpose of your trip?". Be direct and professional. Start with "Good morning. Please place your bags on the belt. Can I see your passport and boarding pass?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`,
  },
  {
    id: 'project-discussion',
    title: 'Thảo luận Dự án',
    description: 'Luyện tập thảo luận về một vấn đề công việc với đồng nghiệp.',
    goal: 'Giải thích một vấn đề bạn đang gặp phải và hỏi xin ý kiến của đồng nghiệp.',
    category: 'Công việc',
    icon: React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', className: 'h-6 w-6', fill: 'currentColor' },
      React.createElement('path', { d: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' })
    ),
    systemInstruction: `You are a senior colleague. The user is your teammate and has a question about a project. Their goal is to explain a problem they are having (e.g., "I'm having trouble with the data analysis for the report") and ask for your opinion or help. Be a supportive and helpful colleague. Start the conversation with "Hey, do you have a minute? I wanted to check in on the project.". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`,
  },
];
