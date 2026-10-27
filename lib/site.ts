export const site = {
  title: "Yurim Jin",
  description: "진유림의 개발 이야기와 사는 이야기",
  // 홈에서 이름 밑 혼잣말. 누를 때마다 다음 말이 한 글자씩 찍힌다
  sayings: [
    "테니스치다 손목 삔, 풋살하다 인대 나간 개발자",
    "뭉치면 주먹밥, 흩어지면 볶음밥",
    "Despite everything, it's still you",
    "빈 손이지만 선의로 가득 찬 마음",
    "삶은 여행 (Boiled voyage)",
    "의리, 다정, 사랑",
  ],
  url: "https://milooy.github.io",
  lang: "ko",
  github: "https://github.com/milooy",
  gaId: "G-4ZD0PJFMV4",
  // 댓글은 레포 Discussions의 Comments 카테고리에 쌓인다 (https://giscus.app 에서 받은 값).
  // 둘 중 하나라도 비어 있으면 댓글 영역을 그리지 않는다.
  giscus: {
    repo: "milooy/milooy.github.io",
    repoId: "R_kgDOGZx9Tw",
    category: "Comments",
    categoryId: "DIC_kwDOGZx9T84DJvsO",
  },
  nav: [
    { href: "/resume/", label: "Resume" },
    { href: "/blog/", label: "Blog" },
    { href: "/notes/", label: "Notes" },
    { href: "/books/", label: "Books" },
    { href: "/drawings/", label: "Drawings" },
    { href: "/songs/", label: "Songs" },
    { href: "/toys/", label: "Toys" },
  ],
}
