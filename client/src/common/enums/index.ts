export enum NavigatorOpenType {
    navigate = 1, // 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层
    redirect = 2, // 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
    switchTab = 3, // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
    reLaunch = 4, // 关闭所有页面，打开到应用内的某个页面
    navigateBack = 5 // 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
}

export enum FeedbackType {
    Feedback = 1, // 意见反馈
    Word = 2, // 单词反馈
    Bug = 3 // bug反馈
}

export enum UserResource {
    // menu
    MenuDashboard = 1,
    MenuWord = 2,
    MenuArticle = 3,
    MenuMe = 4,

    // default

    UserWordCreate = 10,
    UserWordListDisplay = 11,
    UserWordEdit = 12,
    UserWordDelete = 13,

    QuertionAnswerCreate = 14,
    FeedbackCreate = 15,

    ArticleReview = 16, // 文章评论
    ArticlePraise = 17, // 文章点赞

    Donate = 18, // 捐赠
    WordCollect = 19,

    // administrator
    
    WordCreate = 100,
    WordEdit = 101,
    WordListDisplay = 102,
    WordDelete = 103
}