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
                title: 'Thì Hiện tại đơn (Present Simple)', 
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li>Diễn tả một thói quen, hành động lặp đi lặp lại ở hiện tại (e.g., I get up at 7 AM).</li>
                        <li>Diễn tả một sự thật hiển nhiên, một chân lý (e.g., The Earth goes around the Sun).</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <ul>
                        <li><strong>Khẳng định:</strong> <code>S + V(s/es) + O</code></li>
                        <li><strong>Phủ định:</strong> <code>S + do/does + not + V(nguyên mẫu) + O</code></li>
                        <li><strong>Nghi vấn:</strong> <code>Do/Does + S + V(nguyên mẫu) + O?</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>She works in a hospital.</code><br><em>(Cô ấy làm việc trong một bệnh viện.)</em></p>
                    <p><code>They don't like coffee.</code><br><em>(Họ không thích cà phê.)</em></p>
                ` 
            },
            { 
                title: 'Mạo từ "a/an/the"', 
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li><strong>a/an:</strong> Đứng trước danh từ đếm được số ít, khi người hoặc vật được nhắc đến lần đầu tiên. Dùng 'an' trước nguyên âm (u, e, o, a, i).</li>
                        <li><strong>the:</strong> Dùng khi người hoặc vật đã được xác định hoặc đã được nhắc đến trước đó.</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>I see a dog. The dog is black.</code><br><em>(Tôi thấy một con chó. Con chó đó màu đen.)</em></p>
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
            },
            {
                title: 'Tính từ sở hữu (Possessive Adjectives)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để chỉ sự sở hữu, đứng trước danh từ.</p>
                    <ul>
                        <li><code>my</code> (của tôi)</li>
                        <li><code>your</code> (của bạn)</li>
                        <li><code>his</code> (của anh ấy)</li>
                        <li><code>her</code> (của cô ấy)</li>
                        <li><code>its</code> (của nó)</li>
                        <li><code>our</code> (của chúng tôi)</li>
                        <li><code>their</code> (của họ)</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>This is my book.</code><br><em>(Đây là quyển sách của tôi.)</em></p>
                    <p><code>Her name is Lisa.</code><br><em>(Tên của cô ấy là Lisa.)</em></p>
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
                        <li>Diễn tả một hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ.</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <ul>
                        <li><strong>Khẳng định:</strong> <code>S + V2/V-ed + O</code></li>
                        <li><strong>Phủ định:</strong> <code>S + did + not + V(nguyên mẫu) + O</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>We watched a movie last night.</code><br><em>(Tối qua chúng tôi đã xem một bộ phim.)</em></p>
                    <p><code>He didn't go to school yesterday.</code><br><em>(Hôm qua anh ấy không đi học.)</em></p>
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
                    <p><code>The baby is sleeping.</code><br><em>(Em bé đang ngủ.)</em></p>
                    <p><code>I am meeting my friends tomorrow.</code><br><em>(Tôi sẽ gặp bạn bè vào ngày mai.)</em></p>
                `
            },
            { 
                title: 'So sánh hơn & So sánh nhất', 
                content: `
                    <h4><strong>So sánh hơn (Comparatives):</strong></h4>
                    <p>Dùng để so sánh giữa hai đối tượng.</p>
                    <ul>
                        <li><strong>Tính từ ngắn:</strong> <code>adj-er + than</code> (e.g., <code>taller than</code>)</li>
                        <li><strong>Tính từ dài:</strong> <code>more + adj + than</code> (e.g., <code>more beautiful than</code>)</li>
                    </ul>
                    <h4><strong>So sánh nhất (Superlatives):</strong></h4>
                    <p>Dùng để so sánh một đối tượng với tất cả các đối tượng còn lại.</p>
                    <ul>
                        <li><strong>Tính từ ngắn:</strong> <code>the + adj-est</code> (e.g., <code>the tallest</code>)</li>
                        <li><strong>Tính từ dài:</strong> <code>the most + adj</code> (e.g., <code>the most beautiful</code>)</li>
                    </ul>
                `
            },
            {
                title: 'Trạng từ chỉ tần suất (Adverbs of Frequency)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Diễn tả mức độ thường xuyên của một hành động.</p>
                    <h4><strong>Vị trí:</strong></h4>
                    <ul>
                        <li>Thường đứng trước động từ thường (e.g., <code>I <strong>always</strong> get up early.</code>).</li>
                        <li>Đứng sau động từ "to be" (e.g., <code>She is <strong>never</strong> late.</code>).</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>always > usually > often > sometimes > rarely > never</code></p>
                    <p><code>He often plays football in the afternoon.</code><br><em>(Anh ấy thường chơi bóng đá vào buổi chiều.)</em></p>
                `
            },
            {
                title: 'Động từ khuyết thiếu cơ bản (can, could, should)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li><code>can</code>: Diễn tả khả năng ở hiện tại (e.g., <code>I can swim.</code>)</li>
                        <li><code>could</code>: Diễn tả khả năng trong quá khứ (e.g., <code>I could swim when I was 5.</code>) hoặc một yêu cầu lịch sự (e.g., <code>Could you help me?</code>).</li>
                        <li><code>should</code>: Dùng để đưa ra lời khuyên (e.g., <code>You should study harder.</code>).</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>S + modal verb + V(nguyên mẫu)</code></p>
                `
            },
            {
                title: 'Danh từ đếm được & không đếm được',
                content: `
                    <h4><strong>Danh từ đếm được (Countable Nouns):</strong></h4>
                    <p>Là những danh từ có thể dùng với số đếm, có dạng số ít và số nhiều (e.g., one book, two books).</p>
                    <h4><strong>Danh từ không đếm được (Uncountable Nouns):</strong></h4>
                    <p>Là những danh từ chỉ chất liệu, chất lỏng, khái niệm trừu tượng, không dùng với số đếm (e.g., water, information, happiness). Thường đi với <code>some, any, much, a little</code>.</p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>There are three <strong>chairs</strong> in the room.</code> (đếm được)</p>
                    <p><code>I need some <strong>water</strong>.</code> (không đếm được)</p>
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
                        <li>Diễn tả hành động bắt đầu trong quá khứ, kéo dài đến hiện tại (với <em>for, since</em>).</li>
                        <li>Diễn tả hành động đã xảy ra nhưng không rõ thời gian, kết quả còn ảnh hưởng đến hiện tại.</li>
                        <li>Diễn tả trải nghiệm (với <em>ever, never</em>).</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>S + have/has + V3/V-ed + O</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>I have lived here for five years.</code><br><em>(Tôi đã sống ở đây được năm năm rồi.)</em></p>
                    <p><code>Have you ever been to Japan?</code><br><em>(Bạn đã bao giờ đến Nhật Bản chưa?)</em></p>
                `
            },
            {
                title: 'Câu điều kiện loại 1',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Diễn tả một điều kiện có thể xảy ra ở hiện tại hoặc tương lai.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>If + S + V(hiện tại đơn), S + will + V(nguyên mẫu)</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>If it rains, we will stay at home.</code><br><em>(Nếu trời mưa, chúng tôi sẽ ở nhà.)</em></p>
                `
            },
            {
                title: 'Gerunds and Infinitives (Danh động từ và Động từ nguyên mẫu)',
                content: `
                    <h4><strong>Danh động từ (Gerunds - V-ing):</strong></h4>
                    <p>Thường đứng sau một số động từ như <code>enjoy, avoid, finish, suggest</code>.</p>
                    <p><code>She enjoys reading books.</code><br><em>(Cô ấy thích đọc sách.)</em></p>
                    <h4><strong>Động từ nguyên mẫu (Infinitives - to V):</strong></h4>
                    <p>Thường đứng sau một số động từ như <code>want, decide, hope, plan</code>.</p>
                    <p><code>He decided to study abroad.</code><br><em>(Anh ấy đã quyết định đi du học.)</em></p>
                `
            },
            {
                title: 'Thì Quá khứ tiếp diễn (Past Continuous)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <ul>
                        <li>Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ.</li>
                        <li>Diễn tả một hành động đang xảy ra thì một hành động khác xen vào.</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>S + was/were + V-ing + O</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>I was watching TV when the phone rang.</code><br><em>(Tôi đang xem TV thì điện thoại reo.)</em></p>
                `
            },
            {
                title: 'Câu tường thuật (Reported Speech)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để thuật lại lời nói của người khác.</p>
                    <h4><strong>Quy tắc chung khi tường thuật câu trần thuật:</strong></h4>
                    <ul>
                        <li>Đổi đại từ, tính từ sở hữu.</li>
                        <li>Lùi thì của động từ (e.g., hiện tại đơn → quá khứ đơn).</li>
                        <li>Đổi trạng từ chỉ thời gian và nơi chốn (e.g., <code>now</code> → <code>then</code>).</li>
                    </ul>
                    <h4><strong>Tường thuật câu hỏi và mệnh lệnh:</strong></h4>
                    <ul>
                        <li><strong>Câu hỏi Yes/No:</strong> dùng <code>ask + if/whether</code>.</li>
                        <li><strong>Câu hỏi Wh-:</strong> dùng <code>ask + từ để hỏi (what, where...)</code>.</li>
                        <li><strong>Mệnh lệnh:</strong> dùng <code>tell/ask + O + (not) to V</code>.</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>Direct: "I am happy," she said.</code> → <code>Reported: She said that she was happy.</code></p>
                    <p><code>Direct: "Do you like music?" he asked.</code> → <code>Reported: He asked if I liked music.</code></p>
                    <p><code>Direct: "Close the door," she told me.</code> → <code>Reported: She told me to close the door.</code></p>
                `
            },
        ],
    },
    {
        level: 'B2',
        name: 'B2 - Trung cao cấp',
        topics: [
            {
                title: 'Câu điều kiện loại 2 & 3',
                content: `
                    <h4><strong>Câu điều kiện loại 2:</strong></h4>
                    <ul>
                        <li><strong>Công dụng:</strong> Diễn tả điều kiện không có thật ở hiện tại.</li>
                        <li><strong>Cấu trúc:</strong> <code>If + S + V2/V-ed, S + would/could + V(nguyên mẫu)</code></li>
                        <li><strong>Ví dụ:</strong> <code>If I were you, I would accept the offer.</code><br><em>(Nếu tôi là bạn, tôi sẽ chấp nhận lời đề nghị đó.)</em></li>
                    </ul>
                    <h4><strong>Câu điều kiện loại 3:</strong></h4>
                    <ul>
                        <li><strong>Công dụng:</strong> Diễn tả điều kiện không có thật trong quá khứ.</li>
                        <li><strong>Cấu trúc:</strong> <code>If + S + had + V3/V-ed, S + would/could + have + V3/V-ed</code></li>
                        <li><strong>Ví dụ:</strong> <code>If she had studied harder, she would have passed the exam.</code><br><em>(Nếu cô ấy đã học chăm chỉ hơn, cô ấy đã vượt qua kỳ thi rồi.)</em></li>
                    </ul>
                `
            },
            {
                title: 'Câu bị động (Passive Voice)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Nhấn mạnh đối tượng chịu tác động của hành động.</p>
                    <h4><strong>Cấu trúc chung:</strong></h4>
                    <p><code>S + be + V3/V-ed + (by O)</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>My car is being repaired.</code><br><em>(Xe của tôi đang được sửa chữa.)</em></p>
                    <p><code>This bridge was built in 1990.</code><br><em>(Cây cầu này được xây vào năm 1990.)</em></p>
                `
            },
            {
                title: 'Mệnh đề quan hệ (Relative Clauses)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Bổ sung thông tin cho danh từ đứng trước nó. Bắt đầu bằng <code>who, whom, which, that, whose</code>.</p>
                    <ul>
                        <li><strong>Mệnh đề xác định (Defining):</strong> Cần thiết cho nghĩa của câu, không có dấu phẩy.</li>
                        <li><strong>Mệnh đề không xác định (Non-defining):</strong> Cung cấp thêm thông tin, có dấu phẩy.</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>The man who lives next door is a doctor.</code> (Xác định)</p>
                    <p><code>My brother, who lives in London, is a doctor.</code> (Không xác định)</p>
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
            {
                title: 'Động từ khuyết thiếu chỉ sự suy luận (Modals of Deduction)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để đưa ra phán đoán về một sự việc.</p>
                    <ul>
                        <li><code>must</code>: Chắc chắn là (khẳng định).</li>
                        <li><code>can't</code>: Chắc chắn không phải là.</li>
                        <li><code>may/might/could</code>: Có lẽ là.</li>
                    </ul>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <ul>
                        <li><strong>Hiện tại:</strong> <code>S + modal + V(nguyên mẫu)</code></li>
                        <li><strong>Quá khứ:</strong> <code>S + modal + have + V3/V-ed</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>He isn't answering the phone. He must be busy.</code> (Hiện tại)</p>
                    <p><code>The ground is wet. It must have rained last night.</code> (Quá khứ)</p>
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
                    <p>Kết hợp điều kiện trong quá khứ và kết quả ở hiện tại (hoặc ngược lại).</p>
                    <h4><strong>Cấu trúc phổ biến:</strong></h4>
                    <p><code>If + S + had + V3, S + would + V(nguyên mẫu)</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>If I had taken that job, I would be rich now.</code><br><em>(Nếu tôi đã nhận công việc đó, thì bây giờ tôi đã giàu rồi.)</em></p>
                `
            },
            {
                title: 'Đảo ngữ (Inversion)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để nhấn mạnh, thường đứng đầu câu với các trạng từ phủ định.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>Trạng từ phủ định + trợ động từ + S + V</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>Not only did he pass the exam, but he also got the highest score.</code><br><em>(Anh ấy không những đỗ kỳ thi mà còn đạt điểm cao nhất.)</em></p>
                    <p><code>Rarely have I seen such a beautiful sunset.</code><br><em>(Hiếm khi nào tôi thấy cảnh hoàng hôn đẹp như vậy.)</em></p>
                `
            },
            {
                title: 'Mệnh đề danh từ (Noun Clauses)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Là một mệnh đề phụ có chức năng như một danh từ (làm chủ ngữ, tân ngữ).</p>
                    <h4><strong>Bắt đầu bằng:</strong></h4>
                    <p><code>that, what, who, where, when, why, how, whether...</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code><strong>What he said</strong> was not true.</code> (Làm chủ ngữ)<br><em>(Những gì anh ấy nói là không đúng.)</em></p>
                    <p><code>I don't know <strong>where she lives</strong>.</code> (Làm tân ngữ)<br><em>(Tôi không biết cô ấy sống ở đâu.)</em></p>
                `
            },
            {
                title: 'Mệnh đề Phân từ (Participle Clauses)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để rút gọn câu, cung cấp thông tin một cách ngắn gọn và tinh tế.</p>
                    <ul>
                        <li><strong>Hiện tại phân từ (V-ing):</strong> Dùng cho hành động chủ động.</li>
                        <li><strong>Quá khứ phân từ (V3/V-ed):</strong> Dùng cho hành động bị động.</li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>Feeling tired, she went to bed early.</code><br><em>(Cảm thấy mệt, cô ấy đã đi ngủ sớm.)</em></p>
                    <p><code>Built in the 19th century, the house is now a museum.</code><br><em>(Được xây dựng vào thế kỷ 19, ngôi nhà bây giờ là một viện bảo tàng.)</em></p>
                `
            },
            {
                title: 'Tương lai trong quá khứ (Future in the Past)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để nói về một hành động được cho là sẽ xảy ra trong tương lai, tại một thời điểm trong quá khứ.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p>Thường dùng <code>was/were going to + V</code>, <code>would + V</code>, hoặc thì quá khứ tiếp diễn.</p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>He said he <strong>would call</strong> me, but he didn't.</code><br><em>(Anh ấy đã nói sẽ gọi cho tôi, nhưng anh ấy đã không làm.)</em></p>
                    <p><code>I <strong>was going to</strong> travel last year, but I couldn't.</code><br><em>(Tôi đã định đi du lịch vào năm ngoái, nhưng tôi không thể.)</em></p>
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
                    <p>Dùng để diễn tả điều ước, yêu cầu, đề nghị hoặc tình huống giả định. Thường theo sau các động từ như <code>suggest, recommend, demand</code>.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>... that + S + V(nguyên mẫu)</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>The doctor recommended that he stop smoking.</code><br><em>(Bác sĩ đề nghị rằng anh ấy nên bỏ thuốc.)</em></p>
                    <p><code>It is essential that everyone be on time.</code><br><em>(Điều cốt yếu là mọi người phải có mặt đúng giờ.)</em></p>
                `
            },
            {
                title: 'Câu chẻ (Cleft Sentences)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Dùng để nhấn mạnh một phần cụ thể của câu.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <ul>
                        <li><code>It is/was [phần nhấn mạnh] that [mệnh đề còn lại].</code></li>
                        <li><code>What [chủ ngữ] do/does/did is/was [phần nhấn mạnh].</code></li>
                    </ul>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code><strong>It was John</strong> who broke the window.</code> (Nhấn mạnh John)<br><em>(Chính John là người đã làm vỡ cửa sổ.)</em></p>
                    <p><code><strong>What I need</strong> is a good rest.</code> (Nhấn mạnh a good rest)<br><em>(Điều tôi cần là được nghỉ ngơi thật tốt.)</em></p>
                `
            },
             {
                title: 'So sánh kép (Double Comparatives)',
                content: `
                    <h4><strong>Công dụng:</strong></h4>
                    <p>Diễn tả mối quan hệ nhân quả, rằng một sự việc thay đổi sẽ dẫn đến một sự việc khác thay đổi tương ứng.</p>
                    <h4><strong>Cấu trúc:</strong></h4>
                    <p><code>The + so sánh hơn, the + so sánh hơn.</code></p>
                    <h4><strong>Ví dụ:</strong></h4>
                    <p><code>The harder you study, the better your grades will be.</code><br><em>(Bạn càng học chăm chỉ, điểm số của bạn sẽ càng tốt.)</em></p>
                    <p><code>The more you practice, the more confident you become.</code><br><em>(Bạn càng luyện tập, bạn càng trở nên tự tin.)</em></p>
                `
            },
        ],
    },
];