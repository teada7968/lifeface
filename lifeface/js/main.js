// 存储数据（实际项目中应该用后端API，这里用localStorage模拟）
let posts = [];
let pendingPosts = [];
let currentUser = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initEvents();
    updateUserUI();
    loadArticles();
    loadCommunityPosts();
    setupAdRotator();
});

// 加载模拟数据
function loadData() {
    // 内置官方文章
    const defaultPosts = [
        {
            id: '1',
            title: '春日通勤穿搭指南，5件单品穿出高级感',
            category: 'fashion',
            summary: '不想每天烦恼穿什么？这5件基础款单品帮你轻松度过整个春天。',
            content: '详细内容...',
            author: '生活美学志',
            coverImage: '',
            createdAt: new Date('2025-03-15'),
            status: 'published',
            views: 1240
        },
        {
            id: '2',
            title: '新手化妆全攻略：从零开始学化妆',
            category: 'beauty',
            summary: '化妆小白必看！手把手教你选择适合自己的化妆品和化妆技巧。',
            content: '详细内容...',
            author: '生活美学志',
            coverImage: '',
            createdAt: new Date('2025-03-10'),
            status: 'published',
            views: 892
        },
        {
            id: '3',
            title: '周末周边游：3个被低估的小众旅行地',
            category: 'travel',
            summary: '不想去人挤人的景点？这几个宝藏目的地值得收藏。',
            content: '详细内容...',
            author: '生活美学志',
            coverImage: '',
            createdAt: new Date('2025-03-08'),
            status: 'published',
            views: 567
        },
        {
            id: '4',
            title: '极简生活：如何打造让心情变好的家居空间',
            category: 'life',
            summary: '从整理到收纳，让你的家成为治愈心灵的港湾。',
            content: '详细内容...',
            author: '生活美学志',
            coverImage: '',
            createdAt: new Date('2025-03-05'),
            status: 'published',
            views: 734
        },
        {
            id: '5',
            title: '冥想100天：我学到的5个人生智慧',
            category: 'knowledge',
            summary: '坚持冥想的改变，从焦虑到平静的心路历程。',
            content: '详细内容...',
            author: '生活美学志',
            coverImage: '',
            createdAt: new Date('2025-03-01'),
            status: 'published',
            views: 445
        }
    ];
    
    // 从localStorage读取待审核内容
    const storedPending = localStorage.getItem('pendingPosts');
    if (storedPending) {
        pendingPosts = JSON.parse(storedPending);
    }
    
    // 合并已发布内容（实际应该从后端获取）
    posts = defaultPosts;
    
    // 加载审核通过的用户内容
    const approvedPosts = localStorage.getItem('approvedUserPosts');
    if (approvedPosts) {
        const userPosts = JSON.parse(approvedPosts);
        posts = [...defaultPosts, ...userPosts];
    }
}

// 加载首页文章
function loadArticles() {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;
    
    const displayPosts = posts.slice(0, 4);
    grid.innerHTML = displayPosts.map(post => createArticleCard(post)).join('');
}

// 加载社区精选（审核通过的用户内容）
function loadCommunityPosts() {
    const grid = document.getElementById('communityGrid');
    if (!grid) return;
    
    const userPosts = posts.filter(p => p.author !== '生活美学志').slice(0, 3);
    if (grid) {
        if (userPosts.length > 0) {
            grid.innerHTML = userPosts.map(post => createArticleCard(post)).join('');
        } else {
            grid.innerHTML = '<div class="empty-state">✨ 暂无社区内容，快来成为第一个分享者吧 ✨</div>';
        }
    }
}

// 创建文章卡片HTML
function createArticleCard(post) {
    const categoryMap = {
        life: '🏠 生活服务',
        knowledge: '📚 知识分享',
        beauty: '💄 美妆',
        fashion: '👗 穿搭',
        travel: '✈️ 旅行'
    };
    
    const catName = categoryMap[post.category] || post.category;
    const date = new Date(post.createdAt).toLocaleDateString('zh-CN');
    const coverStyle = post.coverImage ? `background-image: url(${post.coverImage})` : '';
    
    return `
        <div class="article-card" onclick="viewArticle('${post.id}')">
            <div class="article-cover" style="${coverStyle}"></div>
            <div class="article-content">
                <span class="article-category">${catName}</span>
                <h3 class="article-title">${escapeHtml(post.title)}</h3>
                <p class="article-summary">${escapeHtml(post.summary)}</p>
                <div class="article-meta">
                    <span>✍️ ${escapeHtml(post.author)}</span>
                    <span>📅 ${date}</span>
                    <span>👁️ ${post.views || 0}</span>
                </div>
            </div>
        </div>
    `;
}

