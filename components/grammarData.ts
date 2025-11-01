interface GrammarTopic {
    title: string;
    content: string;
}

interface GrammarLevel {
    level: string;
    name: string;
    topics: GrammarTopic[];
}

export const GRAMMAR_LEVELS: GrammarLevel[] = [
    {
        level: 'A1',
        name: 'A1 - Mới bắt đầu',
        topics: [
            { 
                title: 'Thì Hiện tại đơn (Present Simple)', 
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li>Diễn tả một thói quen, hành động lặp đi lặp lại ở hiện tại (e.g., I get up at 7 AM).</li>
                        <li>Diễn tả một sự thật hiển nhiên, một chân lý (e.g., The Earth goes around the Sun).</li>
                        <li>Diễn tả lịch trình, thời gian biểu (e.g., The train leaves at 8 PM).</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <ul>
                        <li><strong>Khẳng định:</strong> <code>S + V(s/es) + O</code></li>
                        <li><strong>Phủ định:</strong> <code>S + do/does + not + V(nguyên mẫu) + O</code></li>
                        <li><strong>Nghi vấn:</strong> <code>Do/Does + S + V(nguyên mẫu) + O?</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>She works in a hospital.</code><br><em>(Cô ấy làm việc trong một bệnh viện.)</em></p>
                    <p><code>The sun rises in the East.</code><br><em>(Mặt trời mọc ở hướng Đông.)</em></p>
                    <p><code>They don't like coffee.</code><br><em>(Họ không thích cà phê.)</em></p>
                ` 
            },
            { 
                title: 'Động từ "to be" (am/is/are)', 
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Được dùng để giới thiệu, mô tả tính chất, trạng thái, vị trí của người hoặc vật.</p>
                    <h4><strong>Chia động từ:</strong></h4>
                    <ul>
                        <li><code>I</code> + <strong>am</strong></li>
                        <li><code>He / She / It / Danh từ số ít</code> + <strong>is</strong></li>
                        <li><code>You / We / They / Danh từ số nhiều</code> + <strong>are</strong></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>I am a student.</code><br><em>(Tôi là một học sinh.)</em></p>
                    <p><code>The book is on the table.</code><br><em>(Quyển sách ở trên bàn.)</em></p>
                    <p><code>Are you tired?</code><br><em>(Bạn có mệt không?)</em></p>
                `
            },
            { 
                title: 'Mạo từ "a/an/the"', 
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li><strong>a/an:</strong> Đứng trước danh từ đếm được số ít, khi người hoặc vật được nhắc đến lần đầu tiên hoặc một cách chung chung. Dùng 'an' trước nguyên âm (u, e, o, a, i).</li>
                        <li><strong>the:</strong> Dùng khi người hoặc vật đã được xác định hoặc đã được nhắc đến trước đó.</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>I see a dog in the garden. The dog is black.</code><br><em>(Tôi thấy một con chó trong vườn. Con chó đó màu đen.)</em></p>
                    <p><code>She wants to eat an apple.</code><br><em>(Cô ấy muốn ăn một quả táo.)</em></p>
                `
            },
            {
                title: 'Số nhiều của Danh từ',
                content: `
                     <h4><strong>Quy tắc chung:</strong></h4>
                    <p>Thêm "s" vào cuối danh từ số ít.</p>
                    <ul>
                        <li><code>book</code> → <code>books</code></li>
                        <li><code>cat</code> → <code>cats</code></li>
                    </ul>
                     <h4><strong>Trường hợp đặc biệt:</strong></h4>
                    <ul>
                        <li>Kết thúc bằng s, sh, ch, x, z → thêm "es" (e.g., <code>box</code> → <code>boxes</code>).</li>
                        <li>Kết thúc bằng phụ âm + y → đổi y thành i + es (e.g., <code>baby</code> → <code>babies</code>).</li>
                        <li>Bất quy tắc (e.g., <code>man</code> → <code>men</code>, <code>child</code> → <code>children</code>).</li>
                    </ul>
                `
            }
        ],
    },
    {
        level: 'A2',
        name: 'A2 - Sơ cấp',
        topics: [
            { 
                title: 'Thì Quá khứ đơn (Past Simple)', 
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li>Diễn tả một hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ, thường có thời gian xác định (yesterday, last week, in 2010).</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <ul>
                        <li><strong>Khẳng định:</strong> <code>S + V2/V-ed + O</code></li>
                        <li><strong>Phủ định:</strong> <code>S + did + not + V(nguyên mẫu) + O</code></li>
                        <li><strong>Nghi vấn:</strong> <code>Did + S + V(nguyên mẫu) + O?</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>We watched a movie last night.</code><br><em>(Tối qua chúng tôi đã xem một bộ phim.)</em></p>
                    <p><code>He didn't go to school yesterday.</code><br><em>(Hôm qua anh ấy không đi học.)</em></p>
                ` 
            },
            { 
                title: 'So sánh hơn & So sánh nhất (Comparatives & Superlatives)', 
                content: `
                    <h4><strong>So sánh hơn:</strong></h4>
                    <p>Dùng để so sánh giữa hai người/vật.</p>
                    <ul>
                        <li><strong>Tính từ ngắn:</strong> <code>adj-er + than</code> (e.g., <code>taller than</code>)</li>
                        <li><strong>Tính từ dài:</strong> <code>more + adj + than</code> (e.g., <code>more beautiful than</code>)</li>
                    </ul>
                    <h4><strong>So sánh nhất:</strong></h4>
                    <p>Dùng để so sánh một người/vật với tất cả những người/vật còn lại trong nhóm.</p>
                    <ul>
                        <li><strong>Tính từ ngắn:</strong> <code>the + adj-est</code> (e.g., <code>the tallest</code>)</li>
                        <li><strong>Tính từ dài:</strong> <code>the most + adj</code> (e.g., <code>the most beautiful</code>)</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>An elephant is bigger than a mouse.</code><br><em>(Con voi to hơn con chuột.)</em></p>
                    <p><code>This is the most expensive car in the world.</code><br><em>(Đây là chiếc xe đắt nhất thế giới.)</em></p>
                `
            },
            {
                title: 'Thì Hiện tại tiếp diễn (Present Continuous)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li>Diễn tả hành động đang xảy ra tại thời điểm nói.</li>
                        <li>Diễn tả một kế hoạch chắc chắn trong tương lai gần.</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>S + am/is/are + V-ing + O</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>Please be quiet. The baby is sleeping.</code><br><em>(Xin hãy yên lặng. Em bé đang ngủ.)</em></p>
                    <p><code>I am meeting my friends tomorrow.</code><br><em>(Tôi sẽ gặp bạn bè vào ngày mai.)</em></p>
                `
            }
        ],
    },
    {
        level: 'B1',
        name: 'B1 - Trung cấp',
        topics: [
            { 
                title: 'Thì Hiện tại hoàn thành (Present Perfect)', 
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li>Diễn tả hành động bắt đầu trong quá khứ, kéo dài đến hiện tại (thường đi với <em>for, since</em>).</li>
                        <li>Diễn tả hành động đã xảy ra nhưng không rõ thời gian, kết quả còn ảnh hưởng đến hiện tại.</li>
                        <li>Diễn tả trải nghiệm, kinh nghiệm (thường đi với <em>ever, never, before</em>).</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <ul>
                        <li><strong>Khẳng định:</strong> <code>S + have/has + V3/V-ed + O</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>I have lived here for five years.</code><br><em>(Tôi đã sống ở đây được năm năm rồi.)</em></p>
                    <p><code>She has broken her leg.</code><br><em>(Cô ấy đã bị gãy chân - và giờ chân vẫn còn đau.)</em></p>
                    <p><code>Have you ever been to Japan?</code><br><em>(Bạn đã bao giờ đến Nhật Bản chưa?)</em></p>
                `
            },
            {
                title: 'Câu điều kiện loại 1 (First Conditional)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Diễn tả một điều kiện có thể xảy ra ở hiện tại hoặc tương lai.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>If + S + V(hiện tại đơn), S + will + V(nguyên mẫu)</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>If it rains, we will stay at home.</code><br><em>(Nếu trời mưa, chúng tôi sẽ ở nhà.)</em></p>
                    <p><code>If you study hard, you will pass the exam.</code><br><em>(Nếu bạn học chăm chỉ, bạn sẽ vượt qua kỳ thi.)</em></p>
                `
            },
            {
                title: 'Động từ khuyết thiếu (Modal Verbs)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để diễn tả khả năng, sự cho phép, nghĩa vụ, lời khuyên...</p>
                    <ul>
                        <li><strong>Can/Could:</strong> Khả năng, sự cho phép.</li>
                        <li><strong>Must/Have to:</strong> Sự bắt buộc, nghĩa vụ.</li>
                        <li><strong>Should:</strong> Lời khuyên.</li>
                        <li><strong>May/Might:</strong> Có thể xảy ra (nhưng không chắc chắn).</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>You should see a doctor.</code><br><em>(Bạn nên đi gặp bác sĩ.)</em></p>
                    <p><code>I must finish this report by 5 PM.</code><br><em>(Tôi phải hoàn thành báo cáo này trước 5 giờ chiều.)</em></p>
                `
            },
        ],
    },
    {
        level: 'B2',
        name: 'B2 - Trung cao cấp',
        topics: [
            {
                title: 'Câu điều kiện loại 2 & 3 (Second & Third Conditionals)',
                content: `
                    <h4><strong>Câu điều kiện loại 2:</strong></h4>
                    <ul>
                        <li><strong>Công dụng:</strong> Diễn tả một điều kiện không có thật ở hiện tại.</li>
                        <li><strong>Cấu trúc:</strong> <code>If + S + V2/V-ed, S + would/could + V(nguyên mẫu)</code></li>
                        <li><strong>Ví dụ:</strong> <code>If I were you, I would accept the offer.</code><br><em>(Nếu tôi là bạn, tôi sẽ chấp nhận lời đề nghị đó.)</em></li>
                    </ul>
                    <h4><strong>Câu điều kiện loại 3:</strong></h4>
                    <ul>
                        <li><strong>Công dụng:</strong> Diễn tả một điều kiện không có thật trong quá khứ, dẫn đến một kết quả trái với quá khứ.</li>
                        <li><strong>Cấu trúc:</strong> <code>If + S + had + V3/V-ed, S + would/could + have + V3/V-ed</code></li>
                        <li><strong>Ví dụ:</strong> <code>If she had studied harder, she would have passed the exam.</code><br><em>(Nếu cô ấy đã học chăm chỉ hơn, cô ấy đã vượt qua kỳ thi rồi.)</em></li>
                    </ul>
                `
            },
            {
                title: 'Câu bị động (Passive Voice)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Được sử dụng khi muốn nhấn mạnh đối tượng chịu tác động của hành động, hoặc khi không biết/không muốn đề cập đến người thực hiện hành động.</p>
                    <h4><strong>Cấu trúc chung:</strong></h4>
                    <p><code>S + be + V3/V-ed + (by O)</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>The Mona Lisa was painted by Leonardo da Vinci.</code><br><em>(Bức Mona Lisa được vẽ bởi Leonardo da Vinci.)</em></p>
                    <p><code>My car is being repaired.</code><br><em>(Xe của tôi đang được sửa chữa.)</em></p>
                `
            },
            {
                title: 'Thì Quá khứ hoàn thành (Past Perfect)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Diễn tả một hành động đã xảy ra và hoàn thành trước một hành động khác trong quá khứ.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>S + had + V3/V-ed</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>By the time I arrived, the train had already left.</code><br><em>(Vào lúc tôi đến, con tàu đã rời đi rồi.)</em></p>
                `
            },
        ],
    },
    {
        level: 'C1',
        name: 'C1 - Cao cấp',
        topics: [
            {
                title: 'Câu điều kiện hỗn hợp (Mixed Conditionals)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Kết hợp các loại câu điều kiện để diễn tả những tình huống phức tạp hơn.</p>
                    <h4><strong>Loại phổ biến nhất (Loại 3 + Loại 2):</strong></h4>
                    <ul>
                        <li><strong>Công dụng:</strong> Diễn tả một điều kiện trái với quá khứ, dẫn đến một kết quả trái với hiện tại.</li>
                        <li><strong>Cấu trúc:</strong> <code>If + S + had + V3/V-ed, S + would + V(nguyên mẫu)</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>If I had taken that job, I would be rich now.</code><br><em>(Nếu tôi đã nhận công việc đó, thì bây giờ tôi đã giàu rồi.)</em></p>
                `
            },
            {
                title: 'Đảo ngữ (Inversion)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để nhấn mạnh, thường xuất hiện trong văn phong trang trọng.</p>
                    <h4><strong>Các trường hợp phổ biến:</strong></h4>
                    <ul>
                        <li><strong>Với trạng từ phủ định (Not only, never, rarely...):</strong> <code>Trạng từ phủ định + trợ động từ + S + V</code></li>
                        <li><strong>Với "Only after/when/if...":</strong> <code>Only... + mệnh đề phụ, + đảo ngữ ở mệnh đề chính</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>Not only did he pass the exam, but he also got the highest score.</code><br><em>(Anh ấy không những đỗ kỳ thi mà còn đạt điểm cao nhất.)</em></p>
                    <p><code>Rarely have I seen such a beautiful sunset.</code><br><em>(Hiếm khi nào tôi thấy cảnh hoàng hôn đẹp như vậy.)</em></p>
                `
            },
        ],
    },
    {
        level: 'C2',
        name: 'C2 - Thành thạo',
        topics: [
            {
                title: 'Thức giả định (Subjunctive)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để diễn tả một điều ước, một yêu cầu, một đề nghị hoặc một tình huống giả định, không có thật. Thường xuất hiện trong văn phong rất trang trọng.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p>Sau các động từ như <code>suggest, recommend, demand, insist</code> hoặc tính từ như <code>important, essential, vital</code>, mệnh đề theo sau có dạng:</p>
                    <p><code>... that + S + V(nguyên mẫu)</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>The doctor recommended that he stop smoking.</code><br><em>(Bác sĩ đề nghị rằng anh ấy nên bỏ thuốc.)</em></p>
                    <p><code>It is essential that everyone be on time.</code><br><em>(Điều cốt yếu là mọi người phải có mặt đúng giờ.)</em></p>
                `
            },
            {
                title: 'Phân từ và Mệnh đề Phân từ (Participles & Participle Clauses)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để rút gọn câu, cung cấp thêm thông tin một cách ngắn gọn và tinh tế.</p>
                    <ul>
                        <li><strong>Hiện tại phân từ (V-ing):</strong> Dùng cho hành động chủ động.</li>
                        <li><strong>Quá khứ phân từ (V3/V-ed):</strong> Dùng cho hành động bị động.</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>Feeling tired, she went to bed early.</code><br><em>(Cảm thấy mệt, cô ấy đã đi ngủ sớm.) - Rút gọn từ "Because she felt tired..."</em></p>
                    <p><code>Built in the 19th century, the house is now a museum.</code><br><em>(Được xây dựng vào thế kỷ 19, ngôi nhà bây giờ là một viện bảo tàng.) - Rút gọn từ "The house, which was built..."</em></p>
                `
            },
        ],
    },
];
