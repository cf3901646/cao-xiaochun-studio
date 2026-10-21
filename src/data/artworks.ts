export interface MacroFocalSpot {
  id: string;
  label: string;
  note: string;
  /** Percentage X (0-100) on the painting image */
  xPercent: number;
  /** Percentage Y (0-100) on the painting image */
  yPercent: number;
}

export interface ArtworkItem {
  id: string;
  indexNumber: string; // "01" .. "06"
  accessionCode: string;
  originalFilename: string;
  imageUrl: string;
  title: string;
  enTitle: string;
  mediumAndAttributes: string;
  dimensionsEstimate: string;
  originStory: string;
  techniqueNotes: string;
  /** Spatial layout coordinates relative to center (0,0) on the 1440x900 desktop stage */
  spatialPos: {
    x: number;
    y: number;
    width: number;
    height: number;
    parallaxDepth: number; // e.g., 0.85 to 1.2
  };
  /** Ambient aura colors for hover/focus transition */
  ambientColor: {
    hex: string;
    lightAura: string;
    darkAura: string;
    accentName: string;
  };
  /** Suggested macro inspection spots tied to the artist's notes */
  macroSpots: MacroFocalSpot[];
}

export const STUDIO_INFO = {
  artistNameCn: '曹晓春',
  artistNameEn: 'CAO XIAOCHUN',
  brandHeader: '曹晓春  |  CAO XIAOCHUN STUDIO',
  wechatId: 'cxc750209',
  avatarUrl: '/assets/aistudio/a3afa24fcf5bcde2a9d8437ee976526e_db58066f.png',
  cover: {
    exhibitionLabel: 'MONOGRAPH & ORIGINAL ARCHIVE · 个人油画作品集',
    title: '光落之处，刀笔留痕',
    subtitleEn: 'Where Light Settles, Brush and Knife Leave Their Trace',
    epigraph: '布面油画原作 · 创作缘起与刀笔手记',
    featuredIds: ['work-01', 'work-03', 'work-05', 'work-06']
  },
  statement: {
    headline: '看光怎么落下来，看颜料怎么留住它。',
    subheadlineEn: 'Between the breathing of light and the tactile warmth of brush and knife.',
    paragraphs: [
      '画画这么多年，我越来越不喜欢把自己困在某一种固定的程式里。面对不同的景物，手里的画笔和刮刀自然会给出不同的反应。',
      '画桌上的柿子时，我想起的是古典油画里的克制——把背景压进深暗里，用很薄的透明色一层层罩染，直到果实自己透出光来；但到了河边看乱石、在山里看白桦林时，薄涂就显得太文气了，必须换上刮刀，把调色板上没有完全搅匀的冷暖灰色直接堆上画布，让凸起的颜料自己去接住光线。',
      '远看是一口气，近看是一刀一笔的痕迹。这里整理了我近期的八幅原作与画画时的思考记录。如果你恰好喜欢某一种光线或笔触，想为自己的空间留一张画，可以加我微信聊聊。'
    ]
  },
  commissions: {
    title: '为特定空间或记忆，留一张原作',
    subtitleEn: 'Bespoke Commissions & Private Collection',
    paragraphs: [
      '除了画室现有的个人创作外，我也接受少量的私人定制。无论您是偏爱像《木桩上的双柿》那样安静耐看的古典写实静物，还是喜欢《浅滩乱石》《山前白桦》这种带有强烈刮刀肌理的风景，都可以根据您的墙面尺寸、空间光线或您珍藏的照片来独立构思。',
      '我不设繁琐的商业客服流程，所有定制均由我本人直接与您沟通尺寸、色调与创作周期。'
    ],
    contactCardLabel: '曹晓春 · 个人微信号：cxc750209'
  }
};