// HTML转义
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// 查看文章详情
function viewArticle(id) {
    alert('文章详情页开发中...\n实际项目中会跳转到详情页');
}

// 初始化事件监听
function initEvents() {
    // 分类筛选
    document.querySelectorAll('.category-card, .filter-btn').forEach(el => {
        el.addEventListener('click', (e) => {
            const cat = el.dataset.cat || el.dataset.filter;
            if (cat && cat !== 'all') {
                filterArticles(cat);
            } else if (cat === 'all') {
                loadAllArticles();
            }
        });
    });
    
    // 提交表单
    const submitForm = document.getElementById('submitForm');
    if (submitForm) {
        submitForm.addEventListener('submit', handleSubmit);
    }
    
    // 登录/注册
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Tab切换
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });
}

// 筛选文章
function filterArticles(category) {
    const filtered = posts.filter(p => p.category === category);
    const listContainer = document.getElementById('articlesList');
    if (listContainer) {
        listContainer.innerHTML = filtered.map(p => createArticleCard(p)).join('');
    }
}

function loadAllArticles() {
    const listContainer = document.getElementById('articlesList');
    if (listContainer) {
        listContainer.innerHTML = posts.map(p => createArticleCard(p)).join('');
    }
}

// 处理投稿
function handleSubmit(e) {
    e.preventDefault();
    
    // 检查是否登录
    if (!currentUser) {
        alert('请先登录后再投稿');
        location.href = 'login.html';
        return;
    }
    
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const summary = document.getElementById('summary').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;
    const coverImage = document.getElementById('coverImage').value;
    
    const newPost = {
        id: Date.now().toString(),
        title,
        category,
        summary,
        content,
        author: author || currentUser.name,
        coverImage,
        createdAt: new Date(),
        status: 'pending',
        userId: currentUser.id,
        views: 0
    };
    
    // 保存到待审核列表
    pendingPosts.push(newPost);
    localStorage.setItem('pendingPosts', JSON.stringify(pendingPosts));
    
    alert('投稿成功！内容将在审核通过后展示。\n（模拟审核：管理员将看到待审核列表）');
    e.target.reset();
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // 模拟登录验证
    if (email && password.length >= 6) {
        currentUser = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('登录成功！');
        location.href = 'index.html';
    } else {
        alert('邮箱或密码错误（演示模式：任意邮箱+6位以上密码即可）');
    }
}

// 处理注册
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    if (password !== confirm) {
        alert('两次输入的密码不一致');
        return;
    }
    
    if (name && email && password.length >= 6) {
        currentUser = {
            id: Date.now(),
            name: name,
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('注册成功！已自动登录');
        location.href = 'index.html';
    } else {
        alert('请填写完整信息');
    }
}

// 更新用户UI
function updateUserUI() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        const userBtns = document.querySelectorAll('#userNavBtn, #userNavBtn2');
        userBtns.forEach(btn => {
            if (btn) btn.textContent = `👤 ${currentUser.name}`;
        });
    }
}

// 广告轮播（自动更换广告内容）
function setupAdRotator() {
    const adContents = [
        '✨ 春风有信，花开有期 | 春季限定好物推荐 ✨',
        '📖 本周热读：《极简生活指南》限时免费试读 →',
        '🎁 会员专属福利 | 每日精选好物榜单，点击查看详情 →',
        '🌟 发现更多美好 → 下载App 每日更新优质内容 🌟',
        '📸 分享你的生活瞬间，有机会获得首页推荐 → 立即投稿',
        '🔥 本周热门：#春季穿搭挑战赛 快来参与！',
        '💎 知识付费限时特惠：畅销课程全场5折起',
        '🎨 创意生活节：手作好物限时折扣'
    ];
    
    let adIndex = 0;
    setInterval(() => {
        const ads = document.querySelectorAll('.ad-content');
        ads.forEach((ad, idx) => {
            if (ad) {
                const newContent = adContents[(adIndex + idx) % adContents.length];
                ad.textContent = newContent;
            }
        });
        adIndex = (adIndex + 1) % adContents.length;
    }, 8000);
}

// 为文章列表页单独加载
if (window.location.pathname.includes('articles.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('articlesList')) {
            loadAllArticles();
        }
    });
}

// 全局函数供HTML调用
window.viewArticle = viewArticle;
window.filterArticles = filterArticles;