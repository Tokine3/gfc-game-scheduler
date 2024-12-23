export const privacyContent = {
  ja: {
    adult: {
      title: 'プライバシーポリシー',
      description: '個人情報の取り扱いについて',
      closeButton: '閉じる',
      switchToKids: 'こどもむけ',
      switchToAdult: 'おとなむけ',
      sections: [
        {
          title: '1. 収集する情報',
          icon: '',
          content: '本サービスでは、必要最小限の以下の情報を収集します：',
          list: [
            'Discordアカウント情報（ユーザーID、ユーザー名）',
            'サーバー情報（サーバーID、サーバー名）',
            'スケジュール情報（予定内容、日時）',
            '基本的な利用ログ（アクセス日時）',
          ],
        },
        {
          title: '2. 情報の利用目的',
          content: '収集した情報は、以下の目的でのみ使用します：',
          list: [
            'スケジュール管理機能の提供',
            'ユーザー認証の実施',
            'サービスの改善・不具合対応',
            'お問い合わせ対応',
          ],
        },
        {
          title: '3. 情報の管理',
          content: '個人情報の管理について、以下の対策を実施しています：',
          list: [
            'SSL/TLS暗号化通信の使用',
            'アクセス制御の実施',
            '定期的なバックアップ',
            '不要データの適切な削除',
          ],
        },
        {
          title: '4. 第三者提供',
          content:
            '収集した情報は、以下の場合を除き第三者への提供は行いません：',
          list: [
            'ユーザーの同意がある場合',
            '法令に基づく場合',
            '個人を特定できない形での統計データの利用',
          ],
        },
        {
          title: '5. Cookieの使用',
          content:
            '本サービスでは、認証情報の保持のために必要最小限のCookieを使用します。これらは、サービスの基本的な機能の提供に必要なものです。',
        },
        {
          title: '6. お問い合わせ',
          content:
            'プライバシーに関するお問い合わせは、以下の窓口で受け付けています：',
          contact: {
            twitter: '@yourusername',
            github: 'github.com/yourusername',
            email: 'privacy@gfcscheduler.com',
          },
        },
        {
          title: '7. 改定について',
          content:
            '本プライバシーポリシーは、サービスの改善に伴い予告なく改定される場合があります。重要な変更については、サービス上で通知します。',
          dates: {
            established: '2024年1月1日',
            updated: '2024年3月15日',
          },
        },
      ],
    },
    kids: {
      title: 'プライバシーポリシー',
      description: 'たいせつなおやくそく',
      closeButton: 'とじる',
      switchToKids: 'こどもむけ',
      switchToAdult: 'おとなむけ',
      sections: [
        {
          title: 'たいせつなおやくそく',
          icon: 'Star',
          content:
            'このアプリは、おともだちとあそぶやくそくをきめるためのアプリです。みんなでたのしくつかうために、すこしだけおしえてほしいことがあります：',
          list: [
            'ディスコードでつかっているニックネーム',
            'みんなであつまるばしょのなまえ',
            'いつあそべるかのよてい',
          ],
        },
        {
          title: 'なぜおしえてほしいの？',
          icon: 'Heart',
          content: 'みんなとなかよくあそぶために、つかうものです：',
          list: [
            'おともだちとあそぶよていをきめるため',
            'あなたがだれだかわかるようにするため',
            'みんなのよていをかんたんにみれるようにするため',
          ],
        },
        {
          title: 'あんしんしてね',
          icon: 'Lock',
          content:
            'あなたのだいじなじょうほうは、とくべつなかぎつきのばこにいれて、だいじにまもっています 🔒',
          list: [
            'あなたのじょうほうは、かぎをかけてほかのひとにはみせません',
            'いらなくなったじょうほうは、きれいにけします',
            'あんぜんにつかえるように、いつもちゅういしています',
          ],
        },
        {
          title: 'たのしくつかうために',
          icon: 'Star',
          content: 'みんながたのしくつかえるように、つぎのことをまもってね：',
          list: [
            'おともだちにやさしくしよう',
            'みんなでなかよくつかおう',
            'わからないことは、おうちのひとにきいてみよう',
          ],
        },
        {
          title: 'わからないことがあったら',
          icon: 'MessageCircle',
          content:
            'もんだいやしんぱいなことがあったら、おうちのひとといっしょにれんらくしてください ✉️',
          contact: {
            note: 'おうちのかたへ 👨‍👩‍👧‍👦',
            description:
              'このアプリは、子どもが安全に使えるように簡単な機能だけを提供しています。何かご質問やご心配なことがございましたら、お気軽にお問い合わせください。',
            email: 'contact@gfcscheduler.com',
          },
        },
        {
          title: 'あんぜんにつかうためのアドバイス',
          icon: 'Shield',
          content:
            'このアプリをたのしくつかうために、つぎのことをおぼえておいてね：',
          list: [
            'ゲームのなかでであったおともだちには、ほんとうのなまえをおしえないでね 🎮',
            'パスワードは、だいじなひみつ！ だれにもおしえないでね 🔑',
            'しらないひとからメッセージがきたら、おうちのひとにみせてね 📧',
          ],
        },
        {
          title: 'たいせつなおやくそく',
          icon: 'Laugh',
          content: 'みんなのあんぜんのために、つぎのことをまもってね：',
          list: [
            'おともだちとなかよくあそぼう！ わるぐちは、だめだよ 🚫',
            'やくそくしたよていは、できるだけまもろうね ⏰',
            'いやなことをされたら、すぐにおうちのひとにそうだんしよう 🆘',
          ],
        },
        {
          title: 'おうちのかたへ',
          icon: 'Handshake',
          content:
            'お子様の安全なオンライン活動のため、以下の点にご注意ください：',
          list: [
            '定期的な利用状況の確認',
            '不適切なコンテンツの報告機能の説明',
            'コミュニケーションの見守り',
            'プライバシー設定の確認',
          ],
          contact: {
            note: 'ご不明点やご懸念がございましたら、お気軽にお問い合わせください。',
            email: 'privacy@gfcscheduler.com',
          },
        },
      ],
    },
  },
  en: {
    adult: {
      title: 'Privacy Policy',
      description: 'How we handle your information',
      closeButton: 'Close',
      switchToKids: 'Kids Mode',
      switchToAdult: 'Adult Mode',
      sections: [
        {
          title: '1. Information We Collect',
          icon: '',
          content:
            'We collect the following minimal information necessary for the service:',
          list: [
            'Discord account information (User ID, username)',
            'Server information (Server ID, server name)',
            'Schedule information (event details, dates and times)',
            'Basic usage logs (access time, IP address)',
          ],
        },
        {
          title: '2. How We Use Information',
          content:
            'We use the collected information only for the following purposes:',
          list: [
            'Providing schedule management features',
            'User authentication',
            'Service improvements and bug fixes',
            'Customer support',
            'Security measures',
          ],
        },
        {
          title: '3. Information Protection',
          content:
            'We protect your information through the following measures:',
          list: [
            'SSL/TLS encryption for communication security',
            'Access control to prevent unauthorized access',
            'Regular security audits',
            'Appropriate data deletion policies',
          ],
        },
        {
          title: '4. Information Sharing and Third-Party Disclosure',
          content: 'Regarding the handling of collected information:',
          list: [
            'We do not disclose information to third parties in general',
            "We may disclose information to third parties only when required by law or with the user's consent",
            'We share information only within the scope necessary for Discord integration',
            'We may use the information in aggregated form without being able to identify individuals',
          ],
        },
        {
          title: '5. User Rights',
          content: 'Users have the following rights:',
          list: [
            'Request access, correction, or deletion of personal information',
            'Check and delete service usage history',
            'Change privacy settings',
            'Delete account and related data',
          ],
        },
        {
          title: '6. Data Retention Periods',
          content: 'Retention periods for various types of data:',
          list: [
            'Account information: Deleted within 6 months after withdrawal',
            'Schedule information: Deleted within 3 months after the event ends',
            'Usage logs: Deleted within 90 days after collection',
            'Backup data: Retained for 30 days before deletion',
          ],
        },
        {
          title: '7. Security Measures',
          content:
            'We implement the following technical and organizational measures:',
          list: [
            'Regular security assessments and vulnerability testing',
            'Implementation of unauthorized access detection systems',
            'Regular updates and enhancements of encryption technologies',
            'Periodic security training for operational personnel',
          ],
        },
      ],
    },
    kids: {
      title: 'Privacy Policy',
      description: 'Important Rules for Everyone',
      closeButton: 'Close',
      switchToKids: 'Kids Mode',
      switchToAdult: 'Adult Mode',
      sections: [
        {
          title: 'Important Rules',
          icon: 'Star',
          content:
            'This app helps you make plans to play with your friends. To make it fun for everyone, we need to know a few things:',
          list: [
            'Your nickname on Discord',
            'The name of your meeting place',
            'When you can play',
          ],
        },
        {
          title: 'Why Do We Need This?',
          icon: 'Heart',
          content:
            'We use this information to help you play with your friends:',
          list: [
            'To help you make plans with friends',
            'So your friends know who you are',
            'To make it easy to see when everyone can play',
          ],
        },
        {
          title: 'You Can Feel Safe',
          icon: 'Lock',
          content:
            'Your important information is kept in a special locked box that we protect very carefully 🔒',
          list: [
            'Your information is locked away where others cannot see it',
            'We clean up information we no longer need',
            'We always make sure everything is safe to use',
          ],
        },
        {
          title: 'Having Fun Together',
          icon: 'Star',
          content: 'To make sure everyone has fun, remember these things:',
          list: [
            'Be kind to your friends',
            'Play nicely together',
            'Ask a grown-up if you are not sure about something',
          ],
        },
        {
          title: 'If You Need Help',
          icon: 'Mail',
          content:
            'If you have any problems or worries, please contact us with your parents or guardians ✉️',
          contact: {
            note: 'To Parents and Guardians 👨‍👩‍👧‍👦',
            description:
              'This app provides simple features to ensure children can use it safely. If you have any questions or concerns, please feel free to contact us.',
            email: 'contact@gfcscheduler.com',
          },
        },
        {
          title: 'Safety Tips',
          icon: 'Shield',
          content: 'Remember these tips to have fun safely:',
          list: [
            'Never tell your real name to people you meet in games 🎮',
            'Your password is a special secret - never share it! 🔑',
            'Show any messages from strangers to your parents 📧',
          ],
        },
        {
          title: 'Important Safety Rules',
          icon: 'Heart',
          content: 'Follow these rules to stay safe:',
          list: [
            'Be friendly with others! No mean words 🚫',
            'Try to keep your promises about game time ⏰',
            'Tell a grown-up right away if something bothers you 🆘',
          ],
        },
        {
          title: 'To Parents and Guardians',
          icon: 'Shield',
          content: `Please note these points for your child's safe online activity:`,
          list: [
            'Regular monitoring of usage',
            'Understanding how to report inappropriate content',
            'Supervising communications',
            'Checking privacy settings',
          ],
          contact: {
            note: 'If you have any questions or concerns, please feel free to contact us.',
            email: 'privacy@gfcscheduler.com',
          },
        },
      ],
    },
  },
  zh: {
    adult: {
      title: '隐私政策',
      description: '关于个人信息的处理',
      closeButton: '关闭',
      switchToKids: '儿童模式',
      switchToAdult: '成人模式',
      sections: [
        {
          title: '1. 收集的信息',
          icon: '',
          content: '为了提供服务，我们收集以下必要的最小限度信息：',
          list: [
            'Discord账户信息（用户ID、用户名）',
            '服务器信息（服务器ID、服务器名称）',
            '日程信息（活动详情、日期和时间）',
            '基本使用日志（访问时间、IP地址）',
          ],
        },
        {
          title: '2. 信息使用目的',
          content: '收集的信息仅用于以下特定目的：',
          list: [
            '提供日程管理功能',
            '用户身份验证',
            '服务改进和问题修复',
            '客户支持服务',
            '安全保护措施',
          ],
        },
        {
          title: '3. 信息保护措施',
          content: '我们采取以下全面的安全措施保护您的信息：',
          list: [
            '使用SSL/TLS加密保护通信安全',
            '实施严格的访问控制以防止未经授权的访问',
            '定期进行安全审计和系统检查',
            '执行完善的数据删除策略',
          ],
        },
        {
          title: '4. 信息共享和第三方披露',
          content: '关于收集的信息的处理：',
          list: [
            '原则上不向第三方提供信息',
            '在法律要求或用户同意的情况下除外',
            '仅在必要范围内共享信息以进行Discord集成',
            '可能以无法识别个人的形式用于统计分析',
          ],
        },
        {
          title: '5. 用户权利',
          content: '用户享有以下权利：',
          list: [
            '请求访问、更正或删除个人信息的权利',
            '检查和删除服务使用历史记录的权利',
            '更改隐私设置的权利',
            '删除账户和相关数据的权利',
          ],
        },
        {
          title: '6. 数据保留期限',
          content: '各种数据的保留期限：',
          list: [
            '账户信息：退出后6个月内删除',
            '日程信息：活动结束后3个月内删除',
            '使用日志：收集后90天内删除',
            '备份数据：保留30天后删除',
          ],
        },
        {
          title: '7. 安全措施的详细说明',
          content: '我们实施以下技术性和组织性措施：',
          list: [
            '定期进行安全评估和漏洞测试',
            '实施未经授权访问检测系统',
            '定期更新和加强加密技术',
            '定期对运营人员进行安全培训',
          ],
        },
      ],
    },
    kids: {
      title: '隐私政策',
      description: '重要的约定',
      closeButton: '关闭',
      switchToKids: '儿童模式',
      switchToAdult: '成人模式',
      sections: [
        {
          title: '重要的约定',
          icon: 'Star',
          content:
            '这是一个帮助你和小伙伴们安排游戏时间的有趣应用。为了让大家都玩得开心，我们需要知道一些事情：',
          list: [
            '你在Discord上使用的昵称',
            '你们相聚的地方名称',
            '你什么时候有空玩耍',
          ],
        },
        {
          title: '为什么需要这些信息？',
          icon: 'Heart',
          content: '我们使用这些信息来帮助你和小伙伴们一起玩：',
          list: [
            '帮助你和小伙伴们约定游戏时间',
            '让小伙伴们知道你是谁',
            '方便看到大家什么时候有空玩耍',
          ],
        },
        {
          title: '你可以放心',
          icon: 'Lock',
          content:
            '你的重要信息都被放在一个特别的上锁的盒子里，我们会好好保护 🔒',
          list: [
            '你的信息被锁起来了，其他人看不到',
            '不需要的信息我们会及时清理',
            '我们一直在确保所有东西都很安全',
          ],
        },
        {
          title: '一起开心玩耍',
          icon: 'Star',
          content: '为了让大家都玩得开心，记住这些事情：',
          list: [
            '对小伙伴们要友善',
            '大家一起快乐地玩',
            '有不明白的事情要问爸爸妈妈',
          ],
        },
        {
          title: '需要帮助时',
          icon: 'Mail',
          content: '如果遇到问题或担心的事情，请和爸爸妈妈一起联系我们 ✉️',
          contact: {
            note: '致家长们 👨‍👩‍👧‍👦',
            description:
              '这个应用提供了简单的功能，以确保孩子们可以安全地使用它。如果您有任何问题或担忧，请随时与我们联系。',
            email: 'contact@gfcscheduler.com',
          },
        },
        {
          title: '安全小贴士',
          icon: 'Shield',
          content: '记住这些小贴士，安全地玩耍：',
          list: [
            '不要告诉游戏中认识的朋友你的真实姓名 🎮',
            '密码是特别的秘密，不要告诉任何人！ 🔑',
            '收到陌生人的消息要告诉爸爸妈妈 📧',
          ],
        },
        {
          title: '重要的安全规则',
          icon: 'Heart',
          content: '遵守这些规则，确保安全：',
          list: [
            '要和大家友好相处！不说坏话 🚫',
            '尽量遵守约定的游戏时间 ⏰',
            '遇到不舒服的事情要立即告诉大人 🆘',
          ],
        },
        {
          title: '致家长们',
          icon: 'Shield',
          content: '为了确保您的孩子安全使用网络，请注意以下几点：',
          list: [
            '定期查看使用情况',
            '了解如何报告不当内容',
            '监督交流情况',
            '检查隐私设置',
          ],
          contact: {
            note: '如果您有任何问题或担忧，请随时与我们联系。',
            email: 'privacy@gfcscheduler.com',
          },
        },
      ],
    },
  },
  ko: {
    adult: {
      title: '개인정보 처리방침',
      description: '개인정보 취급에 대하여',
      closeButton: '닫기',
      switchToKids: '어린이용',
      switchToAdult: '성인용',
      sections: [
        {
          title: '1. 수집하는 정보',
          icon: '',
          content:
            '본 서비스는 다음과 같은 필수적인 최소한의 정보만을 수집합니다:',
          list: [
            'Discord 계정 정보(사용자 ID, 사용자명)',
            '서버 정보(서버 ID, 서버명)',
            '일정 정보(이벤트 내용, 날짜 및 시간)',
            '기본 사용 로그(접속 시간, IP 주소)',
          ],
        },
        {
          title: '2. 정보 사용 목적',
          content: '수집된 정보는 다음과 같은 특정 목적으로만 사용됩니다:',
          list: [
            '일정 관리 기능 제공',
            '사용자 인증 수행',
            '서비스 개선 및 버그 수정',
            '고객 지원 서비스',
            '보안 대책 수립',
          ],
        },
        {
          title: '3. 정보 보호 조치',
          content: '다음과 같은 포괄적인 보안 조치를 통해 정보를 보호합니다:',
          list: [
            'SSL/TLS 암호화를 통한 통신 보안 강화',
            '엄격한 접근 제어를 통한 무단 접근 방지',
            '정기적인 보안 감사 및 시스템 점검',
            '체계적인 데이터 삭제 정책 실행',
          ],
        },
        {
          title: '4. 정보 공유 및 제3자 제공',
          content: '수집된 정보의 처리에 대하여:',
          list: [
            '일반적으로 제3자에게 제공하지 않습니다',
            '법률에 따르거나 사용자의 동의가 있는 경우를 제외하고',
            'Discord 통합을 위해 필요한 범위 내에서만 정보를 공유합니다',
            '통계 정보로 개인을 식별할 수 없는 형태로 사용할 수 있습니다',
          ],
        },
        {
          title: '5. 사용자 권리',
          content: '사용자는 다음과 같은 권리를 보유합니다:',
          list: [
            '개인정보 제공, 수정 또는 삭제 요청 권리',
            '서비스 이용 이력 확인 및 삭제 권리',
            '개인정보 보호 설정 변경 권리',
            '계정 삭제 및 관련 데이터 완전 삭제 권리',
          ],
        },
        {
          title: '6. 데이터 보존 기간',
          content: '다양한 유형의 데이터에 대한 보존 기간:',
          list: [
            '계정 정보: 탈퇴 후 6개월 이내 삭제',
            '일정 정보: 이벤트 종료 후 3개월 이내 삭제',
            '사용 로그: 수집 후 90일 이내 삭제',
            '백업 데이터: 30일 보존 후 삭제',
          ],
        },
        {
          title: '7. 보안 대책 세부 설명',
          content: '다음과 같은 기술적 및 조직적 대책을 시행합니다:',
          list: [
            '정기적인 보안 평가 및 취약점 검사',
            '무단 접근 검지 시스템 도입',
            '암호화 기술 정기적 업데이트 및 강화',
            '운영 담당자에 대한 정기적인 보안 교육',
          ],
        },
      ],
    },
    kids: {
      title: '개인정보 보호정책',
      description: '소중한 약속',
      closeButton: '닫기',
      switchToKids: '어린이용',
      switchToAdult: '성인용',
      sections: [
        {
          title: '소중한 약속',
          icon: 'Star',
          content:
            '이 앱은 친구들과 함께 게임할 시간을 정하는 재미있는 앱이에요. 모두가 즐겁게 사용하기 위해 알아야 할 것들이 있어요：',
          list: [
            'Discord에서 사용하는 너의 별명',
            '친구들과 만나는 장소 이름',
            '언제 놀 수 있는지',
          ],
        },
        {
          title: '왜 이런 정보가 필요한가요?',
          icon: 'Heart',
          content:
            '우리는 이 정보를 사용하여 친구들과 함께 게임할 수 있도록 도와줄 거예요：',
          list: [
            '친구들과 함께 게임 약속을 만들기 위해',
            '친구들이 너를 알아볼 수 있도록',
            '모두가 언제 게임을 할 수 있는지 쉽게 알 수 있도록',
          ],
        },
        {
          title: '안전하게 보관할게요',
          icon: 'Lock',
          content:
            '너의 소중한 정보는 특별한 금고에 넣어서 잘 보관하고 있어요 🔒',
          list: [
            '너의 정보는 다른 사람들이 볼 수 없도록 잠겨있어요',
            '필요 없는 정보는 깨끗이 지워요',
            '항상 안전하게 사용할 수 있도록 확인하고 있어요',
          ],
        },
        {
          title: '즐겁게 사용하기',
          icon: 'Star',
          content: '모두가 즐겁게 사용하기 위해 이런 것들을 기억하세요：',
          list: [
            '친구들에게 친절하게 대해요',
            '다 같이 사이좋게 놀아요',
            '모르는 것이 있으면 부모님께 물어보세요',
          ],
        },
        {
          title: '도움이 필요할 때',
          icon: 'Mail',
          content:
            '문제가 있거나 걱정되는 일이 있으면 부모님과 함께 연락해주세요 ✉️',
          contact: {
            note: '부모님께 드리는 말씀 👨‍👩‍👧‍👦',
            description:
              '이 앱은 아이들이 안전하게 사용할 수 있도록 간단한 기능만을 제공합니다. 문의사항이나 우려사항이 있으시면 언제든 연락주세요.',
            email: 'contact@gfcscheduler.com',
          },
        },
        {
          title: '안전하게 사용하는 방법',
          icon: 'Shield',
          content: '안전하게 즐기기 위해 이것들을 기억하세요：',
          list: [
            '게임에서 만난 친구에게 진짜 이름을 알려주지 마세요 🎮',
            '비밀번호는 특별한 비밀이에요 - 누구에게도 알려주면 안 돼요! 🔑',
            '모르는 사람이 보낸 메시지는 부모님께 보여주세요 📧',
          ],
        },
        {
          title: '중요한 안전 규칙',
          icon: 'Heart',
          content: '안전을 위해 이런 규칙들을 지켜주세요：',
          list: [
            '다른 친구들과 사이좋게 지내요! 나쁜 말은 하지 않아요 🚫',
            '약속한 게임 시간을 지키도록 노력해요 ⏰',
            '불편하거나 무서운 일이 있으면 바로 부모님께 말씀드려요 🆘',
          ],
        },
        {
          title: '부모님께 드리는 말씀',
          icon: 'Shield',
          content:
            '자녀의 안전한 온라인 활동을 위해 다음 사항들을 확인해주세요：',
          list: [
            '정기적인 사용 현황 확인',
            '부적절한 콘텐츠 신고 방법 숙지',
            '대화 내용 모니터링',
            '개인정보 보호 설정 확인',
          ],
          contact: {
            note: '문의사항이나 우려사항이 있으시면 언제든 연락주세요.',
            email: 'privacy@gfcscheduler.com',
          },
        },
      ],
    },
  },
};