export const ARTWORKS: ArtworkItem[] = [
  {
    id: 'work-01',
    indexNumber: '01',
    accessionCode: 'CXC · ARCHIVE 01',
    originalFilename: '2180acf6d535c82ad8f3c805385a9c17.jpg',
    imageUrl: '/assets/aistudio/2180acf6d535c82ad8f3c805385a9c17_0e53c795.jpg',
    title: '《木桩上的双柿》',
    enTitle: 'Two Persimmons on an Aged Timber Block',
    mediumAndAttributes: '布面油画 · 古典写实静物 · 薄涂与多层透明罩染',
    dimensionsEstimate: '60 × 80 cm · 亚麻油画布',
    originStory:
      '画这组柿子的时候，我特意找了一截表面开裂、布满岁月刀痕的旧木桩做底座。我想表现的不是那种喜庆热闹的果盘，而是一种在暗室里静置下来的分量感。背景我用象牙黑调入少量熟褐压得极深，但不能死黑，得让暗部有空气流动，把所有的视觉焦点都推给前面这两颗刚洗净、还挂着水珠的柿子。',
    techniqueNotes:
      '柿子表皮没有用厚堆的画法，而是借鉴了古典油画的透明罩染（Glazing）——底子干透后，用极薄的朱红、镉橙与茜素红一层层染出果肉半透明的温润感。最考验耐心的是前面那片带黄斑的落叶和几颗水珠：水珠本身没有颜色，全靠底下一小笔重色投影和顶端克制的一点暖白高光，把果皮表面的张力撑起来。',
    spatialPos: {
      x: -735,
      y: -200,
      width: 265,
      height: 330,
      parallaxDepth: 1.08
    },
    ambientColor: {
      hex: '#9E3B24',
      lightAura: 'rgba(158, 59, 36, 0.16)',
      darkAura: 'rgba(186, 74, 48, 0.24)',
      accentName: '朱砂茜素 · 暗室暖光'
    },
    macroSpots: [
      {
        id: 'spot-01-a',
        label: '果皮透明罩染与水珠高光',
        note: '朱红与镉橙薄染出的半透明果肉感，水珠靠底部重色投影与顶端暖白撑起张力',
        xPercent: 38,
        yPercent: 64
      },
      {
        id: 'spot-01-b',
        label: '黄斑落叶与开裂旧木桩',
        note: '干裂木纹的岁月刀痕与落叶叶脉肌理形成冷暖材质对比',
        xPercent: 46,
        yPercent: 72
      }
    ]
  },
  {
    id: 'work-02',
    indexNumber: '02',
    accessionCode: 'CXC · ARCHIVE 02',
    originalFilename: '0897540fa7d1886b5f23169c2c5eee71.jpg',
    imageUrl: '/assets/aistudio/0897540fa7d1886b5f23169c2c5eee71_fcae3607.jpg',
    title: '《玻璃壶与白鸢尾》',
    enTitle: 'Glass Pitcher and White Irises in Morning Mist',
    mediumAndAttributes: '布面油画 · 印象派静物 · 湿画法与厚涂高光',
    dimensionsEstimate: '60 × 80 cm · 亚麻油画布',
    originStory:
      '白色和浅紫色的花在浅背景里是最难画的，稍微处理不好就会显得粉气或者单薄。这幅画我想尝试一种“透气”的灰调子——背景不画实，用藕荷、暖灰和一点点淡赭石揉在一起，让整束鸢尾花像是刚从晨雾里剪下来插进水壶里的状态，保留那种还没有完全舒展开的生机。',
    techniqueNotes:
      '如果放大看右侧那朵主花，会发现下垂的花瓣我是顺着生长的方向，用饱蘸钛白混合少许柠檬黄的猪鬃笔直接厚刮上去的，笔触凸起得非常明显，用来接住正面的光源；而左边的紫鸢尾则完全融在半透明的暗部里。底下玻璃水壶的通透感，就靠壶口一抹冷高光和水中被折射扭曲的深绿花梗来点醒。',
    spatialPos: {
      x: 735,
      y: -200,
      width: 265,
      height: 330,
      parallaxDepth: 0.94
    },
    ambientColor: {
      hex: '#84738C',
      lightAura: 'rgba(132, 115, 140, 0.18)',
      darkAura: 'rgba(163, 145, 173, 0.22)',
      accentName: '晨雾藕荷 · 钛白厚触'
    },
    macroSpots: [
      {
        id: 'spot-02-a',
        label: '右侧主花瓣猪鬃笔厚涂',
        note: '饱蘸钛白混合少许柠檬黄顺着生长方向厚刮，凸起笔触直接迎光',
        xPercent: 66,
        yPercent: 27
      },
      {
        id: 'spot-02-b',
        label: '玻璃水壶冷高光与折射花梗',
        note: '壶口一抹冷高光配合水中折射扭曲的深绿花梗，点醒玻璃通透感',
        xPercent: 51,
        yPercent: 83
      }
    ]
  },
  {
    id: 'work-03',
    indexNumber: '03',
    accessionCode: 'CXC · ARCHIVE 03',
    originalFilename: '98f7b3a8ddaca560d08e34f62169968c.jpg',
    imageUrl: '/assets/aistudio/98f7b3a8ddaca560d08e34f62169968c_d96c2ef0.jpg',
    title: '《幽谷来光》',
    enTitle: 'Tyndall Light Through the Deep Moss Valley',
    mediumAndAttributes: '布面油画 · 森林光影风景 · 干湿结合与薄扫法',
    dimensionsEstimate: '80 × 65 cm · 粗纹亚麻布',
    originStory:
      '清晨进山，太阳刚升到树冠上方时，林子里水汽很重，光线会像纱一样斜着劈下来。很多画森林光线的画容易把光柱画成生硬的白条，显得很假。我在画这张时，把八成的力气都花在了“暗部”——只有把近处溪石上厚厚的青苔、右侧古树盘根错节的深暗压住了，那几束斜穿下来的光才会有湿润的空气感。',
    techniqueNotes:
      '中间的光束完全利用了亚麻画布本身的粗纹理：底色铺好灰蓝绿之后，用大扇形笔蘸一点极薄的淡黄与粉绿，轻轻在画布表面扫过去，让颜料只挂在画布纹理的凸起处。前景溪水里的几笔暖黄反光和纯白水花是最后点上去的，一下子把幽暗的溪谷点活了。',
    spatialPos: {
      x: -735,
      y: 200,
      width: 265,
      height: 330,
      parallaxDepth: 1.14
    },
    ambientColor: {
      hex: '#3E5E38',
      lightAura: 'rgba(62, 94, 56, 0.16)',
      darkAura: 'rgba(92, 138, 78, 0.24)',
      accentName: '翠谷青苔 · 丁达尔晨光'
    },
    macroSpots: [
      {
        id: 'spot-03-a',
        label: '亚麻粗纹理薄扫丁达尔光束',
        note: '大扇形笔蘸极薄淡黄与粉绿轻扫，颜料仅挂在亚麻画布纹理凸起处',
        xPercent: 54,
        yPercent: 32
      },
      {
        id: 'spot-03-b',
        label: '前景溪水暖黄反光与点睛水花',
        note: '深暗青苔压住底色后，最后点上的暖黄反光与纯白水花让溪谷瞬间鲜活',
        xPercent: 38,
        yPercent: 84
      }
    ]
  },
  {
    id: 'work-04',
    indexNumber: '04',
    accessionCode: 'CXC · ARCHIVE 04',
    originalFilename: 'feacc5b24104e4dd5d51fffc416d2dd9.jpg',
    imageUrl: '/assets/aistudio/feacc5b24104e4dd5d51fffc416d2dd9_6f8399f6.jpg',
    title: '《浅滩乱石》',
    enTitle: 'Boulders at the Shallow Emerald Riverbank',
    mediumAndAttributes: '布面油画 · 刮刀厚涂风景 · 刀笔结合',
    dimensionsEstimate: '65 × 90 cm · 亚麻油画布',
    originStory:
      '这张竖构图的河岸，我感兴趣的是“水的软”和“石头的硬”怎么在同一张画布上共存。远处被雾气笼罩的树林和中间平缓流淌的深绿河水，给人一种很安静的纵深；但视线一旦落到右下角这堆乱石上，画面的节奏就突然变得硬朗、干脆起来。',
    techniqueNotes:
      '前景这几块大石头几乎全是用调色刀（Palette Knife）塑出来的。我刻意没有把颜色在调色板上调匀，而是用刀背挑起赭石、暖白、熟褐甚至一点天光反射的冷灰紫，顺着石头的结构面一刀刀切下去、压上去。水的波纹也是用刀锋横着拉出来的，近看全是厚实的油彩堆叠，退后三步看则是清澈的水面反光。',
    spatialPos: {
      x: 735,
      y: 200,
      width: 265,
      height: 330,
      parallaxDepth: 1.12
    },
    ambientColor: {
      hex: '#4A6B53',
      lightAura: 'rgba(74, 107, 83, 0.16)',
      darkAura: 'rgba(98, 138, 110, 0.24)',
      accentName: '碧水浅滩 · 刮刀赭石'
    },
    macroSpots: [
      {
        id: 'spot-04-a',
        label: '右下角调色刀厚塑乱石结构面',
        note: '刀背挑起未完全调匀的赭石、暖白、熟褐与冷灰紫，顺着石面一刀刀切压',
        xPercent: 78,
        yPercent: 79
      },
      {
        id: 'spot-04-b',
        label: '刀锋横向拉出的水面波纹反光',
        note: '近看是厚实的油彩堆叠痕迹，退后看则是清澈平缓的碧绿水波',
        xPercent: 28,
        yPercent: 68
      }
    ]
  },
  {
    id: 'work-05',
    indexNumber: '05',
    accessionCode: 'CXC · ARCHIVE 05',
    originalFilename: '0f507a6316ee6b0fbd2d466235fb34f5.jpg',
    imageUrl: '/assets/aistudio/0f507a6316ee6b0fbd2d466235fb34f5_9e49f0c5.jpg',
    title: '《山前白桦》',
    enTitle: 'Birch Grove Before Ultramarine Mountains',
    mediumAndAttributes: '布面油画 · 全幅厚涂肌理 (Impasto) · 冷暖补色实验',
    dimensionsEstimate: '70 × 95 cm · 粗纹亚麻布',
    originStory:
      '画白桦林最忌讳用黑色的线条去勾白色的树干，那样画出来像电线杆，没有生命。在高原强烈的阳光下，远处的山脉是纯粹的群青与钴蓝，而近处草地和树叶是耀眼的黄绿。站在树林里，你会发现白桦树的树干其实是一面镜子，把周围所有的环境色都吸进去了。',
    techniqueNotes:
      '这是画室原作中用色最奔放、笔触最厚重的一张。主树干的背光面我大胆地压入了大量的紫罗兰、群青和赭石，受光面则用刮刀厚厚地堆上暖白和浅黄。背景的草地完全放弃了细节勾勒，全部用短促有力的竖向刀触和笔触并置，让冷暖颜色在观者的眼睛里自己去混合、震颤。',
    spatialPos: {
      x: -410,
      y: 0,
      width: 265,
      height: 330,
      parallaxDepth: 0.96
    },
    ambientColor: {
      hex: '#3F598A',
      lightAura: 'rgba(63, 89, 138, 0.16)',
      darkAura: 'rgba(84, 118, 184, 0.25)',
      accentName: '高原群青 · 白桦暖黄'
    },
    macroSpots: [
      {
        id: 'spot-05-a',
        label: '主树干紫罗兰冷暗部与刮刀暖白受光',
        note: '摒弃生硬黑线，背光压入紫罗兰、群青与赭石，受光面用刮刀厚堆暖白',
        xPercent: 60,
        yPercent: 52
      },
      {
        id: 'spot-05-b',
        label: '草地短促竖向刀触并置',
        note: '放弃琐碎勾勒，以黄绿与冷蓝短促刀触并置，在视觉中自然混合震颤',
        xPercent: 42,
        yPercent: 82
      }
    ]
  },
  {
    id: 'work-06',
    indexNumber: '06',
    accessionCode: 'CXC · ARCHIVE 06',
    originalFilename: '4046cdf36983738cca6f4c9f498feedf.jpg',
    imageUrl: '/assets/aistudio/4046cdf36983738cca6f4c9f498feedf_0df4b790.jpg',
    title: '《雾海归帆》',
    enTitle: 'Returning Yellow Sail on the Misty Sea',
    mediumAndAttributes: '布面油画 · 意境海景 · 极简构图与微妙色阶',
    dimensionsEstimate: '70 × 90 cm · 亚麻油画布',
    originStory:
      '把画面的三分之二都留给云和雾，是一次挺冒险的尝试。我想画傍晚或者清晨海边那种天地浑然一体的苍茫感——海平线在远处已经彻底融进雾气里找不到了，只有近处漫上沙滩的浅浪和一艘亮着暖黄色风帆的老船，还有岸边两个极小的赶海人影，给人一点人间的温度。',
    techniqueNotes:
      '难点全在天空中那团巨大的云层：虽然亮，但不能画成死白。我用了大量的暖黄灰、粉紫灰和天蓝灰在湿底子上反复揉擦衔接，利用画布的颗粒感做出云团厚重的体积。整张画最重的一笔颜色压在左下角的暗部礁石与沙滩上，用这一块深褐色的重量，稳稳托住上方一整片飘渺的云海。',
    spatialPos: {
      x: 410,
      y: 0,
      width: 265,
      height: 330,
      parallaxDepth: 1.05
    },
    ambientColor: {
      hex: '#C49A52',
      lightAura: 'rgba(196, 154, 82, 0.17)',
      darkAura: 'rgba(212, 168, 92, 0.24)',
      accentName: '云海暖帆 · 苍茫暮色'
    },
    macroSpots: [
      {
        id: 'spot-06-a',
        label: '暖黄色风帆与海面微光倒影',
        note: '苍茫雾气中唯一温暖的视觉锚点，帆影与浅浪反光细腻呼应',
        xPercent: 64,
        yPercent: 56
      },
      {
        id: 'spot-06-b',
        label: '岸边赶海人影与左下深褐礁石压重',
        note: '极小的赶海人影赋予人间温度，左下角深褐色块稳稳托起整片云海',
        xPercent: 50,
        yPercent: 80
      }
    ]
  },
  {
    id: 'work-07',
    indexNumber: '07',
    accessionCode: 'CXC · ARCHIVE 07',
    originalFilename: 'mmexport1792561867440_26f21078.jpg',
    imageUrl: '/assets/aistudio/mmexport1792561867440_26f21078.jpg',
    title: '《陶罐粉蔷薇与茶台》',
    enTitle: 'Pink Roses in Ceramic Jar with Tea and Fruit',
    mediumAndAttributes: '布面油画 · 古典写实静物 · 透明罩染与微光折射',
    dimensionsEstimate: '60 × 75 cm · 亚麻油画布',
    originStory:
      '这幅静物我想画出一种茶歇时刻安静凝固的空气。桌上的深色陶罐、微沸的红茶杯、一颗青苹果与几朵正盛开的粉蔷薇，它们在沉暗的背景里彼此依偎。画花最怕“艳俗”，我把大面积的环境压在深赭与紫黑里，让光只抚摸花瓣的受光面与白瓷盘的边缘，让整张画拥有像老油画一样耐看的厚重感。',
    techniqueNotes:
      '主花头那朵粉蔷薇，是用多层半透明的茜素红、肉粉与钛白在干底子上逐步提亮揉染出来的，花瓣边缘留着柔软的虚边，表现其水分与娇嫩；而右下角的陶罐则用了肯定的弧形笔触，罐肩那一抹冷白色高光一下子切出了釉面的硬度和光泽。前景垂落的麻布褶皱层叠，我用松节油调和很薄的暖灰扫出布纹的起伏，沉着而不抢戏。',
    spatialPos: {
      x: -560,
      y: 360,
      width: 265,
      height: 330,
      parallaxDepth: 1.05
    },
    ambientColor: {
      hex: '#B86878',
      lightAura: 'rgba(184, 104, 120, 0.18)',
      darkAura: 'rgba(204, 124, 140, 0.25)',
      accentName: '幽夜凝光 · 柔粉温润'
    },
    macroSpots: [
      {
        id: 'spot-07-a',
        label: '主花头粉蔷薇多层柔薄罩染',
        note: '茜素红与肉粉薄染层叠出的半透明娇嫩感，花瓣边缘虚柔透气',
        xPercent: 70,
        yPercent: 30
      },
      {
        id: 'spot-07-b',
        label: '陶罐釉面冷白高光与青苹果',
        note: '肯定的弧形笔触切出硬质釉面反光，与青苹果果皮形成温润质感对比',
        xPercent: 55,
        yPercent: 50
      }
    ]
  },
  {
    id: 'work-08',
    indexNumber: '08',
    accessionCode: 'CXC · ARCHIVE 08',
    originalFilename: 'mmexport1792561871077_234d13c6.jpg',
    imageUrl: '/assets/aistudio/mmexport1792561871077_234d13c6.jpg',
    title: '《掰开的麦面包》',
    enTitle: 'Torn Rustic Bread with Palette Knife Impasto',
    mediumAndAttributes: '布面油画 · 刮刀厚涂肌理 (Impasto) · 纯粹质感实验',
    dimensionsEstimate: '50 × 60 cm · 粗纹亚麻布',
    originStory:
      '食物里最打动我的是那种粗粝质朴的生命力。这块被随手掰开的乡村硬麦面包，有着刚出炉时的焦脆外壳和撕裂后孔隙丰富的蜂窝状内部。我不想用传统画笔去小心翼翼地描摹它，而是想用颜料本身的厚度和干裂，直接“重塑”一块真正的麦面包——当你离近看，颜料的凸起就是面粉发酵后留下的呼吸孔。',
    techniqueNotes:
      '整幅画完全放弃了细笔，纯粹用不同规格的调色刀刮涂堆砌而成。面包焦黄的外皮，是用刀刃刮出赭黄、生褐与微焦的生赭，形成带有微小龟裂的硬质弧线；内部撕裂的断面则是这幅画的刀功核心：刀背直接挑起没有完全搅拌的钛白、暖粉灰和极少许熟褐，像抹奶油一样狠狠压进画布，再利用刀尖拉出蜂窝状的深凹刀痕。凸起的油彩厚度甚至达到数毫米，光从侧面照过来时，阴影就是颜料自己投下的。',
    spatialPos: {
      x: 560,
      y: 360,
      width: 265,
      height: 330,
      parallaxDepth: 1.08
    },
    ambientColor: {
      hex: '#B26E2B',
      lightAura: 'rgba(178, 110, 43, 0.18)',
      darkAura: 'rgba(202, 134, 67, 0.25)',
      accentName: '焦香麦皮 · 刮刀厚堆'
    },
    macroSpots: [
      {
        id: 'spot-08-a',
        label: '面包撕裂蜂窝状刮刀厚堆与凹痕',
        note: '刀背厚堆钛白与暖粉灰，刀尖拉出凹陷气孔，颜料凸起达数毫米直接接光',
        xPercent: 62,
        yPercent: 55
      },
      {
        id: 'spot-08-b',
        label: '焦黄酥脆外壳刀刃刮痕与龟裂',
        note: '刀刃刮出赭黄与微焦生赭，形成微小龟裂的硬质外皮弧线',
        xPercent: 28,
        yPercent: 46
      }
    ]
  }
];
