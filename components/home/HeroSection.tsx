import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  Braces,
  Check,
  Code2,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            <span />
            اینجا، نقطه شروع توست
          </span>
          <h1>
            مهارت‌های تازه،
            <br />
            <span>آینده‌ای که می‌سازی.</span>
          </h1>
          <p>
            با آموزش‌های پروژه‌محور، از دانستن به توانستن برس.
            <br className="desktop-break" /> مسیر یادگیری‌ات را پیدا کن و قدم
            بعدی را با اطمینان بردار.
          </p>
          <div className="hero-actions">
            <Link href="/course" className="button button-primary">
              کشف دوره‌ها <ArrowLeft size={19} />
            </Link>
            <Link href="/course?sort=popular" className="hero-secondary">
              از کجا شروع کنم؟ <ArrowUpLeft size={18} />
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>۶ مسیر</strong>
              <span>برای شروع یادگیری</span>
            </div>
            <div>
              <strong>پروژه‌محور</strong>
              <span>تمرین در دنیای واقعی</span>
            </div>
            <div>
              <strong>قدم‌به‌قدم</strong>
              <span>از پایه تا حرفه‌ای</span>
            </div>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="تصویر مفهومی مسیر یادگیری برنامه‌نویسی"
          role="img"
        >
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="floating-badge badge-code">
            <Code2 size={29} />
          </div>
          <div className="floating-badge badge-spark">
            <Sparkles size={26} />
          </div>
          <div className="code-window" dir="ltr">
            <div className="window-bar">
              <span />
              <span />
              <span />
              <small>your-next-chapter.ts</small>
            </div>
            <div className="code-content">
              <span className="code-comment">{"// Build your future"}</span>
              <p>
                <b>const</b> developer = {"{"}
              </p>
              <p className="code-indent">
                passion: <em>&apos;learning&apos;</em>,
              </p>
              <p className="code-indent">
                skills: [<em>&apos;create&apos;</em>, <em>&apos;build&apos;</em>
                ],
              </p>
              <p className="code-indent">
                possibilities: <i>Infinity</i>
              </p>
              <p>{"};"}</p>
              <p className="code-last">
                developer.<strong>startToday</strong>();
                <span className="code-cursor" />
              </p>
            </div>
          </div>
          <div className="achievement">
            <span>
              <Check size={21} />
            </span>
            <div>
              <strong>یک مهارت نزدیک‌تر به هدفت</strong>
              <small>هر روز، کمی بهتر از دیروز</small>
            </div>
            <Braces size={24} />
          </div>
          <span className="art-caption">LEARN. BUILD. GROW.</span>
        </div>
      </div>
    </section>
  );
}
