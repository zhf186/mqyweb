# 网站重新设计 - 设计文档

## 概述

重新设计漫骑游官网，打造**大气时尚科技轻奢**的品牌形象。核心策略：
1. **精简首页**：只保留核心信息
2. **内容分流**：合理分配到各专属页面
3. **文案优化**：简洁有力，避免官方套话
4. **视觉升级**：大版面、留白、现代感

## 架构设计

### 页面结构

```
首页 (/)
├── Hero Section (全屏)
├── Brand Intro (简短)
├── E-BIKE Highlight (3个卖点)
├── Featured Routes (3-4条)
└── CTA Section

E-BIKE (/ebike)
├── Product Hero
├── German Heritage
├── Smart Features
├── Specs
├── Partners Badge
└── CTA (试骑/购买)

Routes (/routes)
├── 保持现有
└── 优化文案

Community (/community)
├── Community Intro
├── Photo Gallery (大量照片)
├── Stats
└── Join CTA

Partners (/partners)
├── Partnership Advantages
├── Yadea Partnership
├── Gazelle Partnership
├── 11 Scenic Areas
├── Cooperation Models
└── Business CTA

About (/about)
├── Brand Story
├── Timeline
├── Manufacturing (工厂)
├── Nationwide (门店)
└── Join Us CTA
```

## 组件设计

### 1. Hero Section (首页)

```tsx
<HeroSection>
  <FullScreenImage src="/hero.jpg" />
  <Overlay gradient="black/60 to transparent" />
  <Content center>
    <Logo size="xl" />
    <Tagline>骑遇无限美好</Tagline>
    <ScrollIndicator />
  </Content>
</HeroSection>
```

**特点**:
- 全屏大图
- 极简文字
- 滚动提示

### 2. Brand Intro (首页)

```tsx
<BrandIntro>
  <Container maxWidth="800px">
    <Badge>FUTURE LUXURY CYCLING</Badge>
    <Headline>德国血统 × 智能骑行</Headline>
    <Description>
      高端跨界骑游生活平台
    </Description>
  </Container>
</BrandIntro>
```

**文案**:
- 标题：德国血统 × 智能骑行
- 描述：高端跨界骑游生活平台

### 3. E-BIKE Highlight (首页)

```tsx
<EBikeHighlight>
  <Grid cols={3}>
    <Feature>
      <Icon>⚡</Icon>
      <Title>11.9kg</Title>
      <Desc>极致轻量</Desc>
    </Feature>
    <Feature>
      <Icon>🔋</Icon>
      <Title>100km</Title>
      <Desc>续航里程</Desc>
    </Feature>
    <Feature>
      <Icon>📱</Icon>
      <Title>智能系统</Title>
      <Desc>扫码即骑</Desc>
    </Feature>
  </Grid>
  <CTA href="/ebike">了解 E-BIKE</CTA>
</EBikeHighlight>
```

**特点**:
- 3个核心卖点
- 大数字+简短说明
- 图标+文字

### 4. Featured Routes (首页)

```tsx
<FeaturedRoutes>
  <SectionHeader>
    <Badge>ROUTES</Badge>
    <Title>精选路线</Title>
  </SectionHeader>
  <RouteGrid>
    {routes.slice(0, 4).map(route => (
      <RouteCard key={route.id}>
        <Image src={route.image} />
        <Overlay />
        <Info>
          <Name>{route.name}</Name>
          <Meta>{route.distance}km · {route.difficulty}</Meta>
        </Info>
      </RouteCard>
    ))}
  </RouteGrid>
  <CTA href="/routes">探索更多</CTA>
</FeaturedRoutes>
```

**特点**:
- 只展示3-4条精选
- 大图+简短信息
- 引导到路线页面

### 5. Partners Page

