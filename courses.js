// Original, local-only lessons. Timing is an estimate, never a gate:
// about 12–18 minutes per course if learners replay, rehearse, and swap roles.
// A quick single pass may be shorter. No personal information is required.
// Respond models are examples, not answer keys or automatic scoring criteria.
export const courses = [
  {
    id: 'after-school',
    title: '放学后的快乐时间',
    emoji: '🎨',
    goal: '从一个爱好词开始，说出喜欢的活动、理由，并邀请伙伴一起玩。',
    scene: '你和一位友好的同学聊放学后的活动。可以说真实喜好，也可以扮演角色。建议边听边说、换词再试，约12–18分钟；不计时催促，按自己的节奏来。',
    steps: [
      { id: 'hobby-01', type: 'listen', prompt: '先听一句，选出意思。选好后，试着轻声重复你听到的活动。', en: 'I like drawing.', zh: '我喜欢画画。', options: ['我喜欢画画。', '我喜欢游泳。', '我喜欢唱歌。'], answer: '我喜欢画画。', hint: 'drawing 是画画。可以再听一次，不用一次听懂。' },
      { id: 'hobby-02', type: 'speak', prompt: '先说一个词就算成功！听后轻声说，再用舒服的音量说。', en: 'Drawing.', zh: '画画。', hint: '不用模仿得一模一样。能让人听懂，比口音更重要。' },
      { id: 'hobby-03', type: 'type', prompt: '输入“画画”的英文。输入后，再读给自己听。', en: 'drawing', zh: '画画', hint: '刚刚听到的词：drawing。' },
      { id: 'hobby-04', type: 'build', prompt: '拼出“我喜欢画画。”拼好后，先慢慢读，再自然地读。', en: 'I like drawing.', zh: '我喜欢画画。', hint: 'I（我）→ like（喜欢）→ drawing（画画）。' },
      { id: 'hobby-05', type: 'speak', prompt: '跟着说完整句。再把 drawing 换成 reading 或 singing，说一个新句子。', en: 'I like drawing.', zh: '我喜欢画画。', hint: 'I like reading. 我喜欢阅读。I like singing. 我喜欢唱歌。选一个就好。' },
      { id: 'hobby-06', type: 'listen', prompt: '同学问了什么？选好后，试着用一句话回答。', en: 'What do you like doing after school?', zh: '放学后你喜欢做什么？', options: ['放学后你喜欢做什么？', '你想买什么饮料？', '现在几点了？'], answer: '放学后你喜欢做什么？', hint: 'after school 是放学后。' },
      { id: 'hobby-07', type: 'respond', prompt: '轮到你：放学后你喜欢做什么？What do you like doing after school? 先回答，再换一个爱好回答。', en: 'I like reading after school.', zh: '放学后我喜欢阅读。', hint: '可用句架 I like … after school.；reading / drawing / singing 都可以。', keywords: ['reading', 'drawing', 'singing', 'after school'] },
      { id: 'hobby-08', type: 'build', prompt: '给爱好加一个小理由：拼出“这很好玩。”然后接在你的爱好句后面读。', en: 'It is fun.', zh: '这很好玩。', hint: 'It 指刚刚说的活动；fun 是好玩的。' },
      { id: 'hobby-09', type: 'speak', prompt: '把爱好和理由连起来说。第一遍看示范，第二遍试着不看；也可以换成自己的爱好。', en: 'I like drawing. It is fun.', zh: '我喜欢画画。这很好玩。', hint: '两句之间可以停一下。想不起来时再看示范，不算失败。' },
      { id: 'hobby-10', type: 'type', prompt: '输入“好玩的”的英文。说一说：什么活动让你觉得 fun？', en: 'fun', zh: '好玩的', hint: '只有三个字母：fun。' },
      { id: 'hobby-11', type: 'respond', prompt: '聊聊原因：你为什么喜欢它？Why do you like it? 先说一个理由，再把爱好和理由一起说。', en: 'It is fun.', zh: '这很好玩。', hint: '理由词：fun（好玩）、relaxing（放松）。只说一个理由也很好。', keywords: ['fun', 'relaxing'] },
      { id: 'hobby-12', type: 'listen', prompt: '同学发出邀请。听一听，选出意思；再试着答应或礼貌拒绝。', en: 'Do you want to draw with me?', zh: '你想和我一起画画吗？', options: ['你想和我一起画画吗？', '你能帮我买水吗？', '你什么时候回家？'], answer: '你想和我一起画画吗？', hint: 'with me 是和我一起。可以回答 Yes, please. 或 No, thanks.' },
      { id: 'hobby-13', type: 'build', prompt: '拼出一个简短邀请。拼完先当邀请者，再当同学回应。', en: 'Let us draw together.', zh: '我们一起画画吧。', hint: 'Let us … 是“让我们……吧”；together 是一起。' },
      { id: 'hobby-14', type: 'respond', prompt: '接受或拒绝都可以：你想一起画画吗？Do you want to draw with me? 先表达自己的选择，再试另一种回应。', en: 'Yes, please. That sounds fun.', zh: '好的。这听起来很好玩。', hint: '答应：Yes, please.；拒绝：No, thanks.。拒绝不用解释。', keywords: ['yes', 'no', 'thanks'] },
      { id: 'hobby-15', type: 'speak', prompt: '这次先不看示范，邀请同学一起阅读。需要时再看；然后换成一起画画。', en: 'Do you want to read with me?', zh: '你想和我一起阅读吗？', hint: '只给你活动词：read / draw。慢一点也没关系。' },
      { id: 'hobby-16', type: 'respond', prompt: '小对话：你喜欢做什么？What do you like doing? 用自己的选择说“爱好＋理由”。说完假装对方没听清，再自然地说一次。', en: 'I like singing. It is fun.', zh: '我喜欢唱歌。这很好玩。', hint: '先自己组织语言，再按需查看示范。你的选择不必和示范相同。', keywords: ['like', 'fun'] },
      { id: 'hobby-17', type: 'respond', prompt: '换你发起对话：我们一起做什么？What can we do together? 选一个活动，用英语邀请对方；再替对方回应。', en: 'Do you want to draw with me?', zh: '你想和我一起画画吗？', hint: '先不看参考。可以想象同学答应，也可以让对方礼貌拒绝。' },
      { id: 'hobby-18', type: 'respond', prompt: '自由小剧场：放学后你想做什么？What do you want to do after school? 说出爱好和理由，再邀请伙伴。分几句慢慢说；愿意的话，换个活动再演一轮。', en: 'I like reading because it is fun. Do you want to read with me?', zh: '我喜欢阅读，因为这很好玩。你想和我一起阅读吗？', hint: '不用照背。可以用前面学过的短句，也可以加入自己会说的内容。没有唯一正确答案。' }
    ]
  },
  {
    id: 'snack-shop',
    title: '小小点餐员',
    emoji: '🥪',
    goal: '礼貌地点一份小吃或饮料，询问价格，遇到售罄时换一个选择。',
    scene: '这是一个虚构的小吃店，价格仅用于练习，不会真实购买。你可以轮流扮演顾客和店员。建议每段换一个选择再说，约12–18分钟；无需等待倒计时。',
    steps: [
      { id: 'shop-01', type: 'listen', prompt: '听听这位顾客想要什么。选好后，读出饮料词。', en: 'Water, please.', zh: '请给我水。', options: ['请给我水。', '请给我果汁。', '请给我牛奶。'], answer: '请给我水。', hint: 'water 是水，please 让请求更礼貌。' },
      { id: 'shop-02', type: 'speak', prompt: '只说一个短语也能点单。听后说一次，再想象店员就在面前，礼貌地说一次。', en: 'Water, please.', zh: '请给我水。', hint: '可以在 water 后轻轻停顿，再说 please。' },
      { id: 'shop-03', type: 'type', prompt: '输入“水”的英文，再读一遍。', en: 'water', zh: '水', hint: 'water。这里不用输入整句。' },
      { id: 'shop-04', type: 'build', prompt: '拼出完整点单句。拼好后，试着边想象递菜单边说。', en: 'I would like some water, please.', zh: '我想要一些水，谢谢。', hint: 'I would like … 是礼貌地说“我想要……”。' },
      { id: 'shop-05', type: 'speak', prompt: '看示范点一杯饮料，再把 water 换成 milk 或 juice，说一个新点单句。', en: 'I would like some water, please.', zh: '我想要一些水，谢谢。', hint: 'milk 是牛奶；juice 是果汁。水、牛奶和果汁前都可以用 some。' },
      { id: 'shop-06', type: 'listen', prompt: '听听店员问什么。选好后，用你喜欢的饮料回答。', en: 'What would you like to drink?', zh: '你想喝什么？', options: ['你想喝什么？', '你想去哪里？', '你喜欢什么运动？'], answer: '你想喝什么？', hint: 'drink 是喝。短答 Water, please. 也可以。' },
      { id: 'shop-07', type: 'respond', prompt: '店员问：你想喝什么？What would you like to drink? 先点自己喜欢的，再替一个虚构角色点另一种。', en: 'I would like some juice, please.', zh: '我想要一些果汁，谢谢。', hint: '句架：I would like some …, please.；water / milk / juice。', keywords: ['water', 'milk', 'juice', 'please'] },
      { id: 'shop-08', type: 'build', prompt: '再加一份小吃：拼出“我想要一个三明治，谢谢。”然后读出你的饮料和小吃订单。', en: 'I would like a sandwich, please.', zh: '我想要一个三明治，谢谢。', hint: '一个三明治是 a sandwich；不要用 a water。' },
      { id: 'shop-09', type: 'speak', prompt: '练习询问价格。先看着说，再试着不看；轮流指着想象中的饮料和三明治问一问。', en: 'How much is it?', zh: '这个多少钱？', hint: 'it 指你正在询问的那一件东西。' },
      { id: 'shop-10', type: 'type', prompt: '输入“谢谢”的英文短语，完成后大声说给想象中的店员听。', en: 'thank you', zh: '谢谢', hint: '两个短词：thank you。' },
      { id: 'shop-11', type: 'respond', prompt: '轮到你当店员：多少钱？How much is it? 假设水是3元、果汁是5元，选一件回答，再换另一件。', en: 'It is three yuan.', zh: '三元。', hint: '价格词：three（三）、five（五）。这些是假设价格，不是真实报价。', keywords: ['three', 'five', 'yuan'] },
      { id: 'shop-12', type: 'listen', prompt: '听听店员遇到了什么情况。选好后，想一个可以换点的饮料。', en: 'Sorry, we have no juice today.', zh: '抱歉，我们今天没有果汁。', options: ['今天没有果汁。', '今天果汁免费。', '今天只有果汁。'], answer: '今天没有果汁。', hint: 'no juice 表示没有果汁。你可以换点水或牛奶。' },
      { id: 'shop-13', type: 'build', prompt: '果汁没有了，换个选择。拼好后，把 water 换成 milk 再口头说一遍。', en: 'Some water, please.', zh: '请给我一些水。', hint: '简短的点单短语也很自然，不必每次都说长句。' },
      { id: 'shop-14', type: 'respond', prompt: '果汁售罄，店员问：你想喝水还是牛奶？Would you like water or milk? 自己选一个，礼貌回答；也可以说不用了。', en: 'Some milk, please.', zh: '请给我一些牛奶。', hint: '可选 water / milk；不想换可以说 No, thanks.', keywords: ['water', 'milk', 'please', 'thanks'] },
      { id: 'shop-15', type: 'speak', prompt: '先不看示范，试着说“谢谢，祝你今天愉快”。需要时再看；想象自己是店员，再说一次。', en: 'Thank you. Have a nice day!', zh: '谢谢。祝你今天愉快！', hint: '关键词：thank / nice day。微笑着说也许更轻松。' },
      { id: 'shop-16', type: 'respond', prompt: '组合点单：你想要什么？What would you like? 自选一种饮料和一份小吃，说清楚并加上礼貌用语。然后换一种饮料再说。', en: 'I would like a sandwich and some water, please.', zh: '我想要一个三明治和一些水，谢谢。', hint: '先自己想。可以分成两句，不需要一口气说完。', keywords: ['sandwich', 'water', 'milk', 'juice', 'please'] },
      { id: 'shop-17', type: 'respond', prompt: '换你推进对话：你还想知道什么？What would you like to know? 选一件东西问价格，然后扮演店员给一个虚构价格。', en: 'How much is it?', zh: '这个多少钱？', hint: '先不看参考。可以用已经学过的3元或5元，不需要做算术。' },
      { id: 'shop-18', type: 'respond', prompt: '自由小剧场：准备好点单了吗？Are you ready to order? 自选饮料或小吃，点单、问价、道谢。再换角色：假装一样商品售罄，试着换点别的。', en: 'I would like some milk, please. How much is it?', zh: '我想要一些牛奶，谢谢。这个多少钱？', hint: '示范只是开场，不是完整标准答案。按自己的选择演下去，短句就够用。' }
    ]
  },
  {
    id: 'weekend-plans',
    title: '周末一起玩',
    emoji: '🌤️',
    goal: '介绍一个周末计划，邀请伙伴，商量时间，并为下雨准备另一个选择。',
    scene: '和虚构的伙伴商量周末活动，不需要说出真实住址或行程。建议把邀请、回应和备用计划连起来演，约12–18分钟；可以停下来思考，也可以随时继续。',
    steps: [
      { id: 'weekend-01', type: 'listen', prompt: '听听这个周末计划。选好后，试着重复活动部分。', en: 'I am going to ride my bike on Saturday.', zh: '我打算星期六骑自行车。', options: ['星期六骑自行车。', '星期日看电影。', '星期六去游泳。'], answer: '星期六骑自行车。', hint: 'ride my bike 是骑我的自行车；Saturday 是星期六。' },
      { id: 'weekend-02', type: 'speak', prompt: '先练一个活动短语。跟着说，再想象这个动作，自己说一次。', en: 'Ride a bike.', zh: '骑自行车。', hint: '先把短语说顺就好，不急着说长句。' },
      { id: 'weekend-03', type: 'type', prompt: '输入“自行车”的英文，输入后说出 ride a bike。', en: 'bike', zh: '自行车', hint: 'bike。只需要输入这个词。' },
      { id: 'weekend-04', type: 'build', prompt: '拼出“我打算骑自行车。”拼好后，先分段读，再连起来读。', en: 'I am going to ride my bike.', zh: '我打算骑自行车。', hint: 'I am going to … 表示“我打算……”。可以在 to 前稍作停顿。' },
      { id: 'weekend-05', type: 'speak', prompt: '给计划加上时间。先看着说，再把 Saturday 换成 Sunday 说一次。', en: 'I am going to ride my bike on Saturday.', zh: '我打算星期六骑自行车。', hint: 'on Saturday 在星期六；on Sunday 在星期日。可以先说计划，再补时间。' },
      { id: 'weekend-06', type: 'listen', prompt: '伙伴在问什么？选好后，说一个你愿意练习的周末计划。', en: 'What are you going to do this weekend?', zh: '这个周末你打算做什么？', options: ['这个周末你打算做什么？', '你刚才吃了什么？', '这辆自行车多少钱？'], answer: '这个周末你打算做什么？', hint: 'this weekend 是这个周末。计划可以是虚构的。' },
      { id: 'weekend-07', type: 'respond', prompt: '你的计划是什么？What are you going to do this weekend? 选一个活动回答，再替虚构伙伴说一个不同计划。', en: 'I am going to read a book.', zh: '我打算读一本书。', hint: '句架 I am going to …；read a book / ride my bike / watch a film。', keywords: ['read', 'bike', 'film'] },
      { id: 'weekend-08', type: 'build', prompt: '计划有了，邀请伙伴吧。拼好后，想象伙伴说“好呀”，再读一次邀请。', en: 'Would you like to come with me?', zh: '你愿意和我一起去吗？', hint: 'Would you like to …? 是礼貌的邀请；come with me 是和我一起去。' },
      { id: 'weekend-09', type: 'speak', prompt: '练习回应邀请。先说答应的版本，再试着礼貌拒绝；你可以有自己的选择。', en: 'Yes, I would love to.', zh: '好的，我很愿意。', hint: '拒绝可以说 Sorry, I cannot.（抱歉，我不能。）不用编造原因。' },
      { id: 'weekend-10', type: 'type', prompt: '输入“星期日”的英文。日期词的首字母通常大写，输入后读出来。', en: 'Sunday', zh: '星期日', hint: 'Sunday。星期六是 Saturday，不要混淆。' },
      { id: 'weekend-11', type: 'respond', prompt: '商量时间：我们什么时候见？When shall we meet? 从星期六上午或星期日下午选一个，再换一个时间试说。', en: 'On Sunday afternoon.', zh: '星期日下午。', hint: 'Saturday morning（星期六上午）；Sunday afternoon（星期日下午）。前面用 on。', keywords: ['Saturday', 'Sunday', 'morning', 'afternoon'] },
      { id: 'weekend-12', type: 'listen', prompt: '天气变了，伙伴建议什么？选好后，想一个自己喜欢的室内活动。', en: 'It is raining. Let us play a game at home.', zh: '正在下雨。我们在家玩个游戏吧。', options: ['在家玩个游戏。', '出门骑自行车。', '去公园踢足球。'], answer: '在家玩个游戏。', hint: 'at home 是在家。计划变了也可以一起想办法。' },
      { id: 'weekend-13', type: 'build', prompt: '拼出一个下雨时的备用计划。拼好后，读出来，再口头换成 read a book。', en: 'We can watch a film at home.', zh: '我们可以在家看一部电影。', hint: 'We can … 表示“我们可以……”；watch a film 是看电影。' },
      { id: 'weekend-14', type: 'respond', prompt: '如果下雨，我们能做什么？What can we do if it rains? 选一个室内活动，再想第二个备选。', en: 'We can read a book at home.', zh: '我们可以在家读一本书。', hint: '只给你活动提示：read / draw / play a game。短句回答也可以。', keywords: ['read', 'draw', 'game', 'home'] },
      { id: 'weekend-15', type: 'speak', prompt: '先不看示范，试着邀请伙伴星期日一起看电影。需要时再看；然后换成星期六。', en: 'Would you like to watch a film with me on Sunday?', zh: '你愿意星期日和我一起看电影吗？', hint: '关键词：film / Sunday。太长时，先说邀请，再单独补上时间。' },
      { id: 'weekend-16', type: 'respond', prompt: '邀请由你决定：我们能一起做什么？What can we do together? 自选活动和时间邀请伙伴，再扮演伙伴答应或拒绝。', en: 'Would you like to draw with me on Saturday?', zh: '你愿意星期六和我一起画画吗？', hint: '先自己说，不必使用示范里的活动。可以把一句长话分成几句短话。' },
      { id: 'weekend-17', type: 'respond', prompt: '伙伴星期六没空：星期日可以吗？Is Sunday OK? 可以接受，也可以礼貌拒绝。再换一个选择回答，体验不同的对话结尾。', en: 'Sunday is fine. See you on Sunday!', zh: '星期日可以。星期日见！', hint: '先不看参考；拒绝也算完成练习，不必透露自己的真实安排。', keywords: ['Sunday', 'yes', 'sorry'] },
      { id: 'weekend-18', type: 'respond', prompt: '自由小剧场：你的周末计划是什么？What is your weekend plan? 自选活动和时间，邀请伙伴并替对方回应。最后想象下雨，说一个备用计划；想继续就换角色再演。', en: 'I am going to ride my bike on Sunday. If it rains, I can read at home.', zh: '我打算星期日骑自行车。如果下雨，我可以在家阅读。', hint: '参考只是一种计划。可以用 We can … 单独说备用活动，不必使用 if；说出自己的意思就好。' }
    ]
  }
];