```tsx
<PartnersPage>
  {/* Hero */}
  <Hero>
    <Title>合作伙伴</Title>
    <Subtitle>携手世界级品牌</Subtitle>
  </Hero>

  {/* Advantages */}
  <Advantages>
    <Grid cols={4}>
      <Advantage>
        <Number>10万+</Number>
        <Label>精准用户</Label>
      </Advantage>
      {/* ... */}
    </Grid>
  </Advantages>

  {/* Major Partners */}
  <MajorPartners>
    <PartnerCard featured>
      <Logo src="/yadea.svg" size="xl" />
      <Title>雅迪</Title>
      <Subtitle>全球最大电动车品牌</Subtitle>
      <Description>
        战略合作伙伴，共同打造智能骑行生态
      </Description>
    </PartnerCard>
    <PartnerCard featured>
      <Logo src="/gazelle.svg" size="xl" />
      <Title>Gazelle</Title>
      <Subtitle>荷兰皇家品牌</Subtitle>
      <Description>
        引入欧洲先进技术，德国血统E-BIKE
      </Description>
    </PartnerCard>
  </MajorPartners>

  {/* Scenic Areas */}
  <ScenicAreas>
    <SectionTitle>11家国家级景区</SectionTitle>
    <Grid cols={3}>
      {scenicAreas.map(area => (
        <AreaCard>
          <Image src={area.image} />
          <Name>{area.name}</Name>
        </AreaCard>
      ))}
    </Grid>
  </ScenicAreas>

  {/* CTA */}
  <BusinessCTA>
    <Title>商务合作</Title>
    <Button>立即咨询</Button>
  </BusinessCTA>
</PartnersPage>
```

### 6. About Page

```tsx
<AboutPage>
  {/* Hero */}
  <Hero>
    <Title>关于漫骑游</Title>
    <Subtitle>骑遇无限美好人生</Subtitle>
  </Hero>

  {/* Stats */}
  <Stats>
    <Stat>
      <Number>2006</Number>
      <Label>创立年份</Label>
    </Stat>
    <Stat>
      <Number>32</Number>
      <Label>出口国家</Label>
    </Stat>
    <Stat>
      <Number>5000㎡</Number>
      <Label>智造工厂</Label>
    </Stat>
    <Stat>
      <Number>11</Number>
      <Label>景区合作</Label>
    </Stat>
  </Stats>

  {/* Timeline */}
  <Timeline>
    <Milestone year="2006">
      产品远销全球32国
    </Milestone>
    <Milestone year="2020">
      漫骑游品牌创立
    </Milestone>
    {/* ... */}
  </Timeline>

  {/* Manufacturing */}
  <Manufacturing>
    <SectionTitle>智造基地</SectionTitle>
    <Content>
      <ImageGrid>
        {factoryImages.map(img => (
          <Image src={img} />
        ))}
      </ImageGrid>
      <Info>
        <Stat>5000㎡</Stat>
        <Stat>20年经验</Stat>
        <Stat>200+员工</Stat>
      </Info>
    </Content>
  </Manufacturing>

  {/* Stores */}
  <Stores>
    <SectionTitle>全国布局</SectionTitle>
    <StoreGrid>
      {stores.map(store => (
        <StoreCard>
          <Image src={store.image} />
          <Name>{store.name}</Name>
          <Location>{store.location}</Location>
        </StoreCard>
      ))}
    </StoreGrid>
  </Stores>
</AboutPage>
```

### 7. Community Page

```tsx
<CommunityPage>
  {/* Hero */}
  <Hero>
    <Title>骑行社群</Title>
    <Subtitle>10万+骑友的选择</Subtitle>
  </Hero>

  {/* Stats */}
  <Stats>
    <Stat>
      <Number>500+</Number>
      <Label>骑行活动</Label>
    </Stat>
    <Stat>
      <Number>10万+</Number>
      <Label>社群成员</Label>
    </Stat>
  </Stats>

  {/* Photo Gallery */}
  <PhotoGallery>
    <Masonry cols={4}>
      {photos.map(photo => (
        <Photo src={photo} />
      ))}
    </Masonry>
  </PhotoGallery>

  {/* CTA */}
  <JoinCTA>
    <Title>加入我们</Title>
    <Button>立即加入</Button>
  </JoinCTA>
</CommunityPage>
```

## 数据模型

### 翻译文件优化

```json
{
  "home": {
    "hero": {
      "title": "漫骑游",
      "tagline": "骑遇无限美好"
    },
    "brand": {
      "badge": "FUTURE LUXURY CYCLING",
      "title": "德国血统 × 智能骑行",
      "desc": "高端跨界骑游生活平台"
    },
    "ebike": {
      "features": [
        { "value": "11.9kg", "label": "极致轻量" },
        { "value": "100km", "label": "续航里程" },
        { "value": "智能系统", "label": "扫码即骑" }
      ]
    }
  },
  "partners": {
    "hero": {
      "title": "合作伙伴",
      "subtitle": "携手世界级品牌"
    },
    "yadea": {
      "title": "雅迪",
      "subtitle": "全球最大电动车品牌",
      "desc": "战略合作伙伴，共同打造智能骑行生态"
    },
    "gazelle": {
      "title": "Gazelle",
      "subtitle": "荷兰皇家品牌",
      "desc": "引入欧洲先进技术，德国血统E-BIKE"
    }
  },
  "about": {
    "stats": [
      { "value": "2006", "label": "创立年份" },
      { "value": "32", "label": "出口国家" },
      { "value": "5000㎡", "label": "智造工厂" },
      { "value": "11", "label": "景区合作" }
    ],
    "manufacturing": {
      "title": "智造基地",
      "stats": ["5000㎡", "20年经验", "200+员工"]
    },
    "stores": {
      "title": "全国布局"
    }
  },
  "community": {
    "hero": {
      "title": "骑行社群",
      "subtitle": "10万+骑友的选择"
    },
    "stats": [
      { "value": "500+", "label": "骑行活动" },
      { "value": "10万+", "label": "社群成员" }
    ]
  }
}
```

## 视觉设计规范

### 布局系统

```css
/* 容器宽度 */
.container-sm { max-width: 800px; }
.container-md { max-width: 1200px; }
.container-lg { max-width: 1400px; }

/* 间距系统 */
.spacing-xs { padding: 2rem; }
.spacing-sm { padding: 4rem; }
.spacing-md { padding: 8rem; }
.spacing-lg { padding: 12rem; }

/* 网格系统 */
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
```

### 字体系统

```css
/* 标题 */
.heading-xl { font-size: 96px; font-weight: 700; }
.heading-lg { font-size: 72px; font-weight: 700; }
.heading-md { font-size: 48px; font-weight: 700; }
.heading-sm { font-size: 32px; font-weight: 600; }

/* 正文 */
.body-lg { font-size: 20px; line-height: 1.6; }
.body-md { font-size: 16px; line-height: 1.6; }
.body-sm { font-size: 14px; line-height: 1.5; }

/* 数字 */
.number-xl { font-size: 120px; font-weight: 300; }
.number-lg { font-size: 80px; font-weight: 300; }
```

### 色彩系统

```css
/* 主色 */
--color-black: #000000;
--color-white: #FFFFFF;

/* 灰度 */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-800: #1F2937;
--color-gray-900: #111827;

/* 品牌色 */
--color-brand: #FF6B35;
--color-brand-light: #FF8C5A;
--color-brand-dark: #E55A2B;
```

### 动画系统

```css
/* 过渡 */
.transition-fast { transition: all 0.2s ease; }
.transition-normal { transition: all 0.3s ease; }
.transition-slow { transition: all 0.5s ease; }

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

## 错误处理

### 图片加载失败
- 显示占位图
- 使用渐变背景
- 保持布局稳定

### 内容缺失
- 显示默认文案
- 隐藏空白板块
- 提供反馈入口

## 测试策略

### 视觉测试
- 检查留白比例
- 验证字体大小
- 确认色彩使用
- 测试响应式布局

### 性能测试
- 首屏加载时间 < 3s
- 图片优化检查
- 动画流畅度测试
- 移动端性能测试

### 用户测试
- A/B测试新旧首页
- 收集用户反馈
- 分析停留时间
- 监测转化率

## 实施计划

### Phase 1: 首页重构
1. 精简Hero Section
2. 优化Brand Intro
3. 重构E-BIKE Highlight
4. 精简Featured Routes
5. 优化CTA Section

### Phase 2: 内容分流
1. 创建新的Partners页面
2. 重构About页面
3. 增强Community页面
4. 移除首页冗余内容

### Phase 3: 文案优化
1. 重写所有标题
2. 精简所有描述
3. 优化CTA文案
4. 更新翻译文件

### Phase 4: 视觉升级
1. 应用新的布局系统
2. 更新字体样式
3. 优化色彩使用
4. 增强动画效果

### Phase 5: 测试优化
1. 性能测试
2. 响应式测试
3. 用户测试
4. 迭代优化
